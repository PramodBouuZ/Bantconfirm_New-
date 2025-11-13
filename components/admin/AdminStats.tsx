import React from 'react';
import { User } from '../../types';
import { UsersIcon } from '../icons/UsersIcon';
import { VendorsIcon } from '../icons/VendorsIcon';
import { ListingsIcon } from '../icons/ListingsIcon';
import { LeadIcon } from '../icons/LeadIcon';


interface AdminStatsProps {
    stats: { users: number; vendors: number; listings: number; leads: number };
    user: User;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats, user }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome back, {user.name}. Here's a snapshot of the BANTConfirm platform.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Qualified Leads" 
                    value={stats.leads} 
                    icon={<LeadIcon />} 
                    color="purple" 
                />
                <StatCard 
                    title="Total Listings" 
                    value={stats.listings} 
                    icon={<ListingsIcon />} 
                    color="amber" 
                />
                <StatCard 
                    title="Total Users" 
                    value={stats.users} 
                    icon={<UsersIcon />} 
                    color="indigo" 
                />
                <StatCard 
                    title="Total Vendors" 
                    value={stats.vendors} 
                    icon={<VendorsIcon />} 
                    color="green" 
                />
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'indigo' | 'green' | 'amber' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600',
        green: 'bg-green-100 text-green-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default AdminStats;