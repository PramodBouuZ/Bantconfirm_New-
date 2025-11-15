import React, { useState } from 'react';
import { findSolution } from '../services/geminiService';
import { AIRecommendation, Service, Vendor } from '../types';
import VendorCard from './VendorCard';
import { SERVICE_ICONS } from './icons/serviceIcons';

interface AISolutionFinderProps {
  onSelectService: (service: Service) => void;
  services: Service[];
  vendors: Vendor[];
}

const AISolutionFinder: React.FC<AISolutionFinderProps> = ({ onSelectService, services, vendors }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [error, setError] = useState('');

  const handleFindSolution = async () => {
    if (!query.trim()) {
      setError('Please describe your business need.');
      return;
    }
    setError('');
    setIsLoading(true);
    setRecommendation(null);
    const result = await findSolution(query, services, vendors);
    setRecommendation(result);
    setIsLoading(false);
  };
  
  const recommendedVendors = vendors.filter(v => recommendation?.suggestedVendors.includes(v.name));
  const recommendedService = services.find(s => s.name === recommendation?.suggestedService);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Solution Finder</h1>
        <p className="text-gray-600 mb-6">Describe your business challenge, and our AI will recommend the right solutions and vendors for you.</p>
        <form onSubmit={(e) => { e.preventDefault(); handleFindSolution(); }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'I need a CRM for my sales team'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'Analyzing...' : 'Find My Solution'}
            </button>
        </form>
      </div>

      {isLoading && <LoadingSpinner />}
      
      {recommendation && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Here are your AI-Powered Recommendations</h2>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-indigo-800">AI Analysis</h3>
                <p className="text-indigo-700 mt-1">{recommendation.summary}</p>
            </div>

            {recommendedService && (
                 <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4">Recommended Service</h3>
                    <div 
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center border border-gray-200 cursor-pointer"
                        onClick={() => onSelectService(recommendedService)}
                    >
                        <div className="flex justify-center items-center mb-4 text-indigo-600 h-12">
                            { (SERVICE_ICONS[recommendedService.icon] || null) && React.createElement(SERVICE_ICONS[recommendedService.icon]) }
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{recommendedService.name}</h3>
                        <p className="text-gray-600 text-sm">{recommendedService.description}</p>
                         <p className="text-indigo-600 font-semibold mt-4">Click to learn more &rarr;</p>
                    </div>
                </div>
            )}

            {recommendedVendors.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Recommended Vendors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedVendors.map(vendor => <VendorCard key={vendor.name} {...vendor} />)}
                    </div>
                </div>
            )}

            {recommendedVendors.length === 0 && !recommendedService && (
                <p className="text-center text-gray-500">The AI could not find a specific match. Please try rephrasing your request.</p>
            )}
        </div>
      )}
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
    <div className="text-center py-10">
        <div role="status" className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">AI is thinking...</p>
    </div>
);


export default AISolutionFinder;