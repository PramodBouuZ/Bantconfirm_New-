import React, { useState } from 'react';
import { FAQS, FAQItem } from '../data/faq';

const FAQPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-3 text-lg text-gray-600">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <AccordionItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  );
};

interface AccordionItemProps {
  faq: FAQItem;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left p-6 focus:outline-none"
      >
        <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-6 pt-0 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
