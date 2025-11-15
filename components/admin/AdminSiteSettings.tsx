
import React, { useState, useEffect } from 'react';
import { SiteConfig } from '../../types';

interface AdminSiteSettingsProps {
  siteConfig: SiteConfig;
  onSave: (data: SiteConfig) => void;
}

const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ siteConfig, onSave }) => {
  const [formData, setFormData] = useState<SiteConfig>(siteConfig);
  const [saveMessage, setSaveMessage] = useState('');


  useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle nested state for promoBanner
    if (name in formData.promoBanner) {
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, promoBanner: { ...prev.promoBanner, [name]: checked } }));
        } else {
            setFormData(prev => ({ ...prev, promoBanner: { ...prev.promoBanner, [name]: value } }));
        }
    } 
    // Handle nested state for socialLinks
    else if (name in formData.socialLinks) {
        setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, promoBanner: { ...prev.promoBanner, image: reader.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveMessage("Site settings updated successfully!");
    setTimeout(() => setSaveMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        {saveMessage && <p className="text-green-600 font-semibold">{saveMessage}</p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        
        {/* Promotional Banner Section */}
        <div className="space-y-6 pt-8">
            <h2 className="text-lg font-semibold text-gray-800">Promotional Banner</h2>
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.promoBanner.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-gray-700">Display Banner on Site</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <div className="flex items-center gap-4">
                <img src={formData.promoBanner.image} alt="Banner preview" className="w-48 h-24 object-cover rounded-lg bg-gray-100 border"/>
                <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <span>Upload New Image</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.promoBanner.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"/>
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea id="text" name="text" value={formData.promoBanner.text} onChange={handleChange} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"></textarea>
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input type="url" id="link" name="link" value={formData.promoBanner.link} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="https://example.com"/>
            </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-6 pt-8">
            <h2 className="text-lg font-semibold text-gray-800">Social Media Links</h2>
             <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" id="linkedin" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="https://linkedin.com/company/your-page"/>
            </div>
             <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" id="instagram" name="instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="https://instagram.com/your-profile"/>
            </div>
             <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" id="facebook" name="facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="https://facebook.com/your-page"/>
            </div>
        </div>

        <div className="pt-8">
          <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteSettings;
