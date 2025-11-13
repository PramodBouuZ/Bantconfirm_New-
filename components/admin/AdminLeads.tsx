import React, { useState } from 'react';
import { QualifiedLead, Vendor, LeadStatus } from '../../types';
import { AssignIcon } from '../icons/AssignIcon';
import AssignLeadModal from './AssignLeadModal';

interface AdminLeadsProps {
    leads: QualifiedLead[];
    vendors: Vendor[];
    onAssign: (leadId: number, vendorNames: string[]) => void;
}

const AdminLeads: React.FC<AdminLeadsProps> = ({ leads, vendors, onAssign }) => {
    const [assigningLead, setAssigningLead] = useState<QualifiedLead | null>(null);

    const handleSaveAssignment = (leadId: number, vendorNames: string[]) => {
        onAssign(leadId, vendorNames);
        setAssigningLead(null);
    };

    const statusColors: Record<LeadStatus, string> = {
        'New': 'bg-amber-100 text-amber-800',
        'Assigned': 'bg-green-100 text-green-800',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {assigningLead && (
                <AssignLeadModal
                    lead={assigningLead}
                    vendors={vendors}
                    onClose={() => setAssigningLead(null)}
                    onSave={handleSaveAssignment}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Qualified Leads</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualified At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{lead.leadDetails.name}</div>
                                    <div className="text-sm text-gray-500">{lead.leadDetails.company}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {lead.leadDetails.service}
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(lead.qualifiedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                    {lead.assignedVendorNames.join(', ') || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => setAssigningLead(lead)} 
                                        className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={lead.status === 'Assigned'}
                                    >
                                        <AssignIcon /> Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {leads.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No qualified leads found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLeads;