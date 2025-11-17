

import React, { useState, useRef, useEffect } from 'react';
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
    currentUser: TeamMember;
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
    onDeleteLead: (leadId: number) => void;
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

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { 
        currentUser, stats, listings, vendors, users, services, leads, siteConfig, products, productCategories, vendorApplications, teamMembers,
        onDeleteListing, onAddListing, onUpdateListing, onValidateListing, onAssignVendorsToListing,
        onAddService, onUpdateService, onDeleteService, 
        onAddVendor, onUpdateVendor, onDeleteVendor,
        onAddUser, onUpdateUser, onDeleteUser,
        onAssignVendorsToLead, onDeleteLead, onUpdateSiteConfig, onTestWhatsApp,
        onAddProduct, onUpdateProduct, onDeleteProduct,
        onAddCategory, onUpdateCategory, onDeleteCategory,
        onAddTeamMember, onUpdateTeamMember, onDeleteTeamMember
    } = props;
    
    const [view, setView] = useState<AdminView>(currentUser.role === TeamRole.Admin ? 'stats' : 'leads');
    const navContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    
    const isAdmin = currentUser.role === TeamRole.Admin;

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

    const checkScroll = () => {
        const container = navContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };
    
    useEffect(() => {
        const container = navContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener('scroll', checkScroll, { passive: true });
            
            const resizeObserver = new ResizeObserver(checkScroll);
            resizeObserver.observe(container);
            
            return () => {
                container.removeEventListener('scroll', checkScroll);
                resizeObserver.disconnect();
            };
        }
    }, [availableNavItems]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (navContainerRef.current) {
            const scrollAmount = direction === 'left' ? -250 : 250;
            navContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    const renderView = () => {
        switch (view) {
            case 'stats':
                return isAdmin ? <AdminStats stats={stats} user={currentUser} /> : null;
            case 'leads':
                 return <AdminManageLeads
                    qualifiedLeads={leads}
                    listings={listings}
                    vendors={vendors}
                    users={users}
                    currentUser={currentUser}
                    onAssignLead={onAssignVendorsToLead}
                    onDeleteLead={onDeleteLead}
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
                return isAdmin ? <AdminStats stats={stats} user={currentUser} /> : <AdminManageLeads {...props} />;
        }
    };

    return (
        <div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Welcome back, {currentUser.name}.</p>
            </div>
             <div className="relative group mb-6">
                {canScrollLeft && (
                    <button 
                        onClick={() => handleScroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                )}
                <div ref={navContainerRef} className="overflow-x-auto scrollbar-hide">
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
                {canScrollRight && (
                    <button 
                        onClick={() => handleScroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm p-1 rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                )}
            </div>
            <main>
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;
