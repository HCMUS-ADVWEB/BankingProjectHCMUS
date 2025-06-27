import api from '../utils/api';

const CustomerService = {
  /**
   * Get current logged-in user's account information
   * @returns {Promise<Object>} Account details
   */
  getMyAccount() {
    return api.get('/api/accounts/my-account');
  },

  async getBanks() {
    return api.get('/api/banks')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching banks:', err);
        throw err;
      });
  },

  async getRecipients() {
    return api.get('/api/recipients')
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching recipients:', err);
        throw err;
      });
  },

  async getAccountInfo(accountNumber, bankCode = null) {
    return api.post('/api/accounts/account-info', { accountNumber, bankCode })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching account info:', err);
        throw err;
      });
  },

  async sendOtp(otpType = 'TRANSFER') {
    return api.post('/api/otp', { otpType })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error sending OTP:', err);
        throw err;
      });
  },

  async internalTransfer({ accountNumberReceiver, amount, message, feeType, otp }) {
    return api.post('/api/transactions/internal', {
      accountNumberReceiver,
      amount,
      message,
      feeType,
      otp
    })
    .then(res => res.data)
    .catch(err => {
      console.error('Internal transfer failed:', err);
      throw err;
    });
  },

  // External transfer  
  async externalTransfer({ receiverAccountNumber, amount, content, otp, bankCode }) {
    return api.post('/api/transactions/external', {
      receiverAccountNumber,
      amount,
      content,
      otp,
      bankCode
    })
    .then(res => res.data)
    .catch(err => {
      console.error('External transfer failed:', err);
      throw err;
    });
  }
};

export default CustomerService;
