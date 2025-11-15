

import React from 'react';
import { Product } from '../types';
import { StarIcon } from './icons/StarIcon';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBookDemo: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBookDemo }) => {
  const { name, image, price, oldPrice, author, sales, rating, tags, priceUnit } = product;

  const renderStars = () => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating.rate);
    const hasHalfStar = rating.rate % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className="text-amber-400" />);
    }

    if (hasHalfStar) {
       stars.push(<StarIcon key="half" className="text-amber-400" half />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<StarIcon key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return <div className="flex items-center">{stars}</div>;
  };


  return (
    <div 
        onClick={() => onSelect(product)}
        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200/80 group cursor-pointer flex flex-col"
    >
        <div className="relative h-48 bg-gray-200 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {tags?.map(tag => (
                     <span key={tag} className="bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">
                        {tag}
                     </span>
                ))}
            </div>
        </div>
        <div className="p-4 flex-grow">
            <h3 className="text-md font-bold text-gray-800 truncate group-hover:text-blue-600">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              by <span className="text-gray-700 font-medium">{author || 'BANTConfirm'}</span>
            </p>
            <div className="flex justify-between items-center mt-3">
                 <div className="flex items-center gap-2">
                    {renderStars()}
                    {rating && <span className="text-xs text-gray-500">({rating.count})</span>}
                </div>
                <div className="text-sm text-gray-500">{sales} {sales === 1 ? 'Lead' : 'Leads'}</div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-200/80 flex justify-between items-center">
             <div>
                <p className="text-lg font-bold text-blue-600 flex items-baseline gap-1">
                    <span>{price}</span>
                    {priceUnit && <span className="text-sm font-normal text-gray-500">{priceUnit}</span>}
                </p>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onBookDemo(product);
                }}
                className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
                Book Now
            </button>
        </div>
    </div>
  );
};

export default ProductCard;