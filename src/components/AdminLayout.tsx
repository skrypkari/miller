import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#121318] text-white overflow-hidden">
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-50 p-2 rounded-md bg-[#1e1f25] text-white"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform transition-transform duration-300 ease-in-out fixed md:relative z-40 md:translate-x-0`}
      >
        <AdminSidebar closeSidebar={() => isMobile && setSidebarOpen(false)} />
      </div>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;