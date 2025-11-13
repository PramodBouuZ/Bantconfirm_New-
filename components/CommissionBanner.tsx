import React from 'react';

const CommissionBanner: React.FC = () => {
    const animationStyle = `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    .animate-scroll {
      animation: scroll 25s linear infinite;
    }
  `;

    const BannerText = () => (
        <p className="text-lg font-semibold text-white whitespace-nowrap px-12">
            <span className="text-indigo-400">Post a Need & Get Matched by AI</span>
            <span className="text-gray-500 font-extrabold text-xl mx-4">|</span> 
            <span className="text-amber-400">Facilitate a Deal & Get up to 10% Commission</span>
        </p>
    );

    return (
        <div className="bg-gray-800 my-2 py-4 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <style>{animationStyle}</style>
            <div className="flex items-center justify-center animate-scroll hover:[animation-play-state:paused]">
                <BannerText />
                <BannerText />
                <BannerText />
                <BannerText />
            </div>
        </div>
    );
};

export default CommissionBanner;