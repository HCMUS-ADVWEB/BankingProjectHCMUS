import Navigation from '../components/Navigation';
import { Home, Send, Users, FileText, History, Settings } from 'lucide-react';

export default function CustomerLayout({ children }) {
  const navigationItems = [
    { label: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { label: 'Accounts', href: '/customer/accounts', icon: 'CreditCard' },
    { label: 'Transfer', href: '/customer/transfer', icon: Send },
    { label: 'Recipients', href: '/customer/recipients', icon: Users },
    { label: 'Debts', href: '/customer/debts', icon: FileText },
    { label: 'Transactions', href: '/customer/transactions', icon: History },
    {
      label: 'Change Password',
      href: '/customer/change-password',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Navigation items={navigationItems} title="Customer Dashboard" />
      <main className="ml-[17.5rem] flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
