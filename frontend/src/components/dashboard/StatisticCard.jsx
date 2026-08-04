import React from 'react';

const StatisticCard = ({ title, value, icon, gradient, colorTheme }) => {
  // Define themes for visual excellence
  const themes = {
    blue: 'from-blue-500/10 to-indigo-500/5 text-blue-600 border-blue-100',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 border-emerald-100',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 border-amber-100',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 border-rose-100',
    violet: 'from-violet-500/10 to-purple-500/5 text-violet-600 border-violet-100',
    cyan: 'from-cyan-500/10 to-blue-500/5 text-cyan-600 border-cyan-100',
  };

  const themeClass = themes[colorTheme] || themes.blue;

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Background soft gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeClass.split(' ').slice(0, 2).join(' ')} opacity-0 group-hover:opacity-100 transition-opacity duration-550 pointer-events-none`} />

      <div className="relative flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {value !== undefined && value !== null ? value : 0}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${themeClass.split(' ').slice(0, 2).join(' ')} ${themeClass.split(' ').slice(2).join(' ')} border transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
