import React from 'react';
import { BantData, LeadDetails, BantStage } from '../types';

interface LeadConfirmationProps {
  leadDetails: LeadDetails;
  bantData: BantData;
  onStartOver: () => void;
  isMatching: boolean;
  matchedVendors: string[] | null;
}

const MatchingLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-4">
        <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-gray-600">AI is finding the best vendors for you...</p>
    </div>
);

const LeadConfirmation: React.FC<LeadConfirmationProps> = ({ leadDetails, bantData, onStartOver, isMatching, matchedVendors }) => {
  const summaryItems = [
    { label: 'Budget', value: bantData[BantStage.BUDGET] },
    { label: 'Authority', value: bantData[BantStage.AUTHORITY] },
    { label: 'Need', value: bantData[BantStage.NEED] },
    { label: 'Timeline', value: bantData[BantStage.TIMELINE] },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Lead Qualified!</h2>
      <p className="text-gray-600 mb-8">
        Thank you, {leadDetails.name}. Your request has been successfully qualified by BANTConfirm.
        {!isMatching && matchedVendors
          ? " We have automatically assigned the following top vendors to your request."
          : " Our AI is now matching you with our top vendors."}
      </p>

      <div className="bg-gray-50 rounded-lg p-6 text-left border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Qualification Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InfoItem label="Name" value={leadDetails.name} />
             <InfoItem label="Company" value={leadDetails.company} />
             <InfoItem label="Email" value={leadDetails.email} />
             <InfoItem label="Service" value={leadDetails.service} />
          </div>
          <hr className="my-4"/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaryItems.map(item => (
              <InfoItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>

       <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center mb-8">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">Automated Vendor Assignment</h3>
        {isMatching && <MatchingLoader />}
        {!isMatching && matchedVendors && matchedVendors.length > 0 && (
          <div>
            <p className="text-indigo-700 mb-4">The following vendors have been notified and will be in touch shortly:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {matchedVendors.map(vendorName => (
                <span key={vendorName} className="bg-indigo-200 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">
                  {vendorName}
                </span>
              ))}
            </div>
          </div>
        )}
        {!isMatching && matchedVendors && matchedVendors.length === 0 && (
          <p className="text-indigo-700">
            Our AI couldn't find an immediate perfect match. An account manager will review your request and assign vendors manually within 24 hours.
          </p>
        )}
      </div>

      <button
        onClick={onStartOver}
        className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
      >
        Submit Another Inquiry
      </button>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-md font-semibold text-gray-800">{value}</p>
  </div>
);

export default LeadConfirmation;