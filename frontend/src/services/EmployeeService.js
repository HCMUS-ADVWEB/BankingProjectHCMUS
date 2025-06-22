import api from '../utils/api';
// EmployeeService.js
// Service for employee-related API calls

export const EmployeeService = {
    async fetchAccounts() {
        // GET /api/accounts
        return api.get('/api/accounts')
            .then(res => res.data)
            .catch(err => {
                console.error('Error fetching accounts:', err);
                // For development - return a resolved promise with null data
                // to allow graceful fallback to mock data
                return Promise.resolve({ data: null });
            });
    },
    
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
