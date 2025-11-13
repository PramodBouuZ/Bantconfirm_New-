import React, { useState } from 'react';
import { Service } from '../../types';
import ServiceForm from './ServiceForm';
import { TrashIcon } from '../icons/TrashIcon';
import { SERVICE_ICONS } from '../icons/serviceIcons';

interface AdminServicesProps {
    services: Service[];
    onAdd: (service: Service) => void;
    onUpdate: (service: Service) => void;
    onDelete: (serviceName: string) => void;
}

const AdminServices: React.FC<AdminServicesProps> = ({ services, onAdd, onUpdate, onDelete }) => {
    const [editingService, setEditingService] = useState<Service | 'new' | null>(null);

    const handleSave = (service: Service) => {
        const isNew = !services.some(s => s.name === service.name);
        if (isNew) {
            onAdd(service);
        } else {
            onUpdate(service);
        }
        setEditingService(null);
    };

    const handleDelete = (serviceName: string) => {
        if (window.confirm(`Are you sure you want to delete the service "${serviceName}"?`)) {
            onDelete(serviceName);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingService && (
                <ServiceForm 
                    service={editingService === 'new' ? null : editingService} 
                    onSave={handleSave} 
                    onCancel={() => setEditingService(null)} 
                    existingNames={services.map(s => s.name)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
                <button
                    onClick={() => setEditingService('new')}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Service
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map((service) => {
                            const IconComponent = SERVICE_ICONS[service.icon];
                            return (
                                <tr key={service.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-indigo-600">
                                        {IconComponent && <IconComponent />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 truncate max-w-sm">{service.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => setEditingService(service)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(service.name)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                            aria-label={`Delete service ${service.name}`}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {services.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No services found. Click 'Add New Service' to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminServices;