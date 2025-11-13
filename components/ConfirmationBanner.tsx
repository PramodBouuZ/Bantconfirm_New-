
import React from 'react';
import { InfoIcon } from './icons/InfoIcon';
import { XIcon } from './icons/XIcon';

interface ConfirmationBannerProps {
  message: string;
  onClose: () => void;
}

const ConfirmationBanner: React.FC<ConfirmationBannerProps> = ({ message, onClose }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <InfoIcon />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
            <button onClick={onClose} className="text-blue-600 hover:text-blue-800">
                <XIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBanner;
