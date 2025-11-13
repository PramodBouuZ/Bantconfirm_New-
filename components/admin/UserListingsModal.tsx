
import React from 'react';
import { User, RequirementListing } from '../../types';

interface UserListingsModalProps {
    user: User;
    listings: RequirementListing[];
    onClose: () => void;
}

const UserListingsModal: React.FC<UserListingsModalProps> = ({ user, listings, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">Listings by {user.name}</h2>
                    <p className="text-sm text-gray-500 mb-6">From company: {user.companyName || 'N/A'}</p>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    {listings.length > 0 ? (
                        <div className="space-y-4">
                            {listings.map(listing => (
                                <div key={listing.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-bold text-gray-800">{listing.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">Posted on: {listing.postedDate}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">This user has not posted any listings.</p>
                    )}
                </div>

                <div className="flex-shrink-0 pt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserListingsModal;
