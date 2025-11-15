

import React, { useState } from 'react';
import { User, RequirementListing, Vendor, Service, QualifiedLead, SiteConfig, Product, VendorApplication } from '../../types';
import AdminStats from './AdminStats';
import AdminListings from './AdminListings';
import AdminVendors from './AdminVendors';
import AdminUsers from './AdminUsers';
import { DashboardIcon } from '../icons/DashboardIcon';
import { ListingsIcon } from '../icons/ListingsIcon';
import { VendorsIcon } from '../icons/VendorsIcon';
import { UserIcon } from '../icons/UserIcon';
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
// FIX: Imported the missing UsersIcon component.
import { UsersIcon } from '../icons/UsersIcon';

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

const HorizontalNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const iconIsDiv = React.isValidElement(icon) && icon.type === 'div';

    return (
        <button
            onClick={onClick}
            className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap ${
                isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <span className={`mr-2 ${iconIsDiv ? 'flex items-center justify-center w-5 h-5' : ''}`}>
              {icon}
            </span>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
};


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
    
    const [view, setView] = useState<AdminView>('leadTracker');

    const navItems: { view: AdminView; label: string; icon: React.ReactNode }[] = [
        { view: 'stats', label: 'Dashboard', icon: <DashboardIcon /> },
        { view: 'applications', label: 'Applications', icon: <ApplicationIcon /> },
        { view: 'leads', label: 'Leads', icon: <UserIcon /> },
        { view: 'leadTracker', label: 'Lead Tracker', icon: <TrackerIcon /> },
        { view: 'listings', label: 'Listings', icon: <ListingsIcon /> },
        { view: 'products', label: 'Products', icon: <ProductsIcon /> },
        { view: 'vendors', label: 'Vendors', icon: <VendorsIcon /> },
        { view: 'users', label: 'Users', icon: <UsersIcon /> },
        { view: 'services', label: 'Services', icon: <ServicesIcon /> },
        { view: 'siteSettings', label: 'Site Settings', icon: <SettingsIcon /> },
    ];


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
        <div>
            <div className="overflow-x-auto scrollbar-hide mb-6">
                <nav className="flex items-center space-x-1 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 w-max">
                    {navItems.map(item => {
                        const isActive = view === item.view;
                        let icon = item.icon;
                        // Special icon for active Lead Tracker per screenshot
                        if (item.view === 'leadTracker' && isActive) {
                            icon = <div className="w-2 h-2 bg-white rounded-sm" />;
                        }

                        return (
                           <HorizontalNavItem 
                                key={item.view}
                                icon={icon}
                                label={item.label}
                                isActive={isActive}
                                onClick={() => setView(item.view)}
                           />
                        )
                    })}
                </nav>
            </div>
            <main>
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;