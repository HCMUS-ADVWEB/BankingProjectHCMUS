import Navigation from '../components/Navigation';
import MainHeader from '../components/MainHeader';
import {
  Home,
  Send,
  Users,
  FileText,
  History,
  Settings,
  CreditCard,
  Delete,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeProvider } from '@mui/material/styles';

export default function CustomerLayout({ children }) {
  const navigationItems = [
    { label: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { label: 'Accounts', href: '/customer/accounts', icon: CreditCard },
    { label: 'Transfer', href: '/customer/transfer', icon: Send },
    { label: 'Recipients', href: '/customer/recipients', icon: Users },
    { label: 'Debts', href: '/customer/debts', icon: FileText },
    { label: 'Transactions', href: '/customer/transactions', icon: History },
    {
      label: 'Change Password',
      href: '/customer/change-password',
      icon: Settings,
    },
    {
      label: 'Close account',
      href: '/customer/close-account',
      icon: Delete,
    },
  ];
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-neutral-100 flex">
        <Navigation items={navigationItems} title="Customer Dashboard" />
        <div className="ml-[17.5rem] flex-1 flex flex-col">
          <MainHeader navigationItems={navigationItems} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
