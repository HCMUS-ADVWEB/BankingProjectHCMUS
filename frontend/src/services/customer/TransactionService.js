import api from '../../utils/api';

const TransactionService = {
  /**
   * Fetch transaction history for the current user
   * @param {number} limit - Number of items per page
   * @param {number} page - Page number (1-based)
   * @param {string} orderBy - Field to sort by
   * @param {string} order - Sort direction ('asc' or 'desc')
   * @returns {Promise} Promise containing the transaction data
   */
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

  /**
   * Get details of a specific transaction
   * @param {string} transactionId - ID of the transaction to fetch
   * @returns {Promise} Promise containing the transaction details
   */
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
