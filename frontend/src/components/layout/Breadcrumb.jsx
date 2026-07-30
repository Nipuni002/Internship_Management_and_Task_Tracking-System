import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Helper map to convert URL segment paths into readable title strings
  const segmentNameMap = {
    admin: 'Dashboard',
    intern: 'Dashboard',
    dashboard: 'Dashboard',
    interns: 'Intern Management',
    projects: 'Project Management',
    tasks: 'Task Management',
    logs: 'Daily Logs',
    submissions: 'Submissions',
    analytics: 'Analytics',
    profile: 'Profile',
    settings: 'Settings',
    feedback: 'Feedback'
  };

  // Filter out duplicate "dashboard" segments (e.g., /intern/dashboard becomes just Dashboard)
  const filteredPathnames = pathnames.filter((value, index) => {
    if (value.toLowerCase() === 'dashboard' && index > 0) {
      const prev = pathnames[index - 1].toLowerCase();
      if (prev === 'admin' || prev === 'intern') {
        return false;
      }
    }
    return true;
  });

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium select-none" aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 transition-colors py-1"
      >
        <FiHome size={14} />
      </Link>
      
      {filteredPathnames.map((value, index) => {
        const last = index === filteredPathnames.length - 1;
        
        // Find original index in raw pathnames to build correct href path
        const originalIndex = pathnames.indexOf(value);
        const to = `/${pathnames.slice(0, originalIndex + 1).join('/')}`;
        const name = segmentNameMap[value.toLowerCase()] || value.replace(/-/g, ' ');

        return (
          <div key={to} className="flex items-center space-x-1.5">
            <FiChevronRight className="text-slate-300" size={12} />
            {last ? (
              <span className="text-slate-600 font-semibold cursor-default truncate max-w-[120px] sm:max-w-none">
                {name}
              </span>
            ) : (
              <Link 
                to={to} 
                className="hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
