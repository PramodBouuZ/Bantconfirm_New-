import React from 'react';
import { Service, Vendor, PromotionalBannerData } from '../types';
import VendorCard from './VendorCard';
import { SERVICE_ICONS } from './icons/serviceIcons';
import PromotionalBannerDisplay from './PromotionalBannerDisplay';

interface ServiceDetailProps {
  service: Service;
  vendors: Vendor[];
  promoBanner: PromotionalBannerData;
  onBack: () => void;
  onGetQuote: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, vendors, promoBanner, onBack, onGetQuote }) => {
  const IconComponent = SERVICE_ICONS[service.icon] || null;

  return (
    <div>
      <button onClick={onBack} className="mb-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to All Services
      </button>
      
      <section className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-200 mb-16">
        <div className="flex justify-center items-center mb-6 text-indigo-600">
          {IconComponent && <IconComponent />}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {service.name}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          {service.detailedDescription}
        </p>
        <button
          onClick={onGetQuote}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105 shadow-md"
        >
          Get a Quote for {service.name}
        </button>
      </section>
      
      <section className="bg-gray-50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.keyBenefits.map((benefit, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="my-12">
          <PromotionalBannerDisplay banner={promoBanner} />
      </div>

      <section id="vendors" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Vendors Specializing in {service.name}</h2>
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.name} {...vendor} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No vendors currently specialize in this service.</p>
        )}
      </section>
    </div>
  );
};

export default ServiceDetail;
