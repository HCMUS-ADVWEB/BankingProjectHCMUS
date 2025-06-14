import Navigation from '../components/Navigation';
import MainHeader from '../components/MainHeader';
import { Home, Users, History } from 'lucide-react';

export default function AdminLayout({ children }) {
  const navigationItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { label: 'Employees', href: '/admin/employees', icon: Users },
    { label: 'Transactions', href: '/admin/transactions', icon: History },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Navigation items={navigationItems} title="Admin Dashboard" />
      <div className="ml-[17.5rem] flex-1 flex flex-col">
        <MainHeader navigationItems={navigationItems} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
