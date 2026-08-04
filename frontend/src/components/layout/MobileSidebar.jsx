import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiFolder, 
  FiCheckSquare, 
  FiActivity, 
  FiAward, 
  FiTrendingUp, 
  FiUser, 
  FiSettings, 
  FiMessageSquare,
  FiX,
  FiLogOut,
  FiLayers,
  FiUserCheck,
  FiCalendar
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  // Close sidebar automatically on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!user) return null;

  const role = user.role;

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={18} /> },
    { name: 'Intern Management', path: '/admin/interns', icon: <FiUsers size={18} /> },
    { name: 'Project Management', path: '/admin/projects', icon: <FiFolder size={18} /> },
    { name: 'Task Management', path: '/admin/tasks', icon: <FiCheckSquare size={18} /> },
    { name: 'Daily Work Logs', path: '/admin/logs', icon: <FiActivity size={18} /> },
    { name: 'Submission & Feedback', path: '/admin/submissions', icon: <FiAward size={18} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <FiUserCheck size={18} /> },
    { name: 'Leave Requests', path: '/admin/leave', icon: <FiCalendar size={18} /> },
    { name: 'Performance Eval', path: '/admin/evaluations', icon: <FiAward size={18} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiTrendingUp size={18} /> },
    { name: 'Profile', path: '/admin/profile', icon: <FiUser size={18} /> },
  ];

  const internMenu = [
    { name: 'Dashboard', path: '/intern/dashboard', icon: <FiHome size={18} /> },
    { name: 'My Projects', path: '/intern/projects', icon: <FiFolder size={18} /> },
    { name: 'My Tasks', path: '/intern/tasks', icon: <FiCheckSquare size={18} /> },
    { name: 'Daily Work Logs', path: '/intern/logs', icon: <FiActivity size={18} /> },
    { name: 'My Submissions', path: '/intern/submissions', icon: <FiAward size={18} /> },
    { name: 'Attendance', path: '/intern/attendance', icon: <FiUserCheck size={18} /> },
    { name: 'Leave Requests', path: '/intern/leave', icon: <FiCalendar size={18} /> },
    { name: 'Performance Eval', path: '/intern/evaluations', icon: <FiAward size={18} /> },
    { name: 'Feedback', path: '/intern/feedback', icon: <FiMessageSquare size={18} /> },
    { name: 'Profile', path: '/intern/profile', icon: <FiUser size={18} /> },
  ];

  const currentMenu = role === 'ROLE_ADMIN' ? adminMenu : internMenu;

  return (
    <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 font-sans ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Background Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      ></div>

      {/* Drawer Panel */}
      <div className={`absolute top-0 left-0 w-64 h-full bg-slate-900 shadow-xl transition-transform duration-300 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <div className="flex items-center gap-3 select-none">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                <FiLayers size={18} />
              </div>
              <span className="font-bold text-sm tracking-wider text-white">
                TRACKER
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 px-3 space-y-1">
            {currentMenu.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-3 border-t border-slate-850">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-350 transition-all w-full text-left cursor-pointer"
          >
            <FiLogOut size={18} className="text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
