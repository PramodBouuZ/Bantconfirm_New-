

import React, { useState } from 'react';
import { User, RequirementListing, Vendor, Service, QualifiedLead, SiteConfig, Product, VendorApplication, ProductCategory, WhatsAppConfig, TeamMember, TeamRole } from '../../types';
import AdminStats from './AdminStats';
import AdminVendors from './AdminVendors';
import AdminUsers from './AdminUsers';
import { DashboardIcon } from '../icons/DashboardIcon';
import { ListingsIcon } from '../icons/ListingsIcon';
import { VendorsIcon } from '../icons/VendorsIcon';
import AdminServices from './AdminServices';
import { ServicesIcon } from '../icons/ServicesIcon';
import AdminSiteSettings from './AdminSiteSettings';
import { ProductsIcon } from '../icons/ProductsIcon';
import AdminProducts from './AdminProducts';
import AdminApplications from './AdminApplications';
import { ApplicationIcon } from '../icons/ApplicationIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { LeadIcon } from '../icons/LeadIcon';
import AdminCategories from './AdminCategories';
import AdminManageLeads from './AdminManageLeads';
import AdminTeam from './AdminTeam';
import { TeamIcon } from '../icons/TeamIcon';

type AdminView = 'stats' | 'applications' | 'leads' | 'products' | 'categories' | 'vendors' | 'users' | 'services' | 'team' | 'siteSettings';

interface AdminDashboardProps {
    user: TeamMember;
    stats: { users: number; vendors: number; listings: number; leads: number };
    listings: RequirementListing[];
    vendors: Vendor[];
    users: User[];
    services: Service[];
    leads: QualifiedLead[];
    siteConfig: SiteConfig;
    products: Product[];
    productCategories: ProductCategory[];
    vendorApplications: VendorApplication[];
    teamMembers: TeamMember[];
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
    onTestWhatsApp: (config: WhatsAppConfig) => Promise<{success: boolean, message: string}>;
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onAddCategory: (category: Omit<ProductCategory, 'id'>) => void;
    onUpdateCategory: (category: ProductCategory) => void;
    onDeleteCategory: (categoryId: number) => void;
    onAddTeamMember: (member: Omit<TeamMember, 'id'>) => void;
    onUpdateTeamMember: (member: TeamMember) => void;
    onDeleteTeamMember: (memberId: number) => void;
}

const HorizontalNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 whitespace-nowrap ${
                isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
        >
            <span className="mr-2">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { 
        user, stats, listings, vendors, users, services, leads, siteConfig, products, productCategories, vendorApplications, teamMembers,
        onDeleteListing, onAddListing, onUpdateListing, onValidateListing, onAssignVendorsToListing,
        onAddService, onUpdateService, onDeleteService, 
        onAddVendor, onUpdateVendor, onDeleteVendor,
        onAddUser, onUpdateUser, onDeleteUser,
        onAssignVendorsToLead, onUpdateSiteConfig, onTestWhatsApp,
        onAddProduct, onUpdateProduct, onDeleteProduct,
        onAddCategory, onUpdateCategory, onDeleteCategory,
        onAddTeamMember, onUpdateTeamMember, onDeleteTeamMember
    } = props;
    
    const [view, setView] = useState<AdminView>('leads');
    
    const isAdmin = user.role === TeamRole.Admin;

    const navItems: { view: AdminView; label: string; icon: React.ReactNode, adminOnly: boolean }[] = [
        { view: 'stats', label: 'Dashboard', icon: <DashboardIcon />, adminOnly: true },
        { view: 'leads', label: 'Leads', icon: <LeadIcon />, adminOnly: false },
        { view: 'applications', label: 'Applications', icon: <ApplicationIcon />, adminOnly: true },
        { view: 'products', label: 'Products', icon: <ProductsIcon />, adminOnly: true },
        { view: 'categories', label: 'Categories', icon: <ListingsIcon />, adminOnly: true },
        { view: 'vendors', label: 'Vendors', icon: <VendorsIcon />, adminOnly: true },
        { view: 'users', label: 'Users', icon: <UsersIcon />, adminOnly: true },
        { view: 'team', label: 'Team', icon: <TeamIcon />, adminOnly: true },
        { view: 'services', label: 'Services', icon: <ServicesIcon />, adminOnly: true },
        { view: 'siteSettings', label: 'Site Settings', icon: <SettingsIcon />, adminOnly: true },
    ];
    
    const availableNavItems = navItems.filter(item => isAdmin || !item.adminOnly);


    const renderView = () => {
        switch (view) {
            case 'stats':
                return isAdmin ? <AdminStats stats={stats} user={user as unknown as User} /> : null;
            case 'leads':
                 return <AdminManageLeads
                    qualifiedLeads={leads}
                    listings={listings}
                    vendors={vendors}
                    users={users}
                    onAssignLead={onAssignVendorsToLead}
                    onAssignListing={onAssignVendorsToListing}
                    onValidateListing={onValidateListing}
                    onAddListing={onAddListing}
                    onUpdateListing={onUpdateListing}
                    onDeleteListing={onDeleteListing}
                />;
            case 'vendors':
                return isAdmin ? <AdminVendors vendors={vendors} onAdd={onAddVendor} onUpdate={onUpdateVendor} onDelete={onDeleteVendor} /> : null;
            case 'users':
                return isAdmin ? <AdminUsers 
                            users={users} 
                            listings={listings}
                            onAdd={onAddUser}
                            onUpdate={onUpdateUser}
                            onDelete={onDeleteUser}
                        /> : null;
            case 'team':
                return isAdmin ? <AdminTeam teamMembers={teamMembers} onAdd={onAddTeamMember} onUpdate={onUpdateTeamMember} onDelete={onDeleteTeamMember} /> : null;
            case 'services':
                return isAdmin ? <AdminServices services={services} onAdd={onAddService} onUpdate={onUpdateService} onDelete={onDeleteService} /> : null;
            case 'siteSettings':
                return isAdmin ? <AdminSiteSettings siteConfig={siteConfig} onSave={onUpdateSiteConfig} onTestWhatsApp={onTestWhatsApp} /> : null;
            case 'products':
                return isAdmin ? <AdminProducts products={products} productCategories={productCategories} onAdd={onAddProduct} onUpdate={onUpdateProduct} onDelete={onDeleteProduct} /> : null;
            case 'categories':
                return isAdmin ? <AdminCategories categories={productCategories} products={products} onAdd={onAddCategory} onUpdate={onUpdateCategory} onDelete={onDeleteCategory} /> : null;
            case 'applications':
                return isAdmin ? <AdminApplications applications={vendorApplications} /> : null;
            default:
                return isAdmin ? <AdminStats stats={stats} user={user as unknown as User} /> : <AdminManageLeads {...props} />;
        }
    };

    return (
        <div>
            <div className="overflow-x-auto scrollbar-hide mb-6">
                <nav className="flex items-center space-x-1 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 w-max">
                    {availableNavItems.map(item => (
                       <HorizontalNavItem 
                            key={item.view}
                            icon={item.icon}
                            label={item.label}
                            isActive={view === item.view}
                            onClick={() => setView(item.view)}
                       />
                    ))}
                </nav>
            </div>
            <main>
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;