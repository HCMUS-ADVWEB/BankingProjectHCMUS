import { Shield, Lock } from 'lucide-react';

export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden
      bg-gradient-to-br from-slate-900 via-gray-900 to-black "
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center">
        {/* Bank Logo Area */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-4
            bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl"
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1
            className="font-bold text-3xl bg-clip-text text-transparent mb-2
            bg-gradient-to-r from-emerald-500 to-cyan-500"
          >
            Fintech HUB
          </h1>
          <p className="text-gray-300 font-semibold text-lg">
            Online Internet Banking
          </p>
        </div>

        {/* Main Spinner */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            {/* Animated Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            {/* Inner Ring */}
            <div
              className="absolute inset-4 border-2 border-white/30 rounded-full animate-spin"
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}
            ></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div
          className="inline-flex items-center space-x-2 bg-white/10
          backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
        >
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-white/90 text-sm">Bảo mật uy tín</span>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-10 -left-10 w-5 h-5 bg-white/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 -right-10 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-indigo-400/20 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
}
