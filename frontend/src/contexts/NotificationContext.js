import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import webSocketService from '../utils/webSocketService';
import NotificationAPI from '../services/notificationApi';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.read 
          ? state.unreadCount 
          : state.unreadCount + 1
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    case 'MARK_AS_READ':
      const wasUnread = state.notifications.some(n => n.id === action.payload && !n.read);
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnecting: action.payload };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    default:
      return state;
  }
};

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
  
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    loading: true,
    isConnecting: false,
    subscription: null
  });

  // Define fetchNotifications first before it's used in any other functions
  const fetchNotifications = useCallback(async () => {
    if (!authState.isAuthenticated || !authState.user?.id) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await NotificationAPI.getNotifications(10, 1);
      
      if (response && response.content) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.content });
      } else if (Array.isArray(response)) {
        // Direct array of notifications
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response });
      } else {
        console.warn('Notification response format unexpected:', response);
        dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Set defaults on error
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [authState.isAuthenticated, authState.user?.id]);

  const handleNewNotification = useCallback((notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const setupWebSocket = useCallback(async () => {
    const ws = webSocketService;
    
    try {
      // If already connected with an active subscription, do nothing
      if (ws.connected && state.subscription) {
        return () => {};
      }

      // If we're in the process of connecting, avoid multiple connection attempts
      if (state.isConnecting) {
        return () => {};
      }

      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });

      // Clean up existing subscription if it exists
      if (state.subscription) {
        try {
          state.subscription.unsubscribe();
        } catch (e) {
          console.warn('Error cleaning up subscription:', e);
        }
        dispatch({ type: 'SET_SUBSCRIPTION', payload: null });
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

      dispatch({ type: 'SET_SUBSCRIPTION', payload: sub });

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
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    }
  }, [handleNewNotification, state.subscription, state.isConnecting]);
  // Fetch notifications and setup WebSocket only when authenticated
  useEffect(() => {

    if (!authState.isAuthenticated || !authState.user?.id) {
      return;
    }
    
    let cleanupFunc = () => {};
    let reconnectInterval = null;

    const setupNotifications = async () => {
      try {
        await fetchNotifications();

        if (!state.subscription && !state.isConnecting) {
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
        }, 14 * 60 * 1000); 
      } catch (error) {
        console.error('Error in notification setup:', error);
      }
    };

    setupNotifications();

    return () => {
      if (cleanupFunc) {
        cleanupFunc();
      }
      
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, [authState.isAuthenticated, authState.user?.id, refreshToken, setupWebSocket, fetchNotifications, state.subscription, state.isConnecting]);

  useEffect(() => {
    const checkConnection = () => {
      if (!state.isConnecting && authState.isAuthenticated && !webSocketService.connected && !state.subscription) {
        setupWebSocket().catch(console.error);
      }
    };

    window.addEventListener('focus', checkConnection);
    
    return () => {
      window.removeEventListener('focus', checkConnection);
    };
  }, [authState.isAuthenticated, state.isConnecting, setupWebSocket, state.subscription]);

  const markAllAsRead = async () => {
    try {
      dispatch({ type: 'MARK_ALL_READ' });
      
      await NotificationAPI.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
      
      await NotificationAPI.markAsRead(notificationId);
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      fetchNotifications();
    }
  };

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
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
