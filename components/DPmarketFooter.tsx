import React from 'react';

// FIX: The AppView enum does not exist. This component has been refactored to use standard href links for navigation, consistent with the rest of the application. The unused onNav prop and its related types have been removed.
interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
    
    const FooterLink: React.FC<{href: string; label: string}> = ({ href, label }) => (
        <li>
            <a href={href} className="text-gray-400 hover:text-white transition-colors cursor-pointer">{label}</a>
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
                    <FooterLink href="/" label="Home" />
                    <FooterLink href="/about" label="About Us" />
                    <FooterLink href="/contact" label="Contact" />
                    <FooterLink href="/faq" label="FAQ" />
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4">For Partners</h3>
                <ul className="space-y-2 text-sm">
                   <FooterLink href="/become-a-vendor" label="Become a Vendor" />
                   <FooterLink href="/login" label="Vendor Login" />
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