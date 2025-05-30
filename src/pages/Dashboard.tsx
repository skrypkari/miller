import React from 'react';
import Card from '../components/Card';
import RecentActivity from '../components/RecentActivity';
import NetworkFees from '../components/NetworkFees';
import { Search, Plus, Database } from 'lucide-react';

const Dashboard: React.FC = () => {
  const balances = [
    { network: 'Ethereum', balance: 5000, color: '#627EEA' },
    { network: 'Binance', balance: 3200, color: '#F3BA2F' },
    { network: 'Polygon', balance: 1500, color: '#8247E5' },
    { network: 'Arbitrum', balance: 800, color: '#28A0F0' }
  ];

  const quickActions = [
    { title: 'Create Project', icon: <Plus size={20} />, path: '/projects' },
    { title: 'Backup', icon: <Database size={20} />, path: '/backup' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => window.location.href = action.path}
            className="flex items-center justify-center gap-2 bg-[#1e1f25] hover:bg-[#2a2b33] transition-colors p-4 rounded-lg text-white"
          >
            <span className="text-green-400">{action.icon}</span>
            {action.title}
          </button>
        ))}
      </div>
      
      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {balances.map((item) => (
          <Card 
            key={item.network}
            title={item.network}
            value={`$${item.balance.toLocaleString()}`}
            color={item.color}
          />
        ))}
      </div>
      
      {/* Activity and Fees sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <NetworkFees />
      </div>
    </div>
  );
};

export default Dashboard;