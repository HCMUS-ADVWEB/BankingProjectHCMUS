import { NavLink } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation({ items, title }) {
  const { isDarkMode } = useTheme();

  return (
    <nav
      className={`fixed z-50 w-70 h-screen flex flex-col border-r ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      } shadow-xl transition-colors duration-200`}
    >
      {/* Sidebar Title */}
      <div
        className={`p-4 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        } flex items-center gap-3.5`}
      >
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
          <p
            className={`text-sm font-semibold ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
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
                  `flex items-center gap-2.5 p-3 my-3 rounded-md transition-colors duration-200
                  ${
            isDarkMode
              ? 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-cyan-500/20'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
                  ${
            isActive
              ? isDarkMode
                ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-white'
                : 'bg-gray-200 text-gray-900'
              : ''
            }`
                }
              >
                <IconComponent
                  className={`w-5 h-5 ${
                    isDarkMode ? 'text-emerald-400' : 'text-gray-600'
                  }`}
                />
                <span className="text-base font-medium">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
