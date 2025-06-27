import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Circle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileModal({ isOpen = true, onClose = () => {} }) {
  const { state } = useAuth();

  if (!isOpen) return null;

  // Format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const profileFields = [
    {
      icon: User,
      label: 'Full Name',
      value: state.user?.fullName,
      primary: true,
    },
    { icon: User, label: 'Username', value: state.user?.username },
    { icon: Mail, label: 'Email', value: state.user?.email },
    { icon: Phone, label: 'Phone', value: state.user?.phone },
    { icon: MapPin, label: 'Address', value: state.user?.address },
    {
      icon: Calendar,
      label: 'Date of Birth',
      value: state.user?.dob ? formatDate(state.user.dob) : 'Not provided',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header với gradient */}
        <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 py-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* User Avatar And Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20">
                <User className="h-8 w-8 text-white" />
              </div>
              {state.user?.isActive && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-3 border-gray-900 shadow-sm">
                  <Circle
                    className="h-3 w-3 text-green-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {state.user?.fullName || 'User'}
              </h2>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-white/80" />
                <p className="text-white/90 text-sm font-medium">
                  {state.user?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {profileFields.map((field, index) => {
                const IconComponent = field.icon;
                return (
                  <div key={index} className="group">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-sm">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {field.label}
                        </p>
                        <p
                          className={`text-gray-900 break-words ${field.primary ? 'text-base font-semibold' : 'text-sm'}`}
                        >
                          {field.value || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:opacity-80 border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
