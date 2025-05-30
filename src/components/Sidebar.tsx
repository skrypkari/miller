import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Terminal, 
  Database, 
  Wallet,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname === '/' ? '/dashboard' : location.pathname;

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Builder', path: '/builder', icon: <Terminal size={20} /> },
    { name: 'Backup', path: '/backup', icon: <Database size={20} /> },
    { name: 'Wallets', path: '/wallets', icon: <Wallet size={20} /> },
  ];

  return (
    <div className="bg-[#121318] border-r border-gray-800 h-screen w-64 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="text-green-400" size={28} />
          <h1 className="text-xl font-bold tracking-wider">MILLER DRAINER</h1>
        </div>
      </div>
      
      <nav className="flex-1 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-6 text-gray-300 hover:bg-gray-800 transition-colors ${
                  isActive(item.path) ? 'bg-gray-800 border-l-4 border-green-400 text-green-400' : ''
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
        <p>© 2025 Miller Drainer</p>
      </div>
    </div>
  );
};

export default Sidebar;