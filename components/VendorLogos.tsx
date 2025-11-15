

import React from 'react';
import { Vendor } from '../types';

interface VendorLogosProps {
  vendors: Vendor[];
}

const VendorLogos: React.FC<VendorLogosProps> = ({ vendors }) => {
  // Using a style tag for the keyframes animation is a straightforward way
  // to include component-specific animations without a separate CSS file.
  const animationStyle = `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    .animate-scroll {
      animation: scroll 40s linear infinite;
    }
  `;

  // A helper component for the list of logos to avoid repetition and keep the JSX clean.
  const LogoList = () => (
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none">
      {vendors.map((vendor, index) => (
        <li key={index}>
          <img
            className="max-h-12 w-auto object-contain"
            src={vendor.logoUrl}
            alt={vendor.name}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-white py-8 sm:py-12">
      <style>{animationStyle}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted Vendors
        </h2>
        <div
          className="mt-10 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        >
          <div className="flex items-center justify-center md:justify-start animate-scroll hover:[animation-play-state:paused]">
            {/* We render the list twice to create the seamless scrolling effect */}
            <LogoList />
            <LogoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogos;