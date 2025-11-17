

import React, { useState } from 'react';
import { User } from '../types';

interface SignupProps {
  onSignup: (user: Omit<User, 'id'>) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: Omit<User, 'id'> = { 
      name, 
      companyName, 
      email, 
      mobile, 
      location,
      isAdmin: false, // New users are never admins by default
    };
    // In a real app, you would also handle the password securely.
    onSignup(newUser);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Your Account</h2>
      <p className="text-gray-600 mb-8 text-center">Join the BANTConfirm marketplace today.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
          <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Optional)</label>
          <input type="tel" id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Create Account
        </button>
      </form>
       <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
          Log In
        </a>
      </p>
    </div>
  );
};

export default Signup;