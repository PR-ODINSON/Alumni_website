import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const NO_SIDEBAR_ROUTES = ['/'];

export default function Layout() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const showSidebar = isAuthenticated && !NO_SIDEBAR_ROUTES.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      <Navbar />
      <div className="flex pt-16 relative z-10">
        {showSidebar && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <Sidebar />
          </>
        )}
        <main className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${showSidebar ? 'lg:ml-72 p-4 lg:pl-0' : 'p-0'}`}>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
