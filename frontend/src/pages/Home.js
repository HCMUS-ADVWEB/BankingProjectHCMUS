import { useAuth } from '../contexts/AuthContext';
import {
  Shield,
  PiggyBank,
  Zap,
  Lock,
  Award,
  Phone,
  Mail,
  MapPin,
  ShieldUser,
  UserCircle2,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  CUSTOMER_EXPERIENCES,
  SOLUTIONS,
  MANAGEMENTS,
  GENERAL_STATS,
  CONTACT_INFO,
  CURRENT_YEAR,
} from '../utils/constants';

const NAVIGATION_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Access', href: '#roles' },
];

export default function HomePage() {
  const { state } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      id="home"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white"
    >
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        {/* Logo and Navigation */}
        <div className="max-w-7xl mx-auto flex items-center h-16 px-4 lg:px-6">
          {/* Logo - Fixed width container */}
          <div className="flex items-center w-48">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-xl blur-sm opacity-75
                  bg-gradient-to-r from-emerald-400 to-cyan-400"
                ></div>
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl shadow-xl
                  bg-gradient-to-br from-emerald-500 to-cyan-500"
                >
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span
                  className="text-lg font-bold bg-clip-text text-transparent
                  bg-gradient-to-r from-emerald-400 to-cyan-400"
                >
                  FINTECH
                </span>
                <p className="text-xs text-gray-300 font-medium">
                  Internet Banking
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAVIGATION_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 group"
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300
                  bg-gradient-to-r from-emerald-400 to-cyan-400"
                ></span>
              </a>
            ))}
          </nav>

          {/* Login Button - Fixed width container */}
          <div className="flex items-center justify-end w-48">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Login Button */}
            <div className="hidden md:block">
              <a
                href={
                  state.isAuthenticated
                    ? `/${(state.user?.role || 'customer').toLowerCase()}/dashboard`
                    : '/auth/login'
                }
                className="inline-flex items-center gap-2 px-4 py-1.5 text-white font-medium
                rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
                bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                <ShieldUser className="h-4 w-4" />
                {state.isAuthenticated ? 'DASHBOARD' : 'SIGN IN'}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {NAVIGATION_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={
                  state.isAuthenticated
                    ? `/${(state.user?.role || 'customer').toLowerCase()}/dashboard`
                    : '/auth/login'
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg
                bg-gradient-to-r from-emerald-500 to-cyan-500 mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldUser className="h-4 w-4" />
                {state.isAuthenticated ? 'DASHBOARD' : 'SIGN IN'}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        {/* Background Elements */}
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

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 space-y-6">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm
            bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Complete Banking Technology
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-3 pt-2">
            <h1 className="font-bold leading-tight font-serif text-4xl md:text-6xl text-white">
              Internet
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {' '}
                Banking
              </span>
            </h1>
            <p className="text-gray-300 leading-relaxed font-serif text-3xl md:text-5xl font-semibold max-w-7xl mx-auto">
              Experience digital finance
              <br></br>
              with secured and friendly platform.
              <br></br>
              Manage your digital accounts
              <br></br>
              anytime, anywhere.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <a
              href={
                state.isAuthenticated
                  ? `/${(state.user?.role || 'customer').toLowerCase()}/dashboard`
                  : '/auth/login'
              }
              className="inline-flex items-center gap-2 px-8 py-3 text-white text-base font-semibold
              bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 hover:from-emerald-600/80 hover:to-cyan-600/80
              rounded-xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <UserCircle2 className="h-5 w-5" />
              Access Banking Portal
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 mx-32">
            {GENERAL_STATS.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg group-hover:shadow-xl
                  bg-gradient-to-r ${stat.color} transition-all duration-300 transform group-hover:scale-110`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-white mb-1 text-2xl">
                  {stat.number}
                </div>
                <p className="text-gray-300 font-medium text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Experience Section */}
      <section id="experience" className="pt-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl
            bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl
            bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full backdrop-blur-sm
              bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
            >
              <UserCircle2 className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Customer Experience
              </span>
            </div>
            <h2 className="mb-4 text-3xl md:text-4xl leading-tight font-bold font-serif text-white">
              Why Customers
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                {' '}
                Choose Us
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed font-serif text-lg md:text-xl font-medium max-w-3xl mx-auto">
              Join with other customers who trust us with their financial future
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {CUSTOMER_EXPERIENCES.map((feature, index) => (
              <div key={index} className="group">
                <div
                  className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl border border-white/10
                  rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-all duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <div className="text-2xl font-bold text-white mb-1">
                      {feature.stat}
                    </div>
                    <div className="text-gray-400 text-xs font-medium">
                      {feature.statLabel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Banking Services Section */}
      <section id="solutions" className="pt-32 pb-2 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl
            bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl
            bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full backdrop-blur-sm
              bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
            >
              <PiggyBank className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">
                Banking Solutions
              </span>
            </div>
            <h2 className="mb-4 text-3xl md:text-4xl leading-tight font-bold font-serif text-white">
              Complete Banking in
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}
                One Platform
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed font-serif text-lg md:text-xl font-medium max-w-3xl mx-auto">
              From account management to transfers, experience comprehensive
              banking
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {SOLUTIONS.map((service, index) => (
              <div key={index} className="group">
                <div
                  className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl border border-white/10
                  rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg bg-gradient-to-r ${service.iconBg} group-hover:scale-110 transition-all duration-300`}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-3">
                      {service.title}
                    </h4>
                    <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                          <span className="text-gray-400 text-xs">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section id="roles" className="pt-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl
            bg-gradient-to-r from-rose-500/10 to-pink-500/10"
          ></div>
          <div
            className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl
            bg-gradient-to-r from-violet-500/10 to-purple-500/10"
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full backdrop-blur-sm
              bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20"
            >
              <ShieldUser className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-400">
                Multi-Level Access
              </span>
            </div>
            <h2 className="mb-4 text-3xl md:text-4xl leading-tight font-bold font-serif text-white">
              Designed for
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                {' '}
                Every Role
              </span>
            </h2>
            <p className="text-gray-300 leading-relaxed font-serif text-lg md:text-xl font-medium max-w-3xl mx-auto">
              Role-based access for customers, employees, and administrators
            </p>
          </div>

          {/* Roles Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {MANAGEMENTS.map((roleData, index) => (
              <div key={index} className="group">
                <div
                  className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl border border-white/10
                  rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${roleData.gradient} 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                  ></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg 
                        bg-gradient-to-r ${roleData.gradient} group-hover:scale-110 transition-all duration-300`}
                      >
                        <roleData.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {roleData.role}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {roleData.users}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4 text-sm">
                      {roleData.description}
                    </p>
                    <div className="space-y-2">
                      <div className="text-white font-medium text-xs mb-2">
                        Key Features:
                      </div>
                      {roleData.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${roleData.gradient}`}
                          ></div>
                          <span className="text-gray-300 text-xs">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-24">
            <div
              className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl border border-white/10
              rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
                  Ready to Transform Your Banking?
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  Join customers who have switched to smarter, secure banking.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={
                      state.isAuthenticated
                        ? `/${(state.user?.role || 'customer').toLowerCase()}/dashboard`
                        : '/auth/login'
                    }
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold
                    bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                    rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <UserCircle2 className="h-5 w-5" />
                    Get Started
                  </a>
                  <a
                    href="#solutions"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold
                    bg-transparent border-2 border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Award className="h-5 w-5" />
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-slate-800 via-gray-800 to-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl
                  bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg"
                >
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h5 className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-lg">
                    FINTECH
                  </h5>
                  <p className="text-gray-400 font-medium text-sm">
                    Internet Banking
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm max-w-2xl">
                Our secure internet banking platform is built to meet the needs
                of modern users. Easily manage your bank accounts, transfer
                funds, pay bills, and monitor transactions - all from the
                comfort of your home or on the go. With 24/7 access, you can
                stay in control of your finances anytime, anywhere. We use
                industry-standard security protocols to keep your information
                safe and your data protected. Whether you are checking your
                balance or setting up automatic payments, everything is designed
                to be fast, simple, and reliable. Plus, our dedicated customer
                support team is always ready to help you with any questions or
                concerns.
              </p>
              <div className="flex gap-3">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 flex items-center gap-2
                  bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
                >
                  <Shield className="h-3 w-3" />
                  INSURED
                </div>
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 flex items-center gap-2
                  bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                >
                  <Lock className="h-3 w-3" />
                  SECURED
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pl-6">
              <h6 className="font-bold text-gray-200 text-lg">Get in Touch</h6>
              <ul className="space-y-4 mt-4">
                <li className="flex items-center gap-3 text-gray-400">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg
                    bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
                  >
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Email</div>
                    <div className="text-sm">{CONTACT_INFO.email}</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg
                    bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  >
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Support
                    </div>
                    <div className="text-sm">{CONTACT_INFO.phone}</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg
                    bg-gradient-to-r from-purple-500/20 to-violet-500/20"
                  >
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Location
                    </div>
                    <div className="text-sm">{CONTACT_INFO.location}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <div className="flex flex-col border-t border-white/10 pt-8 lg:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {CURRENT_YEAR} Fintech HUB. All rights reserved. Transforming
              Finance Through Technology
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a
                href="/"
                className="hover:text-emerald-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/"
                className="hover:text-emerald-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="/"
                className="hover:text-emerald-400 transition-colors duration-300"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
