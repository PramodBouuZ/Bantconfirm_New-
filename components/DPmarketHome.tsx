

import React from 'react';
import { Service } from '../types';
import ServiceCard from './ServiceCard';
import PromotionalBanner from './PromotionalBanner';

interface HomePageProps {
  services: Service[];
  onGetQuote: (serviceName?: string) => void;
  onPostRequirement: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ services, onGetQuote, onPostRequirement }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-50 text-gray-800 flex flex-col justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 opacity-50"></div>
        <div className="relative z-10 p-4 flex-grow flex flex-col items-center justify-center min-h-[calc(80vh-80px)]">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-gray-900">
            Intelligent Leads for IT & Software Vendors
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Submit your business requirements or leads, get them qualified by our AI BANT assistant, and connect with top-tier vendors. <strong className="text-blue-600">Earn up to 10% commission on converted deals.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onPostRequirement}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              Post a Lead & Earn
            </button>
            <button
              onClick={() => onGetQuote()}
              className="bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
            >
              Find a Solution
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">A Smarter Way to Connect</h2>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Our streamlined process ensures quality for both businesses and vendors.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <HowItWorksStep icon="1" title="Submit Requirement" description="Post your business need or a qualified lead you have. The more detail, the better." />
                <HowItWorksStep icon="2" title="AI BANT Qualification" description="Our intelligent assistant analyzes and qualifies the submission based on Budget, Authority, Need, and Timeline." />
                <HowItWorksStep icon="3" title="Connect with Vendors" description="The BANT-qualified lead is sent to our network of vetted vendors, ensuring relevant and timely proposals." />
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Solutions</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">We cater to a wide range of IT and software needs.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {services.map(service => (
              <ServiceCard
                key={service.name}
                name={service.name}
                icon={service.icon}
                itemCount={0}
                onSelect={() => onGetQuote(service.name)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Commission Banner */}
       <section className="bg-blue-600">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
                    <div>
                        <h2 className="text-3xl font-bold">Earn Up to 10% Commission</h2>
                        <p className="text-blue-200 mt-2 text-lg max-w-3xl">Have a lead for an IT or software requirement? Submit it to our platform. If the lead converts to a deal with one of our vendors, you get rewarded.</p>
                    </div>
                    <div className="mt-6 lg:mt-0 flex-shrink-0">
                         <button
                            onClick={onPostRequirement}
                            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-100 transition-all duration-300 shadow-lg"
                        >
                            Start Earning Now
                        </button>
                    </div>
                </div>
            </div>
      </section>
      
      <PromotionalBanner />

    </div>
  );
};

const HowItWorksStep: React.FC<{icon: string; title: string; description: string}> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mx-auto mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);


export default HomePage;
