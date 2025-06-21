import api from '../utils/api';
// EmployeeService.js
// Service for employee-related API calls

export const EmployeeService = {
    async fetchTransactions(params = {}) {
        // GET /api/accounts/{{customer-id}}?limit=3&pn=1
        const { customerId, ...query } = params;
        return api.get(`/api/accounts/${customerId}`, { params: query })
            .then(res => res.data);
    },

    async createAccount(data) {
        // POST /api/accounts/create
        return api.post('/api/accounts/create', data)
            .then(res => res.data);
    },

    async depositAccount(data) {
        // PUT /api/accounts/recharge
        return api.put('/api/accounts/recharge', data)
            .then(res => res.data);
    },
};
