import { CheckCheck } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden
        bg-gradient-to-b from-slate-800 via-gray-800 to-zinc-900"
    >
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl
          bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl
          bg-gradient-to-r from-blue-500/20 to-purple-500/20"
        ></div>
      </div>

      {/* Main content */}
      <div
        className="max-w-md w-full relative z-10 rounded-2xl p-8 text-center animate-fade-in
        bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 backdrop-blur-xl"
      >
        <div className="text-5xl mb-3 text-emerald-400">
          <CheckCheck className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-extrabold text-emerald-400 mb-3 uppercase">
          Password Reset Successful
        </h2>
        <p className="text-gray-300 mb-8">
          Your password has been successfully reset. You can now login with your
          new password.
        </p>
        <a
          href="/auth/login"
          className="w-full block text-white font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/25
          transition-all duration-300 transform hover:scale-105 px-4 py-4 uppercase
          bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
