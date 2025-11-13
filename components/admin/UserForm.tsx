import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface UserFormProps {
    user: User | null;
    onSave: (user: User | Omit<User, 'id'>) => void;
    onCancel: () => void;
    existingEmails: string[];
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, existingEmails }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [mobile, setMobile] = useState('');
    const [location, setLocation] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');

    const isEditing = user !== null;

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setCompanyName(user.companyName || '');
            setMobile(user.mobile || '');
            setLocation(user.location || '');
            setIsAdmin(user.isAdmin || false);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim()) {
            setError('Name and Email are required fields.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!isEditing && existingEmails.includes(email)) {
            setError('A user with this email already exists.');
            return;
        }

        const userData = {
            name: name.trim(),
            email: email.trim(),
            companyName: companyName.trim(),
            mobile: mobile.trim(),
            location: location.trim(),
            isAdmin,
        };

        if (isEditing) {
            onSave({ ...userData, id: user.id });
        } else {
            onSave(userData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 disabled:bg-gray-100" disabled={isEditing} />
                        {isEditing && <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>}
                    </div>
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                            <input type="tel" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm font-medium text-gray-700">Make Administrator</span>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;