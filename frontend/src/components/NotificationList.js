import { Bell } from 'lucide-react';

export default function NotificationList({
  notifications = [],
  loading = false,
  markAsRead,
  markAllAsRead,
  isDarkMode,
}) {
  return (
    <>
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-3 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <Bell className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No notifications
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              You'll see notifications here when you receive them
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:${
                isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'
              } border-l-4 ${
                !notification.read
                  ? isDarkMode
                    ? 'border-l-emerald-500 bg-emerald-900/30'
                    : 'border-l-blue-500 bg-blue-50/50'
                  : isDarkMode
                    ? 'border-l-transparent bg-transparent text-gray-300'
                    : 'border-l-transparent bg-transparent text-gray-600'
              } relative transition-colors duration-200 cursor-pointer`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <p
                className={`text-sm ${
                  !notification.read
                    ? isDarkMode
                      ? 'text-white font-medium'
                      : 'text-gray-900 font-medium'
                    : isDarkMode
                      ? 'text-gray-300'
                      : 'text-gray-700'
                }`}
              >
                {notification.title}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } line-clamp-2 overflow-hidden`}
              >
                {notification.content}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mt-1`}
              >
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer with "Mark all as read" button */}
      {notifications.length > 0 && (
        <div
          className={`px-4 pt-2 pb-1 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}
        >
          <button
            className={`text-sm font-medium ${
              isDarkMode
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-blue-600 hover:text-blue-800'
            } transition-colors py-1 px-2 rounded hover:${
              isDarkMode ? 'bg-emerald-900/20' : 'bg-blue-50'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
          >
            Mark all as read
          </button>
        </div>
      )}
    </>
  );
}
