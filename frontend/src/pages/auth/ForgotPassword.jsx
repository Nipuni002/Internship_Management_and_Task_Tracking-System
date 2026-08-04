import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email address is required');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Invalid email format');
      return;
    }

    setSubmitting(true);
    // Mimic link request transmission delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      toast.success('Reset link dispatched successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="text-center">
        <h3 className="text-xl font-black text-white tracking-tight">Forgot Password</h3>
        <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
          Provide your registered email address and we will dispatch a password recovery reset link.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
          <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-2xl text-center space-y-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Reset Link Dispatched</h4>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              We have mock-dispatched a credentials recovery link to <span className="text-white font-bold">{email}</span>.
            </p>
          </div>
          <div className="pt-2">
            <Link 
              to={`/reset-password?email=${encodeURIComponent(email)}`} 
              className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
            >
              [Simulator Redirect] Reset Password Here →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRequestLink} className="space-y-4 text-xs font-semibold text-slate-400">
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FiLoader size={18} className="animate-spin" />
                <span>Sending link...</span>
              </>
            ) : (
              <span>Request Reset Link</span>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="text-slate-400 hover:text-white text-xs transition-colors font-bold">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
