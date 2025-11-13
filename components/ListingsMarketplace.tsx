

import React, { useState, useMemo, useEffect } from 'react';
import { RequirementListing, ListingCategory } from '../types';
import ListingCard from './ListingCard';

interface ListingsMarketplaceProps {
  listings: RequirementListing[];
  onPostRequirement: () => void;
  onPostFromListing: (listing: RequirementListing) => void;
  highlightedListingId?: number | null;
}

const ListingsMarketplace: React.FC<ListingsMarketplaceProps> = ({ listings, onPostRequirement, onPostFromListing, highlightedListingId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<ListingCategory[]>([]);
    
    const categories: ListingCategory[] = ['Software', 'Hardware', 'Service'];

    const handleCategoryToggle = (category: ListingCategory) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(listing.category);
            
            const matchesSearch = searchTerm.trim() === '' ||
                                  listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  listing.description.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [listings, selectedCategories, searchTerm]);
    
    useEffect(() => {
      if (highlightedListingId) {
        const element = document.getElementById(`listing-${highlightedListingId}`);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-4', 'ring-indigo-500', 'transition-all', 'duration-1000', 'ring-offset-2');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-indigo-500', 'ring-offset-2');
            }, 3000);
          }, 100); // Small delay to ensure render
        }
      }
    }, [highlightedListingId, filteredListings]);


    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900">Marketplace Listings</h1>
                <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">Browse requirements posted by other businesses. Find opportunities to sell your unused assets or services.</p>
                <button
                    onClick={onPostRequirement}
                    className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
                >
                    Post Your Requirement
                </button>
            </div>

             <div className="flex flex-col md:flex-row gap-8">
                {/* Filters */}
                <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-xl shadow-lg border border-gray-200 self-start">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Filters</h2>
                    <div className="space-y-6">
                         {/* Search Filter */}
                        <div>
                            <label htmlFor="listing-search" className="block text-sm font-semibold text-gray-700 mb-2">Search Listings</label>
                            <input
                                type="text"
                                id="listing-search"
                                placeholder="e.g. CRM, VoIP"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Category Filter */}
                        <div>
                             <h3 className="text-sm font-semibold text-gray-700 mb-2">Category</h3>
                            <div className="space-y-3">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-600">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                 {/* Listings Grid */}
                <main className="w-full md:w-3/4 lg:w-4/5">
                    {filteredListings.length > 0 ? (
                    <div className="space-y-6">
                        {filteredListings.map(listing => (
                        <ListingCard key={listing.id} {...listing} onPostNow={onPostFromListing} />
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800">No Listings Found</h3>
                        <p className="text-gray-500 mt-2">There are no listings matching your current filter selection.</p>
                    </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ListingsMarketplace;
