import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Mobile/Tablet Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar - Mobile Responsive */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 overflow-auto flex flex-col w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 w-full">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden mr-4 p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors focus:outline-none"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Logged in as</span>
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold sm:hidden mr-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-900 hidden sm:inline">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
