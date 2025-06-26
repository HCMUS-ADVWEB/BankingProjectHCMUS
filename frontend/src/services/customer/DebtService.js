import api from '../../utils/api';
// DebtService.js
// Service for debt reminder-related API calls

const DebtService = {
  /**
   * Fetch debt reminders divided into created and received lists
   * @param {string|null} status - Filter by status (PENDING, PAID, CANCELLED)
   * @param {number} limit - Number of items per page
   * @param {number} page - Page number (1-based)

   * @returns {Promise} Promise containing the debt reminders data
   */
  async getDebtReminderLists(status = null, limit = 10, page = 1) {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    queryParams.append('limit', limit);
    queryParams.append('page', page);

    const url = `/api/debts?${queryParams.toString()}`;
    return api
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching debt reminders:', err);
        throw err;
      });
  },
  /**
   * Create a new debt reminder
   * @param {Object} debtData - Debt reminder data with format { debtorAccountNumber, amount, message }
   * @returns {Promise} Promise containing the create operation result
   */
  async createDebtReminder(debtData) {
    // Format data according to API requirements
    const formattedData = {
      debtorAccountNumber:
        debtData.accountNumber || debtData.debtorAccountNumber,
      amount: debtData.amount,
      message: debtData.message || '',
    };

    return api
      .post('/api/debts', formattedData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error creating debt reminder:', err);
        throw err;
      });
  },

  /**
   * Cancel a debt reminder
   * @param {string} reminderId - UUID of the debt reminder
   * @param {string} reason - Reason for cancellation
   * @returns {Promise} Promise containing the cancel operation result
   */
  async cancelDebtReminder(reminderId, reason) {
    return api
      .delete(`/api/debts/${reminderId}`, {
        data: { cancelledReason: reason },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error cancelling debt reminder:', err);
        throw err;
      });
  },

  /**
   * Request OTP for debt payment
   * @returns {Promise} Promise containing the OTP request result
   */
  async requestOtpForPayDebt() {
    return api
      .post('/api/debts/request-otp')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error requesting OTP for debt payment:', err);
        throw err;
      });
  },

  /**
   * Pay a debt reminder
   * @param {Object} paymentData - Payment data including OTP
   * @returns {Promise} Promise containing the payment operation result
   */
  async payDebtReminder(reminderId, paymentData) {
    console.log('Paying debt reminder:', { paymentData });
    return api
      .post(`/api/debts/${reminderId}`, paymentData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error paying debt reminder:', err);
        throw err;
      });
  },
};

export default DebtService;
