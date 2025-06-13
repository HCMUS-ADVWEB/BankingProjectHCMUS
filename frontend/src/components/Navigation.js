import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, PiggyBank } from 'lucide-react';

export default function Navigation({ items, title }) {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav
      className="fixed z-50 w-70 h-screen flex flex-col border-r border-white/10 backdrop-blur-md
      bg-gradient-to-br from-slate-900 via-gray-900 to-black"
    >
      {/* Decorations */}
      <div className="absolute -z-50 inset-0 opacity-20">
        <div className="absolute bottom-1/4 right-2 w-32 h-32 rounded-full blur-2xl bg-indigo-400"></div>
        <div className="absolute top-1/4 left-1.5 w-32 h-32 rounded-full blur-2xl bg-blue-400"></div>
      </div>

      {/* Sidebar Title */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3.5">
        <div
          className="relative h-12 w-12 flex items-center justify-center rounded-2xl shadow-2xl
          bg-gradient-to-br from-emerald-500 to-cyan-500"
        >
          <PiggyBank className="h-6 w-6 text-white" />
        </div>
        <div>
          <span
            className="text-xl font-extrabold bg-clip-text text-transparent
            bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            FINTECH
          </span>
          <p className="text-sm text-gray-300 font-semibold">
            {title || 'Dashboard'}
          </p>
        </div>
      </div>

      {/* Tab List */}
      <ul className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const IconComponent =
            typeof item.icon === 'string'
              ? require('lucide-react')[item.icon]
              : item.icon;
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 my-3 rounded-md 
                  transition-colors duration-200 text-gray-200 hover:text-white
                  hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-cyan-500/20 
                  ${isActive ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white' : ''}`
                }
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-base font-medium">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Logout Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-white font-semibold text-xl
            bg-gradient-to-br from-violet-700 to-blue-700"
          >
            {state.user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-base font-medium text-white">
              {state.user?.fullName}
            </div>
            <div className="text-sm text-gray-400 capitalize">
              {state.user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg
            shadow-lgtransform transition-all duration-300 text-white font-semibold text-sm
            hover:shadow-xl hover:scale-[0.98] active:scale-95
            bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-800 hover:to-red-800"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="leading-none">Log out</span>
        </button>
      </div>
    </nav>
  );
}
