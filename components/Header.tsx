
import React, { useState, useRef, useEffect } from 'react';
import { AppView, User, Notification, TeamMember, TeamRole } from '../types';
import { BellIcon } from './icons/BellIcon';
import NotificationsDropdown from './NotificationsDropdown';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
  onNav: (view: AppView) => void;
  currentUser: User | TeamMember | null;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
  logo?: string;
}

const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onNav, currentUser, onLogout, notifications, onMarkNotificationsAsRead, logo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const isTeamMember = currentUser && 'role' in currentUser;
  const isAdmin = isTeamMember && (currentUser as TeamMember).role === TeamRole.Admin;

  const handleMobileNav = (view: AppView) => {
    onNav(view);
    setIsMobileMenuOpen(false);
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(prev => {
        const nextState = !prev;
        if (nextState && unreadCount > 0) {
            onMarkNotificationsAsRead();
        }
        return nextState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef]);
  
  const getDashboardView = () => {
    if (!currentUser) return AppView.HOME;
    if (isTeamMember) return AppView.ADMIN_DASHBOARD;
    return AppView.DASHBOARD;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div 
              className="cursor-pointer"
              onClick={() => onNav(AppView.HOME)}
            >
              {logo ? (
                <img src={logo} alt="BANTConfirm Logo" className="h-10 w-auto" />
              ) : (
                <div className="text-3xl font-bold">
                  <span className="text-blue-600">BANT</span><span className="text-amber-500">Confirm</span>
                </div>
              )}
            </div>
            <nav className="hidden lg:flex items-center space-x-8 ml-10">
                <button onClick={() => onNav(AppView.HOME)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-transparent border-none p-0">Home</button>
                <button onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-transparent border-none p-0">Products</button>
                <button onClick={() => onNav(AppView.ABOUT)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-transparent border-none p-0">About</button>
                <button onClick={() => onNav(AppView.CONTACT)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer bg-transparent border-none p-0">Contact</button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser ? (
              <>
                 <button onClick={() => onNav(getDashboardView())} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors">
                    <UserCircleIcon />
                 </button>
                {isAdmin && (
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={handleToggleNotifications}
                      className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none transition-colors"
                      aria-label={`Notifications (${unreadCount} unread)`}
                    >
                      <BellIcon />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <NotificationsDropdown
                        notifications={notifications}
                        onClose={() => setIsNotificationsOpen(false)}
                      />
                    )}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300 hidden sm:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <button
                  onClick={() => onNav(AppView.LOGIN)}
                  className="text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => onNav(AppView.SIGNUP)}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                >
                  Signup
                </button>
              </div>
            )}
             <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <XIcon/> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
       {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-t border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="flex flex-col p-4 space-y-2">
            <button onClick={() => handleMobileNav(AppView.HOME)} className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Home</button>
            <button onClick={() => handleMobileNav(AppView.LISTINGS_MARKETPLACE)} className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Products</button>
            <button onClick={() => handleMobileNav(AppView.ABOUT)} className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">About</button>
            <button onClick={() => handleMobileNav(AppView.CONTACT)} className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Contact</button>
            
            {!currentUser && (
                <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-2">
                     <button
                        onClick={() => handleMobileNav(AppView.LOGIN)}
                        className="w-full text-center text-gray-700 font-semibold py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleMobileNav(AppView.SIGNUP)}
                        className="w-full text-center bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                    >
                        Signup
                    </button>
                </div>
            )}
            {currentUser && (
                 <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                    >
                        Logout
                    </button>
                </div>
            )}
          </nav>
        </div>
    </header>
  );
};

export default Header;
