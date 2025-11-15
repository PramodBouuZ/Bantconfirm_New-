
import React, { useState, useEffect } from 'react';
import { RequirementListing, ListingCategory, User } from '../types';

interface PostRequirementFormProps {
  onPost: (details: Omit<RequirementListing, 'id' | 'postedDate' | 'aiMatches' | 'status' | 'assignedVendorNames'>) => void;
  currentUser: User | null;
}

const PostRequirementForm: React.FC<PostRequirementFormProps> = ({ onPost, currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Software');
  const [authorName, setAuthorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.name);
      setCompanyName(currentUser.companyName || '');
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !authorName.trim()) {
      setError('Title, Description, and Your Name are required.');
      return;
    }
    setError('');
    onPost({ 
        title: title.trim(), 
        description: description.trim(), 
        category, 
        authorName: authorName.trim(), 
        companyName: companyName.trim() 
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Post Your Requirement</h2>
      <p className="text-gray-600 mb-8 text-center">Let vendors and service providers find you. Fill out the details of your need below.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Requirement Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Need a new CRM for 50 users"
          />
        </div>
         <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            placeholder="John Doe"
            disabled={!!currentUser}
          />
        </div>
         <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            placeholder="Acme Inc."
             disabled={!!currentUser && !!currentUser.companyName}
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Service">Service</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            rows={5}
            placeholder="Describe your needs, requirements, timeline, budget, etc."
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Post to Marketplace
        </button>
      </form>
    </div>
  );
};

export default PostRequirementForm;
