import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, Star, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAllAdmin();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id);
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await productApi.toggleFeatured(id);
      setProducts(products.map(p => p._id === id ? { ...p, featured: !p.featured } : p));
      toast.success('Featured status updated');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleToggleVisible = async (id) => {
    try {
      await productApi.toggleVisible(id);
      setProducts(products.map(p => p._id === id ? { ...p, isVisible: !p.isVisible } : p));
      toast.success('Visibility status updated');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">Published</span>;
      case 'Draft': return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-semibold">Draft</span>;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center flex-1 h-full items-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your entire product catalog and custom statues.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
        >
          <Plus size={18} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-16">Image</th>
                  <th className="px-6 py-4 font-semibold w-1/4">Product Info</th>
                  <th className="px-6 py-4 font-semibold w-32">Category</th>
                  <th className="px-6 py-4 font-semibold text-center w-28">Status</th>
                  <th className="px-6 py-4 font-semibold text-center w-32">Quick Actions</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {prod.thumbnail ? (
                          <img src={prod.thumbnail} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-4 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 line-clamp-1">{prod.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">SKU: {prod.sku}</span>
                        {prod.productType === 'Custom' && (
                          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">Custom</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{prod.category?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(prod.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleToggleFeatured(prod._id)}
                          className={`p-1.5 rounded-md transition-colors ${prod.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'} cursor-pointer`}
                          title="Toggle Featured"
                        >
                          <Star size={16} className={prod.featured ? 'fill-current' : ''} />
                        </button>
                        <button 
                          onClick={() => handleToggleVisible(prod._id)}
                          className={`p-1.5 rounded-md transition-colors ${prod.isVisible ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-100'} cursor-pointer`}
                          title="Toggle Visibility"
                        >
                          {prod.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/admin/products/${prod._id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(prod._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-sm">Start building out your art and statue catalog today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
