import React, { useState } from 'react';
import { Plus, Wallet2, Copy, Check, ArrowUpRight, Coins, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface Contract {
  id: string;
  network: Network;
  token: string;
  balance: number;
}

interface Wallet {
  id: string;
  address: string;
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

  const tokens = {
    eth: [{ id: 'eth', name: 'ETH' }],
    bsc: [{ id: 'bnb', name: 'BNB' }],
    polygon: [{ id: 'matic', name: 'MATIC' }],
    arbitrum: [{ id: 'arb', name: 'ARB' }]
  };

  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      address: '0x9876...5432',
      contracts: [
        { id: '1', network: networks[0], token: 'ETH', balance: 1.5 },
        { id: '2', network: networks[1], token: 'BNB', balance: 5.2 }
      ],
      lastActivity: new Date(),
      status: 'active'
    },
    {
      id: '2',
      address: '0x5432...9876',
      contracts: [
        { id: '3', network: networks[2], token: 'MATIC', balance: 1000 },
        { id: '4', network: networks[3], token: 'ARB', balance: 50 }
      ],
      lastActivity: new Date(Date.now() - 86400000),
      status: 'inactive'
    }
  ]);

  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [newWallet, setNewWallet] = useState({ address: '' });
  const [newContract, setNewContract] = useState({
    network: '',
    token: ''
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
    if (newWallet.address) {
      const wallet: Wallet = {
        id: (wallets.length + 1).toString(),
        address: newWallet.address,
        contracts: [],
        lastActivity: new Date(),
        status: 'active'
      };
      setWallets(prev => [...prev, wallet]);
      setNewWallet({ address: '' });
      setShowAddWallet(false);
    }
  };

  const handleAddContract = () => {
    if (!selectedWallet || !newContract.network || !newContract.token) return;

    const network = networks.find(n => n.id === newContract.network);
    if (network) {
      const newContractObj: Contract = {
        id: Math.random().toString(),
        network,
        token: newContract.token,
        balance: 0
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

      setNewContract({ network: '', token: '' });
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

  const getTotalBalance = (network: Network) => {
    return wallets.reduce((total, wallet) => {
      const contractBalance = wallet.contracts
        .filter(c => c.network.id === network.id)
        .reduce((sum, contract) => sum + contract.balance, 0);
      return total + contractBalance;
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

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {networks.map(network => {
          const totalBalance = getTotalBalance(network);
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

        <div className="space-y-3">
          {wallets.map(wallet => (
            <motion.button
              key={wallet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedWallet(wallet)}
              className="w-full bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  wallet.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="font-mono">{wallet.address}</span>
              </div>
              <ArrowUpRight 
                size={20} 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400"
              />
            </motion.button>
          ))}
        </div>
      </div>

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
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({ address: e.target.value })}
                    placeholder="Enter wallet address"
                    className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
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
              className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-2xl m-4"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Wallet Details</h2>
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
                  <h3 className="text-lg font-semibold">Contracts</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedWallet.contracts.map(contract => (
                    <motion.button
                      key={contract.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowWithdrawModal(true);
                      }}
                      className="bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: contract.network.color }}
                        />
                        <span>{contract.network.name}</span>
                      </div>
                      <div className="text-lg font-bold">
                        {contract.balance} {contract.token}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Contract Modal */}
        {showAddContract && (
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
                    Network
                  </label>
                  <CustomDropdown
                    options={networks}
                    value={newContract.network}
                    onChange={(value) => setNewContract(prev => ({ ...prev, network: value, token: '' }))}
                    placeholder="Select network"
                  />
                </div>

                {newContract.network && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Token
                    </label>
                    <CustomDropdown
                      options={tokens[newContract.network as keyof typeof tokens]}
                      value={newContract.token}
                      onChange={(value) => setNewContract(prev => ({ ...prev, token: value }))}
                      placeholder="Select token"
                    />
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
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
                <h2 className="text-xl font-bold">Withdraw Funds</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Available Balance</div>
                  <div className="text-xl font-bold">
                    {selectedContract.balance} {selectedContract.token}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount to Withdraw
                  </label>
                  <input
                    type="number"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Destination Address
                  </label>
                  <input
                    type="text"
                    value={withdrawalData.destinationAddress}
                    onChange={(e) => setWithdrawalData(prev => ({ ...prev, destinationAddress: e.target.value }))}
                    placeholder="Enter destination wallet address"
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
                    disabled={!withdrawalData.amount || !withdrawalData.destinationAddress}
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