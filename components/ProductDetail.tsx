

import React from 'react';
import { Product } from '../types';
import { StarIcon } from './icons/StarIcon';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onBookDemo: (product: Product) => void;
  onPostRequirement: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onBookDemo, onPostRequirement }) => {
  const { name, image, price, oldPrice, author, sales, rating, description, features, priceUnit } = product;
  
  const renderStars = () => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating.rate);
    const hasHalfStar = rating.rate % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} className="text-amber-400 w-5 h-5" />);
    }

    if (hasHalfStar) {
       stars.push(<StarIcon key="half" className="text-amber-400 w-5 h-5" half />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<StarIcon key={`empty-${i}`} className="text-gray-300 w-5 h-5" />);
    }
    
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div>
      <button onClick={onBack} className="mb-8 text-blue-600 hover:text-blue-800 font-semibold flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start mt-8">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <img src={image} alt={name} className="w-full h-auto object-cover rounded-lg"/>
        </div>
        
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{name}</h1>
          <p className="text-gray-500 mt-2">
            by <span className="text-gray-800 font-semibold">{author}</span>
          </p>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {renderStars()}
              {rating && <span>({rating.count} reviews)</span>}
            </div>
            <span className="text-gray-300">|</span>
            <span>{sales} Sales</span>
          </div>
          
          <div className="my-6">
            {oldPrice && <p className="text-xl text-gray-400 line-through">{oldPrice}</p>}
            <p className="text-4xl font-bold text-blue-600 flex items-baseline gap-2">
                <span>{price}</span>
                {priceUnit && <span className="text-lg font-normal text-gray-500">{priceUnit}</span>}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{description}</p>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">Features</h3>
          <ul className="space-y-3 text-gray-700">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button 
                onClick={() => onBookDemo(product)} 
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 shadow-md flex-1 text-center"
            >
                Book Demo
            </button>
            <button 
                onClick={() => onPostRequirement(product)} 
                className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-600 transition-colors duration-300 transform hover:scale-105 shadow-md flex-1 text-center"
            >
                Post This as a Requirement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;