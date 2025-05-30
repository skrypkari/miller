import React from 'react';
import { Layers } from 'lucide-react';

interface CardProps {
  title: string;
  value: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-[#1e1f25] rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 mb-1">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <div 
          className="p-2 rounded-md" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Layers size={20} style={{ color: color }} />
        </div>
      </div>
    </div>
  );
};

export default Card;