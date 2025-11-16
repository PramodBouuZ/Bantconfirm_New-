

import React, { useState, useEffect } from 'react';
import { RequirementListing, ListingCategory, User, BantStage, TeamMember } from '../../types';

interface ListingFormProps {
    listing: RequirementListing | null;
    currentUser: User | TeamMember;
    onSave: (details: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'> | RequirementListing) => void;
    onCancel: () => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ listing, currentUser, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ListingCategory>('Software');
    const [companyName, setCompanyName] = useState('');
    
    // BANT Fields
    const [budget, setBudget] = useState('');
    const [authority, setAuthority] = useState('');
    const [need, setNeed] = useState('');
    const [timeline, setTimeline] = useState('');

    const [error, setError] = useState('');
    
    const isEditing = listing !== null;

    useEffect(() => {
        if (listing) {
            setTitle(listing.title);
            setDescription(listing.description);
            setCategory(listing.category);
            setCompanyName(listing.companyName);
            setBudget(listing.bantData?.[BantStage.BUDGET] || '');
            setAuthority(listing.bantData?.[BantStage.AUTHORITY] || '');
            setNeed(listing.bantData?.[BantStage.NEED] || '');
            setTimeline(listing.bantData?.[BantStage.TIMELINE] || '');
        }
    }, [listing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Title and Description are required.');
            return;
        }
        setError('');

        const listingData = { 
            title: title.trim(), 
            description: description.trim(), 
            category, 
            companyName: companyName.trim(),
            bantData: {
                [BantStage.BUDGET]: budget,
                [BantStage.AUTHORITY]: authority,
                [BantStage.NEED]: need,
                [BantStage.TIMELINE]: timeline,
            }
        };

        if (isEditing) {
            onSave({
                ...listing,
                ...listingData,
            });
        } else {
            onSave({
                ...listingData,
                authorName: currentUser.name, // Assign current admin as author
            });
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Requirement' : 'Add New Requirement'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                         <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="Software">Software</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Service">Service</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"></textarea>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">BANT Data (Optional)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BantInput label="Budget" value={budget} onChange={setBudget} />
                            <BantInput label="Authority" value={authority} onChange={setAuthority} />
                            <BantInput label="Need" value={need} onChange={setNeed} />
                            <BantInput label="Timeline" value={timeline} onChange={setTimeline} />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Requirement</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BantInput: React.FC<{label: string; value: string; onChange: (v: string) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"/>
    </div>
);


export default ListingForm;