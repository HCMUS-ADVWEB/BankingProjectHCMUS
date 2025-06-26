import api from '../../utils/api';

const TransactionService = {
  async getTransactions(
    limit = 10,
    page = 1,
    orderBy = 'createdAt',
    order = 'desc',
  ) {
    return api
      .get('/api/accounts/customer/transactions', {
        params: {
          limit,
          pn: page,
          orderBy,
          order,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        throw err;
      });
  },

  async getTransactionDetails(transactionId) {
    return api
      .get(`/api/transactions/${transactionId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error fetching transaction details:', err);
        throw err;
      });
  },
};

export default TransactionService;
