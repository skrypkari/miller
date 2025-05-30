import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-[#2a2b33] border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ backgroundColor: 'rgba(74, 222, 128, 0.1)' }}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:text-green-400 transition-colors ${
                    option.id === value ? 'bg-green-400/10 text-green-400' : 'text-white'
                  }`}
                >
                  {option.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;