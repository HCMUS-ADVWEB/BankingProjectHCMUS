// import axios from 'axios';

export const loginUser = async ({ username, password, role }) => {
  // Mock API response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password && ['customer', 'admin', 'employee'].includes(role)) {
        resolve({ username, role });
      } else {
        reject(new Error('Invalid credentials or role'));
      }
    }, 1000);
  });
};

// Other mocked API functions (unchanged from previous artifacts)
export const fetchAccounts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, number: '1234567890', balance: 1000000 }]);
    }, 1000);
  });
};

export const fetchRecipients = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, recipientAccountNumber: '0987654321', recipientName: 'John Doe' }]);
    }, 1000);
  });
};

export const addRecipient = async (recipient) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Date.now(), ...recipient });
    }, 1000);
  });
};

export const updateRecipient = async (recipient) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipient);
    }, 1000);
  });
};

export const deleteRecipient = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(id);
    }, 1000);
  });
};

export const fetchTransactions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          type: 'TRANSFER',
          amount: 50000,
          status: 'COMPLETED',
          fromAccountNumber: '1234567890',
          toAccountNumber: '0987654321',
          createdAt: '2025-06-01T10:00:00Z',
        },
        {
          id: 2,
          type: 'RECEIVED',
          amount: 30000,
          status: 'COMPLETED',
          fromAccountNumber: '0987654321',
          toAccountNumber: '1234567890',
          createdAt: '2025-06-02T12:00:00Z',
        },
        {
          id: 3,
          type: 'DEBT_PAYMENT',
          amount: 20000,
          status: 'COMPLETED',
          fromAccountNumber: '1234567890',
          toAccountNumber: '0987654321',
          createdAt: '2025-06-03T08:00:00Z',
        },
      ]);
    }, 1000);
  });
};

export const fetchDebts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          debtor: '0987654321',
          amount: 20000,
          message: 'Lunch debt',
          status: 'PENDING',
          created: '2025-06-01T09:00:00Z',
        },
        {
          id: 2,
          debtor: '1234567890',
          amount: 15000,
          message: 'Coffee debt',
          status: 'PENDING',
          created: '2025-06-02T10:00:00Z',
        },
      ]);
    }, 1000);
  });
};

export const addDebt = async (debt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Date.now(), ...debt, status: 'PENDING' });
    }, 1000);
  });
};

export const updateDebt = async (debt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(debt);
    }, 1000);
  });
};