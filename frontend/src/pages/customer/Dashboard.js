import { useAuth } from "../../contexts/AuthContext";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Chào mừng, {user?.fullName}
          </h1>
          <p className="text-lg">
            Quản lý tài khoản và giao dịch của bạn
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Tài khoản của bạn</h2>
          {/* Placeholder for account content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add AccountCard components here when available */}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Thao tác nhanh</h2>
          {/* Placeholder for QuickActions component */}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Giao dịch gần đây</h2>
          {/* Placeholder for RecentTransactions component */}
        </div>
      </div>
    </CustomerLayout>
  );
}