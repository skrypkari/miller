import React, { useState } from 'react';
import { Code2, Shield, Hash, Key, Save, Download, Plus, Wallet, Search, Filter, X, Check } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  wallet: string;
  contracts: {
    id: string;
    name: string;
    address: string;
    network: {
      name: string;
      symbol: string;
      color: string;
    };
  }[];
}

interface Method {
  id: string;
  name: string;
  enabled: boolean;
}

interface Build {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  contractId: string;
  logHashes: boolean;
  protection: boolean;
  password: string;
  hasPassword: boolean;
  methods: Method[];
  createdAt: Date;
}

const Builder: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'DD',
      wallet: '0x1234...5678',
      contracts: [
        { 
          id: 'c1', 
          name: 'Main Contract', 
          address: '0xabcd...1234',
          network: { name: 'Ethereum', symbol: 'ETH', color: '#627EEA' }
        },
        { 
          id: 'c2', 
          name: 'Secondary Contract', 
          address: '0xefgh...5678',
          network: { name: 'BSC', symbol: 'BNB', color: '#F3BA2F' }
        }
      ]
    },
    {
      id: '2',
      name: 'XProject',
      wallet: '0x8765...4321',
      contracts: [
        { 
          id: 'c3', 
          name: 'BSC Contract', 
          address: '0xijkl...9012',
          network: { name: 'BSC', symbol: 'BNB', color: '#F3BA2F' }
        }
      ]
    },
    {
      id: '3',
      name: 'CryptoFlow',
      wallet: '0xdef1...2345',
      contracts: [
        { 
          id: 'c4', 
          name: 'Polygon Contract', 
          address: '0xmnop...3456',
          network: { name: 'Polygon', symbol: 'MATIC', color: '#8247E5' }
        },
        { 
          id: 'c5', 
          name: 'Secondary Contract', 
          address: '0xqrst...7890',
          network: { name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' }
        }
      ]
    }
  ];

  const [builds, setBuilds] = useState<Build[]>([
    {
      id: '1',
      name: 'Main Build',
      projectId: '1',
      projectName: 'DD',
      contractId: 'c1',
      logHashes: true,
      protection: true,
      password: '',
      hasPassword: false,
      methods: [
        { id: 'seaport', name: 'Seaport', enabled: true },
        { id: 'permit2', name: 'Permit2', enabled: true },
        { id: 'blur', name: 'Blur', enabled: false },
        { id: 'swap', name: 'Swap', enabled: true },
        { id: 'transfer', name: 'Transfer', enabled: true }
      ],
      createdAt: new Date('2025-02-15')
    }
  ]);

  const [showNewBuildForm, setShowNewBuildForm] = useState(false);
  const [newBuild, setNewBuild] = useState<Omit<Build, 'id' | 'createdAt' | 'projectName'>>({
    name: '',
    projectId: '',
    contractId: '',
    logHashes: true,
    protection: true,
    password: '',
    hasPassword: false,
    methods: [
      { id: 'seaport', name: 'Seaport', enabled: true },
      { id: 'permit2', name: 'Permit2', enabled: true },
      { id: 'blur', name: 'Blur', enabled: false },
      { id: 'swap', name: 'Swap', enabled: true },
      { id: 'transfer', name: 'Transfer', enabled: true }
    ]
  });

  const [contractSearch, setContractSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === newBuild.projectId);
  const selectedContract = selectedProject?.contracts.find(c => c.id === newBuild.contractId);

  const filteredContracts = selectedProject?.contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(contractSearch.toLowerCase()) ||
                         contract.address.toLowerCase().includes(contractSearch.toLowerCase());
    const matchesNetwork = !selectedNetwork || contract.network.name === selectedNetwork;
    return matchesSearch && matchesNetwork;
  }) || [];

  const uniqueNetworks = selectedProject?.contracts.reduce((acc: string[], contract) => {
    if (!acc.includes(contract.network.name)) {
      acc.push(contract.network.name);
    }
    return acc;
  }, []) || [];

  const networkOptions = uniqueNetworks.map(network => ({
    id: network,
    name: network
  }));

  const handleMethodToggle = (methodId: string) => {
    setNewBuild(prev => ({
      ...prev,
      methods: prev.methods.map(method => 
        method.id === methodId ? { ...method, enabled: !method.enabled } : method
      )
    }));
  };

  const handleCreateBuild = () => {
    const selectedProject = projects.find(p => p.id === newBuild.projectId);
    const build: Build = {
      ...newBuild,
      id: (builds.length + 1).toString(),
      projectName: selectedProject?.name || '',
      createdAt: new Date()
    };
    setBuilds(prev => [...prev, build]);
    setShowNewBuildForm(false);
    setNewBuild({
      name: '',
      projectId: '',
      contractId: '',
      logHashes: true,
      protection: true,
      password: '',
      hasPassword: false,
      methods: [
        { id: 'seaport', name: 'Seaport', enabled: true },
        { id: 'permit2', name: 'Permit2', enabled: true },
        { id: 'blur', name: 'Blur', enabled: false },
        { id: 'swap', name: 'Swap', enabled: true },
        { id: 'transfer', name: 'Transfer', enabled: true }
      ]
    });
  };

  const handleDownloadBuild = (buildId: string) => {
    console.log('Downloading build:', buildId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Builder</h1>
        <button
          onClick={() => setShowNewBuildForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
        >
          <Plus size={20} />
          New Build
        </button>
      </div>

      {!showNewBuildForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {builds.map(build => (
            <motion.div
              key={build.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#1e1f25] rounded-xl p-6 hover:shadow-lg hover:shadow-green-400/5 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">{build.name}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Code2 size={16} />
                    <span>{build.projectName}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Created: {build.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadBuild(build.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-[#1e1f25] rounded-lg hover:shadow-md hover:shadow-green-400/20 transition-all duration-300"
                >
                  <Download size={20} />
                  Download
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Code2 size={16} className="text-green-400" />
                    Methods
                  </h3>
                  <div className="space-y-2">
                    {build.methods.map(method => (
                      <div
                        key={method.id}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          method.enabled 
                            ? 'bg-green-400/10 text-green-400' 
                            : 'bg-[#2a2b33] text-gray-400'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          method.enabled ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield size={16} className="text-green-400" />
                    Settings
                  </h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      build.logHashes ? 'bg-green-400/10 text-green-400' : 'bg-[#2a2b33] text-gray-400'
                    }`}>
                      <Hash size={16} />
                      <span>Log Hashes</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      build.protection ? 'bg-green-400/10 text-green-400' : 'bg-[#2a2b33] text-gray-400'
                    }`}>
                      <Shield size={16} />
                      <span>Protection</span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      build.hasPassword ? 'bg-green-400/10 text-green-400' : 'bg-[#2a2b33] text-gray-400'
                    }`}>
                      <Key size={16} />
                      <span>Password Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showNewBuildForm && (
        <div className="space-y-6">
          <div className="bg-[#1e1f25] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Build Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Build Name</label>
                <input
                  type="text"
                  value={newBuild.name}
                  onChange={(e) => setNewBuild(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter build name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project</label>
                <CustomDropdown
                  options={projects}
                  value={newBuild.projectId}
                  onChange={(value) => setNewBuild(prev => ({ ...prev, projectId: value, contractId: '' }))}
                  placeholder="Select a project"
                />
              </div>
            </div>
          </div>

          {selectedProject && (
            <div className="bg-[#1e1f25] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="text-green-400" size={24} />
                <h2 className="text-xl font-semibold">Project Wallet</h2>
              </div>
              <div className="bg-[#2a2b33] p-4 rounded-lg">
                <div className="font-mono">{selectedProject.wallet}</div>
              </div>
            </div>
          )}

          {selectedProject && (
            <div className="bg-[#1e1f25] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Code2 className="text-green-400" size={24} />
                  <h2 className="text-xl font-semibold">Select Contract</h2>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search contracts..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                      className="w-64 bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="w-48">
                    <CustomDropdown
                      options={networkOptions}
                      value={selectedNetwork || ''}
                      onChange={(value) => setSelectedNetwork(value || null)}
                      placeholder="All Networks"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContracts.map(contract => (
                  <motion.button
                    key={contract.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNewBuild(prev => ({ ...prev, contractId: contract.id }))}
                    className={`relative overflow-hidden text-left transition-all duration-300 ${
                      newBuild.contractId === contract.id 
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-[#1e1f25]'
                        : 'bg-[#2a2b33] hover:bg-[#353640]'
                    } p-6 rounded-xl`}
                  >
                    {/* Network Gradient */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 opacity-10"
                      style={{
                        background: `radial-gradient(circle at 70% -20%, ${contract.network.color}, transparent 70%)`
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{contract.name}</h3>
                        <div
                          className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          style={{ 
                            backgroundColor: `${contract.network.color}20`,
                            color: contract.network.color
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: contract.network.color }}
                          />
                          {contract.network.symbol}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="font-mono text-sm bg-[#1e1f25] p-2 rounded-lg">
                          {contract.address}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: contract.network.color }}
                          />
                          Network: {contract.network.name}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {newBuild.contractId === contract.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-[#1e1f25] flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      </div>
                    )}

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                ))}
              </div>

              {filteredContracts.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No contracts found matching your criteria
                </div>
              )}
            </div>
          )}

          {selectedContract && (
            <>
              <div className="bg-[#1e1f25] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="text-green-400" size={24} />
                  <h2 className="text-xl font-semibold">Methods</h2>
                </div>
                <div className="space-y-3">
                  {newBuild.methods.map(method => (
                    <div key={method.id} className="flex items-center justify-between">
                      <span>{method.name}</span>
                      <button
                        onClick={() => handleMethodToggle(method.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          method.enabled 
                            ? 'bg-green-400 text-[#1e1f25]' 
                            : 'bg-[#2a2b33] text-gray-400'
                        }`}
                      >
                        {method.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1f25] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-green-400" size={24} />
                  <h2 className="text-xl font-semibold">Security</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash size={20} />
                      <span>Log Transaction Hashes</span>
                    </div>
                    <button
                      onClick={() => setNewBuild(prev => ({ ...prev, logHashes: !prev.logHashes }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newBuild.logHashes 
                          ? 'bg-green-400 text-[#1e1f25]' 
                          : 'bg-[#2a2b33] text-gray-400'
                      }`}
                    >
                      {newBuild.logHashes ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={20} />
                      <span>Protection</span>
                    </div>
                    <button
                      onClick={() => setNewBuild(prev => ({ ...prev, protection: !prev.protection }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newBuild.protection 
                          ? 'bg-green-400 text-[#1e1f25]' 
                          : 'bg-[#2a2b33] text-gray-400'
                      }`}
                    >
                      {newBuild.protection ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={20} />
                      <span>Password Protection</span>
                    </div>
                    <button
                      onClick={() => setNewBuild(prev => ({ ...prev, hasPassword: !prev.hasPassword }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newBuild.hasPassword 
                          ? 'bg-green-400 text-[#1e1f25]' 
                          : 'bg-[#2a2b33] text-gray-400'
                      }`}
                    >
                      {newBuild.hasPassword ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {newBuild.hasPassword && (
                    <div className="mt-2">
                      <input
                        type="password"
                        value={newBuild.password}
                        onChange={(e) => setNewBuild(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowNewBuildForm(false)}
                  className="px-6 py-3 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBuild}
                  disabled={!newBuild.name || !newBuild.projectId || !newBuild.contractId}
                  className="flex items-center gap-2 px-6 py-3 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  Create Build
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Builder;