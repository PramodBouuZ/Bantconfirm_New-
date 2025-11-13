import React from 'react';
import { AppView } from '../types';

const HighlightIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex justify-center items-center mb-4 text-indigo-400 h-10">
        {children}
    </div>
);

const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H9M15 15H9M12 21V15M4 11.642a4 4 0 100 5.292m16-5.292a4 4 0 110 5.292" />
    </svg>
);

const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917L12 23l9-2.083A12.02 12.02 0 0017.618 7.984z" />
    </svg>
);

const PercentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path fillRule="evenodd" d="M14.615 1.585a.75.75 0 01.359.852l-6.672 19.324a.75.75 0 01-1.406-.486l6.672-19.324a.75.75 0 011.047-.366zM5.25 6.375a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25zm0 16.5a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z" clipRule="evenodd" />
    </svg>
);


const HighlightItem: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div>
        <HighlightIconWrapper>{icon}</HighlightIconWrapper>
        <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{text}</p>
    </div>
);


interface FooterProps {
  onNav: (view: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNav }) => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <HighlightItem 
              icon={<AiIcon />}
              title="AI-Powered Matching"
              text="Our intelligent system analyzes your needs to connect you with the perfect vendors, saving you time and effort."
            />
            <HighlightItem 
              icon={<VerifiedIcon />}
              title="Vetted & Verified"
              text="Every vendor on our platform is thoroughly vetted for quality and reliability, so you can procure with absolute confidence."
            />
            <HighlightItem 
              icon={<PercentIcon />}
              title="Earn Commission"
              text="Facilitate a deal by posting a requirement on our marketplace and you can earn up to a 10% commission."
            />
          </div>
        </div>
        <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} BANTConfirm. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a onClick={() => onNav(AppView.ABOUT)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</a>
                    <a onClick={() => onNav(AppView.FAQ)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">FAQ</a>
                    <a onClick={() => onNav(AppView.CONTACT)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a>
                    <a onClick={() => onNav(AppView.BECOME_VENDOR)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Become a Vendor</a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;