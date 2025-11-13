import React from 'react';
import { Vendor } from '../types';

interface AnimatedVendorLogosProps {
  vendors: Vendor[];
}

const AnimatedVendorLogos: React.FC<AnimatedVendorLogosProps> = ({ vendors }) => {
  const animationStyle = `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    .animate-scroll {
      animation: scroll 40s linear infinite;
    }
  `;

  const LogoList = () => (
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-10 [&_img]:max-w-none">
      {vendors.map((vendor, index) => (
        <li key={index}>
          <img
            className="max-h-10 w-auto object-contain filter brightness-0 invert hover:filter-none transition-all duration-300"
            src={vendor.logoUrl}
            alt={vendor.name}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="py-6 sm:py-8">
      <style>{animationStyle}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold leading-8 text-gray-300 mb-6">
          Trusted Vendors
        </h2>
        <div
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        >
          <div className="flex items-center justify-center md:justify-start animate-scroll hover:[animation-play-state:paused]">
            <LogoList />
            <LogoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedVendorLogos;