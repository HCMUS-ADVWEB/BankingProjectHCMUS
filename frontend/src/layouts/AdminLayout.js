import Navigation from '../components/Navigation';
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
      <main className="ml-[17.5rem] flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
