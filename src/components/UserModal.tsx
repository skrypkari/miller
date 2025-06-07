import React, { useState } from 'react';
import { X } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { 
    tokenAddress: string;
    contractAddress: string;
    fromAddress: string;
  }) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenAddress.trim() || !contractAddress.trim() || !fromAddress.trim()) {
      return;
    }
    
    onSubmit({ 
      tokenAddress: tokenAddress.trim(),
      contractAddress: contractAddress.trim(),
      fromAddress: fromAddress.trim()
    });
    
    // Очищаем форму
    setTokenAddress('');
    setContractAddress('');
    setFromAddress('');
  };

  const handleClose = () => {
    // Очищаем форму при закрытии
    setTokenAddress('');
    setContractAddress('');
    setFromAddress('');
    onClose();
  };

  const isFormValid = tokenAddress.trim() && contractAddress.trim() && fromAddress.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md m-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add User</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-400 mb-2">
              Token Address *
            </label>
            <input
              type="text"
              id="tokenAddress"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-500"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-400 mb-2">
              Contract Address *
            </label>
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-500"
              placeholder="0x..."
              required
            />
          </div>

          <div>
            <label htmlFor="fromAddress" className="block text-sm font-medium text-gray-400 mb-2">
              From Address *
            </label>
            <input
              type="text"
              id="fromAddress"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-500"
              placeholder="0x..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;