
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ListingsMarketplaceProps {
  products: Product[];
  onPostRequirement: () => void;
  onPostFromProduct: (product: Product) => void;
}

const ListingsMarketplace: React.FC<ListingsMarketplaceProps> = ({ products, onPostRequirement, onPostFromProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            return searchTerm.trim() === '' ||
                                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  product.description.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [products, searchTerm]);


    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900">Product Catalog</h1>
                <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">Explore our curated selection of top-tier solutions designed to elevate your business.</p>
                <button
                    onClick={onPostRequirement}
                    className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
                >
                    Post a Custom Requirement
                </button>
            </div>

             <div className="flex flex-col md:flex-row gap-8">
                {/* Filters */}
                <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-xl shadow-lg border border-gray-200 self-start">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Filters</h2>
                    <div>
                        <label htmlFor="product-search" className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
                        <input
                            type="text"
                            id="product-search"
                            placeholder="e.g. CRM, Cloud"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </aside>

                 {/* Products Grid */}
                <main className="w-full md:w-3/4 lg:w-4/5">
                    {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onPostNow={onPostFromProduct} />
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800">No Products Found</h3>
                        <p className="text-gray-500 mt-2">There are no products matching your current filter selection.</p>
                    </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ListingsMarketplace;
