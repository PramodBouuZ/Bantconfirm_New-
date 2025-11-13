import React from 'react';
import { Vendor } from '../types';

const VendorCard: React.FC<Vendor> = ({ name, logoUrl, heroImageUrl, description, specialties }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col">
      <div className="relative h-40 bg-gray-200">
        <img src={heroImageUrl} alt={`${name} hero banner`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <img src={logoUrl} alt={`${name} logo`} className="max-h-16 max-w-full" />
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((spec, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;