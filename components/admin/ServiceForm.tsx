import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { SERVICE_ICON_NAMES } from '../icons/serviceIcons';

interface ServiceFormProps {
    service: Service | null;
    onSave: (service: Service) => void;
    onCancel: () => void;
    existingNames: string[];
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel, existingNames }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(SERVICE_ICON_NAMES[0] || '');
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [keyBenefits, setKeyBenefits] = useState('');
    const [error, setError] = useState('');

    const isEditing = service !== null;

    useEffect(() => {
        if (service) {
            setName(service.name);
            setIcon(service.icon);
            setDescription(service.description);
            setDetailedDescription(service.detailedDescription);
            setKeyBenefits(service.keyBenefits.join('\n'));
        }
    }, [service]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !description.trim() || !detailedDescription.trim()) {
            setError('All fields except Key Benefits are required.');
            return;
        }
        
        if (!isEditing && existingNames.includes(name)) {
            setError('A service with this name already exists. Please choose a unique name.');
            return;
        }

        const benefitsArray = keyBenefits.split('\n').map(b => b.trim()).filter(b => b);
        
        onSave({
            name,
            icon,
            description,
            detailedDescription,
            keyBenefits: benefitsArray,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 disabled:bg-gray-100"
                            disabled={isEditing}
                            required
                        />
                         {isEditing && <p className="text-xs text-gray-500 mt-1">Service name cannot be changed.</p>}
                    </div>
                     <div>
                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                        <select
                            id="icon"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                        >
                            {SERVICE_ICON_NAMES.map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            placeholder="A brief summary for service cards"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                        <textarea
                            id="detailedDescription"
                            value={detailedDescription}
                            onChange={(e) => setDetailedDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            placeholder="A full description for the service detail page"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="keyBenefits" className="block text-sm font-medium text-gray-700 mb-1">Key Benefits</label>
                        <textarea
                            id="keyBenefits"
                            value={keyBenefits}
                            onChange={(e) => setKeyBenefits(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            placeholder="Enter one benefit per line"
                        />
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
                            Save Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;