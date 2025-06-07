import React, { useState } from 'react';
import { Plus, Wallet2, Copy, Check, ArrowUpRight, Search, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  network: Network;
  token: string; // Только USDT или USDC
  balance: number;
  usdBalance: number;
}

interface Wallet {
  id: string;
  address: string;
  projectId: string;
  projectName: string;
  contracts: Contract[];
  lastActivity: Date;
  status: 'active' | 'inactive';
}

const Wallets: React.FC = () => {
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'Binance Smart Chain', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
  ];

  // Проекты для привязки кошельков
  const projects: Project[] = [
    { id: '1', name: 'DD' },
    { id: '2', name: 'XProject' },
    { id: '3', name: 'CryptoFlow' },
    { id: '4', name: 'DefiMaster' },
    { id: '5', name: 'TokenVault' },
    { id: '6', name: 'ChainLink' },
    { id: '7', name: 'MetaSwap' },
    { id: '8', name: 'EtherBridge' },
    { id: '9', name: 'PolyDex' },
    { id: '10', name: 'ArbiTrade' }
  ];

  // Только USDT и USDC токены
  const tokens = [
    { id: 'usdt', name: 'USDT' },
    { id: 'usdc', name: 'USDC' }
  ];

  // Генерируем много кошельков для демонстрации
  const generateWallets = (count: number): Wallet[] => {
    return Array.from({ length: count }, (_, i) => {
      const project = projects[Math.floor(Math.random() * projects.length)];
      const contractCount = Math.floor(Math.random() * 4) + 1; // 1-4 контракта
      
      const contracts: Contract[] = Array.from({ length: contractCount }, (_, j) => {
        const network = networks[Math.floor(Math.random() * networks.length)];
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const balance = Math.random() * 5000 + 100;
        
        return {
          id: `contract_${i}_${j}`,
          network,
          token: token.name,
          balance,
          usdBalance: balance * (token.name === 'USDT' ? 1 : 0.999)
        };
      });

      return {
        id: (i + 1).toString(),
        address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        projectId: project.id,
        projectName: project.name,
        contracts,
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.2 ? 'active' : 'inactive'
      };
    });
  };

  const [wallets, setWallets] = useState<Wallet[]>(generateWallets(50));
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newWallet, setNewWallet] = useState({ 
    address: '',
    projectId: ''
  });
  
  const [newContract, setNewContract] = useState({
    networkId: '',
    tokenId: ''
  });
  
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    destinationAddress: ''
  });

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleAddWallet = () => {
    if (newWallet.address && newWallet.projectId) {
      const project = projects.find(p => p.id === newWallet.projectId);
      if (project) {
        const wallet: Wallet = {
          id: (wallets.length + 1).toString(),
          address: newWallet.address,
          projectId: newWallet.projectId,
          projectName: project.name,
          contracts: [],
          lastActivity: new Date(),
          status: 'active'
        };
        setWallets(prev => [...prev, wallet]);
        setNewWallet({ address: '', projectId: '' });
        setShowAddWallet(false);
      }
    }
  };

  const handleAddContract = () => {
    if (!selectedWallet || !newContract.networkId || !newContract.tokenId) return;

    const network = networks.find(n => n.id === newContract.networkId);
    const token = tokens.find(t => t.id === newContract.tokenId);
    
    if (network && token) {
      const newContractObj: Contract = {
        id: Math.random().toString(),
        network,
        token: token.name,
        balance: 0,
        usdBalance: 0
      };

      setWallets(prev => prev.map(wallet => {
        if (wallet.id === selectedWallet.id) {
          return {
            ...wallet,
            contracts: [...wallet.contracts, newContractObj]
          };
        }
        return wallet;
      }));

      setNewContract({ networkId: '', tokenId: '' });
      setShowAddContract(false);
    }
  };

  const handleWithdraw = () => {
    if (!selectedContract || !withdrawalData.amount || !withdrawalData.destinationAddress) return;

    console.log('Withdrawing:', {
      contract: selectedContract,
      amount: withdrawalData.amount,
      to: withdrawalData.destinationAddress
    });

    setWithdrawalData({ amount: '', destinationAddress: '' });
    setShowWithdrawModal(false);
    setSelectedContract(null);
  };

  // Фильтрация кошельков по поиску
  const filteredWallets = wallets.filter(wallet =>
    wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalBalance = (token: string) => {
    return wallets.reduce((total, wallet) => {
      const contractBalance = wallet.contracts
        .filter(c => c.token === token)
        .reduce((sum, contract) => sum + contract.usdBalance, 0);
      return total + contractBalance;
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Wallets</h1>
          <p className="text-gray-400 mt-1">
            {wallets.length} wallets • Manage your USDT and USDC assets
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddWallet(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
        >
          <Plus size={20} />
          Add Wallet
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search wallets by address, project name, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {searchTerm && (
        <div className="text-sm text-gray-400">
          Found {filteredWallets.length} wallets matching "{searchTerm}"
        </div>
      )}

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWallets.map(wallet => (
          <motion.button
            key={wallet.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedWallet(wallet)}
            className="bg-[#1e1f25] p-6 rounded-xl text-left hover:bg-[#2a2b33] transition-all duration-300 group relative overflow-hidden w-full"
          >
            {/* Background gradient - теперь на всю ширину */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    wallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-400">ID: {wallet.id}</span>
                </div>
                <div className="px-2 py-1 bg-[#2a2b33] rounded-full text-xs">
                  {wallet.projectName}
                </div>
              </div>

              {/* Address */}
              <div className="font-mono text-sm mb-4 truncate" title={wallet.address}>
                {wallet.address}
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Contracts:</span>
                  <span>{wallet.contracts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="font-bold">
                    ${wallet.contracts.reduce((sum, c) => sum + c.usdBalance, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last Activity:</span>
                  <span>{wallet.lastActivity.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Tokens */}
              <div className="mt-4 flex gap-1 flex-wrap">
                {Array.from(new Set(wallet.contracts.map(c => c.token))).map(token => (
                  <div
                    key={token}
                    className={`px-2 py-1 rounded-full text-xs ${
                      token === 'USDT' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}
                  >
                    {token}
                  </div>
                ))}
              </div>

              {/* Networks */}
              <div className="mt-3 flex gap-1">
                {Array.from(new Set(wallet.contracts.map(c => c.network.id))).map(networkId => {
                  const network = networks.find(n => n.id === networkId);
                  return network ? (
                    <div
                      key={networkId}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${network.color}20` }}
                      title={network.name}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: network.color }}
                      />
                    </div>
                  ) : null;
                })}
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={20} className="text-green-400" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* No results message */}
      {filteredWallets.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No wallets found</div>
          <div className="text-gray-500">Try adjusting your search terms</div>
        </div>
      )}

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAddWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddWallet(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Wallet</h2>
                <button
                  onClick={() => setShowAddWallet(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={newWallet.address}
                    onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="0x..."
                    className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Project *
                  </label>
                  <CustomDropdown
                    options={projects}
                    value={newWallet.projectId}
                    onChange={(value) => setNewWallet(prev => ({ ...prev, projectId: value }))}
                    placeholder="Select project to bind wallet"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddWallet(false)}
                    className="px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddWallet}
                    disabled={!newWallet.address.trim() || !newWallet.projectId}
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                    Add Wallet
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Wallet Details Modal */}
        {selectedWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedWallet(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Wallet Details</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Project:</span>
                      <span className="font-medium">{selectedWallet.projectName}</span>
                    </div>
                    <button
                      onClick={() => handleCopyAddress(selectedWallet.address)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors"
                    >
                      <span className="font-mono">{selectedWallet.address}</span>
                      {copiedAddress === selectedWallet.address ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <div className="text-sm text-gray-400">
                      Total Value: ${selectedWallet.contracts.reduce((sum, c) => sum + c.usdBalance, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWallet(null)}
                  className="p-2 hover:bg-[#2a2b33] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Contracts ({selectedWallet.contracts.length})</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddContract(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
                  >
                    <Plus size={16} />
                    Add Contract
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedWallet.contracts.map(contract => (
                    <motion.button
                      key={contract.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowWithdrawModal(true);
                      }}
                      className="bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-colors relative overflow-hidden group"
                    >
                      {/* Background gradient based on token */}
                      <div 
                        className={`absolute top-0 right-0 w-24 h-24 opacity-5 ${
                          contract.token === 'USDT' ? 'bg-green-400' : 'bg-blue-400'
                        }`}
                        style={{
                          background: `radial-gradient(circle at center, ${
                            contract.token === 'USDT' ? '#4ade80' : '#3b82f6'
                          }, transparent 70%)`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: contract.network.color }}
                            />
                            <span className="text-sm font-medium">{contract.network.name}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            contract.token === 'USDT' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-blue-400/20 text-blue-400'
                          }`}>
                            {contract.token}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-lg font-bold">
                            {contract.balance.toFixed(2)} {contract.token}
                          </div>
                          <div className="text-sm text-gray-400">
                            ≈ ${contract.usdBalance.toLocaleString()}
                          </div>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={16} className="text-green-400" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedWallet.contracts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Wallet2 size={48} className="mx-auto mb-4 opacity-50" />
                    <div>No contracts added yet</div>
                    <div className="text-sm">Click "Add Contract" to get started</div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Contract Modal */}
        {showAddContract && selectedWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddContract(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Contract</h2>
                <button
                  onClick={() => setShowAddContract(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Network *
                  </label>
                  <CustomDropdown
                    options={networks}
                    value={newContract.networkId}
                    onChange={(value) => setNewContract(prev => ({ ...prev, networkId: value }))}
                    placeholder="Select network"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Token *
                  </label>
                  <CustomDropdown
                    options={tokens}
                    value={newContract.tokenId}
                    onChange={(value) => setNewContract(prev => ({ ...prev, tokenId: value }))}
                    placeholder="Select token (USDT or USDC)"
                  />
                </div>

                {/* Preview */}
                {newContract.networkId && newContract.tokenId && (
                  <div className="bg-[#2a2b33] p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Preview:</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: networks.find(n => n.id === newContract.networkId)?.color 
                        }}
                      />
                      <span className="font-medium">
                        {tokens.find(t => t.id === newContract.tokenId)?.name} on{' '}
                        {networks.find(n => n.id === newContract.networkId)?.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddContract(false)}
                    className="px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddContract}
                    disabled={!newContract.networkId || !newContract.tokenId}
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                    Add Contract
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && selectedContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Withdraw {selectedContract.token}</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedContract.network.color }}
                    />
                    <span className="font-medium">{selectedContract.network.name}</span>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      selectedContract.token === 'USDT' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}>
                      {selectedContract.token}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">Available Balance</div>
                  <div className="text-xl font-bold">
                    {selectedContract.balance.toFixed(2)} {selectedContract.token}
                  </div>
                  <div className="text-sm text-gray-400">
                    ≈ ${selectedContract.usdBalance.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount to Withdraw
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      max={selectedContract.balance}
                      step="0.01"
                      className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 pr-16 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {selectedContract.token}
                    </div>
                  </div>
                  <button
                    onClick={() => setWithdrawalData(prev => ({ 
                      ...prev, 
                      amount: selectedContract.balance.toString() 
                    }))}
                    className="mt-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    Use max amount
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Destination Address
                  </label>
                  <input
                    type="text"
                    value={withdrawalData.destinationAddress}
                    onChange={(e) => setWithdrawalData(prev => ({ ...prev, destinationAddress: e.target.value }))}
                    placeholder="0x..."
                    className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWithdraw}
                    disabled={!withdrawalData.amount || !withdrawalData.destinationAddress || 
                             parseFloat(withdrawalData.amount) > selectedContract.balance}
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DollarSign size={20} />
                    Withdraw
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallets;