import api from '../../utils/api';

const TransactionService = {
  async getTransactions(
    limit = 1000,
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
      .then((res) => {
        console.log('Transactions response:', res);
        return res.data;
      })
      .catch((err) => {
        console.error('Error fetching transactions:', err);
        throw err;
      });
  },

  async getTransactionDetails(transactionId) {
    return api
      .get(`/api/transactions/${transactionId}`)
      .then((res) => {
        console.log('Transaction details response:', res);
        return res.data;
      })
      .catch((err) => {
        console.error('Error fetching transaction details:', err);
        throw err;
      });
  },
};

export default TransactionService;
