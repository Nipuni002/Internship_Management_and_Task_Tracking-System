import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiAlertCircle, FiUser } from 'react-icons/fi';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve email from URL search params if present
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!email) {
      setError('Email address is required');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email address format');
      return;
    }

    if (!employeeId) {
      setError('Employee ID is required');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.resetPassword(email, employeeId, password);
      if (response.success) {
        toast.success('Password reset successfully! Please sign in with your new credentials.');
        navigate('/login');
      } else {
        setError(response.message || 'Failed to reset password. Check credentials.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred during password reset.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="text-center">
        <h3 className="text-xl font-black text-white tracking-tight">Set New Password</h3>
        <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
          Provide your verification credentials and configure your new secure account password.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
          <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-semibold text-slate-400">
        
        {/* Email Address */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiMail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-600"
              placeholder="intern.name@company.com"
              disabled={submitting}
              required
            />
          </div>
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Employee ID / Intern ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiUser size={18} />
            </div>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-600"
              placeholder="INT-2026-001"
              disabled={submitting}
              required
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiLock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-600"
              placeholder="••••••••"
              disabled={submitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 focus:outline-none"
              disabled={submitting}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiLock size={18} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-600"
              placeholder="••••••••"
              disabled={submitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 focus:outline-none"
              disabled={submitting}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2.5 rounded-xl transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <FiLoader size={18} className="animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>

        {/* Back to Login link */}
        <div className="text-center pt-2">
          <Link to="/login" className="text-slate-400 hover:text-white text-xs transition-colors font-bold">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
