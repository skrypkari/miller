import React from 'react';
import { Terminal } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      date: new Date(2025, 4, 25, 14, 15),
      type: 'Created',
      address: '0xf3B...12a4',
      status: 'WAITING'
    },
    {
      date: new Date(2025, 4, 24, 9, 23),
      type: 'WITHDRAWN',
      address: '0xd9E...4c3f',
      value: '0.15 ETH'
    },
    {
      date: new Date(2025, 4, 24, 4, 32),
      type: 'ADDED',
      address: '0x61D...34F9',
      wallet: 'WALLET'
    }
  ];

  const formatDate = (date: Date): string => {
    return `[${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}]`;
  };

  return (
    <div className="bg-[#1e1f25] rounded-lg p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Terminal size={20} className="mr-2 text-green-400" />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      
      <div className="bg-[#121318] rounded-md p-3 font-mono text-sm">
        {activities.map((activity, index) => (
          <div key={index} className="terminal-text mb-1">
            <span className="text-gray-400">{formatDate(activity.date)}</span>{' '}
            <span className="text-yellow-400">{activity.type}</span>{' '}
            <span className="text-blue-400">{activity.address}</span>{' '}
            {activity.value && <span className="text-green-400">{activity.value}</span>}
            {activity.status && <span className="text-red-400">{activity.status}</span>}
            {activity.wallet && <span className="text-purple-400">{activity.wallet}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;