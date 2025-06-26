import api from '../../utils/api';

const TransferService = {
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

  async internalTransfer(transferData) {
    return api
      .post('/api/transactions/internal', transferData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error performing internal transfer:', err);
        throw err;
      });
  },

  async externalTransfer(transferData) {
    return api
      .post('/api/transactions/external', transferData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error performing external transfer:', err);
        throw err;
      });
  },

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

export default TransferService;
