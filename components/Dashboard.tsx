
import React from 'react';
import { User, RequirementListing, StoredConversation, Product, PromotionalBannerData } from '../types';
import ListingCard from './ListingCard';
import ConversationHistory from './ConversationHistory';
import KeyPointsHighlight from './KeyPointsHighlight';
import ConfirmationBanner from './ConfirmationBanner';
import ProductCard from './ProductCard';
import PromotionalBannerDisplay from './PromotionalBannerDisplay';

interface DashboardProps {
    user: User;
    userListings: RequirementListing[];
    products: Product[];
    isMatching: boolean;
    onPostRequirement: () => void;
    savedConversation: StoredConversation | null;
    onContinueConversation: () => void;
    confirmationMessage: string | null;
    onClearConfirmation: () => void;
    onPostFromProduct: (product: Product) => void;
    promoBanner: PromotionalBannerData;
}

const Dashboard: React.FC<DashboardProps> = ({ user, userListings, products, isMatching, onPostRequirement, savedConversation, onContinueConversation, confirmationMessage, onClearConfirmation, onPostFromProduct, promoBanner }) => {
    const featuredProducts = products.slice(0, 4);
    
    return (
        <div>
            {/* Dashboard Header */}
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard, {user.name.split(' ')[0]}!</h1>
                    <p className="mt-1 text-gray-600">Here you can manage your requirements and explore the marketplace.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {confirmationMessage && (
                    <div className="mb-8">
                        <ConfirmationBanner message={confirmationMessage} onClose={onClearConfirmation} />
                    </div>
                )}

                <div className="mb-10">
                    <KeyPointsHighlight onPostRequirement={onPostRequirement} />
                </div>

                {/* Saved Conversation */}
                {savedConversation && (
                    <div className="mb-10">
                        <ConversationHistory
                            conversation={savedConversation}
                            onContinue={onContinueConversation}
                        />
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Requirements</h2>
                    <button
                        onClick={onPostRequirement}
                        className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                    >
                         <PlusIcon />
                        Post New Requirement
                    </button>
                </div>

                {isMatching && (
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-lg mb-6 flex items-center">
                         <div role="status" className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-3"></div>
                        <p className="font-semibold">Our AI is analyzing your latest requirement to find the best vendor matches...</p>
                    </div>
                )}
                
                {userListings.length > 0 ? (
                    <div className="space-y-6">
                        {userListings.map(listing => (
                            <ListingCard key={listing.id} {...listing} onPostNow={() => { console.log("Post from listing on dashboard is not implemented yet.")}} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800">No Requirements Posted Yet</h3>
                        <p className="text-gray-500 mt-2 mb-6">Post your first requirement to get automated vendor matches from our AI.</p>
                        <button
                            onClick={onPostRequirement}
                            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                        >
                            Post a Requirement
                        </button>
                    </div>
                )}

                <div className="my-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Promotion</h2>
                    <PromotionalBannerDisplay banner={promoBanner} />
                </div>

                 {/* New Section: Featured Products */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Explore Featured Products</h2>
                    </div>
                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onPostNow={onPostFromProduct} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">No Products in the Marketplace Yet</h3>
                            <p className="text-gray-500 mt-2">Check back later to see products added by our admin team.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export default Dashboard;
