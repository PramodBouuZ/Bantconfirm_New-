

import React from 'react';
import { SERVICE_ICONS } from './icons/serviceIcons';

interface ServiceCardProps {
  name: string;
  icon: string;
  onSelect: () => void;
  itemCount: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, icon, onSelect, itemCount }) => {
  const IconComponent = SERVICE_ICONS[icon] || null;

  return (
    <div 
      onClick={onSelect}
      className="bg-white p-4 rounded-xl transition-all duration-300 text-center border border-gray-200 hover:shadow-lg hover:border-blue-500 cursor-pointer flex flex-col items-center justify-start h-full"
    >
      <div className="flex justify-center items-center mb-3 text-blue-600 h-10 w-10">
        {IconComponent && <IconComponent />}
      </div>
      <h3 className="text-sm font-bold text-gray-900 leading-tight">{name}</h3>
      <p className="text-xs text-gray-500 mt-1">{itemCount} items</p>
    </div>
  );
};

export default ServiceCard;