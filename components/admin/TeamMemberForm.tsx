import React, { useState, useEffect } from 'react';
import { TeamMember, TeamRole } from '../../types';

interface TeamMemberFormProps {
    member: TeamMember | null;
    onSave: (member: TeamMember | Omit<TeamMember, 'id'>) => void;
    onCancel: () => void;
    existingEmails: string[];
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSave, onCancel, existingEmails }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<TeamRole>(TeamRole.LeadManager);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isEditing = member !== null;

    useEffect(() => {
        if (member) {
            setName(member.name);
            setEmail(member.email);
            setRole(member.role);
        }
    }, [member]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !email.trim()) {
            setError('Name and Email are required.');
            return;
        }
        if (!isEditing && !password.trim()) {
            setError('Password is required for new team members.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const isEmailTaken = existingEmails.some(
            existingEmail => existingEmail.toLowerCase() === email.trim().toLowerCase() && (isEditing ? member.email.toLowerCase() !== email.trim().toLowerCase() : true)
        );
        if (isEmailTaken) {
            setError('A user with this email already exists.');
            return;
        }

        const memberData = { name: name.trim(), email: email.trim(), role };

        if (isEditing) {
            onSave({ ...member, ...memberData });
        } else {
            onSave(memberData); // Password is not stored on the member object for this demo
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as TeamRole)} className="w-full px-4 py-2 border bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300">
                            {Object.values(TeamRole).map(roleValue => (
                                <option key={roleValue} value={roleValue}>{roleValue}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{isEditing ? 'New Password (optional)' : 'Password'}</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required={!isEditing} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Member</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamMemberForm;
