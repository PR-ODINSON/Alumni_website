import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from '../../pages/home/components/Footer';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const NO_SIDEBAR_ROUTES = ['/'];

export default function Layout() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();

  const showSidebar = isAuthenticated && !NO_SIDEBAR_ROUTES.includes(location.pathname);
  const showLayoutFooter =
    !location.pathname.startsWith('/messages') &&
    !(location.pathname === '/' && !isAuthenticated);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden font-sans flex flex-col">
      <Navbar />
      <div className="flex pt-16 relative z-10 flex-1">
        {showSidebar && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <Sidebar />
          </>
        )}
        <main className={`flex-1 flex flex-col min-h-[calc(100vh-4rem)] transition-all duration-300 ${showSidebar ? 'lg:ml-72' : ''}`}>
          <div className={`w-full flex-1 max-w-full ${showSidebar ? 'p-3 sm:p-4 lg:p-6 lg:pl-0' : 'p-0'}`}>
            <Outlet />
          </div>
          {showLayoutFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
