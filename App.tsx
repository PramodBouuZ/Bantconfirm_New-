

import React, { useState, useEffect, useMemo } from 'react';
import { AppView, BantData, LeadDetails, Service, RequirementListing, User, StoredConversation, Notification, Vendor, QualifiedLead, Product, VendorApplication, StoredLeadPosterConversation, SiteConfig, AssignmentHistoryEntry } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LeadForm from './components/LeadForm';
import BantAssistant from './components/BantAssistant';
import LeadConfirmation from './components/LeadConfirmation';
import ServiceDetail from './components/ServiceDetail';
import AISolutionFinder from './components/AISolutionFinder';
import ListingsMarketplace from './components/ListingsMarketplace';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FAQPage from './components/FAQPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { VENDORS_DATA } from './data/vendors';
import { SERVICES_DATA } from './data/services';
import { LISTINGS } from './data/listings';
import { USERS } from './data/users';
import { LEADS_DATA } from './data/leads';
import { matchVendorsToListing, matchVendorsToLead } from './services/geminiService';
import ToastNotification from './components/ToastNotification';
import { PRODUCTS_DATA } from './data/products';
import BecomeAVendorPage from './components/BecomeAVendorPage';
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import BookDemoModal from './components/BookDemoModal';
import AILeadPoster from './components/AILeadPoster';
import ForgotPassword from './components/ForgotPassword';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [leadDetails, setLeadDetails] = useState<LeadDetails | null>(null);
  const [bantData, setBantData] = useState<BantData | null>(null);
  const [initialServiceForForm, setInitialServiceForForm] = useState<string | undefined>();
  const [isMatching, setIsMatching] = useState(false);
  const [savedConversation, setSavedConversation] = useState<StoredConversation | null>(null);
  const [savedLeadPosterConversation, setSavedLeadPosterConversation] = useState<StoredLeadPosterConversation | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [highlightedListingId, setHighlightedListingId] = useState<number | null>(null);
  const [isLeadMatching, setIsLeadMatching] = useState(false);
  const [lastMatchedVendors, setLastMatchedVendors] = useState<string[] | null>(null);

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

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const initialData: SiteConfig = {
      promoBanner: {
        isActive: true,
        image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop',
        title: 'Supercharge Your Business!',
        text: 'Discover our new Enterprise Solutions package. Get a free consultation today.',
        link: '#',
      },
      socialLinks: {
        linkedin: 'https://www.linkedin.com',
        instagram: 'https://www.instagram.com',
        facebook: 'https://www.facebook.com',
      }
    };
    try {
      const saved = localStorage.getItem('bant_site_config');
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error("Failed to load site config from localStorage", error);
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

  const productsWithLeadCounts = useMemo(() => {
    return products.map(product => {
        const leadCount = listings.filter(
            listing => listing.title.includes(product.name)
        ).length;
        return { ...product, sales: leadCount };
    });
  }, [products, listings]);


  useEffect(() => {
    try {
      // Load BANT assistant conversation
      const savedBantConv = localStorage.getItem('bant_conversation');
      if (savedBantConv) {
        const parsed = JSON.parse(savedBantConv) as StoredConversation;
        if (parsed.leadDetails && parsed.messages) {
          setSavedConversation(parsed);
        }
      }
      
      // Load Lead Poster conversation
      const savedLeadPosterConv = localStorage.getItem('bant_lead_poster_conversation');
      if (savedLeadPosterConv) {
        const parsed = JSON.parse(savedLeadPosterConv) as StoredLeadPosterConversation;
        if (parsed.messages && parsed.currentStage) {
          setSavedLeadPosterConversation(parsed);
        } else {
           setSavedLeadPosterConversation(null); // Clear invalid data
        }
      } else {
        setSavedLeadPosterConversation(null); // Clear if no data
      }

    } catch (error) {
      console.error("Failed to load a conversation from localStorage", error);
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
  useEffect(() => { try { localStorage.setItem('bant_site_config', JSON.stringify(siteConfig)); } catch (e) { console.error(e); } }, [siteConfig]);
  useEffect(() => { try { localStorage.setItem('bant_products', JSON.stringify(products)); } catch (e) { console.error(e); } }, [products]);
  useEffect(() => { try { localStorage.setItem('bant_vendor_applications', JSON.stringify(vendorApplications)); } catch (e) { console.error(e); } }, [vendorApplications]);


  const handleNav = (view: AppView) => {
    if (view === AppView.HOME) {
      setSelectedService(null);
      setSelectedProduct(null);
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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(AppView.PRODUCT_DETAIL);
  };

  const handleBookDemo = (product: Product) => {
    setBookingProduct(product);
  };

  const handleCloseBookDemo = () => {
    setBookingProduct(null);
  };

  const handleLeadSubmit = (details: LeadDetails) => {
    localStorage.removeItem('bant_conversation');
    setSavedConversation(null);
    setLeadDetails(details);
    setCurrentView(AppView.BANT_ASSISTANT);
  };

  const handleBantComplete = async (data: BantData) => {
    if (leadDetails) {
      const newLead: QualifiedLead = {
        id: qualifiedLeads.length > 0 ? Math.max(...qualifiedLeads.map(l => l.id)) + 1 : 1,
        leadDetails: leadDetails,
        bantData: data,
        qualifiedAt: new Date().toISOString(),
        status: 'New',
        assignedVendorNames: [],
        assignmentHistory: [],
      };
      
      setBantData(data);
      setCurrentView(AppView.CONFIRMATION);
      setIsLeadMatching(true);
      setLastMatchedVendors(null);
      
      setQualifiedLeads(prev => [newLead, ...prev]);

      // Trigger AI matching in the background
      const matchedVendorNames = await matchVendorsToLead(newLead, vendors);
      
      // Update the lead with AI matches
      setQualifiedLeads(prev => prev.map(l => {
        if (l.id === newLead.id) {
          const newHistoryEntry: AssignmentHistoryEntry = {
            assignedAt: new Date().toISOString(),
            vendorNames: matchedVendorNames,
          };
          return {
            ...l,
            status: 'Assigned',
            assignedVendorNames: matchedVendorNames,
            assignmentHistory: [newHistoryEntry],
          };
        }
        return l;
      }));
      
      setLastMatchedVendors(matchedVendorNames);
      setIsLeadMatching(false);
    }
    
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
  
  const handleContinueLeadPosterConversation = () => {
    if (savedLeadPosterConversation) {
      handleNav(AppView.AI_LEAD_POSTER);
    }
  };

  const handleRequirementPosted = async (newListingData: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => {
    localStorage.removeItem('bant_lead_poster_conversation');
    setSavedLeadPosterConversation(null);

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
    localStorage.removeItem('bant_lead_poster_conversation');
    setSavedLeadPosterConversation(null);
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

  const CLOUD_HERO_IMAGE = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2231&auto=format&fit=crop';

  const processVendorHeroImage = (vendor: Vendor): Vendor => {
    if (vendor.specialties.includes('Cloud Solutions')) {
        return { ...vendor, heroImageUrl: CLOUD_HERO_IMAGE };
    }
    return vendor;
  };

  const handleAddVendor = (vendor: Vendor) => {
    const processedVendor = processVendorHeroImage(vendor);
    setVendors(prev => [...prev, processedVendor]);
  };
  
  const handleUpdateVendor = (updatedVendor: Vendor) => {
    const processedVendor = processVendorHeroImage(updatedVendor);
    setVendors(prev => prev.map(v => v.name === processedVendor.name ? processedVendor : v));
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
    setQualifiedLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newHistoryEntry: AssignmentHistoryEntry = {
          assignedAt: new Date().toISOString(),
          vendorNames: vendorNames,
        };
        const updatedHistory = [...lead.assignmentHistory, newHistoryEntry];
        return {
          ...lead,
          status: 'Assigned',
          assignedVendorNames: vendorNames, // Keep this for current display logic
          assignmentHistory: updatedHistory,
        };
      }
      return lead;
    }));
  };

  const handleUpdateSiteConfig = (data: SiteConfig) => {
    setSiteConfig(data);
  };
  
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
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

    const PageWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </div>
    );

    switch (viewToRender) {
      case AppView.HOME:
        return <HomePage 
          services={services}
          products={productsWithLeadCounts}
          vendors={vendors}
          onGetQuote={handleGetQuote}
          onPostRequirement={() => handleNav(currentUser ? AppView.AI_LEAD_POSTER : AppView.SIGNUP)}
          onSelectProduct={handleSelectProduct}
          onBookDemo={handleBookDemo}
          onNav={handleNav}
        />;
      case AppView.DASHBOARD:
        if (!currentUser) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <PageWrapper><Dashboard 
          user={currentUser} 
          userListings={listings.filter(l => l.authorName === currentUser.name)}
          products={productsWithLeadCounts}
          isMatching={isMatching}
          onPostRequirement={() => handleNav(AppView.AI_LEAD_POSTER)}
          savedConversation={savedConversation}
          onContinueConversation={handleContinueConversation}
          savedLeadPosterConversation={savedLeadPosterConversation}
          onContinueLeadPosterConversation={handleContinueLeadPosterConversation}
          confirmationMessage={confirmationMessage}
          onClearConfirmation={() => setConfirmationMessage(null)}
          promoBanner={siteConfig.promoBanner}
          onSelectProduct={handleSelectProduct}
          onBookDemo={handleBookDemo}
        /></PageWrapper>
      case AppView.ADMIN_DASHBOARD:
         if (!currentUser || !currentUser.isAdmin) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <PageWrapper><AdminDashboard 
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
            siteConfig={siteConfig}
            products={productsWithLeadCounts}
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
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
        /></PageWrapper>
      case AppView.SERVICE_DETAIL: {
        if (!selectedService) {
          setCurrentView(homeView);
          return null;
        }
        const relevantVendors = vendors.filter(vendor => 
          vendor.specialties.includes(selectedService.name)
        );
        return <PageWrapper><ServiceDetail 
          service={selectedService} 
          vendors={relevantVendors}
          promoBanner={siteConfig.promoBanner}
          onBack={() => {
            setSelectedService(null);
            setCurrentView(homeView);
          }}
          onGetQuote={() => handleGetQuote(selectedService.name)}
        /></PageWrapper>;
      }
      case AppView.PRODUCT_DETAIL: {
        if (!selectedProduct) {
          setCurrentView(homeView);
          return null;
        }
        return <PageWrapper><ProductDetail 
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setCurrentView(AppView.LISTINGS_MARKETPLACE);
          }}
          onBookDemo={handleBookDemo}
          onPostRequirement={handlePostFromProduct}
        /></PageWrapper>
      }
      case AppView.LEAD_FORM:
        return <PageWrapper><LeadForm onSubmit={handleLeadSubmit} initialService={initialServiceForForm} services={services} /></PageWrapper>;
      case AppView.BANT_ASSISTANT:
        if (!leadDetails) {
          setCurrentView(AppView.LEAD_FORM);
          return null;
        }
        return <PageWrapper><BantAssistant leadDetails={leadDetails} onComplete={handleBantComplete} /></PageWrapper>;
      case AppView.CONFIRMATION:
        if (!bantData || !leadDetails) {
          setCurrentView(AppView.LEAD_FORM);
          return null;
        }
        return <PageWrapper><LeadConfirmation 
                 leadDetails={leadDetails} 
                 bantData={bantData} 
                 onStartOver={handleStartOver} 
                 isMatching={isLeadMatching}
                 matchedVendors={lastMatchedVendors}
               /></PageWrapper>;
      case AppView.AI_SOLUTION_FINDER:
        return <PageWrapper><AISolutionFinder onSelectService={handleSelectService} services={services} vendors={vendors} /></PageWrapper>;
      case AppView.LISTINGS_MARKETPLACE:
        return <PageWrapper><ListingsMarketplace 
                 products={productsWithLeadCounts} 
                 onPostRequirement={() => handleNav(currentUser ? AppView.AI_LEAD_POSTER : AppView.SIGNUP)} 
                 onSelectProduct={handleSelectProduct}
                 onBookDemo={handleBookDemo}
               /></PageWrapper>;
       case AppView.AI_LEAD_POSTER:
        if (!currentUser) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <PageWrapper><AILeadPoster onComplete={handleRequirementPosted} currentUser={currentUser} /></PageWrapper>;
      case AppView.ABOUT:
        return <PageWrapper><AboutPage /></PageWrapper>;
      case AppView.CONTACT:
        return <PageWrapper><ContactPage /></PageWrapper>;
      case AppView.FAQ:
        return <PageWrapper><FAQPage /></PageWrapper>;
      case AppView.LOGIN:
        return <PageWrapper><Login onLogin={handleLogin} onSwitchToSignup={() => handleNav(AppView.SIGNUP)} onForgotPassword={() => handleNav(AppView.FORGOT_PASSWORD)} users={users} /></PageWrapper>;
      case AppView.SIGNUP:
        return <PageWrapper><Signup onSignup={handleSignup} onSwitchToLogin={() => handleNav(AppView.LOGIN)} /></PageWrapper>;
      case AppView.FORGOT_PASSWORD:
        return <PageWrapper><ForgotPassword onBackToLogin={() => handleNav(AppView.LOGIN)} /></PageWrapper>;
      case AppView.BECOME_VENDOR:
        return <PageWrapper><BecomeAVendorPage onSubmit={handleVendorApplicationSubmit} /></PageWrapper>;
      default:
        setCurrentView(homeView);
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col text-gray-800" style={{fontFamily: "'Inter', sans-serif"}}>
      {toast && currentUser?.isAdmin && (
        <ToastNotification 
          notification={toast}
          onClose={() => setToast(null)}
        />
      )}
      {bookingProduct && (
        <BookDemoModal
          productName={bookingProduct.name}
          onClose={handleCloseBookDemo}
          onConfirm={(details) => {
            alert(`Demo booked for "${bookingProduct.name}" on ${details.date} at ${details.time}. (This is a demonstration)`);
            handleCloseBookDemo();
          }}
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
        {renderContent()}
      </main>
      <Footer onNav={handleNav} socialLinks={siteConfig.socialLinks} />
    </div>
  );
};

export default App;