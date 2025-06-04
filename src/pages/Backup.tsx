import React, { useState } from 'react';
import { Download, Send, History, RefreshCw, Shield, Clock, Database, ArrowUpRight, Calendar, FileText, Code2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackupHistory {
  id: string;
  date: Date;
  size: string;
  type: 'manual' | 'telegram';
  status: 'completed' | 'failed';
}

const Backup: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupHistory] = useState<BackupHistory[]>([
    {
      id: '1',
      date: new Date('2025-03-01T10:30:00'),
      size: '2.3 MB',
      type: 'manual',
      status: 'completed'
    },
    {
      id: '2',
      date: new Date('2025-02-28T15:45:00'),
      size: '2.1 MB',
      type: 'telegram',
      status: 'completed'
    },
    {
      id: '3',
      date: new Date('2025-02-27T09:15:00'),
      size: '2.0 MB',
      type: 'manual',
      status: 'failed'
    }
  ]);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Backup created');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleTelegramBackup = async () => {
    setIsBackingUp(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Backup sent to Telegram');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Backup</h1>
          <p className="text-gray-400 mt-1">Secure your data across multiple platforms</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#1e1f25] p-6 rounded-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                <Clock size={24} className="text-green-400" />
              </div>
              <div className="text-sm text-gray-400">Last Backup</div>
            </div>
            <div className="text-2xl font-bold mb-1">2 hours ago</div>
            <div className="text-sm text-gray-400">March 1, 2025 10:30 AM</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#1e1f25] p-6 rounded-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Database size={24} className="text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Total Size</div>
            </div>
            <div className="text-2xl font-bold mb-1">156.8 MB</div>
            <div className="text-sm text-gray-400">Across 24 backups</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#1e1f25] p-6 rounded-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                <Shield size={24} className="text-purple-400" />
              </div>
              <div className="text-sm text-gray-400">Security Status</div>
            </div>
            <div className="text-2xl font-bold mb-1">Protected</div>
            <div className="text-sm text-gray-400">End-to-end encryption</div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1f25] rounded-xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/5 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
          
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-6">Backup Options</h2>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBackup}
                disabled={isBackingUp}
                className="w-full flex items-center justify-between gap-4 bg-gradient-to-r from-green-400 to-green-500 text-[#1e1f25] p-4 rounded-xl hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1e1f25]/10 flex items-center justify-center">
                    {isBackingUp ? (
                      <RefreshCw className="animate-spin\" size={24} />
                    ) : (
                      <Download size={24} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Download Backup</div>
                    <div className="text-sm opacity-75">Save locally to your device</div>
                  </div>
                </div>
                <ArrowUpRight size={24} className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTelegramBackup}
                disabled={isBackingUp}
                className="w-full flex items-center justify-between gap-4 bg-[#2AABEE] text-white p-4 rounded-xl hover:shadow-lg hover:shadow-[#2AABEE]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    {isBackingUp ? (
                      <RefreshCw className="animate-spin\" size={24} />
                    ) : (
                      <Send size={24} />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Send to Telegram</div>
                    <div className="text-sm opacity-75">Secure cloud storage</div>
                  </div>
                </div>
                <ArrowUpRight size={24} className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>
            </div>

            <div className="mt-6 p-4 bg-[#2a2b33] rounded-xl">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Shield size={16} className="text-green-400" />
                Backup Includes
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <FileText size={16} />
                  <span>Projects & Configs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Database size={16} />
                  <span>User Data</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Code2 size={16} />
                  <span>Build Scripts</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Settings size={16} />
                  <span>System Settings</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Backup History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1f25] rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <History size={24} className="text-green-400" />
            <h2 className="text-xl font-semibold">Backup History</h2>
          </div>

          <div className="space-y-4">
            {backupHistory.map(backup => (
              <motion.div
                key={backup.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#2a2b33] p-4 rounded-xl hover:bg-[#353640] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      backup.type === 'telegram' ? 'bg-[#2AABEE]/10' : 'bg-green-400/10'
                    } flex items-center justify-center`}>
                      {backup.type === 'telegram' ? (
                        <Send size={20} className="text-[#2AABEE]" />
                      ) : (
                        <Download size={20} className="text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {backup.type === 'telegram' ? 'Telegram Backup' : 'Local Backup'}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {backup.date.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      backup.status === 'completed' 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {backup.status}
                    </div>
                    <div className="text-sm text-gray-400">{backup.size}</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#1e1f25] p-2 rounded-lg hover:bg-[#2a2b33] transition-colors"
                >
                  <Download size={16} />
                  Download
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Backup;