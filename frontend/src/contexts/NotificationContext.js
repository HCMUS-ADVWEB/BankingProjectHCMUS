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

  // Define fetchNotifications first before it's used in any other functions
  const fetchNotifications = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.user?.id) {
      return;
    }

    try {
      setLoading(true);
      const response = await NotificationAPI.getNotifications(10, 1);
      
      if (response && response.content) {
        setNotifications(response.content);
        setUnreadCount(response.content.filter((n) => !n.read).length);
      } else if (Array.isArray(response)) {
        // Direct array of notifications
        setNotifications(response);
        setUnreadCount(response.filter((n) => !n.read).length);
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
  }, [authState.isAuthenticated, authState.user?.id]);

  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(count => count + 1);
    }
  }, []);

  const setupWebSocket = useCallback(async () => {
    const ws = webSocketService;
    
    try {
      // If already connected with an active subscription, do nothing
      if (ws.connected && subscription) {
        return () => {};
      }

      // If we're in the process of connecting, avoid multiple connection attempts
      if (isConnecting) {
        return () => {};
      }

      setIsConnecting(true);

      // Clean up existing subscription if it exists
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (e) {
          console.warn('Error cleaning up subscription:', e);
        }
        setSubscription(null);
      }

      // Connect if not already connected
      if (!ws.connected) {
        await ws.connect();
      }

      if (!ws.connected) {
        throw new Error('Failed to establish WebSocket connection');
      }

      const sub = await ws.subscribeToUserNotifications((notification) => {
        try {
          handleNewNotification(notification);
        } catch (e) {
          console.error('Error handling notification:', e);
        }
      });

      if (!sub) {
        throw new Error('Failed to create subscription');
      }

      setSubscription(sub);

      return () => {
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
      return () => {};
    } finally {
      setIsConnecting(false);
    }
  }, [handleNewNotification, subscription, isConnecting]);

  // Fetch notifications and setup WebSocket
  useEffect(() => {
    let cleanupFunc = () => {};
    let reconnectInterval = null;

    const setupNotifications = async () => {
      if (!authState.isAuthenticated || !authState.user?.id) {
        return;
      }

      try {
        // First fetch notifications without changing isConnecting state
        await fetchNotifications();

        // Only setup WebSocket if we don't have an active subscription already
        if (!subscription && !isConnecting) {
          const cleanup = await setupWebSocket();
          if (cleanup) {
            cleanupFunc = cleanup;
          }
        }

        // Refresh token periodically to keep the WebSocket authenticated
        reconnectInterval = setInterval(async () => {
          if (webSocketService.connected && refreshToken) {
            try {
              const newToken = await refreshToken();
              if (newToken) {
                await webSocketService.updateToken(newToken);
              }
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }
        }, 14 * 60 * 1000); // 14 minutes
      } catch (error) {
        console.error('Error in notification setup:', error);
      }
    };

    // Run initial setup
    setupNotifications();

    // Clean up on unmount
    return () => {
      if (cleanupFunc) {
        cleanupFunc();
      }
      
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, [authState.isAuthenticated, authState.user?.id, refreshToken, setupWebSocket, fetchNotifications, subscription, isConnecting]);

  // Reconnect on window focus if connection is lost
  useEffect(() => {
    const checkConnection = () => {
      if (!isConnecting && authState.isAuthenticated && !webSocketService.connected && !subscription) {
        setupWebSocket().catch(console.error);
      }
    };

    window.addEventListener('focus', checkConnection);
    
    return () => {
      window.removeEventListener('focus', checkConnection);
    };
  }, [authState.isAuthenticated, isConnecting, setupWebSocket, subscription]);

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
