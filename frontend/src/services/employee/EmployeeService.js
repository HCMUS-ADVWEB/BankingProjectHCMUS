import api from '../../utils/api';

export const EmployeeService = {
  async createAccount(data) {
    return api.post('/api/accounts/create', data).then((res) => res.data);
  },

  async depositAccount(data) {
    return api
      .post('/api/transactions/internal/deposit', data)
      .then((res) => res.data);
  },

  async fetchTransactions(accountNumber, params = {}) {
    return api
      .post(
        '/api/accounts/get-account-transactions',
        { accountNumber },
        { params },
      )
      .then((res) => ({
        transactions: [
          ...(res.data.data.transactionsAsSender || []).map((tx) => ({
            ...tx,
            role: 'SENDER',
          })),
          ...(res.data.data.transactionsAsReceiver || []).map((tx) => ({
            ...tx,
            role: 'RECEIVER',
          })),
        ],
      }));
  },

  async fetchBanks() {
    return api.get('/api/banks').then((res) => res.data);
  },
};
