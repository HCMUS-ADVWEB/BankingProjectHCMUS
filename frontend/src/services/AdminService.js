import api from '../utils/api';

// Service for employee-related API calls
export const AdminService = {
  async fetchEmployees() {
    return api.get('/api/users')
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching employees:', err);
        return Promise.reject(err);
      });
  },

  async fetchEmployeeById(id) {
    return api.get(`/api/users/${id}`)
      .then(res => res.data)
      .catch(err => {
        console.error(`Error fetching employee ${id}:`, err);
        return Promise.reject(err);
      });
  },

  async createEmployee(data) {
    return api.post('/api/users', data)
      .then(res => res.data)
      .catch(err => {
        console.error('Error adding employee:', err);
        return Promise.reject(err);
      });
  },

  async updateEmployee(id, data) {
    return api.put(`/api/users/${id}`, data)
      .then(res => res.data)
      .catch(err => {
        console.error(`Error updating employee ${id}:`, err);
        return Promise.reject(err);
      });
  },

  async deleteEmployee(id) {
    return api.delete(`/api/users/${id}`)
      .then(res => res.data)
      .catch(err => {
        console.error(`Error deleting employee ${id}:`, err);
        return Promise.reject(err);
      });
  },

  // Bank APIs
  async fetchBanks() {
    return api.get('/api/banks')
      .then(res => res.data.data)
      .catch(err => {
        console.error('Error fetching banks:', err);
        return Promise.reject(err);
      });
  },

  async fetchBankTransactions({ startDate, endDate, limit, page, bankCode }) {
    const params = {
      startDate,
      endDate,
      limit,
      page,
    };
    if (bankCode) params.bankCode = bankCode;

    return api.get('/api/transactions/bank-transactions', { params })
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching bank transactions:', err);
        return Promise.reject(err);
      });
  },

  async fetchTransactionStatistics({ startDate, endDate, limit, page, bankCode }) {
    const params = {
      startDate,
      endDate,
      limit,
      page,
    };
    if (bankCode) params.bankCode = bankCode;

    return api.get('/api/transactions/bank-transactions/statistics', { params })
      .then(res => res.data)
      .catch(err => {
        console.error('Error fetching transaction statistics:', err);
        return Promise.reject(err);
      });
  },
};
