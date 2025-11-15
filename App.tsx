
import React, { useState, useEffect } from 'react';
import { AppView, BantData, LeadDetails, Service, RequirementListing, User, StoredConversation, Notification, Vendor, QualifiedLead, PromotionalBannerData, Product, VendorApplication } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceCard from './components/ServiceCard';
import LeadForm from './components/LeadForm';
import BantAssistant from './components/BantAssistant';
import LeadConfirmation from './components/LeadConfirmation';
import ServiceDetail from './components/ServiceDetail';
import Marketplace from './components/Marketplace';
import Hero from './components/Hero';
import AISolutionFinder from './components/AISolutionFinder';
import ListingsMarketplace from './components/ListingsMarketplace';
import PostRequirementForm from './components/PostRequirementForm';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FAQPage from './components/FAQPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import VendorLogos from './components/VendorLogos';
import { VENDORS_DATA } from './data/vendors';
import { SERVICES_DATA } from './data/services';
import { LISTINGS } from './data/listings';
import { USERS } from './data/users';
import { LEADS_DATA } from './data/leads';
import { matchVendorsToListing } from './services/geminiService';
import CommissionBanner from './components/CommissionBanner';
import ToastNotification from './components/ToastNotification';
import { PRODUCTS_DATA } from './data/products';
import ProductCatalog from './components/ProductCatalog';
import BecomeAVendorPage from './components/BecomeAVendorPage';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [leadDetails, setLeadDetails] = useState<LeadDetails | null>(null);
  const [bantData, setBantData] = useState<BantData | null>(null);
  const [initialServiceForForm, setInitialServiceForForm] = useState<string | undefined>();
  const [isMatching, setIsMatching] = useState(false);
  const [savedConversation, setSavedConversation] = useState<StoredConversation | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [highlightedListingId, setHighlightedListingId] = useState<number | null>(null);

  // --- Persisted State ---
  const [listings, setListings] = useState<RequirementListing[]>(() => {
    try {
      const saved = localStorage.getItem('bant_listings');
      return saved ? JSON.parse(saved) : LISTINGS;
    } catch (error) {
      console.error("Failed to load listings from localStorage", error);
      return LISTINGS;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('bant_users');
      return savedUsers ? JSON.parse(savedUsers) : USERS;
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
      return USERS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('bant_services');
      return saved ? JSON.parse(saved) : SERVICES_DATA;
    } catch (error) {
      console.error("Failed to load services from localStorage", error);
      return SERVICES_DATA;
    }
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem('bant_vendors');
      return saved ? JSON.parse(saved) : VENDORS_DATA;
    } catch (error) {
      console.error("Failed to load vendors from localStorage", error);
      return VENDORS_DATA;
    }
  });

  const [qualifiedLeads, setQualifiedLeads] = useState<QualifiedLead[]>(() => {
    try {
      const saved = localStorage.getItem('bant_qualified_leads');
      return saved ? JSON.parse(saved) : LEADS_DATA;
    } catch (error) {
      console.error("Failed to load qualified leads from localStorage", error);
      return LEADS_DATA;
    }
  });

  const [promoBanner, setPromoBanner] = useState<PromotionalBannerData>(() => {
    const initialData = {
      isActive: true,
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop',
      title: 'Supercharge Your Business!',
      text: 'Discover our new Enterprise Solutions package. Get a free consultation today.',
      link: '#',
    };
    try {
      const saved = localStorage.getItem('bant_promo_banner');
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error("Failed to load promo banner from localStorage", error);
      return initialData;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bant_products');
      return saved ? JSON.parse(saved) : PRODUCTS_DATA;
    } catch (error) {
      console.error("Failed to load products from localStorage", error);
      return PRODUCTS_DATA;
    }
  });
  
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>(() => {
    try {
      const saved = localStorage.getItem('bant_vendor_applications');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load vendor applications from localStorage", error);
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bant_conversation');
      if (saved) {
        const parsed = JSON.parse(saved) as StoredConversation;
        // Simple validation
        if (parsed.leadDetails && parsed.messages) {
          setSavedConversation(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load conversation from localStorage", error);
    }
  }, [currentView]); // Reload when view changes, e.g., after login.

  useEffect(() => {
    // Handle deep linking for shared listings on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const listingIdStr = urlParams.get('listing');
    if (listingIdStr) {
      const listingId = parseInt(listingIdStr, 10);
      const foundListing = listings.find(l => l.id === listingId);
      if (foundListing) {
        setHighlightedListingId(listingId);
        setCurrentView(AppView.LISTINGS_MARKETPLACE);
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [listings]);

  // --- Save state to localStorage on changes ---
  useEffect(() => { try { localStorage.setItem('bant_users', JSON.stringify(users)); } catch (e) { console.error(e); } }, [users]);
  useEffect(() => { try { localStorage.setItem('bant_listings', JSON.stringify(listings)); } catch (e) { console.error(e); } }, [listings]);
  useEffect(() => { try { localStorage.setItem('bant_services', JSON.stringify(services)); } catch (e) { console.error(e); } }, [services]);
  useEffect(() => { try { localStorage.setItem('bant_vendors', JSON.stringify(vendors)); } catch (e) { console.error(e); } }, [vendors]);
  useEffect(() => { try { localStorage.setItem('bant_qualified_leads', JSON.stringify(qualifiedLeads)); } catch (e) { console.error(e); } }, [qualifiedLeads]);
  useEffect(() => { try { localStorage.setItem('bant_promo_banner', JSON.stringify(promoBanner)); } catch (e) { console.error(e); } }, [promoBanner]);
  useEffect(() => { try { localStorage.setItem('bant_products', JSON.stringify(products)); } catch (e) { console.error(e); } }, [products]);
  useEffect(() => { try { localStorage.setItem('bant_vendor_applications', JSON.stringify(vendorApplications)); } catch (e) { console.error(e); } }, [vendorApplications]);


  const handleNav = (view: AppView) => {
    if (view === AppView.HOME) {
      setSelectedService(null);
    }
    setConfirmationMessage(null); // Clear confirmation on navigation
    setCurrentView(view);
  };

  const handleGetQuote = (serviceName?: string) => {
    setInitialServiceForForm(serviceName);
    setCurrentView(AppView.LEAD_FORM);
  };
  
  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentView(AppView.SERVICE_DETAIL);
  };

  const handleLeadSubmit = (details: LeadDetails) => {
    localStorage.removeItem('bant_conversation');
    setSavedConversation(null);
    setLeadDetails(details);
    setCurrentView(AppView.BANT_ASSISTANT);
  };

  const handleBantComplete = (data: BantData) => {
    if (leadDetails) {
        const newLead: QualifiedLead = {
            id: qualifiedLeads.length > 0 ? Math.max(...qualifiedLeads.map(l => l.id)) + 1 : 1,
            leadDetails: leadDetails,
            bantData: data,
            qualifiedAt: new Date().toISOString(),
            status: 'New',
            assignedVendorNames: [],
        };
        setQualifiedLeads(prev => [newLead, ...prev]);
    }

    setBantData(data);
    setCurrentView(AppView.CONFIRMATION);
    localStorage.removeItem('bant_conversation');
    setSavedConversation(null);
};

  const handleStartOver = () => {
    setLeadDetails(null);
    setBantData(null);
    setSelectedService(null);
    localStorage.removeItem('bant_conversation');
    setSavedConversation(null);
    setCurrentView(AppView.HOME);
  }

  const handleContinueConversation = () => {
    if (savedConversation) {
      setLeadDetails(savedConversation.leadDetails);
      setCurrentView(AppView.BANT_ASSISTANT);
    }
  };
  
  const handleRequirementPosted = async (newListingData: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => {
    const newListing: RequirementListing = {
      ...newListingData,
      id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
      postedDate: new Date().toISOString(),
      aiMatches: [],
      status: 'Pending Validation',
      assignedVendorNames: [],
    };
    
    // Add the listing immediately so the user sees it
    setListings(prev => [newListing, ...prev]);
     if (currentUser) {
      setConfirmationMessage(`Your requirement "${newListing.title}" has been posted successfully! A confirmation email has been sent to ${currentUser.email}.`);
    }

    // Create a notification for admins
    const newNotification: Notification = {
        id: Date.now(),
        message: `New requirement posted: "${newListing.title}"`,
        timestamp: new Date().toISOString(),
        read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep latest 10
    setToast(newNotification); // Trigger the on-screen toast

    setCurrentView(currentUser ? AppView.DASHBOARD : AppView.LISTINGS_MARKETPLACE);
    setIsMatching(true);

    // Trigger AI matching in the background
    const matches = await matchVendorsToListing(newListing, vendors);
    
    // Update the listing with AI matches
    setListings(prev => prev.map(l => l.id === newListing.id ? { ...l, aiMatches: matches } : l));
    setIsMatching(false);
  };
  
  const handleDeleteListing = (listingId: number) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
  };
  
  const handleAddListing = (listing: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => {
    const newListing: RequirementListing = {
      ...listing,
      id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
      postedDate: new Date().toISOString(),
      aiMatches: [],
      status: 'Pending Validation',
      assignedVendorNames: [],
    };
    setListings(prev => [newListing, ...prev]);
  };

  const handleUpdateListing = (updatedListing: RequirementListing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
  };
  
  const handleValidateListing = (listingId: number) => {
    setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, status: 'Validated' } : l
    ));
  };

  const handleAssignVendorsToListing = (listingId: number, vendorNames: string[]) => {
      setListings(prev => prev.map(l =>
          l.id === listingId ? { ...l, status: 'Assigned', assignedVendorNames: vendorNames } : l
      ));
  };


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView(user.isAdmin ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD);
  };

  const handleSignup = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1 };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setConfirmationMessage(`Welcome to BANTConfirm, ${newUser.name.split(' ')[0]}! A confirmation email has been sent to ${newUser.email}.`);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(AppView.HOME);
  };

  const handleAddService = (service: Service) => {
    setServices(prev => [...prev, service]);
  };
  
  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.name === updatedService.name ? updatedService : s));
  };
  
  const handleDeleteService = (serviceName: string) => {
    setServices(prev => prev.filter(s => s.name !== serviceName));
  };

  const handleAddVendor = (vendor: Vendor) => {
    setVendors(prev => [...prev, vendor]);
  };
  
  const handleUpdateVendor = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.name === updatedVendor.name ? updatedVendor : v));
  };
  
  const handleDeleteVendor = (vendorName: string) => {
    setVendors(prev => prev.filter(v => v.name !== vendorName));
  };
  
  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1 };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };


  const handleMarkNotificationsAsRead = () => {
    setNotifications(prevNotifications => 
        prevNotifications.map(n => n.read ? n : { ...n, read: true })
    );
  };

  const handleAssignVendorsToLead = (leadId: number, vendorNames: string[]) => {
    setQualifiedLeads(prev => prev.map(lead =>
      lead.id === leadId
        ? { ...lead, status: 'Assigned', assignedVendorNames: vendorNames }
        : lead
    ));
  };

  const handleUpdatePromoBanner = (data: PromotionalBannerData) => {
    setPromoBanner(data);
  };
  
  const handleAddProduct = (product: Product) => {
    setProducts(prev => [{...product, id: Date.now()}, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handlePostFromProduct = (product: Product) => {
    if (!currentUser) {
      handleNav(AppView.LOGIN);
      return;
    }
    
    const newListingData = {
      title: `Enquiry for: ${product.name}`,
      description: `This is an automated enquiry for the product "${product.name}".\n\nProduct Description: ${product.description}\n\nFeatures:\n- ${product.features.join('\n- ')}`,
      category: 'Service' as const,
      authorName: currentUser.name,
      companyName: currentUser.companyName || '',
    };

    handleRequirementPosted(newListingData);
  };

  const handlePostFromListing = (listing: RequirementListing) => {
    if (!currentUser) {
      handleNav(AppView.LOGIN);
      return;
    }
    
    const newListingData = {
      title: `(Copy) ${listing.title}`,
      description: listing.description,
      category: listing.category,
      authorName: currentUser.name,
      companyName: currentUser.companyName || '',
    };

    handleRequirementPosted(newListingData);
  };

  const handleVendorApplicationSubmit = (application: Omit<VendorApplication, 'id' | 'submittedAt'>) => {
    const newApplication: VendorApplication = {
      ...application,
      id: vendorApplications.length > 0 ? Math.max(...vendorApplications.map(a => a.id)) + 1 : 1,
      submittedAt: new Date().toISOString(),
    };
    setVendorApplications(prev => [newApplication, ...prev]);
  };

  const renderContent = () => {
    // Determine the effective home view
    const homeView = currentUser?.isAdmin ? AppView.ADMIN_DASHBOARD : currentUser ? AppView.DASHBOARD : AppView.HOME;

    let viewToRender = currentView;
    if (currentView === AppView.HOME && currentUser) {
      viewToRender = currentUser.isAdmin ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD;
    }

    switch (viewToRender) {
      case AppView.HOME:
        return <Home 
          services={services}
          vendors={vendors}
          products={products}
          onFindSolution={() => handleNav(AppView.AI_SOLUTION_FINDER)} 
          onPostRequirement={() => handleNav(currentUser ? AppView.POST_REQUIREMENT : AppView.SIGNUP)}
          onSelectService={handleSelectService}
          onPostNow={handlePostFromProduct}
        />;
      case AppView.DASHBOARD:
        if (!currentUser) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <Dashboard 
          user={currentUser} 
          userListings={listings.filter(l => l.authorName === currentUser.name)}
          allListings={listings}
          isMatching={isMatching}
          onPostRequirement={() => handleNav(AppView.POST_REQUIREMENT)}
          savedConversation={savedConversation}
          onContinueConversation={handleContinueConversation}
          confirmationMessage={confirmationMessage}
          onClearConfirmation={() => setConfirmationMessage(null)}
          onPostFromListing={handlePostFromListing}
        />
      case AppView.ADMIN_DASHBOARD:
         if (!currentUser || !currentUser.isAdmin) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <AdminDashboard 
            user={currentUser}
            stats={{
              users: users.length,
              vendors: vendors.length,
              listings: listings.length,
              leads: qualifiedLeads.length,
            }}
            listings={listings}
            vendors={vendors}
            users={users}
            services={services}
            leads={qualifiedLeads}
            promoBanner={promoBanner}
            products={products}
            vendorApplications={vendorApplications}
            onDeleteListing={handleDeleteListing}
            onAddListing={handleAddListing}
            onUpdateListing={handleUpdateListing}
            onValidateListing={handleValidateListing}
            onAssignVendorsToListing={handleAssignVendorsToListing}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onDeleteVendor={handleDeleteVendor}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onAssignVendorsToLead={handleAssignVendorsToLead}
            onUpdatePromoBanner={handleUpdatePromoBanner}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
        />
      case AppView.MARKETPLACE:
        return <Marketplace services={services} vendors={vendors} />;
      case AppView.SERVICE_DETAIL: {
        if (!selectedService) {
          setCurrentView(homeView);
          return null;
        }
        const relevantVendors = vendors.filter(vendor => 
          vendor.specialties.includes(selectedService.name)
        );
        return <ServiceDetail 
          service={selectedService} 
          vendors={relevantVendors}
          promoBanner={promoBanner}
          onBack={() => {
            setSelectedService(null);
            setCurrentView(homeView);
          }}
          onGetQuote={() => handleGetQuote(selectedService.name)}
        />;
      }
      case AppView.LEAD_FORM:
        return <LeadForm onSubmit={handleLeadSubmit} initialService={initialServiceForForm} services={services} />;
      case AppView.BANT_ASSISTANT:
        if (!leadDetails) {
          setCurrentView(AppView.LEAD_FORM);
          return null;
        }
        return <BantAssistant leadDetails={leadDetails} onComplete={handleBantComplete} />;
      case AppView.CONFIRMATION:
        if (!bantData || !leadDetails) {
          setCurrentView(AppView.LEAD_FORM);
          return null;
        }
        return <LeadConfirmation leadDetails={leadDetails} bantData={bantData} onStartOver={handleStartOver} />;
      case AppView.AI_SOLUTION_FINDER:
        return <AISolutionFinder onSelectService={handleSelectService} services={services} vendors={vendors} />;
      case AppView.LISTINGS_MARKETPLACE:
        return <ListingsMarketplace 
                 listings={listings} 
                 onPostRequirement={() => handleNav(currentUser ? AppView.POST_REQUIREMENT : AppView.SIGNUP)} 
                 onPostFromListing={handlePostFromListing}
                 highlightedListingId={highlightedListingId}
               />;
       case AppView.POST_REQUIREMENT:
        if (!currentUser) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <PostRequirementForm onPost={handleRequirementPosted} currentUser={currentUser} />;
      case AppView.ABOUT:
        return <AboutPage />;
      case AppView.CONTACT:
        return <ContactPage />;
      case AppView.FAQ:
        return <FAQPage />;
      case AppView.LOGIN:
        return <Login onLogin={handleLogin} onSwitchToSignup={() => handleNav(AppView.SIGNUP)} users={users} />;
      case AppView.SIGNUP:
        return <Signup onSignup={handleSignup} onSwitchToLogin={() => handleNav(AppView.LOGIN)} />;
      case AppView.BECOME_VENDOR:
        return <BecomeAVendorPage onSubmit={handleVendorApplicationSubmit} />;
      default:
        setCurrentView(homeView);
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-800">
      {toast && currentUser?.isAdmin && (
        <ToastNotification 
          notification={toast}
          onClose={() => setToast(null)}
        />
      )}
      <Header 
        onNav={handleNav} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        notifications={notifications}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
      />
      <main className="flex-grow">
        {(currentView === AppView.HOME || currentView === AppView.DASHBOARD) ? renderContent() : (
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
             {renderContent()}
           </div>
        )}
      </main>
      <Footer onNav={handleNav} />
    </div>
  );
};

interface HomeProps {
  services: Service[];
  vendors: Vendor[];
  products: Product[];
  onFindSolution: () => void;
  onPostRequirement: () => void;
  onSelectService: (service: Service) => void;
  onPostNow: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ services, vendors, products, onFindSolution, onPostRequirement, onSelectService, onPostNow }) => (
  <div>
    <Hero onPrimaryAction={onFindSolution} onSecondaryAction={onPostRequirement} />
    <CommissionBanner />
    <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Explore Top IT & Software Services</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Browse our curated categories to find the perfect solution for your business challenges.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service) => (
                <ServiceCard key={service.name} {...service} onSelect={() => onSelectService(service)} />
                ))}
            </div>
        </div>
    </section>
    <ProductCatalog products={products} onPostNow={onPostNow} />
    <VendorLogos vendors={vendors} />
  </div>
);

export default App;
