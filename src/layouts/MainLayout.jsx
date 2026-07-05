import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Authenticate checker for frontend UI routing
  useEffect(() => {
    const auth = localStorage.getItem('devtrack-auth');
    if (!auth) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-[#0F172A] overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-150">
      
      {/* Collapsible Left Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      {/* Content wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar 
          setIsMobileOpen={setIsMobileOpen} 
          isCollapsed={isCollapsed}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#0F172A] flex flex-col gap-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
