
import React from 'react';
import { Product } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface ProductCardProps {
  product: Product;
  onPostNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPostNow }) => {
  const { name, image, price, description, features } = product;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col">
      <div className="relative h-48 bg-gray-200">
        <img src={image} alt={`${name} product`} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1 mb-3 flex-grow">{description}</p>
        
        <div className="space-y-2 mb-4">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start text-sm">
              <CheckIcon />
              <span className="ml-2 text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-5 bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-gray-900">{price}</p>
          <button 
            onClick={() => onPostNow(product)}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            Post Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
