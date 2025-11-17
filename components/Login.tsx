


import React, { useState } from 'react';
import { User, TeamMember } from '../types';

interface LoginProps {
  onLogin: (user: User | TeamMember) => void;
  users: User[];
  teamMembers: TeamMember[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users, teamMembers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // NOTE: We are not checking the password for this demo.
    
    // Check internal team members first
    const teamMember = teamMembers.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (teamMember) {
        onLogin(teamMember);
        return;
    }

    // Then check customer users
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      onLogin(user);
      return;
    }
    
    setError('Invalid email or password.');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
      <p className="text-gray-600 mb-8 text-center">Log in to your BANTConfirm dashboard.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            placeholder="your.email@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div className="flex items-center justify-end">
            <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
                Forgot password?
            </a>
        </div>

        {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Login
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;