import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationList from './NotificationList';
import {
  Bell,
  Moon,
  Sun,
  User,
  ChevronDown,
  PiggyBank,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileModal from './ProfileModal';

export default function MainHeader({ navigationItems = [] }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { state, logout } = useAuth();
  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    markAllAsRead = () => console.warn('markAllAsRead not available'),
    markAsRead = () => console.warn('markAsRead not available'),
  } = useNotifications() || {};
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);

                // Log current notification state when toggling
                if (!showNotifications) {
                  console.log('Opening notifications - Current count:', unreadCount);
                  console.log('Current notifications:', notifications);
                }
              }}
              className={`p-2 ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors relative`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
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
                onClick={(e) => e.stopPropagation()}
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
                <NotificationList
                  notifications={notifications}
                  loading={loading}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>

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
                className={`absolute right-0 mt-2 px-0 ${
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
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowProfileModal(true);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-slate-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } flex items-center space-x-2`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <div
                  className={`border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={logout}
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
