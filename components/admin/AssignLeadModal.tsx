import React, { useState, useMemo } from 'react';
import { QualifiedLead, Vendor, BantStage } from '../../types';

interface AssignLeadModalProps {
    lead: QualifiedLead;
    vendors: Vendor[];
    onClose: () => void;
    onSave: (leadId: number, vendorNames: string[]) => void;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({ lead, vendors, onClose, onSave }) => {
    const [selectedVendors, setSelectedVendors] = useState<string[]>(lead.assignedVendorNames || []);
    const [searchTerm, setSearchTerm] = useState('');

    const handleToggleVendor = (vendorName: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendorName)
                ? prev.filter(name => name !== vendorName)
                : [...prev, vendorName]
        );
    };

    const handleSave = () => {
        onSave(lead.id, selectedVendors);
    };

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vendors, searchTerm]);

    const bantItems = [
        { label: 'Budget', value: lead.bantData[BantStage.BUDGET] },
        { label: 'Authority', value: lead.bantData[BantStage.AUTHORITY] },
        { label: 'Need', value: lead.bantData[BantStage.NEED] },
        { label: 'Timeline', value: lead.bantData[BantStage.TIMELINE] },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign Lead to Vendors</h2>
                <p className="text-gray-600 mb-6">Lead from <span className="font-semibold text-gray-800">{lead.leadDetails.name}</span> for <span className="font-semibold text-gray-800">{lead.leadDetails.service}</span></p>

                {/* BANT Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">BANT Qualification Summary:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {bantItems.map(item => (
                             <div key={item.label}>
                                <p className="font-medium text-gray-500">{item.label}:</p>
                                <p className="text-gray-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
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

export default AssignLeadModal;