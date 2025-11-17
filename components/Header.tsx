
import React, { useState, useRef, useEffect } from 'react';
import { User, Notification, TeamMember, TeamRole } from '../types';
import { BellIcon } from './icons/BellIcon';
import NotificationsDropdown from './NotificationsDropdown';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
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

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, notifications, onMarkNotificationsAsRead, logo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const isTeamMember = currentUser && 'role' in currentUser;
  const isAdmin = isTeamMember && (currentUser as TeamMember).role === TeamRole.Admin;

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
  
  const getDashboardPath = () => {
    if (!currentUser) return "/";
    if (isTeamMember) return "/admin";
    return "/dashboard";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a 
              href="/"
              className="cursor-pointer"
            >
              {logo ? (
                <img src={logo} alt="BANTConfirm Logo" className="h-10 w-auto" />
              ) : (
                <div className="text-3xl font-bold">
                  <span className="text-blue-600">BANT</span><span className="text-amber-500">Confirm</span>
                </div>
              )}
            </a>
            <nav className="hidden lg:flex items-center space-x-8 ml-10">
                <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Home</a>
                <a href="/products" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Products</a>
                <a href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">About</a>
                <a href="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Contact</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser ? (
              <>
                 <a href={getDashboardPath()} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors">
                    <UserCircleIcon />
                 </a>
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
                <a
                  href="/login"
                  className="text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                >
                  Signup
                </a>
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
      <div className={`lg:hidden bg-white border-t border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="flex flex-col p-4 space-y-2">
            <a href="/" className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Home</a>
            <a href="/products" className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Products</a>
            <a href="/about" className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">About</a>
            <a href="/contact" className="text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-100">Contact</a>
            
            {!currentUser && (
                <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-2">
                     <a
                        href="/login"
                        className="w-full text-center text-gray-700 font-semibold py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                    >
                        Login
                    </a>
                    <a
                        href="/signup"
                        className="w-full text-center bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                    >
                        Signup
                    </a>
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