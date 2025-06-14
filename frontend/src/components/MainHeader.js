import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bell,
  Moon,
  Sun,
  Settings,
  User,
  ChevronDown,
  PiggyBank,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function MainHeader({ navigationItems = [] }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { state, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const generateBreadcrumb = () => {
    const breadcrumbs = [{ label: 'Home', href: '/', icon: PiggyBank }];
    const currentItem = navigationItems.find(
      (item) =>
        item.href === location.pathname ||
        location.pathname.startsWith(item.href),
    );
    if (currentItem) {
      breadcrumbs.push({
        label: currentItem.label,
        href: currentItem.href,
        icon: currentItem.icon,
      });
    }
    return breadcrumbs;
  };
  const breadcrumbs = generateBreadcrumb();

  const notifications = [
    {
      id: 1,
      title: 'New transaction completed',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'System maintenance scheduled',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Account verification required',
      time: '3 hours ago',
      unread: false,
    },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`h-16 ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        } border-b flex items-center justify-between px-4 md:px-6 relative z-40`}
      >
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Breadcrumb */}
          <div
            className={`hidden md:flex items-center space-x-2 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {breadcrumbs.map((crumb, index) => {
              const IconComponent = crumb.icon;
              return (
                <Link
                  to={crumb.href}
                  key={crumb.href}
                  className="flex items-center"
                >
                  {index > 0 && (
                    <ChevronRight
                      className={`w-4 h-4 mx-2 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  )}
                  <div className="flex items-center space-x-1">
                    <IconComponent
                      className={`w-4 h-4 ${
                        isDarkMode ? 'text-emerald-400 font' : 'text-gray-600'
                      }`}
                    />
                    <span
                      className={`${
                        index === breadcrumbs.length - 1
                          ? isDarkMode
                            ? 'text-white font-medium'
                            : 'text-gray-900 font-medium'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white'
                            : 'hover:text-gray-900'
                      }`}
                    >
                      {crumb.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 ${
              isDarkMode
                ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            } rounded-lg transition-colors`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors relative`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                } rounded-lg shadow-lg border py-2 z-50`}
              >
                <div
                  className={`px-4 pt-1 pb-2.5 border-b ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      } border-l-4 ${
                        notification.unread
                          ? isDarkMode
                            ? 'border-l-emerald-500 bg-emerald-900/30'
                            : 'border-l-blue-500 bg-blue-50/30'
                          : 'border-l-transparent'
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } mt-1`}
                      >
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className={`px-4 pt-2 pb-1 border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <button
                    className={`text-sm ${
                      isDarkMode
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center space-x-2 p-2 ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors`}
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br ${
                  isDarkMode
                    ? 'from-emerald-500 to-cyan-500'
                    : 'from-violet-700 to-blue-700'
                } rounded-full flex items-center justify-center text-white font-semibold text-sm`}
              >
                {state.user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {state.user?.fullName}
                </div>
                <div
                  className={`text-xs capitalize ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {state.user?.role}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 hidden md:block ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                } rounded-lg shadow-lg border py-2 z-50`}
              >
                <div
                  className={`px-4 pt-1 pb-2.5 border-b ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {state.user?.fullName}
                  </p>
                  <p
                    className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {state.user?.email}
                  </p>
                </div>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center space-x-2`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center space-x-2`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <div
                  className={`border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 mt-1.5 py-2 text-sm ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-red-600 hover:bg-red-50'
                    } flex items-center space-x-2`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showNotifications || showProfileMenu) && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
          />
        )}
      </header>
    </>
  );
}
