
import React from 'react';
import { SERVICE_ICONS } from './icons/serviceIcons';

interface ServiceCardProps {
  name: string;
  icon: string;
  onSelect: () => void;
  itemCount: number;
  isActive?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, icon, onSelect, itemCount, isActive }) => {
  const IconComponent = SERVICE_ICONS[icon] || null;

  const baseClasses = "bg-white p-4 rounded-md transition-all duration-300 text-center border hover:shadow-md cursor-pointer flex flex-col items-center justify-start h-full";
  const activeClasses = "border-blue-500 shadow-md bg-blue-50";
  const inactiveClasses = "border-gray-200 hover:border-blue-500";

  return (
    <div 
      onClick={onSelect}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="flex justify-center items-center mb-2 text-blue-600 h-8 w-8">
        {IconComponent && <IconComponent />}
      </div>
      <h3 className="text-sm font-bold text-gray-900">{name}</h3>
      <p className="text-xs text-gray-500 mt-1">{itemCount} items</p>
    </div>
  );
};

export default ServiceCard;
