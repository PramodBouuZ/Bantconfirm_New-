


import React from 'react';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';

interface FooterProps {
  socialLinks: {
    linkedin: string;
    instagram: string;
    facebook: string;
  };
  logo?: string;
}

const Footer: React.FC<FooterProps> = ({ socialLinks, logo }) => {
    
    const FooterLink: React.FC<{href: string; label: string}> = ({ href, label }) => {
        return (
            <li className="mb-2">
                <a href={href} className="text-gray-400 hover:text-white transition-colors">
                    {label}
                </a>
            </li>
        );
    };

    return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="lg:col-span-1">
                 <a href="/" className="mb-4 inline-block">
                    {logo ? (
                      <img src={logo} alt="BANTConfirm Logo" className="h-10 w-auto" />
                    ) : (
                      <h3 className="text-3xl font-bold">
                          <span className="text-blue-400">BANT</span><span className="text-amber-400">Confirm</span>
                      </h3>
                    )}
                </a>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                   The intelligent B2B marketplace for AI-qualified IT and software leads.
                </p>
                <div className="flex space-x-4">
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><LinkedInIcon /></a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><InstagramIcon /></a>
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><FacebookIcon /></a>
                </div>
            </div>
            
            {/* Links Sections */}
            <div>
                <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">Company</h3>
                <ul className="space-y-1 text-sm">
                    <FooterLink href="/about" label="About Us" />
                    <FooterLink href="/contact" label="Contact" />
                    <FooterLink href="/faq" label="FAQ" />
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">For Partners</h3>
                <ul className="space-y-1 text-sm">
                   <FooterLink href="/become-a-vendor" label="Become a Vendor" />
                   <FooterLink href="/login" label="Vendor Login" />
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">Legal</h3>
                <ul className="space-y-1 text-sm">
                   <FooterLink href="#" label="Privacy Policy" />
                   <FooterLink href="#" label="Terms of Service" />
                </ul>
            </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
             &copy; {new Date().getFullYear()} BANTConfirm. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;