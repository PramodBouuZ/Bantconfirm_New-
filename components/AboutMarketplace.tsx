import React from 'react';

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-center">
        <CheckCircleIcon />
        <span className="ml-3 text-gray-700">{children}</span>
    </li>
);

const AboutMarketplace: React.FC = () => {
    return (
        <section className="bg-white py-12 md:py-16 px-6 md:px-12 rounded-xl shadow-lg border border-gray-200">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">About BANTConfirm Marketplace</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        BANTConfirm is a premier marketplace dedicated to simplifying the procurement process for telecom and IT services. Our mission is to connect businesses with the perfect vendors by leveraging AI-driven requirement analysis and a robust BANT (Budget, Authority, Need, Timeline) framework.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        We eliminate the guesswork and lengthy negotiations, providing a streamlined path to finding trusted partners who can deliver on your specific needs. Whether you're looking for a new VoIP system, cloud infrastructure, or specialized consulting, our platform ensures you get qualified, competitive proposals from top-tier providers.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <FeatureListItem>AI-Powered Requirement Analysis</FeatureListItem>
                        <FeatureListItem>Verified and Vetted Vendors</FeatureListItem>
                        <FeatureListItem>Transparent Quoting Process</FeatureListItem>
                        <FeatureListItem>BANT-Focused Matching</FeatureListItem>
                        <FeatureListItem>End-to-End Project Support</FeatureListItem>
                        <FeatureListItem>Secure and Reliable Platform</FeatureListItem>
                    </ul>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                    <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop" alt="Team collaborating in a modern office" className="w-full h-auto object-cover" />
                </div>
            </div>
        </section>
    );
};

export default AboutMarketplace;
