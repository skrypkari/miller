import React, { useState } from 'react';
import { Plus, Wallet2, Link, DollarSign, RefreshCw, ChevronDown, ArrowUpRight, Coins, Shield, Activity } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';

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
  name: string;
  address: string;
  network: string;
}

interface WalletBalance {
  network: string;
  balance: number;
  change24h: number;
}

interface ContractBalance {
  contractId: string;
  network: string;
  balance: number;
}

interface Wallet {
  id: string;
  address: string;
  projects: string[];
  contracts: string[];
  balances: WalletBalance[];
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

  const projects: Project[] = [
    { id: '1', name: 'DD' },
    { id: '2', name: 'XProject' },
    { id: '3', name: 'CryptoFlow' }
  ];

  const contracts: Contract[] = [
    { id: '1', name: 'Main Contract', address: '0x1234...5678', network: 'eth' },
    { id: '2', name: 'BSC Contract', address: '0x8765...4321', network: 'bsc' },
    { id: '3', name: 'Polygon Contract', address: '0xabcd...efgh', network: 'polygon' }
  ];

  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      address: '0x9876...5432',
      projects: ['1', '2'],
      contracts: ['1'],
      balances: [
        { network: 'eth', balance: 1.5, change24h: 0.2 },
        { network: 'bsc', balance: 5.2, change24h: -0.5 },
        { network: 'polygon', balance: 1000, change24h: 100 }
      ],
      lastActivity: new Date(),
      status: 'active'
    },
    {
      id: '2',
      address: '0x5432...9876',
      projects: ['3'],
      contracts: ['2', '3'],
      balances: [
        { network: 'eth', balance: 0.8, change24h: -0.1 },
        { network: 'bsc', balance: 12.4, change24h: 1.2 },
        { network: 'polygon', balance: 500, change24h: -50 }
      ],
      lastActivity: new Date(Date.now() - 86400000),
      status: 'inactive'
    }
  ]);

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [newWallet, setNewWallet] = useState({
    address: '',
    projects: [] as string[],
    contracts: [] as string[]
  });

  const [selectedNetwork, setSelectedNetwork] = useState('eth');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleAddWallet = () => {
    if (newWallet.address) {
      const wallet: Wallet = {
        id: (wallets.length + 1).toString(),
        address: newWallet.address,
        projects: newWallet.projects,
        contracts: newWallet.contracts,
        balances: networks.map(network => ({
          network: network.id,
          balance: 0,
          change24h: 0
        })),
        lastActivity: new Date(),
        status: 'active'
      };
      setWallets(prev => [...prev, wallet]);
      setNewWallet({ address: '', projects: [], contracts: [] });
      setShowAddWallet(false);
    }
  };

  const handleWithdraw = async (contractId: string) => {
    if (!withdrawAmount) return;
    
    setIsWithdrawing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Withdrawn', withdrawAmount, 'from contract', contractId, 'on network', selectedNetwork);
    } finally {
      setIsWithdrawing(false);
      setWithdrawAmount('');
    }
  };

  const getTotalBalance = (network: string) => {
    return wallets.reduce((total, wallet) => {
      const balance = wallet.balances.find(b => b.network === network)?.balance || 0;
      return total + balance;
    }, 0);
  };

  const getTotalChange24h = (network: string) => {
    return wallets.reduce((total, wallet) => {
      const change = wallet.balances.find(b => b.network === network)?.change24h || 0;
      return total + change;
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Wallets</h1>
          <p className="text-gray-400 mt-1">Manage your crypto assets across multiple networks</p>
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

      {/* Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {networks.map(network => {
          const totalBalance = getTotalBalance(network.id);
          const change24h = getTotalChange24h(network.id);
          const isPositive = change24h >= 0;

          return (
            <motion.div
              key={network.id}
              whileHover={{ y: -5 }}
              className="bg-[#1e1f25] p-6 rounded-lg relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-5"
                style={{
                  background: `radial-gradient(circle at center, ${network.color}, transparent 70%)`
                }}
              />
              
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${network.color}20` }}
                >
                  <Coins size={20} style={{ color: network.color }} />
                </div>
                <span className="font-medium">{network.name}</span>
              </div>
              
              <div className="text-2xl font-bold mb-2">
                {totalBalance.toFixed(4)} {network.symbol}
              </div>
              
              <div className={`flex items-center gap-1 text-sm ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                <ArrowUpRight
                  size={16}
                  className={isPositive ? 'rotate-0' : 'rotate-90'}
                />
                {Math.abs(change24h).toFixed(2)} {network.symbol}
                <span className="text-gray-400 ml-1">24h</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Wallets List */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wallet2 className="text-green-400" size={24} />
          <h2 className="text-xl font-semibold">Your Wallets</h2>
        </div>

        <div className="space-y-4">
          {wallets.map(wallet => (
            <motion.div
              key={wallet.id}
              initial={false}
              animate={{ height: selectedWallet === wallet.id ? 'auto' : '80px' }}
              className="bg-[#2a2b33] rounded-lg overflow-hidden"
            >
              {/* Wallet Header */}
              <div
                onClick={() => setSelectedWallet(
                  selectedWallet === wallet.id ? null : wallet.id
                )}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#353640] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    wallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span className="font-mono">{wallet.address}</span>
                  <span className="text-sm text-gray-400">
                    Last active: {wallet.lastActivity.toLocaleDateString()}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: selectedWallet === wallet.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>

              {/* Wallet Details */}
              <AnimatePresence>
                {selectedWallet === wallet.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {wallet.balances.map(balance => {
                        const network = networks.find(n => n.id === balance.network);
                        return (
                          <div
                            key={balance.network}
                            className="bg-[#1e1f25] p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: network?.color }}
                              />
                              <span>{network?.name}</span>
                            </div>
                            <div className="text-lg font-bold">
                              {balance.balance} {network?.symbol}
                            </div>
                            <div className={`text-sm ${
                              balance.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {balance.change24h >= 0 ? '+' : ''}{balance.change24h} 24h
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#1e1f25] p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Associated Projects</h3>
                        <div className="flex flex-wrap gap-2">
                          {wallet.projects.map(projectId => {
                            const project = projects.find(p => p.id === projectId);
                            return (
                              <div
                                key={projectId}
                                className="bg-[#2a2b33] px-3 py-1 rounded-full text-sm"
                              >
                                {project?.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-[#1e1f25] p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Connected Contracts</h3>
                        <div className="flex flex-wrap gap-2">
                          {wallet.contracts.map(contractId => {
                            const contract = contracts.find(c => c.id === contractId);
                            return (
                              <div
                                key={contractId}
                                className="bg-[#2a2b33] px-3 py-1 rounded-full text-sm"
                              >
                                {contract?.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contract Withdrawal */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="text-green-400" size={24} />
          <h2 className="text-xl font-semibold">Contract Withdrawal</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Contract
            </label>
            <CustomDropdown
              options={contracts}
              value={contracts[0]?.id || ''}
              onChange={(value) => console.log('Selected contract:', value)}
              placeholder="Select contract"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Network
            </label>
            <CustomDropdown
              options={networks}
              value={selectedNetwork}
              onChange={setSelectedNetwork}
              placeholder="Select network"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount
            </label>
            <div className="flex gap-2 w-full">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWithdraw(contracts[0]?.id)}
                disabled={isWithdrawing || !withdrawAmount}
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawing ? (
                  <RefreshCw className="animate-spin\" size={20} />
                ) : (
                  <DollarSign size={20} />
                )}
                Withdraw
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAddWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Add New Wallet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newWallet.address}
                    onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter wallet address"
                    className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Associated Projects
                  </label>
                  <CustomDropdown
                    options={projects}
                    value={newWallet.projects[0] || ''}
                    onChange={(value) => setNewWallet(prev => ({ ...prev, projects: [value] }))}
                    placeholder="Select projects"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Associated Contracts
                  </label>
                  <CustomDropdown
                    options={contracts}
                    value={newWallet.contracts[0] || ''}
                    onChange={(value) => setNewWallet(prev => ({ ...prev, contracts: [value] }))}
                    placeholder="Select contracts"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
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
                  className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
                >
                  <Plus size={20} />
                  Add Wallet
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallets;