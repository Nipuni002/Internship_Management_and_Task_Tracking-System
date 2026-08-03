import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ initialValue = '', onSearch }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative flex items-center font-sans">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <FiSearch size={18} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search tasks by title, project, or assignee..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400 transition-all shadow-sm"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 hover:text-slate-650 cursor-pointer"
            title="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
