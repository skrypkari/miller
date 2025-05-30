import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      <div className="bg-[#1e1f25] rounded-lg p-8 shadow-lg flex flex-col items-center justify-center text-center">
        <Clock size={64} className="text-green-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-400 max-w-md">
          We're working hard to bring you the {title.toLowerCase()} features. 
          This page is currently under development and will be available soon.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;