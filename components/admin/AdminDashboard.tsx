

import React, { useState } from 'react';
import { User, RequirementListing, Vendor, Service, QualifiedLead, SiteConfig, Product, VendorApplication } from '../../types';
import AdminStats from './AdminStats';
import AdminListings from './AdminListings';
import AdminVendors from './AdminVendors';
import AdminUsers from './AdminUsers';
import { DashboardIcon } from '../icons/DashboardIcon';
import { ListingsIcon } from '../icons/ListingsIcon';
import { VendorsIcon } from '../icons/VendorsIcon';
import { UsersIcon } from '../icons/UsersIcon';
import AdminServices from './AdminServices';
import { ServicesIcon } from '../icons/ServicesIcon';
import { LeadIcon } from '../icons/LeadIcon';
import AdminLeads from './AdminLeads';
import AdminSiteSettings from './AdminSiteSettings';
import { ProductsIcon } from '../icons/ProductsIcon';
import AdminProducts from './AdminProducts';
import AdminApplications from './AdminApplications';
import { ApplicationIcon } from '../icons/ApplicationIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { TrackerIcon } from '../icons/TrackerIcon';
import AdminLeadTracker from './AdminLeadTracker';

type AdminView = 'stats' | 'listings' | 'vendors' | 'users' | 'services' | 'leads' | 'siteSettings' | 'products' | 'applications' | 'leadTracker';

interface AdminDashboardProps {
    user: User;
    stats: { users: number; vendors: number; listings: number; leads: number };
    listings: RequirementListing[];
    vendors: Vendor[];
    users: User[];
    services: Service[];
    leads: QualifiedLead[];
    siteConfig: SiteConfig;
    products: Product[];
    vendorApplications: VendorApplication[];
    onDeleteListing: (id: number) => void;
    onAddListing: (listing: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => void;
    onUpdateListing: (listing: RequirementListing) => void;
    onValidateListing: (id: number) => void;
    onAssignVendorsToListing: (id: number, vendorNames: string[]) => void;
    onAddService: (service: Service) => void;
    onUpdateService: (service: Service) => void;
    onDeleteService: (serviceName: string) => void;
    onAddVendor: (vendor: Vendor) => void;
    onUpdateVendor: (vendor: Vendor) => void;
    onDeleteVendor: (vendorName: string) => void;
    onAddUser: (user: Omit<User, 'id'>) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: number) => void;
    onAssignVendorsToLead: (leadId: number, vendorNames: string[]) => void;
    onUpdateSiteConfig: (data: SiteConfig) => void;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { 
        user, stats, listings, vendors, users, services, leads, siteConfig, products, vendorApplications,
        onDeleteListing, onAddListing, onUpdateListing, onValidateListing, onAssignVendorsToListing,
        onAddService, onUpdateService, onDeleteService, 
        onAddVendor, onUpdateVendor, onDeleteVendor,
        onAddUser, onUpdateUser, onDeleteUser,
        onAssignVendorsToLead, onUpdateSiteConfig,
        onAddProduct, onUpdateProduct, onDeleteProduct,
    } = props;
    
    const [view, setView] = useState<AdminView>('stats');

    const renderView = () => {
        switch (view) {
            case 'stats':
                return <AdminStats stats={stats} user={user} />;
            case 'listings':
                return <AdminListings 
                            listings={listings} 
                            vendors={vendors}
                            onDelete={onDeleteListing} 
                            onAdd={onAddListing}
                            onUpdate={onUpdateListing}
                            onValidate={onValidateListing}
                            onAssignVendors={onAssignVendorsToListing}
                        />;
            case 'vendors':
                return <AdminVendors vendors={vendors} onAdd={onAddVendor} onUpdate={onUpdateVendor} onDelete={onDeleteVendor} />;
            case 'users':
                return <AdminUsers 
                            users={users} 
                            listings={listings}
                            onAdd={onAddUser}
                            onUpdate={onUpdateUser}
                            onDelete={onDeleteUser}
                        />;
            case 'services':
                return <AdminServices services={services} onAdd={onAddService} onUpdate={onUpdateService} onDelete={onDeleteService} />;
            case 'leads':
                return <AdminLeads leads={leads} vendors={vendors} onAssign={onAssignVendorsToLead} />;
            case 'leadTracker':
                return <AdminLeadTracker leads={leads} />;
            case 'siteSettings':
                return <AdminSiteSettings siteConfig={siteConfig} onSave={onUpdateSiteConfig} />;
            case 'products':
                return <AdminProducts products={products} onAdd={onAddProduct} onUpdate={onUpdateProduct} onDelete={onDeleteProduct} />;
            case 'applications':
                return <AdminApplications applications={vendorApplications} />;
            default:
                return <AdminStats stats={stats} user={user} />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-210px)]">
            <aside className="w-full md:w-1/4 lg:w-1/5 bg-white p-4 rounded-xl shadow-lg border border-gray-200 self-start">
                <nav className="flex flex-row md:flex-col gap-2">
                    <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={view === 'stats'} onClick={() => setView('stats')} />
                    <NavItem icon={<ApplicationIcon />} label="Applications" isActive={view === 'applications'} onClick={() => setView('applications')} />
                    <NavItem icon={<LeadIcon />} label="Leads" isActive={view === 'leads'} onClick={() => setView('leads')} />
                    <NavItem icon={<TrackerIcon />} label="Lead Tracker" isActive={view === 'leadTracker'} onClick={() => setView('leadTracker')} />
                    <NavItem icon={<ListingsIcon />} label="Listings" isActive={view === 'listings'} onClick={() => setView('listings')} />
                    <NavItem icon={<ProductsIcon />} label="Products" isActive={view === 'products'} onClick={() => setView('products')} />
                    <NavItem icon={<VendorsIcon />} label="Vendors" isActive={view === 'vendors'} onClick={() => setView('vendors')} />
                    <NavItem icon={<UsersIcon />} label="Users" isActive={view === 'users'} onClick={() => setView('users')} />
                    <NavItem icon={<ServicesIcon />} label="Services" isActive={view === 'services'} onClick={() => setView('services')} />
                    <NavItem icon={<SettingsIcon />} label="Site Settings" isActive={view === 'siteSettings'} onClick={() => setView('siteSettings')} />
                </nav>
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5">
                {renderView()}
            </main>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        {icon}
        <span className="ml-3 font-medium">{label}</span>
    </button>
);


export default AdminDashboard;