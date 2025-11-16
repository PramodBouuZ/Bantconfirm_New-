

import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBookDemo: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBookDemo }) => {
  const { name, image, price, author, oldPrice } = product;
  const leadCount = product.sales || 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 group flex flex-col">
      <div className="relative h-48 bg-gray-200 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors cursor-pointer mb-1" onClick={() => onSelect(product)}>{name}</h3>
          {author && <p className="text-sm text-gray-500">by <span className="text-gray-700 font-medium">{author}</span></p>}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-blue-600">{price}</p>
            {oldPrice && <p className="text-sm text-gray-400 line-through">{oldPrice}</p>}
          </div>
           <div className="text-right">
             <p className="text-sm text-gray-500">{leadCount} Leads</p>
             <a
                onClick={(e) => { e.stopPropagation(); onBookDemo(product); }}
                className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer"
              >
                Book Now
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
