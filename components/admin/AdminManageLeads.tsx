



import React, { useState, useMemo } from 'react';
import { QualifiedLead, RequirementListing, Vendor, BantStage, User, TeamMember } from '../../types';
import { AssignIcon } from '../icons/AssignIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import AssignVendorModal from './AssignVendorModal';
import ListingForm from './ListingForm';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

// A unified type to handle both leads and listings
type ManagedLead = (QualifiedLead & { type: 'lead' }) | (RequirementListing & { type: 'listing' });

interface AdminManageLeadsProps {
    qualifiedLeads: QualifiedLead[];
    listings: RequirementListing[];
    vendors: Vendor[];
    users: User[];
    currentUser: TeamMember;
    onAssignLead: (leadId: number, vendorNames: string[]) => void;
    onDeleteLead: (leadId: number) => void;
    onAssignListing: (listingId: number, vendorNames: string[]) => void;
    onValidateListing: (listingId: number) => void;
    onDeleteListing: (listingId: number) => void;
    onUpdateListing: (listing: RequirementListing) => void;
    onAddListing: (listing: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => void;
}

const AdminManageLeads: React.FC<AdminManageLeadsProps> = (props) => {
    const { 
        qualifiedLeads, listings, vendors, users, currentUser,
        onAssignLead, onDeleteLead, onAssignListing, onValidateListing,
        onAddListing, onUpdateListing, onDeleteListing
    } = props;

    const [assigningItem, setAssigningItem] = useState<ManagedLead | null>(null);
    const [editingListing, setEditingListing] = useState<RequirementListing | 'new' | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const combinedLeads = useMemo((): ManagedLead[] => {
        const qLeads: ManagedLead[] = qualifiedLeads.map(l => ({ ...l, type: 'lead' }));
        const reqListings: ManagedLead[] = listings.map(l => ({ ...l, type: 'listing' }));
        const all = [...qLeads, ...reqListings];
        return all.sort((a, b) => {
            const dateA = new Date(a.type === 'lead' ? a.qualifiedAt : a.postedDate);
            const dateB = new Date(b.type === 'lead' ? b.qualifiedAt : b.postedDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [qualifiedLeads, listings]);

    const filteredLeads = useMemo(() => {
        return combinedLeads.filter(item => {
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;
            
            const itemDate = new Date(item.type === 'lead' ? item.qualifiedAt : item.postedDate);
            const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
            const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

            if (start && itemDate < start) return false;
            if (end && itemDate > end) return false;

            if (searchTerm.trim()) {
                const lowerSearchTerm = searchTerm.toLowerCase();
                let contactDetails;
                if (item.type === 'lead') {
                    contactDetails = {
                        name: item.leadDetails.name,
                        company: item.leadDetails.company,
                        email: item.leadDetails.email,
                    };
                } else {
                    const user = users.find(u => u.name === item.authorName);
                    contactDetails = {
                        name: item.authorName,
                        company: item.companyName,
                        email: user?.email || '',
                    };
                }
    
                const match = (
                    contactDetails.name.toLowerCase().includes(lowerSearchTerm) ||
                    contactDetails.company.toLowerCase().includes(lowerSearchTerm) ||
                    contactDetails.email.toLowerCase().includes(lowerSearchTerm)
                );
                if (!match) return false;
            }

            return true;
        });
    }, [combinedLeads, statusFilter, startDate, endDate, searchTerm, users]);

    const handleSaveAssignment = (itemId: number, itemType: 'lead' | 'listing', vendorNames: string[]) => {
        if (itemType === 'lead') {
            onAssignLead(itemId, vendorNames);
        } else {
            onAssignListing(itemId, vendorNames);
        }
        setAssigningItem(null);
    };

    const handleSaveListing = (listingData: RequirementListing | Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => {
        if ('id' in listingData) {
            onUpdateListing(listingData);
        } else {
            onAddListing(listingData);
        }
        setEditingListing(null);
    };

    const toggleExpand = (item: ManagedLead) => {
        const itemId = `${item.type}-${item.id}`;
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Type', 'Contact Name', 'Contact Email', 'Contact Mobile', 'Company', 'Service/Title', 'Date', 'Status', 'Assigned Vendors', 'Budget', 'Authority', 'Need', 'Timeline', 'Description'];
        const csvRows = [headers.join(',')];
        filteredLeads.forEach(item => {
            let contactUser;
            if (item.type === 'listing') {
                contactUser = users.find(u => u.name === item.authorName);
            }

            const row = [
                item.id,
                item.type,
                item.type === 'lead' ? `"${item.leadDetails.name}"` : `"${item.authorName}"`,
                item.type === 'lead' ? `"${item.leadDetails.email}"` : `"${contactUser?.email || ''}"`,
                item.type === 'lead' ? `"${item.leadDetails.mobile || ''}"` : `"${contactUser?.mobile || ''}"`,
                item.type === 'lead' ? `"${item.leadDetails.company}"` : `"${item.companyName}"`,
                item.type === 'lead' ? `"${item.leadDetails.service}"` : `"${item.title.replace(/"/g, '""')}"`,
                new Date(item.type === 'lead' ? item.qualifiedAt : item.postedDate).toISOString(),
                item.status,
                `"${item.assignedVendorNames.join(', ')}"`,
                `"${(item.bantData?.BUDGET || '').replace(/"/g, '""')}"`,
                `"${(item.bantData?.AUTHORITY || '').replace(/"/g, '""')}"`,
                `"${(item.bantData?.NEED || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                `"${(item.bantData?.TIMELINE || '').replace(/"/g, '""')}"`,
                item.type === 'listing' ? `"${item.description.replace(/"/g, '""').replace(/\n/g, ' ')}"` : 'N/A'
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bantconfirm_all_leads_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const statusColors: Record<string, string> = {
        'New': 'bg-amber-100 text-amber-800',
        'Pending Validation': 'bg-amber-100 text-amber-800',
        'Validated': 'bg-indigo-100 text-indigo-800',
        'Assigned': 'bg-green-100 text-green-800',
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {assigningItem && (
                 <AssignVendorModal
                    listing={assigningItem as any} // Simplified for modal reuse
                    vendors={vendors}
                    onClose={() => setAssigningItem(null)}
                    onSave={(id, vendorNames) => handleSaveAssignment(id, assigningItem.type, vendorNames)}
                />
            )}
            {editingListing && (
                <ListingForm
                    listing={editingListing === 'new' ? null : editingListing}
                    currentUser={currentUser}
                    onSave={handleSaveListing}
                    onCancel={() => setEditingListing(null)}
                />
            )}
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Leads &amp; Requirements</h1>
                 <div className="flex gap-2">
                    <button onClick={handleExportCSV} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                        <DownloadIcon />
                        <span className="ml-2">Export CSV</span>
                    </button>
                    <button onClick={() => setEditingListing('new')} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                        Add Requirement
                    </button>
                 </div>
            </div>

            {/* Filters */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                    <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        id="search-filter"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Name, company, email..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">All Statuses</option>
                        <option value="New">New (Qualified)</option>
                        <option value="Pending Validation">Pending Validation</option>
                        <option value="Validated">Validated</option>
                        <option value="Assigned">Assigned</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Date After</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Date Before</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="w-10 px-6 py-3"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service / Requirement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Assignment</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeads.map((item) => {
                            let contactDetails = { name: '', company: '', email: '', mobile: '' };
                            if (item.type === 'lead') {
                                contactDetails = {
                                    name: item.leadDetails.name,
                                    company: item.leadDetails.company,
                                    email: item.leadDetails.email,
                                    mobile: item.leadDetails.mobile || 'N/A',
                                };
                            } else {
                                const user = users.find(u => u.name === item.authorName);
                                contactDetails = {
                                    name: item.authorName,
                                    company: item.companyName,
                                    email: user?.email || 'N/A',
                                    mobile: user?.mobile || 'N/A',
                                };
                            }
                            const history = item.assignmentHistory || [];
                            const lastAssignment = history.length > 0 ? history[history.length - 1] : null;

                            return (
                                <React.Fragment key={`${item.type}-${item.id}`}>
                                    <tr onClick={() => toggleExpand(item)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4"><ChevronDownIcon className={`transform transition-transform duration-200 ${expandedItemId === `${item.type}-${item.id}` ? 'rotate-180' : ''}`} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{contactDetails.name}</div>
                                            <div className="text-sm text-gray-500">{contactDetails.company}</div>
                                            <div className="text-sm text-gray-500">{contactDetails.email}</div>
                                            <div className="text-sm text-gray-500">{contactDetails.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate" title={item.type === 'lead' ? item.leadDetails.service : item.title}>
                                            {item.type === 'lead' ? item.leadDetails.service : item.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.type === 'lead' ? item.qualifiedAt : item.postedDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.status]}`}>{item.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {lastAssignment ? (
                                                <div>
                                                    <div>{new Date(lastAssignment.assignedAt).toLocaleDateString()}</div>
                                                    <div className="text-gray-400 text-xs truncate" title={lastAssignment.vendorNames.join(', ')}>{lastAssignment.vendorNames.join(', ')}</div>
                                                </div>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                             {item.type === 'listing' && (
                                                <>
                                                    {item.status === 'Pending Validation' && (
                                                        <button onClick={(e) => { e.stopPropagation(); onValidateListing(item.id); }} className="text-green-600 hover:text-green-900 font-semibold">Validate</button>
                                                    )}
                                                    <button onClick={(e) => { e.stopPropagation(); setEditingListing(item); }} className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100"><EditIcon /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); onDeleteListing(item.id); }} className="p-1 rounded-full text-red-600 hover:bg-red-100"><TrashIcon /></button>
                                                </>
                                            )}
                                             {item.type === 'lead' && (
                                                 <button onClick={(e) => { e.stopPropagation(); onDeleteLead(item.id); }} className="p-1 rounded-full text-red-600 hover:bg-red-100"><TrashIcon /></button>
                                             )}
                                            <button onClick={(e) => { e.stopPropagation(); setAssigningItem(item); }} className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1">
                                                <AssignIcon /> {item.status === 'Assigned' ? 'Re-assign' : 'Assign'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedItemId === `${item.type}-${item.id}` && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={7} className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-md font-semibold text-gray-800 mb-2">{item.type === 'lead' ? 'BANT Summary' : 'Requirement Details'}</h4>
                                                        <div className="space-y-2 text-sm">
                                                            {item.bantData ? (
                                                                <>
                                                                    <InfoDetail label="Budget" value={item.bantData[BantStage.BUDGET]} />
                                                                    <InfoDetail label="Authority" value={item.bantData[BantStage.AUTHORITY]} />
                                                                    <InfoDetail label="Need" value={item.bantData[BantStage.NEED]} />
                                                                    <InfoDetail label="Timeline" value={item.bantData[BantStage.TIMELINE]} />
                                                                </>
                                                            ) : null}
                                                            {item.type === 'listing' && (
                                                                <p className="text-gray-800 whitespace-pre-wrap pt-2">{item.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-md font-semibold text-gray-800 mb-2">Assignment History</h4>
                                                        {(item.assignmentHistory?.length || 0) > 0 ? (
                                                             <ul className="space-y-2 text-sm">
                                                                {item.assignmentHistory?.map((entry, index) => (
                                                                    <li key={index} className="p-2 bg-white rounded border">
                                                                        <p className="font-semibold text-gray-700">{new Date(entry.assignedAt).toLocaleString()}</p>
                                                                        <p className="text-gray-600">Assigned to: {entry.vendorNames.join(', ')}</p>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (<p className="text-sm text-gray-500">No assignment history found.</p>)}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                     </tbody>
                </table>
                {filteredLeads.length === 0 && <div className="text-center py-12 text-gray-500"><p>No items found matching the current filters.</p></div>}
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
        <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
);

export default AdminManageLeads;