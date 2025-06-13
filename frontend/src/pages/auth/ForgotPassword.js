import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { PiggyBank, Eye, EyeOff, CircleAlert } from 'lucide-react';
import SuccessPage from './SuccessPage';
import * as Yup from 'yup';

export default function ForgotPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmailError, setSendEmailError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const otpRefs = useRef([]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    otp: Yup.array().when([], {
      is: () => otpSent,
      then: (schema) =>
        schema
          .of(
            Yup.string()
              .matches(/^\d$/, 'Each digit must be a number')
              .required('Required'),
          )
          .min(6, 'Complete 6-digit OTP is required'),
      otherwise: (schema) => schema,
    }),
    newPassword: Yup.string().when([], {
      is: () => otpSent,
      then: (schema) =>
        schema
          .required('New password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /[A-Z]/,
            'Password must contain at least one uppercase letter',
          )
          .matches(
            /[a-z]/,
            'Password must contain at least one lowercase letter',
          )
          .matches(/\d/, 'Password must contain at least one number')
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain at least one special character',
          ),
      otherwise: (schema) => schema,
    }),
    confirmPassword: Yup.string().when([], {
      is: () => otpSent,
      then: (schema) =>
        schema
          .required('Confirm new password is required')
          .oneOf([Yup.ref('newPassword')], 'Confirm new password must match'),
      otherwise: (schema) => schema,
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      otp: ['', '', '', '', '', ''],
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSendEmailError('');
      setResetPasswordError('');
      setIsSubmitting(true);
      if (!otpSent) {
        const isSendEmail = await sendEmail(values.email);
        setOtpSent(isSendEmail);
      } else {
        const otpCode = values.otp.join('');
        if (otpCode.length !== 6) {
          formik.setFieldError('otp', 'Please enter a 6-digit OTP');
          return;
        }
        const isReset = await resetPassword(
          values.email,
          otpCode,
          values.newPassword,
          values.confirmPassword,
        );
        setResetSuccess(isReset);
      }
      setIsSubmitting(false);
    },
  });

  const sendEmail = async (email) => {
    try {
      if (email !== 'demo@gmail.com') {
        throw new Error('Email not found');
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log(`OTP sent to ${email}`);
          resolve();
        }, 1000);
      });
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSendEmailError(
        'Email not found. Please check your email or register.',
      );
    }
    return false;
  };

  const resetPassword = async (email, otp, newPassword, confirmNewPassword) => {
    try {
      if (newPassword !== confirmNewPassword) {
        formik.setFieldError(
          'confirmPassword',
          'Confirm new password must match',
        );
        return false;
      }
      setResetPasswordError('');
      console.log('Resetting password...');
      // Simulate API call to reset password
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            `Password reset for ${email} with OTP ${otp} and new password`,
          );
          resolve();
        }, 2000);
      });
      if (otp !== '000000') {
        console.log('Invalid OTP');
        throw new Error('Invalid OTP');
      }
      return true;
    } catch (error) {
      setResetPasswordError('Failed to reset password. Please try again.');
      console.error('Error resetting password:', error);
    }
    return false;
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue('otp', newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
    if (paste.every((char) => /^\d$/.test(char))) {
      const paddedPaste = paste.concat(Array(6 - paste.length).fill(''));
      formik.setFieldValue('otp', paddedPaste);
      otpRefs.current[Math.min(paste.length, 5)].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  if (resetSuccess) {
    return <SuccessPage />;
  }

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
        className="max-w-md w-full relative z-10 backdrop-blur-xl rounded-2xl p-8
        bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 text-4xl text-white shadow-2xl
            bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl
            flex items-center justify-center mx-auto mb-3"
          >
            <PiggyBank className="w-14 h-14" />
          </div>
          <h1
            className="text-2xl font-extrabold text-transparent mb-1 uppercase
            bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text"
          >
            Reset Password
          </h1>
        </div>

        {/* Form */}
        {!otpSent ? (
          <>
            {/* Error Message for Sending Email */}
            {sendEmailError && (
              <div
                className="mb-4 flex items-center justify-between gap-3 rounded-md border-2
                border-red-600 bg-red-100 px-4 py-3"
              >
                <div className="flex items-center gap-3 text-sm text-red-700">
                  <CircleAlert className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-semibold">
                    {sendEmailError}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSendEmailError('');
                    setResetPasswordError('');
                  }}
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

            {/* Email Input Form */}
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-200 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-white/10
                  text-gray-300 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your email"
                  required
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="flex items-center text-red-500/80 mt-1 text-sm animate-fadeIn">
                    *<span>{formik.errors.email}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full transition-all duration-300 transform hover:scale-105 px-4 py-4 mb-6 disabled:opacity-50
                bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
                text-white font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/25 disabled:cursor-not-allowed uppercase"
                disabled={isSubmitting || !formik.isValid}
              >
                {isSubmitting ? 'Sending email' : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Error Message for Resetting Password */}
            {resetPasswordError && (
              <div
                className="mb-6 flex items-center justify-between gap-3 rounded-md
                border-2 border-red-600 bg-red-100 px-4 py-3"
              >
                <div className="flex items-center gap-3 text-sm text-red-700">
                  <CircleAlert className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-semibold">
                    {resetPasswordError}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setResetPasswordError('')}
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
            {/* OTP and Password Reset Form */}
            <form onSubmit={formik.handleSubmit}>
              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex gap-2 justify-center">
                  {formik.values.otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 text-center text-lg font-medium bg-gray-900/50 border border-white/10
                      rounded-lg text-gray-300 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      ref={(el) => (otpRefs.current[index] = el)}
                      aria-label={`OTP digit ${index + 1}`}
                      required
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2.5 text-center">
                  OTP sent to {formik.values.email}
                </div>
              </div>

              {/* New Password and Confirm Password Inputs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-900/50 border border-white/10 text-gray-300
                    focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-emerald-400
                    transition-colors duration-300"
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <div className="flex items-center mt-1 text-red-500/80 text-sm animate-fadeIn">
                    *<span>{formik.errors.newPassword}</span>
                  </div>
                )}
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-200 mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-900/50 border border-white/10 text-gray-300
                    focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="flex items-center mt-1 text-red-500/80 text-sm animate-fadeIn">
                      *<span>{formik.errors.confirmPassword}</span>
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={() => {
                  setSendEmailError('');
                  setResetPasswordError('');
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600
                text-white font-semibold rounded-xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform
                hover:scale-105 px-4 py-4 mb-6 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                disabled={isSubmitting || !formik.isValid}
              >
                {isSubmitting ? 'Resetting' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* Back to Login Link */}
        <div className="text-center">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
