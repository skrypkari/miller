import React, { useState } from 'react';
import { Code2, Shield, Wallet2, Hash, Key, Save, Download, Plus } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

interface Project {
  id: string;
  name: string;
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
  logHashes: boolean;
  protection: boolean;
  wallets: string[];
  password: string;
  hasPassword: boolean;
  methods: Method[];
  createdAt: Date;
}

const Builder: React.FC = () => {
  const projects: Project[] = [
    { id: '1', name: 'DD' },
    { id: '2', name: 'XProject' },
    { id: '3', name: 'CryptoFlow' },
    { id: '4', name: 'DD2' },
    { id: '5', name: 'XProject2' },
    { id: '6', name: 'CryptoFlow2' }
  ];

  const [builds, setBuilds] = useState<Build[]>([
    {
      id: '1',
      name: 'Main Build',
      projectId: '1',
      projectName: 'DD',
      logHashes: true,
      protection: true,
      wallets: ['0x1234...5678', '0x8765...4321'],
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
    logHashes: true,
    protection: true,
    wallets: [],
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

  const [newWallet, setNewWallet] = useState('');

  const handleMethodToggle = (methodId: string) => {
    setNewBuild(prev => ({
      ...prev,
      methods: prev.methods.map(method => 
        method.id === methodId ? { ...method, enabled: !method.enabled } : method
      )
    }));
  };

  const handleAddWallet = () => {
    if (newWallet && !newBuild.wallets.includes(newWallet)) {
      setNewBuild(prev => ({
        ...prev,
        wallets: [...prev.wallets, newWallet]
      }));
      setNewWallet('');
    }
  };

  const handleRemoveWallet = (wallet: string) => {
    setNewBuild(prev => ({
      ...prev,
      wallets: prev.wallets.filter(w => w !== wallet)
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
      logHashes: true,
      protection: true,
      wallets: [],
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
        <div className="space-y-4">
          {builds.map(build => (
            <div key={build.id} className="bg-[#1e1f25] rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{build.name}</h2>
                  <p className="text-gray-400">Project: {build.projectName}</p>
                  <p className="text-gray-400">Created: {build.createdAt.toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDownloadBuild(build.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
                >
                  <Download size={20} />
                  Download Build
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Methods</h3>
                  <div className="space-y-2">
                    {build.methods.map(method => (
                      <div key={method.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${method.enabled ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash size={16} />
                      <span>Log Hashes: {build.logHashes ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Protection: {build.protection ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key size={16} />
                      <span>Password Protected: {build.hasPassword ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  onChange={(value) => setNewBuild(prev => ({ ...prev, projectId: value }))}
                  placeholder="Select a project"
                />
              </div>
            </div>
          </div>

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

          <div className="bg-[#1e1f25] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet2 className="text-green-400" size={24} />
              <h2 className="text-xl font-semibold">Wallets</h2>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newWallet}
                onChange={(e) => setNewWallet(e.target.value)}
                placeholder="Enter wallet address"
                className="flex-1 bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={handleAddWallet}
                className="px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
              >
                Add Wallet
              </button>
            </div>

            <div className="space-y-2">
              {newBuild.wallets.map(wallet => (
                <div key={wallet} className="flex items-center justify-between bg-[#2a2b33] p-3 rounded-lg">
                  <span className="font-mono">{wallet}</span>
                  <button
                    onClick={() => handleRemoveWallet(wallet)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
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
              className="flex items-center gap-2 px-6 py-3 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
            >
              <Save size={20} />
              Create Build
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;