import React, { useState, useEffect } from 'react';
import { LeadDetails, Service } from '../types';

interface LeadFormProps {
  onSubmit: (details: LeadDetails) => void;
  initialService?: string;
  services: Service[];
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, initialService, services }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [service, setService] = useState(initialService || (services.length > 0 ? services[0].name : ''));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);
  
  const validate = (): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters.';
    }

    if (!company.trim()) {
      newErrors.company = 'Company Name is required.';
    } else if (company.trim().length < 2) {
      newErrors.company = 'Company Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Work Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!service) {
      newErrors.service = 'Please select a service of interest.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit({ name, company, email, service, mobile });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get Started</h2>
      <p className="text-gray-600 mb-8 text-center">Tell us a bit about yourself to begin the AI qualification process.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Acme Inc."
          />
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="john.doe@acme.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Optional)</label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                placeholder="+1 555-123-4567"
              />
            </div>
        </div>
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service of Interest</label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={`w-full px-4 py-2 border bg-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
          >
            {services.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
           {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Start AI Assistant
        </button>
      </form>
    </div>
  );
};

export default LeadForm;