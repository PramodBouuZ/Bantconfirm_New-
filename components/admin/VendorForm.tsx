import React, { useState, useEffect } from 'react';
import { Vendor } from '../../types';

interface VendorFormProps {
    vendor: Vendor | null;
    onSave: (vendor: Vendor) => void;
    onCancel: () => void;
    existingNames: string[];
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSave, onCancel, existingNames }) => {
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [specialties, setSpecialties] = useState('');
    const [pricingTier, setPricingTier] = useState<Vendor['pricingTier']>('Flexible');
    const [error, setError] = useState('');

    const isEditing = vendor !== null;

    useEffect(() => {
        if (vendor) {
            setName(vendor.name);
            setLogoUrl(vendor.logoUrl);
            setHeroImageUrl(vendor.heroImageUrl);
            setDescription(vendor.description);
            setSpecialties(vendor.specialties.join(', '));
            setPricingTier(vendor.pricingTier);
        }
    }, [vendor]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !logoUrl.trim() || !heroImageUrl.trim() || !description.trim()) {
            setError('All fields except Specialties are required.');
            return;
        }

        if (!isEditing && existingNames.includes(name)) {
            setError('A vendor with this name already exists. Please choose a unique name.');
            return;
        }

        const specialtiesArray = specialties.split(',').map(s => s.trim()).filter(s => s);

        onSave({
            name: name.trim(),
            logoUrl: logoUrl.trim(),
            heroImageUrl: heroImageUrl.trim(),
            description: description.trim(),
            specialties: specialtiesArray,
            pricingTier,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 disabled:bg-gray-100"
                            disabled={isEditing}
                            required
                        />
                        {isEditing && <p className="text-xs text-gray-500 mt-1">Vendor name cannot be changed.</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageUploadField 
                            label="Logo Image" 
                            imageUrl={logoUrl} 
                            onFileChange={(e) => handleFileChange(e, setLogoUrl)}
                            id="logoUrl"
                        />
                        <ImageUploadField 
                            label="Hero Image" 
                            imageUrl={heroImageUrl} 
                            onFileChange={(e) => handleFileChange(e, setHeroImageUrl)}
                            id="heroImageUrl"
                        />
                    </div>
                  
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                        <input
                            type="text"
                            id="specialties"
                            value={specialties}
                            onChange={(e) => setSpecialties(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            placeholder="e.g., Cloud Solutions, Cybersecurity"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a comma-separated list of specialties.</p>
                    </div>
                    <div>
                        <label htmlFor="pricingTier" className="block text-sm font-medium text-gray-700 mb-1">Pricing Tier</label>
                        <select
                            id="pricingTier"
                            value={pricingTier}
                            onChange={(e) => setPricingTier(e.target.value as Vendor['pricingTier'])}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                        >
                            <option value="SMB">SMB</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface ImageUploadFieldProps {
    label: string;
    imageUrl: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, imageUrl, onFileChange, id }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1 flex items-center">
            <div className="flex-shrink-0 h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-400">Preview</span>
                )}
            </div>
            <label htmlFor={id} className="ml-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span>Change</span>
                <input id={id} name={id} type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
            </label>
        </div>
    </div>
);

export default VendorForm;