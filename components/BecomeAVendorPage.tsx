import React, { useState } from 'react';
import { VendorApplication } from '../types';

interface BecomeAVendorPageProps {
  onSubmit: (application: Omit<VendorApplication, 'id' | 'submittedAt'>) => void;
}

const BecomeAVendorPage: React.FC<BecomeAVendorPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [products, setProducts] = useState('');
  const [logo, setLogo] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Contact name is required.';
    if (!companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email.';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!products.trim()) newErrors.products = 'Please describe your products or services.';
    if (!logo) newErrors.logo = 'Please upload your company logo.';
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
    onSubmit({ name, companyName, email, mobile, location, products, logo });
    setFormSubmitted(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (formSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-gray-600">Your application to become a vendor has been submitted successfully. Our team will review your information and get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Become a Vendor</h2>
      <p className="text-gray-600 mb-8 text-center">Join our curated marketplace and receive AI-qualified leads for your IT & Software solutions.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Contact Name" id="name" value={name} onChange={setName} error={errors.name} />
          <InputField label="Company Name" id="companyName" value={companyName} onChange={setCompanyName} error={errors.companyName} />
          <InputField label="Email ID" id="email" type="email" value={email} onChange={setEmail} error={errors.email} />
          <InputField label="Mobile Number" id="mobile" type="tel" value={mobile} onChange={setMobile} error={errors.mobile} />
        </div>
        <InputField label="Location" id="location" value={location} onChange={setLocation} error={errors.location} />
        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700 mb-1">Products / Services</label>
          <textarea id="products" value={products} onChange={e => setProducts(e.target.value)} rows={4} className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${errors.products ? 'border-red-500' : 'border-gray-300'}`}></textarea>
          {errors.products && <p className="text-red-500 text-xs mt-1">{errors.products}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
          <div className="mt-1 flex items-center">
            <div className="flex-shrink-0 h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {logo ? <img src={logo} alt="Logo Preview" className="h-full w-full object-contain" /> : <span className="text-xs text-gray-400">Preview</span>}
            </div>
            <label htmlFor="logo-upload" className="ml-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span>Upload Logo</span>
              <input id="logo-upload" name="logo" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
          {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Submit Application
        </button>
      </form>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, error, type = "text" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type={type} id={id} value={value} onChange={e => onChange(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default BecomeAVendorPage;