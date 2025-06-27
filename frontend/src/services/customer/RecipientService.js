import api from '../../utils/api';

const RecipientService = {
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
  async addRecipient(recipientData) {
    const formattedData = {
      accountNumber: recipientData.accountNumber,
      bankCode:
        recipientData.bankCode === null
          ? null
          : recipientData.bankCode || recipientData.bankName,
      nickName: recipientData.nickName || recipientData.recipientNickname,
    };

    return api
      .post('/api/recipients', formattedData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error adding recipient:', err);
        throw err;
      });
  },

  async updateRecipient(recipientId, recipientData) {
    return api
      .put(`/api/recipients/${recipientId}`, recipientData)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error updating recipient:', err);
        throw err;
      });
  },

  async deleteRecipient(recipientId) {
    return api
      .delete(`/api/recipients/${recipientId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error deleting recipient:', err);
        throw err;
      });
  },
};

export default RecipientService;
