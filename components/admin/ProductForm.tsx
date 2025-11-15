import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

interface ProductFormProps {
    product: Product | null;
    onSave: (product: Product | Omit<Product, 'id'>) => void;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState('');
    const [error, setError] = useState('');

    const isEditing = product !== null;

    useEffect(() => {
        if (product) {
            setName(product.name);
            setImage(product.image);
            setPrice(product.price);
            setPriceUnit(product.priceUnit || '');
            setDescription(product.description);
            setFeatures(product.features.join('\n'));
        }
    }, [product]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !price.trim() || !description.trim()) {
            setError('Name, Price, and Description are required.');
            return;
        }

        const featuresArray = features.split('\n').map(f => f.trim()).filter(f => f);
        
        const productData = {
            name,
            image,
            price,
            priceUnit,
            description,
            features: featuresArray
        };

        if (isEditing) {
            onSave({ ...product, ...productData });
        } else {
            onSave(productData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <div className="mt-1 flex items-center">
                            <div className="flex-shrink-0 h-24 w-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                {image ? <img src={image} alt="Preview" className="h-full w-full object-cover" /> : <span className="text-xs text-gray-400">Preview</span>}
                            </div>
                            <label htmlFor="image-upload" className="ml-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <span>Change Image</span>
                                <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="e.g., ₹159"/>
                        </div>
                        <div>
                            <label htmlFor="priceUnit" className="block text-sm font-medium text-gray-700 mb-1">Price Unit</label>
                            <input type="text" id="priceUnit" value={priceUnit} onChange={(e) => setPriceUnit(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="e.g., / month"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"></textarea>
                    </div>
                    <div>
                        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                        <textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" placeholder="Enter one feature per line"></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;