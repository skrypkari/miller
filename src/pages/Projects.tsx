import React, { useState } from 'react';
import { Plus, Search, Pin, Trash2, DollarSign, RotateCw } from 'lucide-react';
import UserModal from '../components/UserModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

interface User {
  id: string;
  balance: {
    token: string;
    usd: number;
  };
  isDrainerConnected: boolean;
  approveAmount: number;
  isPinned: boolean;
}

interface Project {
  id: string;
  name: string;
  users: User[];
}

const Projects: React.FC = () => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'DD',
      users: [
        {
          id: '0x1234...5678',
          balance: { token: 'ETH', usd: 5000 },
          isDrainerConnected: true,
          approveAmount: 1000,
          isPinned: true
        },
        {
          id: '0x8765...4321',
          balance: { token: 'ETH', usd: 2500 },
          isDrainerConnected: true,
          approveAmount: 800,
          isPinned: false
        },
        {
          id: '0xabcd...efgh',
          balance: { token: 'ETH', usd: 1200 },
          isDrainerConnected: false,
          approveAmount: 300,
          isPinned: false
        }
      ]
    },
    {
      id: '2',
      name: 'XProject',
      users: [
        {
          id: '0xdef1...2345',
          balance: { token: 'BNB', usd: 3000 },
          isDrainerConnected: true,
          approveAmount: 1500,
          isPinned: true
        },
        {
          id: '0x9876...dcba',
          balance: { token: 'BNB', usd: 4200 },
          isDrainerConnected: true,
          approveAmount: 2000,
          isPinned: true
        }
      ]
    },
    {
      id: '3',
      name: 'CryptoFlow',
      users: [
        {
          id: '0xaaaa...bbbb',
          balance: { token: 'MATIC', usd: 1800 },
          isDrainerConnected: true,
          approveAmount: 600,
          isPinned: false
        },
        {
          id: '0xcccc...dddd',
          balance: { token: 'MATIC', usd: 3500 },
          isDrainerConnected: false,
          approveAmount: 1200,
          isPinned: true
        },
        {
          id: '0xeeee...ffff',
          balance: { token: 'MATIC', usd: 900 },
          isDrainerConnected: true,
          approveAmount: 400,
          isPinned: false
        }
      ]
    },
    {
      id: '4',
      name: 'DD',
      users: [
        {
          id: '0x1234...5678',
          balance: { token: 'ETH', usd: 5000 },
          isDrainerConnected: true,
          approveAmount: 1000,
          isPinned: true
        },
        {
          id: '0x8765...4321',
          balance: { token: 'ETH', usd: 2500 },
          isDrainerConnected: true,
          approveAmount: 800,
          isPinned: false
        },
        {
          id: '0xabcd...efgh',
          balance: { token: 'ETH', usd: 1200 },
          isDrainerConnected: false,
          approveAmount: 300,
          isPinned: false
        }
      ]
    },
    {
      id: '5',
      name: 'XProject',
      users: [
        {
          id: '0xdef1...2345',
          balance: { token: 'BNB', usd: 3000 },
          isDrainerConnected: true,
          approveAmount: 1500,
          isPinned: true
        },
        {
          id: '0x9876...dcba',
          balance: { token: 'BNB', usd: 4200 },
          isDrainerConnected: true,
          approveAmount: 2000,
          isPinned: true
        }
      ]
    },
    {
      id: '6',
      name: 'CryptoFlow',
      users: [
        {
          id: '0xaaaa...bbbb',
          balance: { token: 'MATIC', usd: 1800 },
          isDrainerConnected: true,
          approveAmount: 600,
          isPinned: false
        },
        {
          id: '0xcccc...dddd',
          balance: { token: 'MATIC', usd: 3500 },
          isDrainerConnected: false,
          approveAmount: 1200,
          isPinned: true
        },
        {
          id: '0xeeee...ffff',
          balance: { token: 'MATIC', usd: 900 },
          isDrainerConnected: true,
          approveAmount: 400,
          isPinned: false
        }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddUser = () => {
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handlePinUser = (user: User) => {
    // Implementation for pinning user
    console.log('Pin user:', user);
  };

  const handleWithdraw = (user: User, amount?: number) => {
    // Implementation for withdrawal
    console.log('Withdraw from user:', user, amount);
  };

  const handleSpin = (user: User) => {
    // Implementation for spin action
    console.log('Spin for user:', user);
  };

  const filteredUsers = selectedProject?.users.filter(user => 
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Project Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-4 rounded-lg ${
              selectedProject?.id === project.id 
                ? 'bg-green-400 text-[#1e1f25]' 
                : 'bg-[#1e1f25] text-white hover:bg-[#2a2b33]'
            } transition-colors`}
          >
            <div className="font-bold">{project.name}</div>
            <div className="text-sm opacity-75">{project.users.length} users</div>
          </button>
        ))}
      </div>

      {selectedProject && (
        <>
          {/* Search and Add User */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by User ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1f25] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 bg-green-400 text-[#1e1f25] px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {sortedUsers.map(user => (
              <div key={user.id} className="bg-[#1e1f25] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{user.id}</span>
                    {user.isPinned && (
                      <span className="bg-green-400/20 text-green-400 text-sm px-2 py-1 rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePinUser(user)}
                      className="p-2 hover:bg-[#2a2b33] rounded-lg transition-colors"
                    >
                      <Pin size={20} className={user.isPinned ? 'text-green-400' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-2 hover:bg-[#2a2b33] rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-[#2a2b33] p-3 rounded-lg">
                    <div className="text-gray-400 mb-1">Balance</div>
                    <div>{user.balance.token} (${user.balance.usd})</div>
                  </div>
                  <div className="bg-[#2a2b33] p-3 rounded-lg">
                    <div className="text-gray-400 mb-1">Drainer Status</div>
                    <div className={user.isDrainerConnected ? 'text-green-400' : 'text-red-400'}>
                      {user.isDrainerConnected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                  <div className="bg-[#2a2b33] p-3 rounded-lg">
                    <div className="text-gray-400 mb-1">Approve Amount</div>
                    <div>${user.approveAmount}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleWithdraw(user)}
                    className="flex items-center gap-2 bg-green-400 text-[#1e1f25] px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                  >
                    <DollarSign size={16} />
                    Withdraw All
                  </button>
                  <button
                    onClick={() => handleWithdraw(user, user.balance.usd / 2)}
                    className="flex items-center gap-2 bg-[#2a2b33] text-white px-4 py-2 rounded-lg hover:bg-[#353640] transition-colors"
                  >
                    <DollarSign size={16} />
                    Partial Withdraw
                  </button>
                  <button
                    onClick={() => handleSpin(user)}
                    className="flex items-center gap-2 bg-[#2a2b33] text-white px-4 py-2 rounded-lg hover:bg-[#353640] transition-colors"
                  >
                    <RotateCw size={16} />
                    Spin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={(userData) => {
          console.log('Add user:', userData);
          setShowUserModal(false);
        }}
      />

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

export default Projects;