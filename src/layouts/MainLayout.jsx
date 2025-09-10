import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="main-content" style={{ marginLeft: isSidebarOpen ? '220px' : '60px' }}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content-area">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;