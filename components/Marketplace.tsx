import React, { useState, useMemo } from 'react';
import { Service, Vendor } from '../types';
import VendorCard from './VendorCard';

interface MarketplaceProps {
  services: Service[];
  vendors: Vendor[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ services, vendors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPricingTiers, setSelectedPricingTiers] = useState<string[]>([]);

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handlePricingTierToggle = (tier: string) => {
    setSelectedPricingTiers(prev =>
        prev.includes(tier)
            ? prev.filter(t => t !== tier)
            : [...prev, tier]
    );
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesServices = selectedServices.length === 0 || vendor.specialties.some(s => selectedServices.includes(s));
      const matchesPricing = selectedPricingTiers.length === 0 || selectedPricingTiers.includes(vendor.pricingTier);
      
      return matchesSearch && matchesServices && matchesPricing;
    });
  }, [searchTerm, selectedServices, selectedPricingTiers, vendors]);
  
  const pricingTiers: Vendor['pricingTier'][] = ['SMB', 'Enterprise', 'Flexible'];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-xl shadow-lg border border-gray-200 self-start">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Filters</h2>
        <div className="space-y-6">
          {/* Search Filter */}
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">Search Vendor</label>
            <input
              type="text"
              id="search"
              placeholder="e.g. CloudNet"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Service Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Service Category</h3>
            <div className="space-y-2">
              {services.map(service => (
                <label key={service.name} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => handleServiceToggle(service.name)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-600">{service.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Pricing Tier Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Pricing Tier</h3>
            <div className="space-y-2">
                {pricingTiers.map(tier => (
                     <label key={tier} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedPricingTiers.includes(tier)}
                            onChange={() => handlePricingTierToggle(tier)}
                             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-600">{tier}</span>
                    </label>
                ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Vendors Grid */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredVendors.map(vendor => (
              <VendorCard key={vendor.name} {...vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">No Vendors Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters to find more results.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;