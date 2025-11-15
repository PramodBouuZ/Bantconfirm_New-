
import React, { useState, useRef, useEffect } from 'react';
import { AppView, User, Notification } from '../types';
import { BellIcon } from './icons/BellIcon';
import NotificationsDropdown from './NotificationsDropdown';

interface HeaderProps {
  onNav: (view: AppView) => void;
  currentUser: User | null;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
}

const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onNav, currentUser, onLogout, notifications, onMarkNotificationsAsRead }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationsRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div 
              className="text-3xl font-bold cursor-pointer"
              onClick={() => onNav(AppView.HOME)}
            >
              <span className="text-blue-600">BANT</span><span className="text-amber-500">Confirm</span>
            </div>
            <nav className="hidden lg:flex items-center space-x-8 ml-10">
                <a onClick={() => onNav(AppView.HOME)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Home</a>
                <a onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Products</a>
                <a onClick={() => onNav(AppView.ABOUT)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">About</a>
                <a onClick={() => onNav(AppView.CONTACT)} className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer">Contact</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                 <button onClick={() => onNav(currentUser.isAdmin ? AppView.ADMIN_DASHBOARD : AppView.DASHBOARD)} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors">
                    <UserCircleIcon />
                 </button>
                {currentUser.isAdmin && (
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
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;