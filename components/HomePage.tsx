

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, Service, AppView, Vendor } from '../types';
import ProductCard from './ProductCard';
import ServiceCard from './ServiceCard';
import VendorLogos from './VendorLogos';
import PromotionalBanner from './PromotionalBanner';

interface HomePageProps {
  services: Service[];
  products: Product[];
  vendors: Vendor[];
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: Service) => void;
  onBookDemo: (product: Product) => void;
  onNav: (view: AppView) => void;
  onGetQuote: (serviceName?: string) => void;
  onPostRequirement: () => void;
  onSearch: (term: string) => void;
}

const animatedWords = ["IT Leads", "Software Deals", "Cloud Solutions", "Telco Needs"];

const ChevronLeft: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const HomePage: React.FC<HomePageProps> = ({ services, products, vendors, onSelectProduct, onSelectService, onBookDemo, onNav, onGetQuote, onPostRequirement, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setWordIndex(prev => (prev + 1) % animatedWords.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };
    
    const newArrivalProducts = useMemo(() => products.slice(0, 4), [products]);
    const featuredITProducts = useMemo(() => products.filter(p => p.category === 'IT').slice(0, 4), [products]);
    const telcoProducts = useMemo(() => products.filter(p => p.category === 'Telco').slice(0, 4), [products]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative text-gray-800 flex flex-col justify-center text-center overflow-hidden min-h-[70vh] md:min-h-[60vh] bg-gradient-to-b from-blue-50 to-white">
                 <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="relative z-10 p-4 flex-grow flex flex-col items-center justify-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-gray-900">
                        The Premier Marketplace for AI-Qualified<br/>
                        <span key={wordIndex} className="text-blue-600 text-focus-in inline-block mt-2">
                           {animatedWords[wordIndex]}
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        Connect with top-tier vendors, find the perfect IT solutions, or earn up to 10% commission by sharing qualified leads.
                    </p>
                    <div className="w-full max-w-2xl mx-auto">
                         <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto">
                            <div className="flex items-center bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search for services, solutions & more"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 px-4 border-none focus:ring-0 text-gray-700 bg-transparent"
                                />
                                <button type="submit" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            
            {/* Popular Categories */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
                    <div className="relative flex items-center group">
                         <button onClick={() => handleScroll('left')} className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md -translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft />
                        </button>
                        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            {services.map(service => (
                                 <div key={service.name} className="flex-shrink-0 w-48">
                                    <ServiceCard
                                        name={service.name}
                                        icon={service.icon}
                                        itemCount={0}
                                        onSelect={() => onSelectService(service)}
                                    />
                                 </div>
                            ))}
                        </div>
                        <button onClick={() => handleScroll('right')} className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <ChevronRight />
                        </button>
                    </div>
                </div>
            </section>
            
            {/* New Arrival Products */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">New Arrival Products</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {newArrivalProducts.map(product => (
                            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} onBookDemo={onBookDemo} />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                      <button onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">View All Products</button>
                    </div>
                </div>
            </section>

             {/* Featured IT Solutions */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured IT Solutions</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredITProducts.map(product => (
                            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} onBookDemo={onBookDemo} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Telco Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Telco Products & Services</h2>
                        <button onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="bg-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">View All Items</button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {telcoProducts.map(product => (
                            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} onBookDemo={onBookDemo} />
                        ))}
                    </div>
                </div>
            </section>

            <PromotionalBanner />
            
            {/* CTA Banners */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900">Pay-Per-Success AI Lead Generation</h3>
                        <p className="text-gray-600 mt-2">Join our marketplace and receive AI-qualified leads that are ready for engagement. You only pay a success fee when you close a deal, making it a risk-free channel for business growth.</p>
                        <button onClick={() => onNav(AppView.BECOME_VENDOR)} className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Become a Vendor</button>
                    </div>
                     <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900">Earn Up to 10% Commission</h3>
                        <p className="text-gray-600 mt-2">Monetize your professional network. Submit a qualified lead for any IT or software requirement you come across. If your lead results in a successful deal on our platform, you earn a commission.</p>
                        <button onClick={onPostRequirement} className="mt-6 bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors">Submit a Lead</button>
                    </div>
                </div>
            </section>

            {/* Support */}
            <section className="py-16">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop" alt="Support agent" className="w-20 h-20 rounded-full object-cover" />
                            <div className="ml-6">
                                <h3 className="text-2xl font-bold text-gray-900">Support 24/7</h3>
                                <p className="text-gray-600 mt-1">Wanna talk? Send us a message</p>
                            </div>
                        </div>
                        <button onClick={() => onNav(AppView.CONTACT)} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                           support@bantconfirm.com
                        </button>
                    </div>
                 </div>
            </section>

            <VendorLogos vendors={vendors} />

        </div>
    );
};

export default HomePage;