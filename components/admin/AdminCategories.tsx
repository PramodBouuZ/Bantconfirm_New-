import React, { useState, useMemo } from 'react';
import { ProductCategory, Product } from '../../types';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import CategoryForm from './CategoryForm';

interface AdminCategoriesProps {
    categories: ProductCategory[];
    products: Product[];
    onAdd: (category: Omit<ProductCategory, 'id'>) => void;
    onUpdate: (category: ProductCategory) => void;
    onDelete: (categoryId: number) => void;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, products, onAdd, onUpdate, onDelete }) => {
    const [editingCategory, setEditingCategory] = useState<ProductCategory | 'new' | null>(null);

    const categoriesWithCounts = useMemo(() => {
        return categories.map(category => ({
            ...category,
            productCount: products.filter(p => p.category === category.name).length,
        }));
    }, [categories, products]);
    
    const handleSave = (categoryData: ProductCategory | Omit<ProductCategory, 'id'>) => {
        if ('id' in categoryData) {
            onUpdate(categoryData);
        } else {
            onAdd(categoryData);
        }
        setEditingCategory(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingCategory && (
                <CategoryForm 
                    category={editingCategory === 'new' ? null : editingCategory}
                    onSave={handleSave}
                    onCancel={() => setEditingCategory(null)}
                    existingNames={categories.map(c => c.name)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Product Categories</h1>
                 <button onClick={() => setEditingCategory('new')} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Add New Category
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Count</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categoriesWithCounts.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.productCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                     <button 
                                        onClick={() => setEditingCategory(category)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"
                                        aria-label={`Edit category ${category.name}`}
                                     >
                                        <EditIcon />
                                     </button>
                                    <button 
                                        onClick={() => onDelete(category.id)} 
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                        aria-label={`Delete category ${category.name}`}
                                        disabled={category.productCount > 0}
                                        title={category.productCount > 0 ? 'Cannot delete category in use' : 'Delete category'}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No categories found. Click 'Add New Category' to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;