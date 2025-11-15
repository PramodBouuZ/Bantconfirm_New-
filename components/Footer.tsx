
import React from 'react';
import { AppView, SiteConfig } from '../types';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';

interface FooterProps {
  onNav: (view: AppView) => void;
  socialLinks: SiteConfig['socialLinks'];
}

const Footer: React.FC<FooterProps> = ({ onNav, socialLinks }) => {
    
    const FooterLink: React.FC<{view: AppView; label: string}> = ({ view, label }) => (
        <li>
            <a onClick={() => onNav(view)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">{label}</a>
        </li>
    );
    
    const SocialIcon: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
           {children}
        </a>
    );

    return (
    <footer className="bg-[#13131A] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Section */}
            <div>
                <h3 className="text-2xl font-bold mb-4 cursor-pointer" onClick={() => onNav(AppView.HOME)}>
                    <span className="text-blue-500">BANT</span><span className="text-amber-400">Confirm</span>
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                   The intelligent B2B marketplace for AI-qualified IT and software leads, connecting businesses with top-tier vendors.
                </p>
                <div className="flex space-x-4">
                    {socialLinks.linkedin && <SocialIcon href={socialLinks.linkedin}><LinkedInIcon /></SocialIcon>}
                    {socialLinks.instagram && <SocialIcon href={socialLinks.instagram}><InstagramIcon /></SocialIcon>}
                    {socialLinks.facebook && <SocialIcon href={socialLinks.facebook}><FacebookIcon /></SocialIcon>}
                </div>
            </div>
            {/* Quick Links */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Useful Link</h3>
                <ul className="space-y-3 text-sm">
                    <FooterLink view={AppView.ABOUT} label="About Us" />
                    <FooterLink view={AppView.CONTACT} label="Contact" />
                    <FooterLink view={AppView.FAQ} label="FAQ" />
                    <FooterLink view={AppView.BECOME_VENDOR} label="Become a Vendor" />
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Our Community</h3>
                <ul className="space-y-3 text-sm">
                   <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Forum</a></li>
                   <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Members</a></li>
                   <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                   <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
                </ul>
            </div>
            {/* Newsletter */}
            <div>
                 <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
                 <p className="text-gray-400 mb-4 text-sm">Sign up for our newsletter to get the latest news and updates.</p>
                 <form className="flex">
                    <input type="email" placeholder="Your email" className="bg-[#2A2A32] text-white w-full py-2 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 rounded-r-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l14.5-5.25a.75.75 0 000-1.352L3.105 2.289z"></path></svg>
                    </button>
                 </form>
            </div>
        </div>

        <div className="py-6 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center text-sm">
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