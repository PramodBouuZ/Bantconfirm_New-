
import React, { useState, useRef, useEffect } from 'react';
import { AppView, User, Notification } from '../types';
import { AdminIcon } from './icons/AdminIcon';
import { BellIcon } from './icons/BellIcon';
import NotificationsDropdown from './NotificationsDropdown';

interface HeaderProps {
  onNav: (view: AppView) => void;
  currentUser: User | null;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsAsRead: () => void;
}

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold cursor-pointer"
              onClick={() => onNav(currentUser?.isAdmin ? AppView.ADMIN_DASHBOARD : AppView.HOME)}
            >
              <span className="text-indigo-600">BANT</span>
              <span className="text-amber-500">Confirm</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a onClick={() => onNav(AppView.LISTINGS_MARKETPLACE)} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">Browse Listings</a>
            <a onClick={() => onNav(currentUser ? AppView.POST_REQUIREMENT : AppView.SIGNUP)} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">Post Requirement</a>
            {currentUser?.isAdmin && (
              <a onClick={() => onNav(AppView.ADMIN_DASHBOARD)} className="flex items-center text-amber-600 hover:text-amber-500 font-semibold transition-colors cursor-pointer">
                <AdminIcon />
                <span className="ml-2">Admin Panel</span>
              </a>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {currentUser.isAdmin && (
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={handleToggleNotifications}
                      className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none transition-colors"
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
                <span className="text-gray-600 hidden sm:block">Welcome, <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>!</span>
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
                  className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => onNav(AppView.SIGNUP)}
                  className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  Sign Up
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
