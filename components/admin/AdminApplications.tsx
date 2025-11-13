import React, { useState } from 'react';
import { VendorApplication } from '../../types';

interface AdminApplicationsProps {
  applications: VendorApplication[];
}

const AdminApplications: React.FC<AdminApplicationsProps> = ({ applications }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendor Applications</h1>
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map(app => (
            <ApplicationAccordion key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">No new vendor applications.</p>
      )}
    </div>
  );
};

const ApplicationAccordion: React.FC<{ application: VendorApplication }> = ({ application }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <div className="flex items-center">
            <img src={application.logo} alt={`${application.companyName} logo`} className="h-10 w-10 object-contain rounded-md bg-white p-1 mr-4 border" />
            <div>
                <span className="font-bold text-gray-800">{application.companyName}</span>
                <span className="text-sm text-gray-500 block">Submitted by: {application.name}</span>
            </div>
        </div>
        <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-4">{new Date(application.submittedAt).toLocaleDateString()}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <ChevronDownIcon />
            </span>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoDetail label="Contact Name" value={application.name} />
                <InfoDetail label="Email" value={application.email} />
                <InfoDetail label="Mobile" value={application.mobile} />
                <InfoDetail label="Location" value={application.location} />
                <div className="md:col-span-2">
                    <InfoDetail label="Products / Services" value={application.products} isBlock />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const InfoDetail: React.FC<{label: string, value: string, isBlock?: boolean}> = ({ label, value, isBlock }) => (
    <div className={isBlock ? 'col-span-2' : ''}>
        <h4 className="text-sm font-semibold text-gray-500">{label}</h4>
        <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
);


const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export default AdminApplications;
