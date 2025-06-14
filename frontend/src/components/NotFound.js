import { NavLink } from 'react-router-dom';
import { HouseIcon, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden
      bg-gradient-to-br from-slate-900 via-gray-900 to-black"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main 404 Container */}
      <div className="relative z-10 text-center animate-fadeIn">
        {/* Error Message */}
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center mb-6">
            <AlertCircle className="w-26 h-26 text-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-emerald-500">
            Page Not Found
          </h2>
          <p className="text-gray-300 font-medium text-lg max-w-xl mx-auto">
            The page you are looking for does not exist or has been moved.
            <br></br>
            Please check the URL or return to the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-white font-semibold rounded-xl
              bg-gradient-to-r from-emerald-500 to-cyan-500
              hover:from-emerald-600 hover:to-cyan-600
              shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-2"
          >
            <HouseIcon className="w-5 h-5" />
            Go to Home
          </NavLink>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-indigo-400/40 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
}
