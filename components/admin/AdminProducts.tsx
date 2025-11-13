import React, { useState } from 'react';
import { Product } from '../../types';
import ProductForm from './ProductForm';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';

interface AdminProductsProps {
    products: Product[];
    onAdd: (product: Omit<Product, 'id'>) => void;
    onUpdate: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ products, onAdd, onUpdate, onDelete }) => {
    const [editingProduct, setEditingProduct] = useState<Product | 'new' | null>(null);

    const handleSave = (product: Product | Omit<Product, 'id'>) => {
        if ('id' in product) {
            onUpdate(product);
        } else {
            onAdd(product);
        }
        setEditingProduct(null);
    };

    const handleDelete = (product: Product) => {
        if (window.confirm(`Are you sure you want to delete the product "${product.name}"?`)) {
            onDelete(product.id);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {editingProduct && (
                <ProductForm
                    product={editingProduct === 'new' ? null : editingProduct}
                    onSave={handleSave}
                    onCancel={() => setEditingProduct(null)}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                <button
                    onClick={() => setEditingProduct('new')}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Add New Product
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.features.join(', ')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100"
                                        aria-label={`Edit ${product.name}`}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                        aria-label={`Delete ${product.name}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No products found. Click 'Add New Product' to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
