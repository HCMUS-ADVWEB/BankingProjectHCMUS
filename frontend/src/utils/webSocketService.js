import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BASE_URL } from './constants';

class WebSocketService {  constructor() {
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
    
    // Log initial state
    console.log('WebSocketService initialized');
  }

  connect() {
    console.group('WebSocket Connection');
    
    // Clear any existing connection timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    if (this.connectionPromise) {
      console.log('Connection already in progress');
      console.groupEnd();
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        reject(new Error('No access token found'));
        this.connectionPromise = null;
        console.groupEnd();
        return;
      }

      try {
        console.log('Creating new connection...');
        const wsUrl = `${BASE_URL}/ws`;
        console.log('WebSocket URL:', wsUrl);

        // Create SockJS instance
        const sockJS = new SockJS(wsUrl, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
          timeout: 10000,
          withCredentials: true
        });

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (!this.connected) {
            console.error('Connection timeout');
            sockJS.close();
            reject(new Error('Connection timeout'));
            this.connectionPromise = null;
          }
        }, 15000);

        this.client = new Client({          webSocketFactory: () => sockJS,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            console.log('🔄 STOMP:', str);
          },
          reconnectDelay: 5000,
          // Match Spring's default heartbeat values (10 seconds)
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          onConnect: (frame) => {
            console.log('✅ Connection established:', frame);
            this.connected = true;
            this.retryCount = 0;
            clearTimeout(this.connectionTimeout);
            
            // Resubscribe to all previous subscriptions
            console.log('Resubscribing to destinations:', Array.from(this.subscriptions.keys()));
            this.subscriptions.forEach((callback, destination) => {
              this.subscribe(destination, callback).catch(console.error);
            });
            
            resolve();
          },
          onStompError: (frame) => {
            console.error('❌ STOMP error:', frame);
            this.handleConnectionError(frame);
            reject(new Error(frame.headers['message']));
          },
          onWebSocketClose: () => {
            console.warn('⚠️ WebSocket closed');
            this.handleConnectionError();
          },
          onWebSocketError: (error) => {
            console.error('❌ WebSocket error:', error);
            this.handleConnectionError(error);
          }
        });

        console.log('Activating STOMP client...');
        this.client.activate();

      } catch (error) {
        console.error('❌ Connection error:', error);
        this.handleConnectionError(error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }
  handleConnectionError(error) {
    if (this.disconnecting) {
      console.log('Connection closed due to intentional disconnect');
      return;
    }

    console.error('Connection error:', error);
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
    
    // Clear all active subscriptions but keep the callbacks
    this.activeSubscriptions.clear();
    
    // Attempt reconnection if not at max retries
    if (this.retryCount < this.maxRetries && !this.disconnecting) {
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
      this.retryCount++;
      
      console.log(`Scheduling reconnection attempt ${this.retryCount}/${this.maxRetries} in ${delay}ms`);
      
      this.reconnectTimeout = setTimeout(() => {
        if (!this.disconnecting) {
          console.log('Attempting reconnection...');
          this.connect().catch(err => {
            console.error('Reconnection attempt failed:', err);
          });
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
  disconnect() {
    console.log('Disconnecting WebSocket...');
    this.disconnecting = true;
    
    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Clean up all subscriptions
    this.activeSubscriptions.forEach((subscription, destination) => {
      console.log(`Cleaning up subscription to ${destination}`);
      try {
        subscription.unsubscribe();
      } catch (e) {
        console.warn(`Error unsubscribing from ${destination}:`, e);
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
    
    // Reset disconnect flag after a short delay
    setTimeout(() => {
      this.disconnecting = false;
    }, 1000);
    
    console.log('WebSocket disconnected');
  }    async subscribe(destination, callback) {
        console.group(`Subscribing to ${destination}`);
        try {
            // Don't resubscribe if we already have an active subscription
            if (this.activeSubscriptions.has(destination)) {
                console.log(`Already subscribed to ${destination}`);
                console.groupEnd();
                return this.activeSubscriptions.get(destination);
            }

            // Store the callback for reconnection
            this.subscriptions.set(destination, callback);
            console.log('Stored callback for destination');

      if (!this.connected || !this.client || !this.client.connected) {
        console.log('Not connected, attempting to connect first...');
        try {
          await this.connect();
        } catch (error) {
          console.error('Connection attempt failed:', error);
          throw error;
        }
      }

      if (!this.client || !this.client.connected) {
        console.error('Client still not connected after connection attempt');
        throw new Error('WebSocket client not connected');
      }      console.log('Creating new subscription...');      const subscription = this.client.subscribe(destination, (message) => {
        console.group(`Message received on ${destination}`);
        try {
          console.log('Raw message:', message);
          let payload;
          
          // Handle both string and object message bodies
          if (typeof message.body === 'string') {
            try {
              payload = JSON.parse(message.body);
              console.log('Successfully parsed JSON payload:', payload);
            } catch (parseError) {
              console.log('Message body is not JSON, using as is:', message.body);
              payload = message.body;
            }
          } else {
            console.log('Message body is not a string:', typeof message.body);
            payload = message.body;
          }
          
          // Additional payload validation
          if (payload === null || payload === undefined) {
            console.warn('Received null or undefined payload');
            console.groupEnd();
            return;
          }
          
          // Extract notification from Spring STOMP message format
          if (payload.body) {
            try {
              payload = JSON.parse(payload.body);
              console.log('Parsed message body:', payload);
            } catch (e) {
              console.log('Body is not JSON, using as is:', payload.body);
              payload = payload.body;
            }
          }
          
          // Handle Spring's Message<byte[]> format
          if (payload.payload) {
            payload = payload.payload;
            console.log('Extracted payload:', payload);
          }

          // Get the current callback
          const currentCallback = this.subscriptions.get(destination);
          if (currentCallback) {
            console.log('Executing callback with payload...');
            
            // Force the callback execution into a Promise to handle async updates
            Promise.resolve().then(() => {
              try {
                // If payload is a string, try to parse it again (sometimes double-encoded)
                if (typeof payload === 'string') {
                  try {
                    const parsedPayload = JSON.parse(payload);
                    console.log('Successfully parsed string payload:', parsedPayload);
                    currentCallback(parsedPayload);
                  } catch (e) {
                    console.log('Using raw string payload');
                    currentCallback(payload);
                  }
                } else {
                  currentCallback(payload);
                }
                console.log('Callback completed successfully');
              } catch (callbackError) {
                console.error('Error in callback execution:', callbackError);
                console.error('Callback error stack:', callbackError.stack);
              }
            }).catch(error => {
              console.error('Promise rejection in callback:', error);
            });
          } else {
            console.warn('No callback found for destination:', destination);
          }
        } catch (error) {
          console.error('Error processing message:', error);
          console.error('Message that caused error:', message);
          console.error('Error stack:', error.stack);
        }
        console.groupEnd();
      });

      // Store the active subscription
      this.activeSubscriptions.set(destination, subscription);
      console.log(`Subscription created successfully:`, subscription);
      
      // Add unsubscribe handler
      const originalUnsubscribe = subscription.unsubscribe;
      subscription.unsubscribe = (...args) => {
        console.log(`Unsubscribing from ${destination}`);
        this.activeSubscriptions.delete(destination);
        return originalUnsubscribe.apply(subscription, args);
      };

      console.groupEnd();
      return subscription;
    } catch (error) {
      console.error(`Subscription to ${destination} failed:`, error);
      this.handleSubscriptionError(destination, callback, error);
      console.groupEnd();
      throw error;
    }
  }

  async subscribeToUserNotifications(callback) {
    console.group('Subscribing to User Notifications');
    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('No user ID found in token');
      console.groupEnd();
      return null;
    }

    console.log(`Attempting to subscribe for user: ${userId}`);    // Spring's standard user destination format
    const destinations = [
      // When we use convertAndSendToUser(userId, "/queue/notifications", payload),
      // Spring STOMP will send to "/user/{userId}/queue/notifications"
      `/user/${userId}/queue/notifications`
    ];

    let subscription = null;
    const destination = destinations[0];
    try {
        console.log(`Subscribing to: ${destination}`);
        subscription = await this.subscribe(destination, (notification) => {
          console.group(`Notification Received`);
          console.log('Destination:', destination);
          console.log('Raw notification:', notification);
          try {
            callback(notification);
            console.log('Callback executed successfully');
          } catch (callbackError) {
            console.error('Error in notification callback:', callbackError);
            console.error('Error stack:', callbackError.stack);
          }
          console.groupEnd();
        });
        
        console.log(`Successfully subscribed to ${destination}`);      } catch (err) {
        console.error('Subscription failed:', err);
        throw err;
      }

    console.groupEnd();
    return subscription;
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
    console.log('Checking WebSocket connection state:', {
      connected: this.connected,
      client: this.client ? 'exists' : 'null',
      clientConnected: this.client ? this.client.connected : false,
      connectionPromise: this.connectionPromise ? 'exists' : 'null',
      retryCount: this.retryCount,
    });

    if (!this.connected || !this.client || !this.client.connected) {
      if (this.retryCount < this.maxRetries) {
        console.log('WebSocket not connected, attempting to reconnect...');
        this.connectionPromise = null;
        return this.connect();
      } else {
        console.log('Max retry attempts reached, manual reconnection required');
        return Promise.reject(new Error('Max retry attempts reached'));
      }
    }

    return Promise.resolve();
  }

  getUserIdFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join(''),
      );

      const payload = JSON.parse(jsonPayload);
      // Use id (UUID) instead of sub (username) for WebSocket subscriptions
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
