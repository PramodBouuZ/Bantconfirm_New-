import React, { useState } from 'react';
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

    const getUserListings = (userName: string) => {
        return listings.filter(l => l.authorName === userName);
    };

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
        const headers = ['ID', 'Name', 'Email', 'Company', 'Mobile', 'Location', 'Role', 'Listings Count'];
        const csvRows = [headers.join(',')];

        users.forEach(user => {
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
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bantconfirm_users.csv';
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
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Listings</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
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
            </div>
        </div>
    );
};

export default AdminUsers;