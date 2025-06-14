import Navigation from '../components/Navigation';
import MainHeader from '../components/MainHeader';
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
      <div className="ml-[17.5rem] flex-1 flex flex-col">
        <MainHeader navigationItems={navigationItems} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
