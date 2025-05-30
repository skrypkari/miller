import React, { useState } from 'react';
import { Download, Send, History, RefreshCw } from 'lucide-react';

interface BackupHistory {
  id: string;
  date: Date;
  size: string;
  type: 'manual' | 'telegram';
}

const Backup: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupHistory] = useState<BackupHistory[]>([
    {
      id: '1',
      date: new Date('2025-03-01T10:30:00'),
      size: '2.3 MB',
      type: 'manual'
    },
    {
      id: '2',
      date: new Date('2025-02-28T15:45:00'),
      size: '2.1 MB',
      type: 'telegram'
    }
  ]);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      // Simulated backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Backup created');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleTelegramBackup = async () => {
    setIsBackingUp(true);
    try {
      // Simulated Telegram backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Backup sent to Telegram');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backup</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Actions */}
        <div className="bg-[#1e1f25] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Backup Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="w-full flex items-center justify-center gap-2 bg-green-400 text-[#1e1f25] px-4 py-3 rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBackingUp ? (
                <RefreshCw className="animate-spin\" size={20} />
              ) : (
                <Download size={20} />
              )}
              Download Backup
            </button>

            <button
              onClick={handleTelegramBackup}
              disabled={isBackingUp}
              className="w-full flex items-center justify-center gap-2 bg-[#2AABEE] text-white px-4 py-3 rounded-lg hover:bg-[#229ED9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBackingUp ? (
                <RefreshCw className="animate-spin\" size={20} />
              ) : (
                <Send size={20} />
              )}
              Send to Telegram
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Backup includes:</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Projects and configurations</li>
              <li>• User data and settings</li>
              <li>• Build scripts and templates</li>
              <li>• System configurations</li>
            </ul>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-[#1e1f25] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-green-400" />
            <h2 className="text-xl font-semibold">Backup History</h2>
          </div>

          <div className="space-y-3">
            {backupHistory.map(backup => (
              <div
                key={backup.id}
                className="flex items-center justify-between bg-[#2a2b33] p-4 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {backup.type === 'telegram' ? (
                      <Send size={16} className="text-[#2AABEE]" />
                    ) : (
                      <Download size={16} className="text-green-400" />
                    )}
                    <span className="text-sm text-gray-400">
                      {backup.date.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Size: {backup.size}
                  </div>
                </div>
                <button
                  onClick={() => console.log('Download backup:', backup.id)}
                  className="px-3 py-1 text-sm bg-[#353640] text-white rounded hover:bg-[#404252] transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;