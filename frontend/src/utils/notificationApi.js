import api from './api';

export const NotificationAPI = {  
  getNotifications: async (limit = 10, page = 1) => {
    try {
      console.log(`Calling GET /api/notifications?limit=${limit}&page=${page}`);
      const response = await api.get(`/api/notifications?limit=${limit}&page=${page}`);
      console.log('Raw API response:', response);
      
      // Ensure we always return a consistent data structure
      if (response.data && response.data.data) {
        return response.data.data; // API returns data inside a data field
      } else if (response.data) {
        return response.data; // API returns data directly
      } else {
        console.warn('Unexpected API response format:', response);
        return { content: [] }; // Default empty response
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },
  
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/api/notifications/read/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }
};

export default NotificationAPI;
