import React from 'react';
import { Notification } from '../types';

interface NotificationsDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
              <p className="text-sm text-gray-700">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{timeSince(notification.timestamp)}</p>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>No new notifications.</p>
          </div>
        )}
      </div>
      <div className="p-2 bg-gray-50 rounded-b-lg">
          {/* Could add a "View All" button here later */}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
