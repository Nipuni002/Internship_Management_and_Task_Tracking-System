import React from 'react';
import useTheme from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
      aria-label="Toggle dark mode theme"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <FiMoon size={20} className="transform transition-transform hover:-rotate-12" />
      ) : (
        <FiSun size={20} className="transform transition-transform hover:rotate-45" />
      )}
    </button>
  );
};

export default ThemeToggle;
