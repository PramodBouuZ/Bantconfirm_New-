

import React, { useState } from 'react';
import { RequirementListing } from '../types';
import { ShareIcon } from './icons/ShareIcon';
import BookDemoModal from './BookDemoModal';

interface ListingCardProps extends RequirementListing {
  onPostNow?: (listing: RequirementListing) => void;
  showActions?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = (props) => {
  const { id, title, description, category, authorName, companyName, postedDate, aiMatches, status, assignedVendorNames, onPostNow, showActions = true } = props;
  const [isCopied, setIsCopied] = useState(false);
  const [isBookingDemo, setIsBookingDemo] = useState(false);

  const categoryColors: Record<string, string> = {
    Software: 'bg-indigo-100 text-indigo-800',
    Hardware: 'bg-purple-100 text-purple-800',
    Service: 'bg-amber-100 text-amber-800',
  };
  
  const statusColors: Record<RequirementListing['status'], string> = {
    'Pending Validation': 'bg-amber-100 text-amber-800',
    'Validated': 'bg-indigo-100 text-indigo-800',
    'Assigned': 'bg-green-100 text-green-800',
  };

  const handleBookDemo = () => {
    setIsBookingDemo(true);
  };

  const handlePostNow = () => {
    if (onPostNow) {
        onPostNow(props);
    }
  };
  
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?listing=${id}`;
    navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
  };

  const formattedDate = new Date(postedDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      {isBookingDemo && (
        <BookDemoModal
          productName={title}
          onClose={() => setIsBookingDemo(false)}
          onConfirm={(details) => {
            alert(`Demo booked for "${title}" on ${details.date} at ${details.time}. (This is a demonstration)`);
            setIsBookingDemo(false);
          }}
        />
      )}
      <div id={`listing-${id}`} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0 pr-4">{title}</h3>
            <span className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
              {category}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          
          {showActions ? (
              <div className="flex items-center gap-4">
                  <button 
                      onClick={handleBookDemo}
                      className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm"
                  >
                      Book Demo
                  </button>
                  <button 
                      onClick={handlePostNow}
                      className="bg-amber-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-amber-600 transition-colors duration-300 text-sm"
                  >
                      Post Now
                  </button>
                  <button 
                      onClick={handleShare}
                      className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm flex items-center gap-2 disabled:cursor-not-allowed"
                      disabled={isCopied}
                  >
                      {isCopied ? (
                          'Link Copied!'
                      ) : (
                          <>
                              <ShareIcon />
                              <span>Share</span>
                          </>
                      )}
                  </button>
              </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h4>
                  <span className={`mt-1 px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Vendors</h4>
                  <p className="text-sm font-medium text-gray-800 mt-1">{assignedVendorNames.join(', ') || 'Pending Assignment'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4 mt-4">
            <p className="font-medium mb-2 sm:mb-0">
              Posted by: <span className="text-gray-800">{authorName}</span> at <span className="text-gray-800">{companyName}</span>
            </p>
            <p>Date: <span className="text-gray-800">{formattedDate}</span></p>
          </div>
        </div>
        
        {aiMatches && aiMatches.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <AIIcon />
              AI Suggested Matches
            </h4>
            <div className="space-y-3">
              {aiMatches.map(match => (
                <div key={match.vendorName} className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="font-bold text-gray-800">{match.vendorName}</p>
                  <p className="text-sm text-gray-600 italic">"{match.justification}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
);

export default ListingCard;