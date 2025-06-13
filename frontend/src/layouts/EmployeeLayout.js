import Navigation from '../components/Navigation';
import { Home, UserPlus, DollarSign, History } from 'lucide-react';

export default function EmployeeLayout({ children }) {
  const navigationItems = [
    { label: 'Dashboard', href: '/employee/dashboard', icon: Home },
    { label: 'Create Account', href: '/employee/accounts', icon: UserPlus },
    { label: 'Deposit', href: '/employee/deposit', icon: DollarSign },
    { label: 'Transactions', href: '/employee/transactions', icon: History },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Navigation items={navigationItems} title="Employee Dashboard" />
      <main className="ml-[17.5rem] flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
