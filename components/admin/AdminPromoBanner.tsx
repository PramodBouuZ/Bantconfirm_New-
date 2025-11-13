import React, { useState, useEffect } from 'react';
import { PromotionalBannerData } from '../../types';

interface AdminPromoBannerProps {
  bannerData: PromotionalBannerData;
  onSave: (data: PromotionalBannerData) => void;
}

const AdminPromoBanner: React.FC<AdminPromoBannerProps> = ({ bannerData, onSave }) => {
  const [formData, setFormData] = useState<PromotionalBannerData>(bannerData);
  const [saveMessage, setSaveMessage] = useState('');


  useEffect(() => {
    setFormData(bannerData);
  }, [bannerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveMessage("Promotional banner updated successfully!");
    setTimeout(() => setSaveMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Promotional Banner</h1>
        {saveMessage && <p className="text-green-600 font-semibold">{saveMessage}</p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium text-gray-700">Display Banner on Site</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
          <div className="flex items-center gap-4">
            <img src={formData.image} alt="Banner preview" className="w-48 h-24 object-cover rounded-lg bg-gray-100 border"/>
            <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span>Upload New Image</span>
              <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"/>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Text</label>
          <textarea id="text" name="text" value={formData.text} onChange={handleChange} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"></textarea>
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
          <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="https://example.com"/>
        </div>

        <div className="pt-4">
          <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPromoBanner;
