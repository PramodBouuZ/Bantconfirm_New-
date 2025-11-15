

import React, { useState, useMemo, useRef } from 'react';
import { AppView, Service, Product, Vendor } from '../types';
import ServiceCard from './ServiceCard';
import ProductCard from './ProductCard';
import VendorLogos from './VendorLogos';

interface HomePageProps {
  services: Service[];
  products: Product[];
  vendors: Vendor[];
  onGetQuote: (serviceName?: string) => void;
  onPostRequirement: () => void;
  onSelectProduct: (product: Product) => void;
  onBookDemo: (product: Product) => void;
  onNav: (view: AppView) => void;
}

const ArrowButton: React.FC<{ direction: 'left' | 'right', onClick: () => void, className?: string }> = ({ direction, onClick, className }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-white transition-all z-10 ${direction === 'left' ? '-left-2' : '-right-2'} ${className}`}
        aria-label={`Scroll ${direction}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {direction === 'left' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
        </svg>
    </button>
);

const HomePage: React.FC<HomePageProps> = ({ services, products, vendors, onGetQuote, onPostRequirement, onSelectProduct, onBookDemo, onNav }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
    
  const serviceCategoriesWithCounts = useMemo(() => {
    const baseCategories = [
      { name: 'Leased Line', icon: 'Globe' },
      { name: 'Telephony', icon: 'Phone' },
      { name: 'CRM Software', icon: 'Users' },
      { name: 'Cloud Telephony', icon: 'Cloud' },
      { name: 'Toll-Free Number', icon: 'Phone' },
      { name: 'ERP', icon: 'Briefcase' },
      { name: 'Billing Software', icon: 'Document' },
      { name: 'Custom Dev', icon: 'Code' },
      { name: 'Mailing Solution', icon: 'Chat' },
      { name: 'Cloud Storage', icon: 'Cloud' },
      { name: 'IT & Networking', icon: 'Shield' },
    ];

    return baseCategories.map(category => ({
      ...category,
      count: products.filter(p => p.tags?.includes(category.name)).length,
    }));
  }, [products]);


  const handleCategorySelect = (categoryName: string) => {
    setSearchQuery('');
    setSearchTerm('');
    setSelectedCategory(prev => (prev === categoryName ? null : categoryName));
  };
    
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setSelectedCategory(null);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const filteredProducts = useMemo(() => {
    let tempProducts = products;
    
    if (searchQuery) {
        tempProducts = tempProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    
    if (selectedCategory) {
        tempProducts = tempProducts.filter(p => p.tags?.includes(selectedCategory));
    }

    return tempProducts;
  }, [products, selectedCategory, searchQuery]);
    
  const getProductSectionTitle = () => {
      if (searchQuery) {
          return `Search Results for "${searchQuery}"`;
      }
      if (selectedCategory) {
          return `New Arrivals in ${selectedCategory}`;
      }
      return 'New Arrival Products';
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-gray-800 text-center overflow-hidden pt-16 pb-20">
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight max-w-4xl mx-auto">
                The Premier Marketplace for AI-Qualified IT Leads
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Connect with top-tier vendors, find the perfect IT solutions, or earn up to 10% commission by sharing qualified leads.
            </p>

            <div className="max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-md flex items-center gap-2 border">
                <input 
                    type="text" 
                    placeholder="Search for services, solutions & more" 
                    className="w-full py-2 px-4 text-gray-700 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                />
                <button 
                    onClick={handleSearch}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </div>
            
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
            <div className="relative">
                <ArrowButton direction="left" onClick={() => handleScroll('left')} className="hidden md:flex" />
                <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    {serviceCategoriesWithCounts.map(cat => (
                        <div key={cat.name} className="flex-shrink-0 w-40">
                            <ServiceCard 
                                name={cat.name}
                                icon={cat.icon}
                                onSelect={() => handleCategorySelect(cat.name)}
                                itemCount={cat.count}
                                isActive={selectedCategory === cat.name}
                            />
                        </div>
                    ))}
                </div>
                <ArrowButton direction="right" onClick={() => handleScroll('right')} className="hidden md:flex" />
            </div>
        </div>
      </section>

      {/* New Arrival Products */}
      <section className="py-16 bg-[#F8F9FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                  {getProductSectionTitle()}
              </h2>
              {searchQuery && (
                  <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 font-semibold">
                      Clear Search
                  </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.slice(0, 8).map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={onSelectProduct} 
                        onBookDemo={onBookDemo} 
                    />
                ))}
            </div>
             {(filteredProducts.length === 0 && (selectedCategory || searchQuery)) && (
                <div className="text-center py-10 text-gray-500">
                    <p>No products found matching your criteria.</p>
                </div>
            )}
            <div className="text-center mt-12">
                <button 
                    onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-md hover:bg-blue-700 transition-colors">
                    View All Products
                </button>
            </div>
          </div>
      </section>
      
      {/* Featured IT Solutions */}
      <section className="py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured IT Solutions</h2>
                <p className="text-gray-600 mb-6">Explore a curated selection of our top-rated products, hand-picked for their quality and performance.</p>
                <button onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-md hover:bg-blue-700 transition-colors">
                    View All
                </button>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {products.slice(4, 8).map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={onSelectProduct} 
                        onBookDemo={onBookDemo} 
                    />
                ))}
            </div>
         </div>
      </section>

       {/* Telco Products & Services */}
       <section className="py-24 bg-gradient-to-b from-[#1a0c3b] to-[#0d061f] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-bold">Telco Products & Services</h2>
                    <p className="text-gray-400 mt-2">Explore our top telecommunication products and services, from leased lines to cloud telephony.</p>
                </div>
                 <button onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-md hover:bg-blue-700 transition-colors flex-shrink-0">
                    View All Items
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onSelect={onSelectProduct} 
                        onBookDemo={onBookDemo} 
                    />
                ))}
            </div>
          </div>
       </section>

       {/* CTA Banners */}
        <section className="py-24 bg-[#F8F9FA]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8">
                <div className="p-10 rounded-lg border flex flex-col items-start bg-blue-50 border-blue-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Pay-Per-Success Lead Generation</h3>
                    <p className="text-gray-600 mb-6">Join our marketplace and receive AI-qualified leads that are ready for engagement. You only pay a success fee when you close a deal, making it a risk-free channel for business growth.</p>
                    <button onClick={() => onNav(AppView.BECOME_VENDOR)} className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">Become a Vendor</button>
                </div>
                 <div className="p-10 rounded-lg border flex flex-col items-start bg-amber-50 border-amber-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Earn Up to 10% Commission</h3>
                    <p className="text-gray-600 mb-6">Monetize your professional network. Submit a qualified lead for any IT or software requirement you come across. If your lead results in a successful deal on our platform, you earn a commission.</p>
                     <button onClick={onPostRequirement} className="bg-white text-gray-800 font-bold py-3 px-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">Submit a Lead</button>
                </div>
            </div>
        </section>

        {/* Support Banner */}
        <section className="py-16">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-lg border text-center md:text-left gap-8">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                        <img
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                            src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop"
                            alt="Support agent"
                        />
                        <div className="mt-4 sm:mt-0 sm:ml-6">
                            <h3 className="text-3xl font-bold text-gray-900">Support 24/7</h3>
                            <p className="text-gray-600">Wanna talk? Send us a message</p>
                        </div>
                    </div>
                    <a href="mailto:support@bantconfirm.com" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-md hover:bg-blue-700 transition-colors w-full sm:w-auto flex-shrink-0">
                        support@bantconfirm.com
                    </a>
                </div>
            </div>
        </section>

      <VendorLogos vendors={vendors} />
    </div>
  );
};

export default HomePage;