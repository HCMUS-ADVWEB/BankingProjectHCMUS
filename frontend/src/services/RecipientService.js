import api from '../utils/api';

const RecipientService = {
  /**
   * Fetch recipients list for the current user
   * @param {number} limit - Number of items per page
   * @param {number} page - Page number (1-based)
   * @returns {Promise} Promise containing the recipients data
   */
  async getRecipients(limit = 20, page = 1) {
    return api
      .get('/api/recipients', {
        params: {
          limit,
          page,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching recipients:', err);
        throw err;
      });
  },
  /**
   * Add a new recipient
   * @param {Object} recipientData - Recipient data with format { accountNumber, bankCode, nickName }
   * @returns {Promise} Promise containing the result
   */
  async addRecipient(recipientData) {
    // Format data according to API requirements
    const formattedData = {
      accountNumber: recipientData.accountNumber,
      bankCode:
        recipientData.bankCode === null
          ? null
          : recipientData.bankCode || recipientData.bankName, // Support both formats and null
      nickName: recipientData.nickName || recipientData.recipientNickname, // Support both formats
    };

    return api
      .post('/api/recipients', formattedData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error adding recipient:', err);
        throw err;
      });
  },

  /**
   * Update an existing recipient
   * @param {string} recipientId - ID of the recipient to update
   * @param {Object} recipientData - Updated recipient data
   * @returns {Promise} Promise containing the result
   */
  async updateRecipient(recipientId, recipientData) {
    return api
      .put(`/api/recipients/${recipientId}`, recipientData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error updating recipient:', err);
        throw err;
      });
  },

  /**
   * Delete a recipient
   * @param {string} recipientId - ID of the recipient to delete
   * @returns {Promise} Promise containing the result
   */
  async deleteRecipient(recipientId) {
    return api
      .delete('/api/recipients', {
        data: { recipientId },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error deleting recipient:', err);
        throw err;
      });
  },
};

export default RecipientService;
