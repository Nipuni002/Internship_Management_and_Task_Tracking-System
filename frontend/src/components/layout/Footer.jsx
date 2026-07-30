import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-14 bg-white border-t border-slate-200/80 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-400 font-medium font-sans">
      <div className="truncate">
        <span>&copy; {currentYear} </span>
        <span className="hidden sm:inline">Internship Management &amp; Task Tracking System.</span>
        <span className="sm:hidden">IMTTS.</span>
      </div>
      <div className="shrink-0 flex items-center gap-1">
        <span className="text-[10px] bg-slate-105 text-slate-500 py-0.5 px-2 rounded-full font-semibold">
          v1.0.0
        </span>
      </div>
    </footer>
  );
};

export default Footer;
