import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import BannerForm from '../../components/admin/BannerForm';
import { bannerApi } from '../../api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await bannerApi.getAllAdmin();
      setBanners(data);
    } catch (error) {
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await bannerApi.toggleStatus(id);
      setBanners(banners?.map?.(b => b._id === id ? { ...b, isActive: !currentStatus } : b) || []);
      toast.success(`Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner? The image will remain in your master gallery.')) {
      try {
        await bannerApi.delete(id);
        setBanners(banners.filter(b => b._id !== id));
        toast.success('Banner deleted successfully');
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const openAddForm = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const openEditForm = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 size={40} className="animate-spin text-purple-600" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500 mt-2 text-sm">Design and manage your public website's hero gallery.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
        >
          <Plus size={18} className="mr-2" /> Add New Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {banners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-1/4">Preview</th>
                  <th className="px-6 py-4 font-semibold w-1/3">Heading & Slogan</th>
                  <th className="px-6 py-4 font-semibold text-center w-[15%]">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {banners?.map?.(banner => (
                  <tr key={banner._id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-32 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        {banner.image?.url ? (
                          <img src={banner.image.url} alt="banner" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-4 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 line-clamp-1">{banner.heading}</div>
                      {banner.slogan && <div className="text-sm text-gray-500 mt-1 line-clamp-1">{banner.slogan}</div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(banner._id, banner.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${banner.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditForm(banner)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(banner._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Banners Found</h3>
            <p className="text-sm">Create your first hero banner to showcase your art portfolio.</p>
          </div>
        )}
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => setShowForm(false)}
          onSuccess={fetchBanners}
        />
      )}
    </div>
  );
};

export default Banners;
