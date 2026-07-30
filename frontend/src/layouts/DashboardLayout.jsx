import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MobileSidebar from '../components/layout/MobileSidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Mobile Sidebar Overlay Drawer - Mounted conditionally to prevent click interception */}
      {isMobileOpen && (
        <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      )}

      {/* Main Viewport panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Navigation */}
        <Navbar onMenuClick={() => setIsMobileOpen(true)} />

        {/* Content Outlet Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <Outlet />
        </main>

        {/* Footer info bar */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
