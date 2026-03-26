import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import CategoryForm from '../../components/admin/CategoryForm';
import { categoryApi } from '../../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryApi.delete(id);
        setCategories(categories.filter(c => c._id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const openAddForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center flex-1 h-full items-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage product and statue categories for your store.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
        >
          <Plus size={18} className="mr-2" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-1/4">Image</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Name & Slug</th>
                  <th className="px-6 py-4 font-semibold w-1/4">Heading</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-6 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 line-clamp-1">{cat.name}</div>
                      <div className="text-sm text-gray-400 mt-1 line-clamp-1">/{cat.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm line-clamp-2">{cat.heading || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditForm(cat)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-28 text-gray-500 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ImageIcon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-sm">Create your first category to start organizing your products.</p>
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setShowForm(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;
