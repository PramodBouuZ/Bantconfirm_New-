import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { HandshakeIcon } from './icons/HandshakeIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const PromotionalBanner: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose BANTConfirm?</h2>
          <p className="mt-2 text-lg text-gray-600">The smarter way to source your business technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <FeatureCard
            icon={<BrainIcon />}
            title="Intelligent Matching"
            description="Our AI understands your unique needs to connect you with the perfect solutions and vendors, saving you time and effort."
          />
          <FeatureCard
            icon={<HandshakeIcon />}
            title="Post, Connect, Earn"
            description="Post your requirement on our marketplace and earn up to 10% commission when a successful deal is made."
          />
          <FeatureCard
            icon={<VerifiedIcon />}
            title="Verified & Vetted"
            description="Rest assured that every vendor on our platform is thoroughly vetted for quality and reliability, so you can procure with confidence."
          />
          <FeatureCard
            icon={<SparklesIcon />}
            title="Latest Updates"
            description="Stay informed about the newest products, services, and platform features added to our expanding marketplace."
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
    <div className="flex justify-center items-center mb-4 text-indigo-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default PromotionalBanner;
