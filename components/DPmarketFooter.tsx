import React from 'react';
import { AppView } from '../types';

interface FooterProps {
  onNav: (view: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNav }) => {
    
    const FooterLink: React.FC<{view: AppView; label: string}> = ({ view, label }) => (
        <li>
            <a onClick={() => onNav(view)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">{label}</a>
        </li>
    );

    return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
                <h3 className="text-2xl font-bold mb-4">
                    <span className="text-blue-400">BANT</span>Confirm
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                   The intelligent B2B marketplace for AI-qualified IT and software leads. We connect businesses with top-tier vendors, simplifying procurement and creating opportunities.
                </p>
            </div>
            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                    <FooterLink view={AppView.HOME} label="Home" />
                    <FooterLink view={AppView.ABOUT} label="About Us" />
                    <FooterLink view={AppView.CONTACT} label="Contact" />
                    <FooterLink view={AppView.FAQ} label="FAQ" />
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4">For Partners</h3>
                <ul className="space-y-2 text-sm">
                   <FooterLink view={AppView.BECOME_VENDOR} label="Become a Vendor" />
                   <FooterLink view={AppView.LOGIN} label="Vendor Login" />
                </ul>
            </div>
            {/* Contact */}
            <div>
                 <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                 <ul className="space-y-2 text-sm text-gray-400">
                    <li>Noida, Uttar Pradesh, 201301, India</li>
                    <li>Email: support@bantconfirm.com</li>
                    <li>Phone: +91 120 123 4567</li>
                 </ul>
            </div>
        </div>

        <div className="py-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} BANTConfirm. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of service</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy policy</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;