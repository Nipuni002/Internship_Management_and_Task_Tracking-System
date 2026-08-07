import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const displayName = user.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'User');
  const profilePath = user.role === 'ROLE_ADMIN' ? '/admin/profile' : '/intern/profile';

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8.5 h-8.5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:flex flex-col items-start text-left select-none">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{displayName}</span>
          <span className="text-[10px] text-slate-450 dark:text-slate-500 capitalize">{user.role.replace('ROLE_', '').toLowerCase()}</span>
        </div>
        <FiChevronDown size={14} className="text-slate-400 dark:text-slate-500 hidden sm:block transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{displayName}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Links */}
          <div className="px-2 py-1.5">
            <Link
              to={profilePath}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <FiUser className="text-white" size={15} />
              <span>View Profile</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 hover:text-rose-700 transition-colors w-full text-left cursor-pointer"
            >
              <FiLogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
