import React, { useMemo, useState } from 'react';
import { QualifiedLead, AssignmentHistoryEntry } from '../../types';
import { DownloadIcon } from '../icons/DownloadIcon';

interface FlattenedAssignment extends AssignmentHistoryEntry {
  leadId: number;
  contactName: string;
  companyName: string;
}

interface AdminLeadTrackerProps {
  leads: QualifiedLead[];
}

const AdminLeadTracker: React.FC<AdminLeadTrackerProps> = ({ leads }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const allAssignments = useMemo((): FlattenedAssignment[] => {
    const flattened: FlattenedAssignment[] = [];
    leads.forEach(lead => {
      lead.assignmentHistory.forEach(entry => {
        flattened.push({
          ...entry,
          leadId: lead.id,
          contactName: lead.leadDetails.name,
          companyName: lead.leadDetails.company,
        });
      });
    });
    // Sort by most recent first
    return flattened.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
  }, [leads]);

  const filteredAssignments = useMemo(() => {
    if (!startDate && !endDate) {
      return allAssignments;
    }
    return allAssignments.filter(assignment => {
      const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
      const assignmentDate = new Date(assignment.assignedAt);

      if (start && assignmentDate < start) return false;
      if (end && assignmentDate > end) return false;

      return true;
    });
  }, [allAssignments, startDate, endDate]);

  const handleExportCSV = () => {
    const headers = ['Assignment Date', 'Lead ID', 'Contact Name', 'Company', 'Assigned Vendors'];
    const csvRows = [headers.join(',')];

    filteredAssignments.forEach(a => {
      const row = [
        new Date(a.assignedAt).toISOString(),
        a.leadId,
        `"${a.contactName}"`,
        `"${a.companyName}"`,
        `"${a.vendorNames.join(', ')}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bantconfirm_assignment_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Lead Assignment Tracker</h1>
        <button onClick={handleExportCSV} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center">
          <DownloadIcon />
          <span className="ml-2">Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Assigned After</label>
          <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Assigned Before</label>
          <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Vendors</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.map((assignment, index) => (
              <tr key={`${assignment.leadId}-${assignment.assignedAt}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(assignment.assignedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{assignment.contactName}</div>
                  <div className="text-sm text-gray-500">Lead ID: {assignment.leadId} ({assignment.companyName})</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assignment.vendorNames.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No assignment history found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeadTracker;
