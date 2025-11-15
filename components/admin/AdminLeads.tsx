import React, { useState, useMemo } from 'react';
import { QualifiedLead, Vendor, LeadStatus, BantStage } from '../../types';
import { AssignIcon } from '../icons/AssignIcon';
import AssignLeadModal from './AssignLeadModal';
import { DownloadIcon } from '../icons/DownloadIcon';

interface AdminLeadsProps {
    leads: QualifiedLead[];
    vendors: Vendor[];
    onAssign: (leadId: number, vendorNames: string[]) => void;
}

const AdminLeads: React.FC<AdminLeadsProps> = ({ leads, vendors, onAssign }) => {
    const [assigningLead, setAssigningLead] = useState<QualifiedLead | null>(null);
    const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

            const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
            const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
            const leadDate = new Date(lead.qualifiedAt);

            if (start && leadDate < start) return false;
            if (end && leadDate > end) return false;

            return true;
        });
    }, [leads, statusFilter, startDate, endDate]);


    const handleSaveAssignment = (leadId: number, vendorNames: string[]) => {
        onAssign(leadId, vendorNames);
        setAssigningLead(null);
    };

    const toggleExpand = (leadId: number) => {
        setExpandedLeadId(prevId => (prevId === leadId ? null : leadId));
    };
    
    const handleExportCSV = () => {
        const headers = ['ID', 'Contact Name', 'Company', 'Email', 'Service', 'Qualified At', 'Status', 'Assigned Vendors', 'Budget', 'Authority', 'Need', 'Timeline'];
        const csvRows = [headers.join(',')];

        filteredLeads.forEach(l => {
            const row = [
                l.id,
                `"${l.leadDetails.name}"`,
                `"${l.leadDetails.company}"`,
                `"${l.leadDetails.email}"`,
                `"${l.leadDetails.service}"`,
                new Date(l.qualifiedAt).toISOString(),
                l.status,
                `"${l.assignedVendorNames.join(', ')}"`,
                `"${l.bantData.BUDGET.replace(/"/g, '""')}"`,
                `"${l.bantData.AUTHORITY.replace(/"/g, '""')}"`,
                `"${l.bantData.NEED.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                `"${l.bantData.TIMELINE.replace(/"/g, '""')}"`,
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bantconfirm_leads_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Qualified Leads</h1>
                 <button onClick={handleExportCSV} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <DownloadIcon />
                    <span className="ml-2">Export CSV</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Assigned">Assigned</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Qualified After</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Qualified Before</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"></th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualified At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeads.map((lead) => (
                            <React.Fragment key={lead.id}>
                                <tr onClick={() => toggleExpand(lead.id)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4">
                                        <ChevronDownIcon className={`transform transition-transform duration-200 ${expandedLeadId === lead.id ? 'rotate-180' : ''}`} />
                                    </td>
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
                                            onClick={(e) => { e.stopPropagation(); setAssigningLead(lead); }} 
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1"
                                        >
                                            <AssignIcon /> {lead.status === 'Assigned' ? 'Re-assign' : 'Assign'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedLeadId === lead.id && (
                                    <tr className="bg-indigo-50">
                                        <td colSpan={7} className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-800 mb-2">BANT Summary</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <InfoDetail label="Budget" value={lead.bantData[BantStage.BUDGET]} />
                                                        <InfoDetail label="Authority" value={lead.bantData[BantStage.AUTHORITY]} />
                                                        <InfoDetail label="Need" value={lead.bantData[BantStage.NEED]} />
                                                        <InfoDetail label="Timeline" value={lead.bantData[BantStage.TIMELINE]} />
                                                    </div>
                                                </div>
                                                 <div>
                                                    <h4 className="text-md font-semibold text-gray-800 mb-2">Assignment History</h4>
                                                    {lead.assignmentHistory && lead.assignmentHistory.length > 0 ? (
                                                        <ul className="space-y-2 text-sm">
                                                            {lead.assignmentHistory.map((entry, index) => (
                                                                <li key={index} className="p-2 bg-white rounded border">
                                                                    <p className="font-semibold text-gray-700">{new Date(entry.assignedAt).toLocaleString()}</p>
                                                                    <p className="text-gray-600">Assigned to: {entry.vendorNames.join(', ')}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No assignment history found.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                 {filteredLeads.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No qualified leads found matching the current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const InfoDetail: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <h5 className="font-semibold text-gray-500">{label}</h5>
        <p className="text-gray-800">{value}</p>
    </div>
);


export default AdminLeads;