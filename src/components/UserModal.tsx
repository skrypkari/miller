import React, { useState } from 'react';
import { X } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { userId: string }) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [userId, setUserId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userId });
    setUserId('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1e1f25] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-400 mb-2">
              User ID (Wallet Address)
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="0x..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#2a2b33] text-white rounded-lg hover:bg-[#353640] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-400 text-[#1e1f25] rounded-lg hover:bg-green-500 transition-colors"
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