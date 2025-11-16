import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../types';

interface CategoryFormProps {
    category: ProductCategory | null;
    onSave: (category: ProductCategory | Omit<ProductCategory, 'id'>) => void;
    onCancel: () => void;
    existingNames: string[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel, existingNames }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const isEditing = category !== null;

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Category name is required.');
            return;
        }

        const isNameTaken = existingNames.some(
            existingName => existingName.toLowerCase() === name.trim().toLowerCase() && (isEditing ? category.name.toLowerCase() !== name.trim().toLowerCase() : true)
        );

        if (isNameTaken) {
            setError('A category with this name already exists.');
            return;
        }

        const categoryData = { name: name.trim() };

        if (isEditing) {
            onSave({ ...category, ...categoryData });
        } else {
            onSave(categoryData);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" 
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
