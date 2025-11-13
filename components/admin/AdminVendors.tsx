import React, { useState } from 'react';
import { Vendor } from '../../types';
import VendorForm from './VendorForm';
import { TrashIcon } from '../icons/TrashIcon';

interface AdminVendorsProps {
    vendors: Vendor[];
    onAdd: (vendor: Vendor) => void;
    onUpdate: (vendor: Vendor) => void;
    onDelete: (vendorName: string) => void;
}

const AdminVendors: React.FC<AdminVendorsProps> = ({ vendors, onAdd, onUpdate, onDelete }) => {
    const [editingVendor, setEditingVendor] = useState<Vendor | 'new' | null>(null);

    const handleSave = (vendor: Vendor) => {
        const isNew = !vendors.some(v => v.name === vendor.name);
        if (isNew) {
            onAdd(vendor);
        } else {
            onUpdate(vendor);
        }
        setEditingVendor(null);
    };

    const handleDelete = (vendorName: string) => {
        if (window.confirm(`Are you sure you want to delete the vendor "${vendorName}"?`)) {
            onDelete(vendorName);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingVendor && (
                <VendorForm
                    vendor={editingVendor === 'new' ? null : editingVendor}
                    onSave={handleSave}
                    onCancel={() => setEditingVendor(null)}
                    existingNames={vendors.map(v => v.name)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Vendors</h1>
                <button
                    onClick={() => setEditingVendor('new')}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Vendor
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing Tier</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.map((vendor) => (
                            <tr key={vendor.name} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-contain bg-gray-100 p-1" src={vendor.logoUrl} alt={`${vendor.name} logo`} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {vendor.specialties.map(spec => (
                                            <span key={spec} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.pricingTier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingVendor(vendor)}
                                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vendor.name)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                        aria-label={`Delete vendor ${vendor.name}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {vendors.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No vendors found. Click 'Add New Vendor' to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminVendors;