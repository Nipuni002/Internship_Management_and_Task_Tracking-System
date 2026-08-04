import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSearch } from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const [searchVal, setSearchVal] = React.useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    const event = new CustomEvent('global-search', { detail: val });
    window.dispatchEvent(event);
  };

  const getPageTitle = (pathname) => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/interns')) return 'Intern Management';
    if (pathname.includes('/projects')) return 'Project Management';
    if (pathname.includes('/tasks')) return 'Task Management';
    if (pathname.includes('/logs')) return 'Daily Work Logs';
    if (pathname.includes('/submissions')) return 'Submission & Feedback';
    if (pathname.includes('/analytics')) return 'Analytics Overview';
    if (pathname.includes('/profile')) return 'My Profile';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/feedback')) return 'Feedback Panel';
    return 'Portal';
  };

  const title = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 font-sans shadow-sm shadow-slate-100/40">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition-colors focus:outline-none cursor-pointer"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>
        
        {/* Dynamic page title */}
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-none hidden xs:block">
          {title}
        </h1>
      </div>

      {/* Right Navbar contents */}
      <div className="flex items-center gap-2 sm:gap-4.5">
        {/* Search Input Bar */}
        <div className="relative max-w-xs hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={handleSearchChange}
            placeholder="Search tables..."
            className="w-56 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-450 dark:placeholder-slate-500 transition-all font-semibold"
          />
        </div>

        {/* Theme Toggle switch */}
        <ThemeToggle />

        {/* Notifications feed button */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* User profile dropdown menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
