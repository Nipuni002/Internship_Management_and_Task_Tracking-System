import React from 'react';
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
  FiChevronLeft,
  FiLogOut,
  FiLayers
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const role = user.role;

  // Menus configuration
  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome size={18} /> },
    { name: 'Intern Management', path: '/admin/interns', icon: <FiUsers size={18} /> },
    { name: 'Project Management', path: '/admin/projects', icon: <FiFolder size={18} /> },
    { name: 'Task Management', path: '/admin/tasks', icon: <FiCheckSquare size={18} /> },
    { name: 'Daily Work Logs', path: '/admin/logs', icon: <FiActivity size={18} /> },
    { name: 'Submission & Feedback', path: '/admin/submissions', icon: <FiAward size={18} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiTrendingUp size={18} /> },
    { name: 'Profile', path: '/admin/profile', icon: <FiUser size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
  ];

  const internMenu = [
    { name: 'Dashboard', path: '/intern/dashboard', icon: <FiHome size={18} /> },
    { name: 'My Projects', path: '/intern/projects', icon: <FiFolder size={18} /> },
    { name: 'My Tasks', path: '/intern/tasks', icon: <FiCheckSquare size={18} /> },
    { name: 'Daily Work Logs', path: '/intern/logs', icon: <FiActivity size={18} /> },
    { name: 'My Submissions', path: '/intern/submissions', icon: <FiAward size={18} /> },
    { name: 'Feedback', path: '/intern/feedback', icon: <FiMessageSquare size={18} /> },
    { name: 'Profile', path: '/intern/profile', icon: <FiUser size={18} /> },
  ];

  const currentMenu = role === 'ROLE_ADMIN' ? adminMenu : internMenu;

  return (
    <aside 
      className={`bg-slate-900 text-slate-100 flex flex-col justify-between transition-all duration-300 border-r border-slate-800 shrink-0 sticky top-0 h-screen hidden lg:flex ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden select-none">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              <FiLayers size={18} />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm tracking-wider text-white truncate">
                TRACKER
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 focus:outline-none cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiChevronLeft className={`transform transition-transform duration-300 ${isCollapsed && 'rotate-180'}`} size={16} />
          </button>
        </div>

        {/* Navigation items */}
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
                title={isCollapsed ? item.name : ''}
              >
                <span className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-850">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-350 transition-all w-full text-left group cursor-pointer`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="shrink-0 transition-transform group-hover:scale-105 text-rose-400">
            <FiLogOut size={18} />
          </span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
