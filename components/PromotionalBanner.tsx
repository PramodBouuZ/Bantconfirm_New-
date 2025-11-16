import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { HandshakeIcon } from './icons/HandshakeIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromotionalBannerProps {
  bgColor?: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ bgColor = 'bg-white' }) => {
  return (
    <section className={`${bgColor} py-16 md:py-24`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose BANTConfirm?</h2>
          <p className="mt-2 text-lg text-gray-600">The smarter way to source and sell business technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <FeatureCard
            icon={<BrainIcon />}
            title="Intelligent Matching"
            description="Our AI qualifies every lead with the BANT framework, ensuring vendors receive high-quality, actionable opportunities."
          />
          <FeatureCard
            icon={<HandshakeIcon />}
            title="Post, Connect, Earn"
            description="Submit a requirement or lead and earn up to 10% commission when a successful deal is made through our platform."
          />
          <FeatureCard
            icon={<VerifiedIcon />}
            title="Verified Vendors"
            description="Rest assured that every vendor on our platform is thoroughly vetted for quality and reliability, so you can procure with confidence."
          />
          <FeatureCard
            icon={<SparklesIcon />}
            title="Complete Solutions"
            description="Find a wide array of IT and software solutions, from Internet Leased Lines and CRMs to custom development."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
    <div className="flex justify-center items-center mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default PromotionalBanner;