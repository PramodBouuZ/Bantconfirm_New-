import React from 'react';
import { BantData, LeadDetails, BantStage } from '../types';

interface LeadConfirmationProps {
  leadDetails: LeadDetails;
  bantData: BantData;
  onStartOver: () => void;
}

const LeadConfirmation: React.FC<LeadConfirmationProps> = ({ leadDetails, bantData, onStartOver }) => {
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
        Thank you, {leadDetails.name}. Your request has been successfully qualified and will be sent to our top vendors.
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