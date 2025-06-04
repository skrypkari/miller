import React, { useState } from 'react';
import { Bot, MessageSquare, Key, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [telegramSettings, setTelegramSettings] = useState({
    botApiKey: '',
    chatId: '',
    username: ''
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveTelegramSettings = () => {
    console.log('Saving Telegram settings:', telegramSettings);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Changing password');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

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
                value={telegramSettings.botApiKey}
                onChange={(e) => setTelegramSettings(prev => ({ ...prev, botApiKey: e.target.value }))}
                className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
              value={telegramSettings.chatId}
              onChange={(e) => setTelegramSettings(prev => ({ ...prev, chatId: e.target.value }))}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter chat ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={telegramSettings.username}
              onChange={(e) => setTelegramSettings(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter Telegram username"
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveTelegramSettings}
              className="flex items-center gap-2 px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
            >
              <Save size={20} />
              Save Settings
            </motion.button>
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
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Modal Window Opens</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Withdrawal Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2a2b33] rounded-lg">
            <span>Approval Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1e1f25] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="text-red-400" size={24} />
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
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
      </div>
    </div>
  );
};

export default Settings;