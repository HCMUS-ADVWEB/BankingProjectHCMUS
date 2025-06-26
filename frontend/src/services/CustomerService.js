import api from '../utils/api';

const CustomerService = {
  /**
   * Get current logged-in user's account information
   * @returns {Promise<Object>} Account details
   */
  getMyAccount() {
    return api.get('/api/accounts/my-account');
  },

  async getRecipients(limit = 20, page = 1) {
    return api
      .get('/api/recipients', {
        params: { limit, page },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching recipients:', err);
        throw err;
      });
  },

  /**
   * Request OTP for transaction
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} otpType - Type of OTP (e.g., 'TRANSFER')
   * @returns {Promise} Promise containing the OTP request result
   */
  async requestOtp(userId, email, otpType = 'TRANSFER') {
    return api
      .post('/api/otp', {
        userId,
        email,
        otpType,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error requesting OTP:', err);
        throw err;
      });
  },

  /**
   * Perform internal transfer (within the same bank)
   * @param {Object} transferData - Transfer data
   * @returns {Promise} Promise containing the transfer result
   */
  async internalTransfer(transferData) {
    return api
      .post('/api/transactions/internal', transferData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error performing internal transfer:', err);
        throw err;
      });
  },

  /**
   * Perform external transfer (to another bank)
   * @param {Object} transferData - Transfer data
   * @returns {Promise} Promise containing the transfer result
   */
  async externalTransfer(transferData) {
    return api
      .post('/api/transactions/external', transferData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error performing external transfer:', err);
        throw err;
      });
  },

  /**
   * Save a new recipient
   * @param {Object} recipientData - Recipient data
   * @returns {Promise} Promise containing the save recipient result
   */
  async saveRecipient(recipientData) {
    return api
      .post('/api/recipients', recipientData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error saving recipient:', err);
        throw err;
      });
  },
};

export default CustomerService;
