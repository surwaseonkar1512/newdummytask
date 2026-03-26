import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Image, Folders, ShoppingBag, Edit3, MessageSquare, Settings, LogOut, X, Package, Layers, ImageIcon, Star, Map } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = ({ onClose }) => {
  const { logout } = useAuthStore();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Banners', icon: <Image size={20} />, path: '/admin/banners' },
    { name: 'Categories', icon: <Folders size={20} />, path: '/admin/categories' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Stories & Cases', icon: <Layers size={20} />, path: '/admin/stories' },
    { name: 'Testimonials', icon: <Star size={20} />, path: '/admin/testimonials' },
    { name: 'About Master', icon: <Map size={20} />, path: '/admin/about' },
    { name: 'Leads (CRM)', icon: <MessageSquare size={20} />, path: '/admin/leads' },
    { name: 'Gallery Master', icon: <ImageIcon size={20} />, path: '/admin/gallery' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-xl lg:shadow-md h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        )}
      </div>
      <div className="flex-1 py-4 overflow-y-auto space-y-1">
        {menuItems?.map?.((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
