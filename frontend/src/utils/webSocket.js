import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from './constants';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.activeSubscriptions = new Map();
    this.connected = false;
    this.connectionPromise = null;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.connectionTimeout = null;
    this.disconnecting = false;
    this.reconnectTimeout = null;
  }

  connect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    console.log('🔌 WebSocket connecting...');
    this.connectionPromise = new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ No access token found');
        const error = new Error('No access token found');
        this.connectionPromise = null;
        reject(error);
        return;
      }

      try {
        const wsUrl = `${BASE_URL}/ws`;

        const sockJS = new SockJS(wsUrl, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
          timeout: 10000,
          withCredentials: true,
        });

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (!this.connected) {
            console.error('⏰ Connection timeout');
            try {
              sockJS.close();
            } catch (e) {
              console.warn('Error closing SockJS:', e);
            }
            this.connectionPromise = null;
            reject(new Error('Connection timeout'));
          }
        }, 15000);

        this.client = new Client({
          webSocketFactory: () => sockJS,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: () => {}, // Remove debug logging
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          onConnect: (_frame) => {
            console.log('✅ WebSocket connected');
            try {
              this.connected = true;
              this.retryCount = 0;
              clearTimeout(this.connectionTimeout);

              // Resubscribe to all previous subscriptions
              this.subscriptions.forEach((callback, destination) => {
                this.subscribe(destination, callback).catch(console.error);
              });

              resolve();
            } catch (error) {
              console.error('Error in onConnect:', error);
              reject(error);
            }
          },
          onStompError: (frame) => {
            console.error(
              '❌ STOMP error:',
              frame.headers?.['message'] || 'Unknown error',
            );
            this.handleConnectionError(frame);
            this.connectionPromise = null;
            reject(new Error(frame.headers?.['message'] || 'STOMP error'));
          },
          onWebSocketClose: () => {
            console.warn('🔌 WebSocket disconnected');
            this.handleConnectionError();
          },
          onWebSocketError: (error) => {
            console.error('❌ WebSocket error:', error);
            this.handleConnectionError(error);
            if (this.connectionPromise) {
              this.connectionPromise = null;
              reject(error);
            }
          },
        });

        this.client.activate();
      } catch (error) {
        console.error('❌ Connection failed:', error);
        this.handleConnectionError(error);
        this.connectionPromise = null;
        reject(error);
      }
    }).catch((error) => {
      console.error('❌ WebSocket connection failed:', error);
      this.connectionPromise = null;
      throw error;
    });

    return this.connectionPromise;
  }

  handleConnectionError(error) {
    if (this.disconnecting) {
      return;
    }

    console.error('❌ Connection error:', error);
    this.connected = false;
    this.connectionPromise = null;

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.activeSubscriptions.clear();

    if (this.retryCount < this.maxRetries && !this.disconnecting) {
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
      this.retryCount++;

      console.log(
        `🔄 Reconnecting in ${delay}ms (${this.retryCount}/${this.maxRetries})`,
      );

      this.reconnectTimeout = setTimeout(() => {
        if (!this.disconnecting) {
          console.log('🔄 Reconnecting...');
          this.connect().catch((err) => {
            console.error('❌ Reconnection failed:', err);
          });
        }
      }, delay);
    } else {
      console.error('🛑 Max reconnection attempts reached');
    }
  }

  disconnect() {
    console.log('🛑 WebSocket disconnecting...');
    this.disconnecting = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.activeSubscriptions.forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing:', e);
      }
    });
    this.activeSubscriptions.clear();
    this.subscriptions.clear();

    if (this.client) {
      if (this.client.connected) {
        try {
          this.client.deactivate();
        } catch (e) {
          console.warn('Error deactivating client:', e);
        }
      }
      this.client = null;
    }

    this.connected = false;
    this.connectionPromise = null;
    this.retryCount = 0;

    console.log('✅ WebSocket disconnected');

    // Reset disconnect flag after a short delay
    setTimeout(() => {
      this.disconnecting = false;
    }, 1000);
  }

  async subscribe(destination, callback) {
    try {
      if (this.activeSubscriptions.has(destination)) {
        return this.activeSubscriptions.get(destination);
      }

      this.subscriptions.set(destination, callback);

      if (!this.connected || !this.client || !this.client.connected) {
        try {
          const connectPromise = this.connect();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Subscribe connection timeout')),
              10000,
            ),
          );

          await Promise.race([connectPromise, timeoutPromise]);
        } catch (error) {
          console.error('Connection attempt failed:', error);
          throw error;
        }
      }

      if (!this.client || !this.client.connected) {
        console.error('Client still not connected after connection attempt');
        throw new Error('WebSocket client not connected');
      }

      const subscription = this.client.subscribe(destination, (message) => {
        try {
          let payload;

          // Handle both string and object message bodies
          if (typeof message.body === 'string') {
            try {
              payload = JSON.parse(message.body);
            } catch (parseError) {
              payload = message.body;
            }
          } else {
            payload = message.body;
          }

          // Additional payload validation
          if (payload === null || payload === undefined) {
            console.warn('Received null or undefined payload');
            return;
          }

          if (payload.body) {
            try {
              payload = JSON.parse(payload.body);
            } catch (e) {
              payload = payload.body;
            }
          }
          if (payload.payload) {
            payload = payload.payload;
          }

          const currentCallback = this.subscriptions.get(destination);
          if (currentCallback) {
            // Force the callback execution into a Promise to handle async updates
            Promise.resolve()
              .then(() => {
                try {
                  // If payload is a string, try to parse it again (sometimes double-encoded)
                  if (typeof payload === 'string') {
                    try {
                      const parsedPayload = JSON.parse(payload);
                      currentCallback(parsedPayload);
                    } catch (e) {
                      currentCallback(payload);
                    }
                  } else {
                    currentCallback(payload);
                  }
                } catch (callbackError) {
                  console.error('Error in callback execution:', callbackError);
                }
              })
              .catch((error) => {
                console.error('Promise rejection in callback:', error);
              });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      // Store the active subscription
      this.activeSubscriptions.set(destination, subscription);

      // Add unsubscribe handler
      const originalUnsubscribe = subscription.unsubscribe;
      subscription.unsubscribe = (...args) => {
        this.activeSubscriptions.delete(destination);
        return originalUnsubscribe.apply(subscription, args);
      };

      return subscription;
    } catch (error) {
      console.error(`Subscription to ${destination} failed:`, error);
      this.handleSubscriptionError(destination, callback, error);
      return null;
    }
  }

  async subscribeToUserNotifications(callback) {
    try {
      const userId = this.getUserIdFromToken();
      if (!userId) {
        console.error('No user ID found in token');
        return null;
      }

      const destination = `/user/${userId}/queue/notifications`;

      if (this.activeSubscriptions.has(destination)) {
        this.subscriptions.set(destination, callback);

        const existingSubscription = this.activeSubscriptions.get(destination);
        return existingSubscription;
      }

      const subscription = await this.subscribe(destination, (notification) => {
        try {
          callback(notification);
        } catch (callbackError) {
          console.error('Error in notification callback:', callbackError);
        }
      });

      return subscription;
    } catch (err) {
      console.error('Subscription failed:', err);
      return null;
    }
  }

  handleSubscriptionError(destination, callback, error) {
    console.error(`Error subscribing to ${destination}:`, error);

    if (callback) {
      this.subscriptions.set(destination, callback);
    }

    if (this.activeSubscriptions.has(destination)) {
      try {
        const existingSub = this.activeSubscriptions.get(destination);
        existingSub.unsubscribe();
      } catch (e) {
        console.warn('Error unsubscribing from failed subscription:', e);
      }
      this.activeSubscriptions.delete(destination);
    }
  }

  updateToken(token) {
    if (this.client && this.client.connected) {
      this.disconnect();
      this.connectionPromise = null;
      return this.connect();
    }
    return Promise.resolve();
  }

  checkConnection() {
    if (!this.connected || !this.client || !this.client.connected) {
      if (this.retryCount < this.maxRetries) {
        this.connectionPromise = null;
        return this.connect();
      } else {
        return Promise.reject(new Error('Max retry attempts reached'));
      }
    }

    return Promise.resolve();
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      );

      const payload = JSON.parse(jsonPayload);
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
