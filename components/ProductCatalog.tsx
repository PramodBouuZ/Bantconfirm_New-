

import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  onPostNow: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onPostNow }) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Featured Products & Services</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Explore our curated selection of top-tier solutions designed to elevate your business.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} onSelect={onPostNow} onBookDemo={() => {}} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
