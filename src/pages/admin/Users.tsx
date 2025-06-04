import React, { useState } from 'react';
import { Search, Filter, Grid, List, Users as UsersIcon, Wallet, ArrowUpRight, Copy, Check, ChevronDown, Package, Shield, Clock, X } from 'lucide-react';
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

interface Project {
  id: string;
  name: string;
  network: Network;
  walletAddress: string;
  balance: number;
  usdBalance: number;
  contracts: Contract[];
  users: ProjectUser[];
  lastActivity: Date;
  status: 'active' | 'inactive';
}

interface Contract {
  id: string;
  name: string;
  address: string;
  network: Network;
  balance: number;
  usdBalance: number;
}

interface ProjectUser {
  id: string;
  walletAddress: string;
  balance: {
    token: string;
    usd: number;
  };
  lastActivity: Date;
  status: 'active' | 'inactive';
}

interface User {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
  projects: Project[];
  lastActivity: Date;
  totalBalance: number;
  joinDate: Date;
}

const AdminUsers = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [sortBy, setSortBy] = useState<'username' | 'balance' | 'activity'>('activity');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const usersPerPage = 9;

  // Generate sample users
  const generateUsers = (count: number): User[] => {
    const networks: Network[] = [
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', balance: 0, usdBalance: 0 },
      { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F', balance: 0, usdBalance: 0 },
      { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', balance: 0, usdBalance: 0 }
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `user${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
      role: Math.random() > 0.8 ? 'admin' : 'user',
      projects: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: `project${j}`,
        name: `Project ${j + 1}`,
        network: networks[Math.floor(Math.random() * networks.length)],
        walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        balance: Math.random() * 10,
        usdBalance: Math.random() * 20000,
        contracts: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, k) => ({
          id: `contract${k}`,
          name: `Contract ${k + 1}`,
          address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          network: networks[Math.floor(Math.random() * networks.length)],
          balance: Math.random() * 5,
          usdBalance: Math.random() * 10000
        })),
        users: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, l) => ({
          id: `projectUser${l}`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          balance: {
            token: 'ETH',
            usd: Math.random() * 5000
          },
          lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: Math.random() > 0.3 ? 'active' : 'inactive'
        })),
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.3 ? 'active' : 'inactive'
      })),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      totalBalance: Math.random() * 50000,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    }));
  };

  const [users] = useState<User[]>(generateUsers(50));

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'username':
          return a.username.localeCompare(b.username);
        case 'balance':
          return b.totalBalance - a.totalBalance;
        case 'activity':
          return b.lastActivity.getTime() - a.lastActivity.getTime();
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor user activities</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#1e1f25] px-4 py-2 rounded-lg">
            <span className="text-gray-400">Total Users:</span>{' '}
            <span className="font-bold">{users.length}</span>
          </div>
          <div className="bg-[#1e1f25] px-4 py-2 rounded-lg">
            <span className="text-gray-400">Active:</span>{' '}
            <span className="font-bold">{users.filter(u => u.status === 'active').length}</span>
          </div>
        </div>
      </div>

      {/* User Controls */}
      <div className="bg-[#1e1f25] p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
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
                { id: 'all', name: 'All Roles' },
                { id: 'admin', name: 'Admin' },
                { id: 'user', name: 'User' }
              ]}
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as 'all' | 'admin' | 'user')}
              placeholder="Filter by role"
            />

            <CustomDropdown
              options={[
                { id: 'activity', name: 'Recent Activity' },
                { id: 'username', name: 'Username' },
                { id: 'balance', name: 'Balance' }
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as 'username' | 'balance' | 'activity')}
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

      {/* Users Grid/List */}
      <div className={`grid gap-4 mb-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {paginatedUsers.map((user) => (
          <motion.button
            key={user.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = `/admin/users/${user.id}`}
            className={`p-4 rounded-lg text-left transition-all duration-300 ${
              selectedUser?.id === user.id 
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
                      user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <span className="font-bold">{user.username}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-red-400/20 text-red-400' 
                      : 'bg-blue-400/20 text-blue-400'
                  }`}>
                    {user.role}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-2">{user.email}</div>
                <div className="font-mono text-sm mb-4">{user.walletAddress}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Balance:</span>
                    <span>${user.totalBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Projects:</span>
                    <span>{user.projects.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Activity:</span>
                    <span>{user.lastActivity.toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            ) : (
              // List View
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <span className="font-bold">{user.username}</span>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-red-400/20 text-red-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}>
                      {user.role}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold">${user.totalBalance.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.projects.length}</div>
                    <div className="text-sm text-gray-400">Projects</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.lastActivity.toLocaleDateString()}</div>
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

      {/* Selected User Details */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#1e1f25] rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.role === 'admin' 
                      ? 'bg-red-400/20 text-red-400' 
                      : 'bg-blue-400/20 text-blue-400'
                  }`}>
                    {selectedUser.role}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{selectedUser.email}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress(selectedUser.walletAddress);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors"
              >
                <span className="font-mono">{selectedUser.walletAddress}</span>
                {copiedAddress === selectedUser.walletAddress ? (
                  <Check size={16} className="text-red-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#2a2b33] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Total Balance</div>
                <div className="text-xl font-bold">${selectedUser.totalBalance.toLocaleString()}</div>
              </div>
              <div className="bg-[#2a2b33] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Projects</div>
                <div className="text-xl font-bold">{selectedUser.projects.length}</div>
              </div>
              <div className="bg-[#2a2b33] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Last Activity</div>
                <div className="text-xl font-bold">{selectedUser.lastActivity.toLocaleDateString()}</div>
              </div>
              <div className="bg-[#2a2b33] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Join Date</div>
                <div className="text-xl font-bold">{selectedUser.joinDate.toLocaleDateString()}</div>
              </div>
            </div>

            {/* User's Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedUser.projects.map(project => (
                  <motion.button
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                    className={`bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-all duration-300 ${
                      selectedProject?.id === project.id ? 'ring-2 ring-red-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span className="font-bold">{project.name}</span>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${project.network.color}20` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.network.color }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Balance:</span>
                        <span>{project.balance} {project.network.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">USD Value:</span>
                        <span>${project.usdBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Contracts:</span>
                        <span>{project.contracts.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Users:</span>
                        <span>{project.users.length}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Selected Project Details */}
            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-[#2a2b33] rounded-lg p-6 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{selectedProject.name} Details</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedProject.network.color }}
                        />
                        <span>{selectedProject.network.name}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-1 hover:bg-[#353640] rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#1e1f25] p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Balance</div>
                      <div className="text-lg font-bold">
                        {selectedProject.balance} {selectedProject.network.symbol}
                      </div>
                      <div className="text-sm text-gray-400">
                        ${selectedProject.usdBalance.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#1e1f25] p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Contracts</div>
                      <div className="text-lg font-bold">{selectedProject.contracts.length}</div>
                    </div>
                    <div className="bg-[#1e1f25] p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Users</div>
                      <div className="text-lg font-bold">{selectedProject.users.length}</div>
                    </div>
                  </div>

                  {/* Contracts */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold mb-3">Contracts</h4>
                    <div className="space-y-2">
                      {selectedProject.contracts.map(contract => (
                        <div
                          key={contract.id}
                          className="bg-[#1e1f25] p-3 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium mb-1">{contract.name}</div>
                            <div className="font-mono text-sm text-gray-400">{contract.address}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {contract.balance} {contract.network.symbol}
                            </div>
                            <div className="text-sm text-gray-400">
                              ${contract.usdBalance.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Users */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Project Users</h4>
                    <div className="space-y-2">
                      {selectedProject.users.map(user => (
                        <div
                          key={user.id}
                          className="bg-[#1e1f25] p-3 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <div className="font-mono text-sm">{user.walletAddress}</div>
                            <div className="text-sm text-gray-400">
                              Last active: {user.lastActivity.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${user.balance.usd.toLocaleString()}</div>
                            <div className={`text-sm ${
                              user.status === 'active' ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {user.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;