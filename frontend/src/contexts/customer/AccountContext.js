// src/contexts/customer/AccountContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import CustomerService from '../../services/CustomerService';

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccount = () => {
    setLoading(true);
    CustomerService.getMyAccount()
      .then((res) => {
        setAccount(res.data.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setAccount(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <AccountContext.Provider value={{ account, loading, error, fetchAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
