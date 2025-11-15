import React, { useState, useMemo } from 'react';
import { User, RequirementListing } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { DownloadIcon } from '../icons/DownloadIcon';
import UserForm from './UserForm';
import UserListingsModal from './UserListingsModal';

interface AdminUsersProps {
    users: User[];
    listings: RequirementListing[];
    onAdd: (user: Omit<User, 'id'>) => void;
    onUpdate: (user: User) => void;
    onDelete: (userId: number) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, listings, onAdd, onUpdate, onDelete }) => {
    const [editingUser, setEditingUser] = useState<User | 'new' | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const getUserListings = (userName: string) => {
        return listings.filter(l => l.authorName === userName);
    };

    const usersWithActivity = useMemo(() => {
        return users.map(user => {
            const userListings = listings.filter(l => l.authorName === user.name);
            if (userListings.length === 0) {
                return { ...user, lastActivity: null };
            }
            // Find the most recent postedDate
            const latestListing = userListings.reduce((latest, current) => {
                return new Date(latest.postedDate) > new Date(current.postedDate) ? latest : current;
            });
            return { ...user, lastActivity: new Date(latestListing.postedDate) };
        });
    }, [users, listings]);

    const filteredUsers = useMemo(() => {
        return usersWithActivity.filter(user => {
            // Role filter
            if (roleFilter === 'admin' && !user.isAdmin) return false;
            if (roleFilter === 'user' && user.isAdmin) return false;

            // Date filter - Robustly handle date parsing to avoid timezone issues.
            const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
            const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

            // If a date range is set, users without activity should be filtered out
            if ((start || end) && !user.lastActivity) return false;

            if (start && user.lastActivity && user.lastActivity < start) return false;
            if (end && user.lastActivity && user.lastActivity > end) return false;

            return true;
        });
    }, [usersWithActivity, roleFilter, startDate, endDate]);


    const handleSave = (user: User | Omit<User, 'id'>) => {
        if ('id' in user) {
            onUpdate(user);
        } else {
            onAdd(user);
        }
        setEditingUser(null);
    };

    const handleDelete = (user: User) => {
        if (window.confirm(`Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`)) {
            onDelete(user.id);
        }
    };
    
    const handleExportCSV = () => {
        const headers = ['ID', 'Name', 'Email', 'Company', 'Mobile', 'Location', 'Role', 'Listings Count', 'Last Activity'];
        const csvRows = [headers.join(',')];

        filteredUsers.forEach(user => {
            const userListings = getUserListings(user.name);
            const row = [
                user.id,
                `"${user.name}"`,
                `"${user.email}"`,
                `"${user.companyName || ''}"`,
                `"${user.mobile || ''}"`,
                `"${user.location || ''}"`,
                user.isAdmin ? 'Admin' : 'User',
                userListings.length,
                `"${user.lastActivity ? user.lastActivity.toISOString() : 'N/A'}"`,
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bantconfirm_users_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingUser && (
                <UserForm
                    user={editingUser === 'new' ? null : editingUser}
                    onSave={handleSave}
                    onCancel={() => setEditingUser(null)}
                    existingEmails={users.map(u => u.email)}
                />
            )}
            {viewingUser && (
                <UserListingsModal
                    user={viewingUser}
                    listings={getUserListings(viewingUser.name)}
                    onClose={() => setViewingUser(null)}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                 <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                        <DownloadIcon />
                        <span className="ml-2">Export to CSV</span>
                    </button>
                    <button
                        onClick={() => setEditingUser('new')}
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Add New User
                    </button>
                 </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
                    <select id="role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Activity After</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Activity Before</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Listings</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => {
                            const userListingsCount = getUserListings(user.name).length;
                            return (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.companyName || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                        <div className="text-sm text-gray-500">{user.mobile || 'No mobile'} | {user.location || 'No location'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.isAdmin ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">Admin</span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.lastActivity ? user.lastActivity.toLocaleString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button 
                                            onClick={() => setViewingUser(user)}
                                            className="font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            disabled={userListingsCount === 0}
                                        >
                                            {userListingsCount}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"><EditIcon /></button>
                                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No users found matching the current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;