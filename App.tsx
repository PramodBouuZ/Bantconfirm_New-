
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, BantData, LeadDetails, Service, RequirementListing, User, StoredConversation, Notification, Vendor, QualifiedLead, Product, VendorApplication, StoredLeadPosterConversation, SiteConfig, AssignmentHistoryEntry, ProductCategory, WhatsAppConfig, TeamMember, TeamRole } from './types';
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
import { TEAM_DATA } from './data/team';
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
import { CATEGORIES_DATA } from './data/categories';
import { whatsAppService } from './services/whatsappService';


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
  const [initialMarketplaceSearch, setInitialMarketplaceSearch] = useState<string | null>(null);


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
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('bant_team');
      return saved ? JSON.parse(saved) : TEAM_DATA;
    } catch (error) {
      console.error("Failed to load team from localStorage", error);
      return TEAM_DATA;
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
      },
      logo: '',
      favicon: '',
      whatsappConfig: {
        enabled: false,
        apiEndpoint: '',
        apiKey: '',
        adminMobile: '',
      }
    };
    try {
      const saved = localStorage.getItem('bant_site_config');
      const parsed = saved ? JSON.parse(saved) : {};
      return { ...initialData, ...parsed }; // Merge to ensure new keys exist
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

  const [productCategories, setProductCategories] = useState<ProductCategory[]>(() => {
    try {
      const saved = localStorage.getItem('bant_product_categories');
      return saved ? JSON.parse(saved) : CATEGORIES_DATA;
    } catch (error) {
      console.error("Failed to load product categories from localStorage", error);
      return CATEGORIES_DATA;
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
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember | null>(null);

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

  // Clear initial search term when navigating away from marketplace
  useEffect(() => {
    if (currentView !== AppView.LISTINGS_MARKETPLACE) {
      setInitialMarketplaceSearch(null);
    }
  }, [currentView]);
  
  // Update favicon dynamically
  useEffect(() => {
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon && siteConfig.favicon) {
      favicon.href = siteConfig.favicon;
    }
  }, [siteConfig.favicon]);

  // --- Save state to localStorage on changes ---
  useEffect(() => { try { localStorage.setItem('bant_users', JSON.stringify(users)); } catch (e) { console.error(e); } }, [users]);
  useEffect(() => { try { localStorage.setItem('bant_team', JSON.stringify(teamMembers)); } catch (e) { console.error(e); } }, [teamMembers]);
  useEffect(() => { try { localStorage.setItem('bant_listings', JSON.stringify(listings)); } catch (e) { console.error(e); } }, [listings]);
  useEffect(() => { try { localStorage.setItem('bant_services', JSON.stringify(services)); } catch (e) { console.error(e); } }, [services]);
  useEffect(() => { try { localStorage.setItem('bant_vendors', JSON.stringify(vendors)); } catch (e) { console.error(e); } }, [vendors]);
  useEffect(() => { try { localStorage.setItem('bant_qualified_leads', JSON.stringify(qualifiedLeads)); } catch (e) { console.error(e); } }, [qualifiedLeads]);
  useEffect(() => { try { localStorage.setItem('bant_site_config', JSON.stringify(siteConfig)); } catch (e) { console.error(e); } }, [siteConfig]);
  useEffect(() => { try { localStorage.setItem('bant_products', JSON.stringify(products)); } catch (e) { console.error(e); } }, [products]);
  useEffect(() => { try { localStorage.setItem('bant_product_categories', JSON.stringify(productCategories)); } catch (e) { console.error(e); } }, [productCategories]);
  useEffect(() => { try { localStorage.setItem('bant_vendor_applications', JSON.stringify(vendorApplications)); } catch (e) { console.error(e); } }, [vendorApplications]);

  const handleSendWhatsApp = async (recipient: string, message: string) => {
    if (siteConfig.whatsappConfig?.enabled && recipient) {
        try {
            await whatsAppService.sendMessage(siteConfig.whatsappConfig, recipient, message);
        } catch (error) {
            console.error("Failed to send WhatsApp message:", error);
        }
    }
  };

  const handleTestWhatsApp = async (config: WhatsAppConfig): Promise<{success: boolean, message: string}> => {
    if (!config.adminMobile) {
        return { success: false, message: "Admin mobile number is not set." };
    }
    return await whatsAppService.sendMessage(config, config.adminMobile, "This is a test message from BANTConfirm.");
  };

  const handleNav = (view: AppView) => {
    if (view === AppView.HOME) {
      setSelectedService(null);
      setSelectedProduct(null);
    }
    setConfirmationMessage(null); // Clear confirmation on navigation
    setCurrentView(view);
  };

  const handleMarketplaceSearch = (term: string) => {
    setInitialMarketplaceSearch(term);
    handleNav(AppView.LISTINGS_MARKETPLACE);
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

      handleSendWhatsApp(
        siteConfig.whatsappConfig?.adminMobile || '',
        `New AI-qualified lead from ${newLead.leadDetails.name} for service: "${newLead.leadDetails.service}".`
      );

      // Trigger AI matching in the background
      try {
        const matchedVendorNames = await matchVendorsToLead(newLead, vendors);
        
        // Update the lead with AI matches
        setQualifiedLeads(prev => prev.map(l => {
          if (l.id === newLead.id) {
            const newHistoryEntry: AssignmentHistoryEntry = {
              assignedAt: new Date().toISOString(),
              vendorNames: matchedVendorNames,
            };
            handleAssignVendorsToLead(newLead.id, matchedVendorNames); // Use the handler to also send notifications
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
      } catch (error) {
        console.error("Failed to match vendors for lead:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setToast({
            id: Date.now(),
            message: `AI vendor matching failed: ${errorMessage}`,
            timestamp: new Date().toISOString(),
            read: false,
        });
        setLastMatchedVendors([]); // Indicate failure with empty array
      } finally {
        setIsLeadMatching(false);
      }
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
      assignmentHistory: [],
    };
    
    setListings(prev => [newListing, ...prev]);
     if (currentUser) {
      setConfirmationMessage(`Your requirement "${newListing.title}" has been posted successfully! A confirmation email has been sent to ${currentUser.email}.`);
    }

    const newNotification: Notification = {
        id: Date.now(),
        message: `New requirement posted: "${newListing.title}"`,
        timestamp: new Date().toISOString(),
        read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep latest 10
    setToast(newNotification); // Trigger the on-screen toast

    handleSendWhatsApp(
      siteConfig.whatsappConfig?.adminMobile || '', 
      `New requirement posted by ${newListing.authorName}: "${newListing.title}"`
    );

    setCurrentView(currentUser ? AppView.DASHBOARD : AppView.LISTINGS_MARKETPLACE);
    setIsMatching(true);

    try {
      const matches = await matchVendorsToListing(newListing, vendors);
      setListings(prev => prev.map(l => l.id === newListing.id ? { ...l, aiMatches: matches } : l));
    } catch (error) {
        console.error("Failed to match vendors for listing:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setToast({
            id: Date.now(),
            message: `AI vendor matching failed: ${errorMessage}`,
            timestamp: new Date().toISOString(),
            read: false,
        });
        // Still update the listing but with empty matches to indicate failure
        setListings(prev => prev.map(l => l.id === newListing.id ? { ...l, aiMatches: [] } : l));
    } finally {
        setIsMatching(false);
    }
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
      assignmentHistory: [],
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
      const listing = listings.find(l => l.id === listingId);
      if (!listing) return;

      setListings(prev => prev.map(l => {
          if (l.id === listingId) {
            const newHistoryEntry: AssignmentHistoryEntry = {
                assignedAt: new Date().toISOString(),
                vendorNames: vendorNames,
            };
            const updatedHistory = [...(l.assignmentHistory || []), newHistoryEntry];
            return { 
                ...l, 
                status: 'Assigned', 
                assignedVendorNames: vendorNames,
                assignmentHistory: updatedHistory,
            };
          }
          return l;
      }));

      const user = users.find(u => u.name === listing.authorName);
      if (user?.mobile) {
        handleSendWhatsApp(user.mobile, `Your requirement "${listing.title}" has been assigned to vendors. They will be in touch shortly.`);
      }
      vendorNames.forEach(name => {
        const vendor = vendors.find(v => v.name === name);
        if (vendor?.mobile) {
            handleSendWhatsApp(vendor.mobile, `New requirement assigned: "${listing.title}". Please review and connect with the customer.`);
        }
      });
      handleSendWhatsApp(siteConfig.whatsappConfig?.adminMobile || '', `Requirement "${listing.title}" assigned to: ${vendorNames.join(', ')}`);
  };


  const handleLogin = (user: User | TeamMember) => {
    if ('role' in user) { // It's a TeamMember
      setCurrentTeamMember(user);
      setCurrentUser(null);
      setCurrentView(AppView.ADMIN_DASHBOARD);
    } else { // It's a User
      setCurrentUser(user);
      setCurrentTeamMember(null);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleSignup = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1 };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setConfirmationMessage(`Welcome to BANTConfirm, ${newUser.name.split(' ')[0]}! A confirmation email has been sent to ${newUser.email}.`);
    setCurrentView(AppView.DASHBOARD);
    if (newUser.mobile) {
        handleSendWhatsApp(newUser.mobile, `Welcome to BANTConfirm, ${newUser.name.split(' ')[0]}! We're glad to have you.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTeamMember(null);
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

  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = { ...member, id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1 };
    setTeamMembers(prev => [...prev, newMember]);
  };
  
  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };
  
  const handleDeleteTeamMember = (memberId: number) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };


  const handleMarkNotificationsAsRead = () => {
    setNotifications(prevNotifications => 
        prevNotifications.map(n => n.read ? n : { ...n, read: true })
    );
  };

  const handleAssignVendorsToLead = (leadId: number, vendorNames: string[]) => {
    const lead = qualifiedLeads.find(l => l.id === leadId);
    if (!lead) return;

    setQualifiedLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newHistoryEntry: AssignmentHistoryEntry = {
          assignedAt: new Date().toISOString(),
          vendorNames: vendorNames,
        };
        const updatedHistory = [...(l.assignmentHistory || []), newHistoryEntry];
        return {
          ...l,
          status: 'Assigned',
          assignedVendorNames: vendorNames,
          assignmentHistory: updatedHistory,
        };
      }
      return l;
    }));

    vendorNames.forEach(name => {
        const vendor = vendors.find(v => v.name === name);
        if (vendor?.mobile) {
            handleSendWhatsApp(vendor.mobile, `New qualified lead assigned for "${lead.leadDetails.service}". Contact: ${lead.leadDetails.name}, ${lead.leadDetails.company}.`);
        }
    });
    handleSendWhatsApp(siteConfig.whatsappConfig?.adminMobile || '', `Lead for "${lead.leadDetails.service}" assigned to: ${vendorNames.join(', ')}`);
  };
  
  const handleDeleteQualifiedLead = (leadId: number) => {
    setQualifiedLeads(prev => prev.filter(l => l.id !== leadId));
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

  const handleAddCategory = (category: Omit<ProductCategory, 'id'>) => {
    setProductCategories(prev => [...prev, { ...category, id: Date.now() }]);
  };
  
  const handleUpdateCategory = (updatedCategory: ProductCategory) => {
      const oldCategoryName = productCategories.find(c => c.id === updatedCategory.id)?.name;
      setProductCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      if(oldCategoryName && oldCategoryName !== updatedCategory.name) {
        setProducts(prev => prev.map(p => p.category === oldCategoryName ? { ...p, category: updatedCategory.name } : p));
      }
  };
  
  const handleDeleteCategory = (categoryId: number) => {
      const categoryToDelete = productCategories.find(c => c.id === categoryId);
      if (!categoryToDelete) return;

      const isCategoryInUse = products.some(p => p.category === categoryToDelete.name);
      if(isCategoryInUse) {
        alert('Cannot delete category as it is currently in use by one or more products.');
        return;
      }
      setProductCategories(prev => prev.filter(c => c.id !== categoryId));
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
    const isLoggedIn = currentUser || currentTeamMember;

    let viewToRender = currentView;
    // This logic handles redirection for logged-in users trying to access the homepage.
    if (currentView === AppView.HOME && isLoggedIn) {
      viewToRender = currentTeamMember ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD;
    }

    const PageWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </div>
    );

    const loggedInUser = currentUser || currentTeamMember;

    switch (viewToRender) {
      case AppView.HOME:
        return <HomePage 
          services={services}
          products={productsWithLeadCounts}
          vendors={vendors}
          onGetQuote={handleGetQuote}
          onPostRequirement={() => handleNav(currentUser ? AppView.AI_LEAD_POSTER : AppView.SIGNUP)}
          onSelectProduct={handleSelectProduct}
          onSelectService={handleSelectService}
          onBookDemo={handleBookDemo}
          onNav={handleNav}
          onSearch={handleMarketplaceSearch}
          currentUser={loggedInUser}
        />;
      case AppView.DASHBOARD:
        if (!currentUser) {
          // User is not authenticated, render the Login component instead of causing a side-effect.
          return <PageWrapper><Login onLogin={handleLogin} onSwitchToSignup={() => handleNav(AppView.SIGNUP)} onForgotPassword={() => handleNav(AppView.FORGOT_PASSWORD)} users={users} teamMembers={teamMembers} /></PageWrapper>;
        }
        return <Dashboard 
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
        />
      case AppView.ADMIN_DASHBOARD:
         if (!currentTeamMember) {
          // Team member is not authenticated, render the Login component.
          return <PageWrapper><Login onLogin={handleLogin} onSwitchToSignup={() => handleNav(AppView.SIGNUP)} onForgotPassword={() => handleNav(AppView.FORGOT_PASSWORD)} users={users} teamMembers={teamMembers} /></PageWrapper>;
        }
        return <PageWrapper><AdminDashboard 
            currentUser={currentTeamMember}
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
            productCategories={productCategories}
            vendorApplications={vendorApplications}
            teamMembers={teamMembers}
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
            onDeleteLead={handleDeleteQualifiedLead}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onTestWhatsApp={handleTestWhatsApp}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddTeamMember={handleAddTeamMember}
            onUpdateTeamMember={handleUpdateTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
        /></PageWrapper>
      case AppView.SERVICE_DETAIL: {
        if (!selectedService) {
          setCurrentView(AppView.HOME);
          return null;
        }
        const relevantVendors = vendors.filter(vendor => 
          vendor.specialties.includes(selectedService.name)
        );
        return <ServiceDetail 
          service={selectedService} 
          vendors={relevantVendors}
          promoBanner={siteConfig.promoBanner}
          onBack={() => {
            setSelectedService(null);
            setCurrentView(AppView.HOME);
          }}
          onGetQuote={() => handleGetQuote(selectedService.name)}
        />;
      }
      case AppView.PRODUCT_DETAIL: {
        if (!selectedProduct) {
          setCurrentView(AppView.HOME);
          return null;
        }
        return <ProductDetail 
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setCurrentView(AppView.LISTINGS_MARKETPLACE);
          }}
          onBookDemo={handleBookDemo}
          onPostRequirement={handlePostFromProduct}
        />
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
        return <ListingsMarketplace 
                 products={productsWithLeadCounts} 
                 onPostRequirement={() => handleNav(currentUser ? AppView.AI_LEAD_POSTER : AppView.SIGNUP)} 
                 onSelectProduct={handleSelectProduct}
                 onBookDemo={handleBookDemo}
                 initialSearchTerm={initialMarketplaceSearch}
               />;
       case AppView.AI_LEAD_POSTER:
        if (!currentUser) {
          setCurrentView(AppView.LOGIN);
          return null;
        }
        return <PageWrapper><AILeadPoster onComplete={handleRequirementPosted} currentUser={currentUser} /></PageWrapper>;
      case AppView.ABOUT:
        return <AboutPage />;
      case AppView.CONTACT:
        return <ContactPage />;
      case AppView.FAQ:
        return <PageWrapper><FAQPage /></PageWrapper>;
      case AppView.LOGIN:
        return <PageWrapper><Login onLogin={handleLogin} onSwitchToSignup={() => handleNav(AppView.SIGNUP)} onForgotPassword={() => handleNav(AppView.FORGOT_PASSWORD)} users={users} teamMembers={teamMembers} /></PageWrapper>;
      case AppView.SIGNUP:
        return <PageWrapper><Signup onSignup={handleSignup} onSwitchToLogin={() => handleNav(AppView.LOGIN)} /></PageWrapper>;
      case AppView.FORGOT_PASSWORD:
        return <PageWrapper><ForgotPassword onBackToLogin={() => handleNav(AppView.LOGIN)} /></PageWrapper>;
      case AppView.BECOME_VENDOR:
        return <PageWrapper><BecomeAVendorPage onSubmit={handleVendorApplicationSubmit} /></PageWrapper>;
      default:
        setCurrentView(AppView.HOME);
        return null;
    }
  };

  const loggedInUser = currentUser || currentTeamMember;

  return (
    <div className="bg-white min-h-screen flex flex-col text-gray-800" style={{fontFamily: "'Inter', sans-serif"}}>
      {toast && currentTeamMember?.role === TeamRole.Admin && (
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
        currentUser={loggedInUser} 
        onLogout={handleLogout} 
        notifications={notifications}
        onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
        logo={siteConfig.logo}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNav={handleNav} socialLinks={siteConfig.socialLinks} logo={siteConfig.logo} />
    </div>
  );
};

export default App;
