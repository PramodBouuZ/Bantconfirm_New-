import React, { useState, useMemo } from 'react';
import { RequirementListing, Vendor } from '../../types';

interface AssignVendorModalProps {
    listing: RequirementListing;
    vendors: Vendor[];
    onClose: () => void;
    onSave: (listingId: number, vendorNames: string[]) => void;
}

const AssignVendorModal: React.FC<AssignVendorModalProps> = ({ listing, vendors, onClose, onSave }) => {
    const [selectedVendors, setSelectedVendors] = useState<string[]>(listing.assignedVendorNames || []);
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleVendor = (vendorName: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendorName)
                ? prev.filter(name => name !== vendorName)
                : [...prev, vendorName]
        );
    };

    const handleSave = () => {
        onSave(listing.id, selectedVendors);
    };

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vendors, searchTerm]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign Vendors</h2>
                <p className="text-gray-600 mb-6">Select vendors for requirement: <span className="font-semibold text-gray-800">"{listing.title}"</span></p>
                
                <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 mb-4"
                />

                <div className="flex-grow overflow-y-auto border-t border-b border-gray-200 -mx-8 px-8 py-4">
                    <div className="space-y-3">
                        {filteredVendors.map(vendor => (
                            <label key={vendor.name} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedVendors.includes(vendor.name)}
                                    onChange={() => handleToggleVendor(vendor.name)}
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <img src={vendor.logoUrl} alt={vendor.name} className="h-8 w-8 object-contain rounded-full bg-gray-100 p-0.5" />
                                <span className="font-medium text-gray-700">{vendor.name}</span>
                            </label>
                        ))}
                         {filteredVendors.length === 0 && <p className="text-center text-gray-500 py-4">No vendors match your search.</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Assignment</button>
                </div>
            </div>
        </div>
    );
};

export default AssignVendorModal;