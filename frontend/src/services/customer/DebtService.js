import api from '../../utils/api';

const DebtService = {
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

  async createDebtReminder(debtData) {
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

  async requestOtpForPayDebt() {
    return api
      .post('/api/debts/request-otp')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error requesting OTP for debt payment:', err);
        throw err;
      });
  },

  async payDebtReminder(reminderId, paymentData) {
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
