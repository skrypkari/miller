import React, { useState } from 'react';
import Card from '../components/Card';
import RecentActivity from '../components/RecentActivity';
import NetworkFees from '../components/NetworkFees';
import { Wallet, Plus, Database, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const Dashboard: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<ProjectWallet | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const projectWallets: ProjectWallet[] = [
    {
      id: '1',
      projectName: 'DD',
      address: '0x1234...5678',
      networks: [
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', balance: 1.5, usdBalance: 5000 },
        { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#F3BA2F', balance: 12, usdBalance: 3200 },
        { id: 'matic', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', balance: 2000, usdBalance: 1500 },
        { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', balance: 150, usdBalance: 800 }
      ]
    },
    {
      id: '2',
      projectName: 'XProject',
      address: '0x8765...4321',
      networks: [
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', balance: 2.2, usdBalance: 7300 },
        { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#F3BA2F', balance: 18, usdBalance: 4800 },
        { id: 'matic', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', balance: 3000, usdBalance: 2250 },
        { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', balance: 200, usdBalance: 1000 }
      ]
    },
    {
      id: '3',
      projectName: 'CryptoFlow',
      address: '0xabcd...efgh',
      networks: [
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', balance: 0.8, usdBalance: 2600 },
        { id: 'bnb', name: 'BNB', symbol: 'BNB', color: '#F3BA2F', balance: 8, usdBalance: 2100 },
        { id: 'matic', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', balance: 1500, usdBalance: 1125 },
        { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', balance: 100, usdBalance: 500 }
      ]
    }
  ];

  const quickActions = [
    { title: 'Create Project', icon: <Plus size={20} />, path: '/projects' },
    { title: 'Backup', icon: <Database size={20} />, path: '/backup' }
  ];

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getTotalUsdBalance = (networks: Network[]) => {
    return networks.reduce((total, network) => total + network.usdBalance, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
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

      {/* Project Wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {projectWallets.map((wallet) => (
          <motion.button
            key={wallet.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedWallet(selectedWallet?.id === wallet.id ? null : wallet)}
            className={`p-4 rounded-lg text-left transition-colors ${
              selectedWallet?.id === wallet.id 
                ? 'bg-green-400 text-[#1e1f25]' 
                : 'bg-[#1e1f25] text-white hover:bg-[#2a2b33]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} />
              <span className="font-bold">{wallet.projectName}</span>
            </div>
            <div className="font-mono text-sm opacity-75">{wallet.address}</div>
            <div className="mt-2 text-sm">
              Total Balance: ${getTotalUsdBalance(wallet.networks).toLocaleString()}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Wallet Details */}
      <AnimatePresence>
        {selectedWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#1e1f25] rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {selectedWallet.projectName} Wallet
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress(selectedWallet.address);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2b33] rounded-lg hover:bg-[#353640] transition-colors"
              >
                <span className="font-mono">{selectedWallet.address}</span>
                {copiedAddress === selectedWallet.address ? (
                  <Check size={16} className="text-green-400" />
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
                    {network.balance} {network.symbol}
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

export default Dashboard;