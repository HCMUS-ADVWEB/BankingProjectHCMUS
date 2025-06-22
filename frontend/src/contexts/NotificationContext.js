import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import webSocketService from '../utils/webSocketService';
import NotificationAPI from '../services/notificationApi';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAllAsRead: () => {},
  markAsRead: () => {},
  fetchNotifications: () => {}
});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    console.warn('useNotifications must be used within a NotificationProvider');
    // Return default values instead of undefined
    return {
      notifications: [],
      unreadCount: 0,
      loading: false,
      markAllAsRead: () => {},
      markAsRead: () => {},
      fetchNotifications: () => {}
    };
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { state: authState, refreshToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(count => count + 1);
    }
  }, []);

  const setupWebSocket = useCallback(async () => {
    console.group('Setting up WebSocket');
    const ws = webSocketService;
    
    try {
      if (ws.connected && subscription) {
        console.log('WebSocket already connected with subscription');
        console.groupEnd();
        return;
      }

      if (subscription) {
        console.log('Cleaning up existing subscription...');
        try {
          subscription.unsubscribe();
        } catch (e) {
          console.warn('Error cleaning up subscription:', e);
        }
        setSubscription(null);
      }

      if (!ws.connected) {
        console.log('Attempting to connect...');
        await ws.connect();
      }

      if (!ws.connected) {
        throw new Error('Failed to establish WebSocket connection');
      }

      console.log('WebSocket connected, creating subscription...');
      const sub = await ws.subscribeToUserNotifications((notification) => {
        console.group('WebSocket Notification Received');
        try {
          console.log('Processing notification:', notification);
          handleNewNotification(notification);
        } catch (e) {
          console.error('Error handling notification:', e);
        }
        console.groupEnd();
      });

      if (!sub) {
        throw new Error('Failed to create subscription');
      }

      console.log('Subscription created successfully:', sub);
      setSubscription(sub);

      const verifyInterval = setInterval(() => {
        if (ws.connected && sub) {
          return;
        }
        
        if (!ws.connected) {
          console.log('Connection lost, will auto-reconnect via WebSocketService');
        } else if (!sub) {
          console.log('Subscription lost, recreating...');
          setupWebSocket().catch(console.error);
        }
      }, 30000); 

      console.log('WebSocket setup completed successfully');
      console.groupEnd();

      return () => {
        clearInterval(verifyInterval);
        if (sub) {
          try {
            sub.unsubscribe();
          } catch (e) {
            console.warn('Error during subscription cleanup:', e);
          }
        }
      };

    } catch (error) {
      console.error('Error in WebSocket setup:', error);
      console.groupEnd();
      throw error;
    }
  }, [subscription, handleNewNotification]);

  // Fetch notifications and setup WebSocket
  useEffect(() => {
    let cleanupFunc = () => {};
    let reconnectInterval = null;
    let monitorInterval = null;

    const setupNotifications = async () => {
      if (!authState.isAuthenticated) {
        return;
      }

      try {
        setIsConnecting(true);

        await fetchNotifications();

        const ws = webSocketService;
        
        if (ws.connected) {
          ws.disconnect();
        }

        const cleanup = await setupWebSocket();
        
        if (cleanup) {
          cleanupFunc = cleanup;
        }

        // Monitor WebSocket connection
        monitorInterval = setInterval(() => {
          if (!ws.connected) {
            setupWebSocket().catch(console.error);
          }
        }, 5000);

        // Refresh token periodically
        reconnectInterval = setInterval(async () => {
          if (ws.connected && refreshToken) {
            try {
              const newToken = await refreshToken();
              if (newToken) {
                await ws.updateToken(newToken);
                console.log('Token refreshed successfully');
              }
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }
        }, 14 * 60 * 1000); 

      } catch (error) {
        console.error('Error in notification setup:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    // Run initial setup
    setupNotifications();

    return () => {
      console.log('Cleaning up notification system...');
      if (cleanupFunc) cleanupFunc();
      if (reconnectInterval) clearInterval(reconnectInterval);
      if (monitorInterval) clearInterval(monitorInterval);
      
      const ws = webSocketService;
      if (ws.connected) {
        ws.disconnect();
      }
      
      setNotifications([]);
      setUnreadCount(0);
      console.groupEnd();
    };
  }, [authState.isAuthenticated, authState.user?.id, refreshToken, setupWebSocket]);

  useEffect(() => {
    const checkConnection = () => {
      const ws = webSocketService;
      if (!isConnecting && authState.isAuthenticated && !ws.connected) {
        console.log('Connection lost, attempting to reconnect...');
        setupWebSocket().catch(console.error);
      }
    };

    window.addEventListener('focus', checkConnection);
    
    return () => {
      window.removeEventListener('focus', checkConnection);
    };
  }, [authState.isAuthenticated, isConnecting, setupWebSocket]);  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications from API...');
      setLoading(true);
      const response = await NotificationAPI.getNotifications(10, 1);
      console.log('Notifications API response:', response);
      
      if (response && response.content) {
        setNotifications(response.content);
        setUnreadCount(response.content.filter((n) => !n.read).length);
        console.log('Set notifications (content array):', response.content);
      } else if (Array.isArray(response)) {
        // Direct array of notifications
        setNotifications(response);
        setUnreadCount(response.filter((n) => !n.read).length);
        console.log('Set notifications (direct array):', response);
      } else {
        console.warn('Notification response format unexpected:', response);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set defaults on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };
  const markAllAsRead = async () => {
    try {
      // Optimistically update UI first
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      
      // Then call API
      await NotificationAPI.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Rollback changes on error
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Optimistically update UI
      const wasUnread = notifications.some(n => n.id === notificationId && !n.read);
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Only decrease unread count if notification was actually unread
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      
      // Then call API
      await NotificationAPI.markAsRead(notificationId);
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      // Rollback changes on error
      fetchNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
