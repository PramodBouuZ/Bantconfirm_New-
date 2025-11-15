import React from 'react';

const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: 'Alex Johnson', title: 'Founder & CEO', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Maria Garcia', title: 'Chief Technology Officer', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop' },
    { name: 'David Chen', title: 'Head of Vendor Relations', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Sarah Lee', title: 'Lead UX Designer', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-700 text-white text-center py-20 md:py-32">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')" }}
        ></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold">About BANTConfirm</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">Connecting Businesses Intelligently. Revolutionizing B2B procurement with the power of AI.</p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              To simplify the complex world of B2B technology procurement. We empower businesses to find the perfect solutions and vendors with unparalleled speed, clarity, and confidence by leveraging our AI-powered BANT qualification framework.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the world's most trusted B2B marketplace for IT and software solutions, creating a transparent ecosystem where every submitted lead is a valuable, qualified opportunity for our network of vendors.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop" alt="Our team collaborating" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet the Innovators</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">The passionate minds driving the BANTConfirm revolution.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" src={member.imageUrl} alt={member.name} />
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-semibold">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;