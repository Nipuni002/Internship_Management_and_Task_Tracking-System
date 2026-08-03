import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setServerError(null);
    const result = await login(data.email, data.password);
    
    if (result.success) {
      if (result.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/intern/dashboard');
      }
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiMail size={18} />
            </div>
            <input
              type="text"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address format',
                },
              })}
              className={`w-full bg-slate-900 border ${
                errors.email ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-emerald-500/20'
              } text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 placeholder-slate-600 transition-all`}
              placeholder="name@company.com"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <FiLock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              className={`w-full bg-slate-900 border ${
                errors.password ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-700 focus:ring-emerald-500/20'
              } text-white rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-4 placeholder-slate-600 transition-all`}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
              disabled={loading}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-rose-500 mt-1 block">{errors.password.message}</span>
          )}
        </div>

        {/* Remember me option (optional layout design) */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-slate-800"
            />
            Remember me
          </label>
          <a href="#" className="text-emerald-400 hover:underline">Forgot password?</a>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* First-time login link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            First-time logging in?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-medium">
              Activate Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
