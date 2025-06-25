import api from '../utils/api';

export const NotificationAPI = {
  getNotifications: async (limit = 10, page = 1) => {
    try {
      const response = await api.get(
        `/api/notifications?limit=${limit}&page=${page}`,
      );

      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        console.warn('Unexpected API response format:', response);
        return { content: [] };
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
      const response = await api.put(
        `/api/notifications/read/${notificationId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error marking notification ${notificationId} as read:`,
        error,
      );
      throw error;
    }
  },
};

export default NotificationAPI;
