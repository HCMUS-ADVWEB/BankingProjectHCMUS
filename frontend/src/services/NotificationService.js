import api from '../utils/api';

/**
 * Service for handling notification-related API calls
 */
class NotificationService {
  /**
   * Fetch paginated notifications
   * @param {number} limit - Maximum number of notifications to fetch
   * @param {number} page - Page number to fetch
   * @returns {Promise<Object>} - Notifications data
   */
  async getNotifications(limit = 10, page = 1) {
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
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} - API response
   */
  async markAllAsRead() {
    try {
      const response = await api.put('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Mark a specific notification as read
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {Promise<Object>} - API response
   */
  async markAsRead(notificationId) {
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
  }
}

// Create a singleton instance
const notificationService = new NotificationService();
export default notificationService;
