import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Package,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface AdminSidebarProps {
  closeSidebar: () => void;
}

const AdminSidebar = ({ closeSidebar }: AdminSidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname === '/admin' ? '/admin' : location.pathname;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Builds', path: '/admin/builds', icon: <Package size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="bg-[#121318] border-r border-gray-800 h-screen w-64 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="text-red-400" size={28} />
          <h1 className="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
        </div>
      </div>
      
      <nav className="flex-1 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-6 text-gray-300 hover:bg-gray-800 transition-colors ${
                  isActive(item.path) ? 'bg-gray-800 border-l-4 border-red-400 text-red-400' : ''
                }`}
                onClick={closeSidebar}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 text-xs text-gray-500">
        <p>© 2025 Miller Drainer Admin</p>
      </div>
    </div>
  );
};

export default AdminSidebar;