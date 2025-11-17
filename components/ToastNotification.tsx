import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { BellIcon } from './icons/BellIcon';
import { XIcon } from './icons/XIcon';
import { InfoIcon } from './icons/InfoIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ToastNotificationProps {
  notification: Notification;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const enterTimeout = setTimeout(() => setIsVisible(true), 10);
    
    const exitTimer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]); // Rerun effect if the notification object itself changes

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish before calling parent onClose
  };

  const iconMap = {
    info: <BellIcon />,
    success: <CheckCircleIcon />,
    warning: <InfoIcon />, // Reusing info icon for warning
    error: <InfoIcon />, // Reusing info icon for error
  };

  const colorMap = {
    info: 'bg-indigo-100 text-indigo-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
  };

  const notificationType = notification.type || 'info';

  return (
    <div 
      className={`fixed top-24 right-5 z-[100] w-full max-w-sm bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorMap[notificationType]}`}>
              {iconMap[notificationType]}
            </div>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{notification.title || 'Notification'}</p>
            <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <XIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
