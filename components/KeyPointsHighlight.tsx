import React from 'react';
import { PercentIcon } from './icons/PercentIcon';

interface KeyPointsHighlightProps {
  onPostRequirement: () => void;
}

const KeyPointsHighlight: React.FC<KeyPointsHighlightProps> = ({ onPostRequirement }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4 hidden sm:block">
          <PercentIcon />
        </div>
        <div>
          <h3 className="font-bold text-xl text-center sm:text-left">Post your enquiry and get <span className="text-amber-400">Up to 10% commission</span></h3>
          <p className="text-indigo-200 text-sm mt-1 text-center sm:text-left">Facilitate a deal on the marketplace to earn rewards.</p>
        </div>
      </div>
      <button
        onClick={onPostRequirement}
        className="w-full sm:w-auto bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg hover:bg-indigo-100 transition-colors duration-300 flex-shrink-0"
      >
        Post Enquiry Now
      </button>
    </div>
  );
};

export default KeyPointsHighlight;