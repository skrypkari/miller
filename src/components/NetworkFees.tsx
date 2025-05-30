import React from 'react';
import { Zap } from 'lucide-react';

const NetworkFees: React.FC = () => {
  const fees = [
    { network: 'Ethereum', value: '25 gwei', color: '#627EEA' },
    { network: 'Binance Smart Chain', value: '5 gwei', color: '#F3BA2F' },
    { network: 'Polygon', value: '35 gwei', color: '#8247E5' },
    { network: 'Arbitrum', value: '0.5 gwei', color: '#28A0F0' }
  ];

  return (
    <div className="bg-[#1e1f25] rounded-lg p-4 shadow-lg">
      <div className="flex items-center mb-3">
        <Zap size={20} className="mr-2 text-yellow-400" />
        <h2 className="text-lg font-semibold">Network Fees</h2>
      </div>
      
      <div className="space-y-3">
        {fees.map((fee, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: fee.color }}
              ></div>
              <span className="text-gray-300">{fee.network}</span>
            </div>
            <span className="font-medium">{fee.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkFees;