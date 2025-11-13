import React, { useState, useEffect } from 'react';
import { RequirementListing, ListingCategory, Vendor } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { AssignIcon } from '../icons/AssignIcon';
import AssignVendorModal from './AssignVendorModal';

interface ListingFormProps {
    listing: RequirementListing | null;
    onSave: (listing: RequirementListing | Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => void;
    onCancel: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ listing, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ListingCategory>('Software');
    const [authorName, setAuthorName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');

    const isEditing = listing !== null;

    useEffect(() => {
        if (listing) {
            setTitle(listing.title);
            setDescription(listing.description);
            setCategory(listing.category);
            setAuthorName(listing.authorName);
            setCompanyName(listing.companyName);
        }
    }, [listing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !description.trim() || !authorName.trim()) {
            setError('Title, Description, and Author Name are required.');
            return;
        }

        const listingData = { title, description, category, authorName, companyName };

        if (isEditing) {
            onSave({ ...listing, ...listingData });
        } else {
            onSave(listingData);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Listing' : 'Add New Listing'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"></textarea>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)} className="w-full px-4 py-2 border bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300">
                            <option value="Software">Software</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Service">Service</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                            <input type="text" id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                         <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Listing</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface AdminListingsProps {
    listings: RequirementListing[];
    vendors: Vendor[];
    onDelete: (id: number) => void;
    onAdd: (listing: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => void;
    onUpdate: (listing: RequirementListing) => void;
    onValidate: (id: number) => void;
    onAssignVendors: (id: number, vendorNames: string[]) => void;
}

const AdminListings: React.FC<AdminListingsProps> = ({ listings, vendors, onDelete, onAdd, onUpdate, onValidate, onAssignVendors }) => {
    const [editingListing, setEditingListing] = useState<RequirementListing | 'new' | null>(null);
    const [assigningListing, setAssigningListing] = useState<RequirementListing | null>(null);
    
    const handleSave = (listingData: RequirementListing | Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => {
        if ('id' in listingData) {
            onUpdate(listingData);
        } else {
            onAdd(listingData);
        }
        setEditingListing(null);
    };

    const handleSaveAssignment = (listingId: number, vendorNames: string[]) => {
        onAssignVendors(listingId, vendorNames);
        setAssigningListing(null);
    };

    const statusColors: Record<RequirementListing['status'], string> = {
        'Pending Validation': 'bg-amber-100 text-amber-800',
        'Validated': 'bg-indigo-100 text-indigo-800',
        'Assigned': 'bg-green-100 text-green-800',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingListing && (
                <ListingForm 
                    listing={editingListing === 'new' ? null : editingListing}
                    onSave={handleSave}
                    onCancel={() => setEditingListing(null)}
                />
            )}
            {assigningListing && (
                <AssignVendorModal
                    listing={assigningListing}
                    vendors={vendors}
                    onClose={() => setAssigningListing(null)}
                    onSave={handleSaveAssignment}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
                 <button
                    onClick={() => setEditingListing('new')}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Listing
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {listings.map((listing) => (
                            <tr key={listing.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                                    <div className="text-sm text-gray-500">{listing.authorName} @ {listing.companyName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(listing.postedDate).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[listing.status]}`}>
                                        {listing.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                    {listing.assignedVendorNames.join(', ') || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                     {listing.status === 'Pending Validation' && (
                                        <button onClick={() => onValidate(listing.id)} className="text-green-600 hover:text-green-900 font-semibold">Validate</button>
                                     )}
                                     {(listing.status === 'Validated' || listing.status === 'Assigned') && (
                                        <button onClick={() => setAssigningListing(listing)} className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1">
                                            <AssignIcon /> {listing.status === 'Assigned' ? 'Re-assign' : 'Assign'}
                                        </button>
                                     )}
                                     <button 
                                        onClick={() => setEditingListing(listing)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"
                                        aria-label={`Edit listing titled ${listing.title}`}
                                     >
                                        <EditIcon />
                                     </button>
                                    <button 
                                        onClick={() => onDelete(listing.id)} 
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                        aria-label={`Delete listing titled ${listing.title}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {listings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No listings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminListings;