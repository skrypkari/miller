import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import RecentActivity from '../../components/RecentActivity';
import NetworkFees from '../../components/NetworkFees';
import { Wallet, Plus, Database, Copy, Check, Users, Package, ShieldCheck, Search, Filter, ArrowUpRight, ChevronDown, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../../components/CustomDropdown';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
  balance: number;
  usdBalance: number;
}

interface ProjectWallet {
  id: string;
  projectName: string;
  address: string;
  networks: Network[];
  status: 'active' | 'inactive';
  lastActivity: Date;
  totalApprovals: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<ProjectWallet | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'balance' | 'activity'>('activity');
  const [page, setPage] = useState(1);
  const projectsPerPage = 9;

  // Generate more sample data
  const generateProjects = (count: number): ProjectWallet[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: (i + 1).toString(),
      projectName: `Project ${i + 1}`,
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      networks: [
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', balance: Math.random() * 5, usdBalance: Math.random() * 10000 },
        { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#F3BA2F', balance: Math.random() * 20, usdBalance: Math.random() * 5000 },
        { id: 'matic', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', balance: Math.random() * 3000, usdBalance: Math.random() * 3000 },
        { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', balance: Math.random() * 200, usdBalance: Math.random() * 1500 }
      ],
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      totalApprovals: Math.floor(Math.random() * 1000)
    }));
  };

  const [projectWallets, setProjectWallets] = useState<ProjectWallet[]>(generateProjects(50));

  const quickActions = [
    { title: 'Create Project', icon: <Plus size={20} />, path: '/admin/projects' },
    { title: 'Backup', icon: <Database size={20} />, path: '/admin/backup' }
  ];

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getTotalUsdBalance = (networks: Network[]) => {
    return networks.reduce((total, network) => total + network.usdBalance, 0);
  };

  const statistics = [
    {
      title: 'Total Users',
      value: '156',
      color: '#4ade80',
      icon: <Users size={20} />
    },
    {
      title: 'Active Projects',
      value: projectWallets.filter(w => w.status === 'active').length.toString(),
      color: '#f59e0b',
      icon: <Package size={20} />
    },
    {
      title: 'Total Approvals',
      value: projectWallets.reduce((total, wallet) => total + wallet.totalApprovals, 0).toLocaleString(),
      color: '#3b82f6',
      icon: <ShieldCheck size={20} />
    }
  ];

  // Filter and sort projects
  const filteredProjects = projectWallets
    .filter(wallet => {
      const matchesSearch = wallet.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wallet.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || wallet.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.projectName.localeCompare(b.projectName);
        case 'balance':
          return getTotalUsdBalance(b.networks) - getTotalUsdBalance(a.networks);
        case 'activity':
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statistics.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e1f25] p-6 rounded-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full"
              style={{ background: `radial-gradient(circle at center, ${stat.color}, transparent 70%)` }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-gray-400">{stat.title}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => window.location.href = action.path}
            className="flex items-center justify-center gap-2 bg-[#1e1f25] hover:bg-[#2a2b33] transition-colors p-4 rounded-lg text-white"
          >
            <span className="text-red-400">{action.icon}</span>
            {action.title}
          </button>
        ))}
      </div>

      {/* Project Controls */}
      <div className="bg-[#1e1f25] p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
            
            <CustomDropdown
              options={[
                { id: 'all', name: 'All Status' },
                { id: 'active', name: 'Active' },
                { id: 'inactive', name: 'Inactive' }
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
              placeholder="Filter by status"
            />

            <CustomDropdown
              options={[
                { id: 'activity', name: 'Recent Activity' },
                { id: 'name', name: 'Project Name' },
                { id: 'balance', name: 'Balance' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'name' | 'balance' | 'activity')}
              placeholder="Sort by"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-400 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-400 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={`grid gap-4 mb-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {paginatedProjects.map((wallet) => (
          <motion.button
            key={wallet.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedWallet(selectedWallet?.id === wallet.id ? null : wallet)}
            className={`p-4 rounded-lg text-left transition-all duration-300 ${
              selectedWallet?.id === wallet.id 
                ? 'bg-red-400 text-[#1e1f25]' 
                : 'bg-[#1e1f25] text-white hover:bg-[#2a2b33]'
            }`}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      wallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <span className="font-bold">{wallet.projectName}</span>
                  </div>
                  <ArrowUpRight size={20} className="text-gray-400" />
                </div>
                <div className="font-mono text-sm mb-4">{wallet.address}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Balance:</span>
                    <span>${getTotalUsdBalance(wallet.networks).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Approvals:</span>
                    <span>{wallet.totalApprovals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Activity:</span>
                    <span>{wallet.lastActivity.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {wallet.networks.map(network => (
                    <div
                      key={network.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: network.color }}
                    />
                  ))}
                </div>
              </>
            ) : (
              // List View
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      wallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <span className="font-bold">{wallet.projectName}</span>
                  </div>
                  <div className="font-mono text-sm text-gray-400">{wallet.address}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold">${getTotalUsdBalance(wallet.networks).toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{wallet.totalApprovals.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Approvals</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{wallet.lastActivity.toLocaleDateString()}</div>
                    <div className="text-sm text-gray-400">Last Activity</div>
                  </div>
                  <ArrowUpRight size={20} className="text-gray-400" />
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                page === pageNum
                  ? 'bg-red-400 text-white'
                  : 'bg-[#1e1f25] text-gray-400 hover:bg-[#2a2b33]'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {/* Selected Project Details */}
      <AnimatePresence>
        {selectedWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#1e1f25] rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedWallet.projectName}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedWallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-gray-400">
                    {selectedWallet.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress(selectedWallet.address);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors"
              >
                <span className="font-mono">{selectedWallet.address}</span>
                {copiedAddress === selectedWallet.address ? (
                  <Check size={16} className="text-red-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedWallet.networks.map((network) => (
                <div
                  key={network.id}
                  className="bg-[#2a2b33] p-4 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: network.color }}
                    />
                    <span>{network.name}</span>
                  </div>
                  <div className="text-lg font-bold mb-1">
                    {network.balance.toFixed(4)} {network.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    ${network.usdBalance.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Activity and Fees sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <NetworkFees />
      </div>
    </div>
  );
};

export default AdminDashboard;