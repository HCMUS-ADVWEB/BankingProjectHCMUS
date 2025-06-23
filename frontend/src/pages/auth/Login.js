import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import {
  PiggyBank,
  Eye,
  EyeOff,
  CircleAlert,
  Loader2,
  LogInIcon,
} from 'lucide-react';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
  const navigate = useNavigate();
  const { state, login, clearError } = useAuth();
  const recaptchaRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated) {
      switch (state.user?.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          break;
      }
    }
  }, [state.isAuthenticated, state.user?.role, navigate]);

  const usernameRequirements = [
    {
      label: 'Username not empty',
      test: (username) => username.length >= 1,
    },
  ];

  const passwordRequirements = [
    {
      label: 'At least 8 characters',
      test: (password) => password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      test: (password) => /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      test: (password) => /[a-z]/.test(password),
    },
    {
      label: 'One number',
      test: (password) => /\d/.test(password),
    },
    {
      label: 'One special character',
      test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      recaptcha: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character',
        ),
      recaptcha: Yup.string().required('Please complete the reCAPTCHA'),
    }),

    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        await login(values.username, values.password, values.recaptcha);

        // Only reset reCAPTCHA after successful login or if we need to retry
        // Wait a bit to ensure any ongoing reCAPTCHA operations complete
        setTimeout(() => {
          if (recaptchaRef.current) {
            try {
              recaptchaRef.current.reset();
              formik.setFieldValue('recaptcha', '');
            } catch (error) {
              console.warn('Error resetting reCAPTCHA:', error);
              // If reset fails, just clear the form field
              formik.setFieldValue('recaptcha', '');
            }
          }
        }, 500);

      } catch (error) {
        // On login failure, reset reCAPTCHA after a delay
        setTimeout(() => {
          if (recaptchaRef.current) {
            try {
              recaptchaRef.current.reset();
              formik.setFieldValue('recaptcha', '');
            } catch (resetError) {
              console.warn('Error resetting reCAPTCHA after login failure:', resetError);
              formik.setFieldValue('recaptcha', '');
            }
          }
        }, 100);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle reCAPTCHA changes with error handling
  const handleRecaptchaChange = (token) => {
    formik.setFieldValue('recaptcha', token || '');
  };

  const handleRecaptchaExpired = () => {
    formik.setFieldValue('recaptcha', '');
  };

  const handleRecaptchaError = () => {
    formik.setFieldValue('recaptcha', '');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden
      bg-gradient-to-b from-slate-800 via-gray-800 to-zinc-900"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 -z-10
          bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 -z-10
          bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        ></div>
      </div>

      {/* Login Section */}
      <div
        className="max-w-md w-full relative z-10 border border-white/10 backdrop-blur-xl rounded-2xl p-8
        bg-gradient-to-br from-gray-900/50 to-black/50"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 mb-3 mt-1 flex items-center justify-center mx-auto
            bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-[20px] text-4xl text-white shadow-2xl"
          >
            <PiggyBank className="w-14 h-14" />
          </div>
          <h1
            className="text-3xl font-extrabold bg-clip-text text-transparent uppercase
            bg-gradient-to-r from-emerald-400 to-cyan-400"
          >
            Login
          </h1>
        </div>

        {/* Error Message */}
        {state.authError && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-md border-2 border-red-600 bg-red-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <CircleAlert className="w-5 h-5 text-red-500" />
              <span className="text-red-500 font-semibold">
                {state.authError}
              </span>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-3 rounded-lg transition-all duration-300
              bg-gray-900/50 border border-white/10 text-gray-300 focus:outline-none focus:border-emerald-400"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full px-4 py-3 pr-12 rounded-lg transition-all duration-300
                bg-gray-900/50 border border-white/10 text-gray-300 focus:outline-none focus:border-emerald-400"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-emerald-400 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Username & Password Requirements */}
          {(formik.values.password || formik.values.username) && (
            <div className="mb-8 p-5 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Username requirements
              </p>
              <div className="space-y-1.5 mb-2">
                {usernameRequirements.map((req, index) => {
                  const isValid = req.test(formik.values.username);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isValid
                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                            : 'bg-gray-700/50 border border-gray-600/50'
                        }`}
                      >
                        {isValid ? (
                          <svg
                            className="w-2.5 h-2.5 text-emerald-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        )}
                      </div>
                      <span
                        className={`transition-all duration-200 ${
                          isValid ? 'text-emerald-400' : 'text-gray-500'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Password requirements
              </p>
              <div className="space-y-1.5">
                {passwordRequirements.map((req, index) => {
                  const isValid = req.test(formik.values.password);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isValid
                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                            : 'bg-gray-700/50 border border-gray-600/50'
                        }`}
                      >
                        {isValid ? (
                          <svg
                            className="w-2.5 h-2.5 text-emerald-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        )}
                      </div>
                      <span
                        className={`transition-all duration-200 ${
                          isValid ? 'text-emerald-400' : 'text-gray-500'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* reCAPTCHA */}
          <div className="mb-7">
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_GG_SITE_KEY}
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                onError={handleRecaptchaError}
                theme="white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full relative overflow-hidden font-semibold rounded-xl shadow-xl transition-all duration-300 transform px-4 py-4 mb-6 mt-2 text-white ${
              isLoading
                ? 'bg-gradient-to-r from-emerald-400/50 to-cyan-400/50 cursor-not-allowed scale-95'
                : Object.keys(formik.errors).length > 0 ||
                    !formik.values.recaptcha
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-emerald-500/25 hover:scale-105 cursor-pointer'
            }`}
            disabled={
              isLoading ||
              Object.keys(formik.errors).length > 0 ||
              !formik.values.recaptcha
            }
          >
            {isLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center
                bg-gradient-to-r from-emerald-500/80 to-cyan-500/80"
              >
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="uppercase">Authenticating</span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-white/20 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            <div
              className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            >
              <span>LOGIN</span>
              {!isLoading &&
                Object.keys(formik.errors).length === 0 &&
                formik.values.recaptcha && <LogInIcon className="w-4 h-4" />}
            </div>
          </button>

          {/* Links  */}
          <div className="text-center space-y-3 mb-2">
            <div>
              <a
                href="/auth/forgot-password"
                className="text-blue-400 hover:text-emerald-400 transition-colors duration-300 text-sm font-medium"
              >
                Forgot your password
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <span className="px-3 text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div>
            <div>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-gray-400
                hover:text-emerald-400 transition-colors duration-300 text-sm font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
