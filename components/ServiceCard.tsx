import React from 'react';
import { Service } from '../types';
import { SERVICE_ICONS } from './icons/serviceIcons';

interface ServiceCardProps extends Service {
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, description, icon, onSelect }) => {
  const IconComponent = SERVICE_ICONS[icon] || null;

  return (
    <div 
      onClick={onSelect}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center border border-gray-200 cursor-pointer"
    >
      <div className="flex justify-center items-center mb-4 text-indigo-600 h-12">
        {IconComponent && <IconComponent />}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;