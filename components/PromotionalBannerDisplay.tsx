import React from 'react';
import { PromotionalBannerData } from '../types';

interface PromotionalBannerDisplayProps {
  banner: PromotionalBannerData;
}

const PromotionalBannerDisplay: React.FC<PromotionalBannerDisplayProps> = ({ banner }) => {
  if (!banner || !banner.isActive) {
    return null;
  }

  return (
    <a 
      href={banner.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block w-full h-48 bg-gray-800 rounded-xl shadow-lg overflow-hidden relative group"
    >
      <img 
        src={banner.image} 
        alt={banner.title} 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-2xl font-bold">{banner.title}</h3>
        <p className="text-gray-200 mt-1">{banner.text}</p>
      </div>
    </a>
  );
};

export default PromotionalBannerDisplay;
