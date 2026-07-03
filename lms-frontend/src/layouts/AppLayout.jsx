import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PageTransition from '../components/common/PageTransition';

/**
 * AppLayout Component
 * Main application layout with sidebar and navbar
 * Used for all authenticated pages
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  /**
   * Toggle sidebar (mobile)
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Close sidebar (mobile)
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
