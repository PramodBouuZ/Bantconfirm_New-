import React, { useState } from 'react';
import { TeamMember, TeamRole } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import TeamMemberForm from './TeamMemberForm';
import { AdminIcon } from '../icons/AdminIcon';
import { LeadIcon } from '../icons/LeadIcon';

interface AdminTeamProps {
    teamMembers: TeamMember[];
    onAdd: (member: Omit<TeamMember, 'id'>) => void;
    onUpdate: (member: TeamMember) => void;
    onDelete: (memberId: number) => void;
}

const AdminTeam: React.FC<AdminTeamProps> = ({ teamMembers, onAdd, onUpdate, onDelete }) => {
    const [editingMember, setEditingMember] = useState<TeamMember | 'new' | null>(null);

    const handleSave = (memberData: TeamMember | Omit<TeamMember, 'id'>) => {
        if ('id' in memberData) {
            onUpdate(memberData);
        } else {
            onAdd(memberData);
        }
        setEditingMember(null);
    };

    const handleDelete = (member: TeamMember) => {
        if (window.confirm(`Are you sure you want to delete the team member "${member.name}"?`)) {
            onDelete(member.id);
        }
    };

    const roleIcons: Record<TeamRole, React.ReactNode> = {
        [TeamRole.Admin]: <AdminIcon />,
        [TeamRole.LeadManager]: <LeadIcon />,
    };
    
    const roleColors: Record<TeamRole, string> = {
        [TeamRole.Admin]: 'bg-amber-100 text-amber-800',
        [TeamRole.LeadManager]: 'bg-indigo-100 text-indigo-800',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingMember && (
                <TeamMemberForm
                    member={editingMember === 'new' ? null : editingMember}
                    onSave={handleSave}
                    onCancel={() => setEditingMember(null)}
                    existingEmails={teamMembers.map(m => m.email)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Team Members</h1>
                <button
                    onClick={() => setEditingMember('new')}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add Team Member
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teamMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${roleColors[member.role]}`}>
                                        {roleIcons[member.role]}
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => setEditingMember(member)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"><EditIcon /></button>
                                    <button onClick={() => handleDelete(member)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {teamMembers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No team members found. Click 'Add Team Member' to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTeam;
