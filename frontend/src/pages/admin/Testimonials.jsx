import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Star, X, Check, Image as ImageIcon } from 'lucide-react';
import { testimonialApi } from '../../api/testimonialApi';
import { toast } from 'react-toastify';
import moment from 'moment';
import GalleryModal from '../../components/admin/GalleryModal';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { rating: 5, isVisible: true, isFeatured: false }
  });

  const currentImage = watch('image');
  const currentRating = watch('rating');

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialApi.getAll(); // Admin gets all regardless of visibility
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openDrawer = (testimonial = null) => {
    if (testimonial) {
      setEditingId(testimonial._id);
      reset(testimonial);
    } else {
      setEditingId(null);
      reset({ rating: 5, isVisible: true, isFeatured: false, image: null });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await testimonialApi.update(editingId, data);
        toast.success('Testimonial updated');
      } else {
        await testimonialApi.create(data);
        toast.success('Testimonial added');
      }
      fetchTestimonials();
      closeDrawer();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialApi.delete(id);
        toast.success('Testimonial deleted');
        fetchTestimonials();
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const toggleStatus = async (testimonial, field) => {
    try {
      await testimonialApi.update(testimonial._id, { [field]: !testimonial[field] });
      fetchTestimonials();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleSelectImage = (imgObj) => {
    setValue('image', { url: imgObj.url, publicId: imgObj.publicId }, { shouldValidate: true });
    setShowGallery(false);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Manage testimonials to display on the public storefront.</p>
        </div>
        <button
          onClick={() => openDrawer()}
          className="flex items-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add Client Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-4 rounded-tl-xl whitespace-nowrap">Client</th>
                <th className="p-4">Message Segment</th>
                <th className="p-4 text-center">Rating</th>
                <th className="p-4 text-center">Visibility</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading testimonials?...</td></tr>
              ) : testimonials?.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No testimonials captured yet.</td></tr>
              ) : (
                testimonials?.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 w-64">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-3 shrink-0 overflow-hidden">
                          {item.image?.url ? <img src={item.image.url} alt={item.clientName} className="w-full h-full object-cover" /> : item.clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{item.clientName}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.designation} {item.company && `@ ${item.company}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 italic">
                      <p className="line-clamp-2 text-xs">"{item.testimonialText}"</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center text-yellow-500">
                        {item.rating} <Star size={14} className="ml-1 fill-yellow-500" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStatus(item, 'isVisible')}
                        className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center transition-colors ${item.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {item.isVisible ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                        {item.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStatus(item, 'isFeatured')}
                        className={`p-1.5 rounded-full inline-flex items-center transition-colors ${item.isFeatured ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <Star size={18} className={item.isFeatured ? 'fill-yellow-500' : ''} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openDrawer(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">

            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Review' : 'New Review'}</h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="testimonial-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Photo Picker */}
                <div className="flex justify-center">
                  <div
                    onClick={() => setShowGallery(true)}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors overflow-hidden relative group"
                  >
                    {currentImage?.url ? (
                      <>
                        <img src={currentImage.url} alt="Client" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="text-gray-300" size={32} />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input {...register('clientName', { required: 'Name is required' })} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200" placeholder="e.g. Mukesh Ambani" />
                  {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input {...register('designation')} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200" placeholder="e.g. CEO" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input {...register('company')} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200" placeholder="e.g. Reliance" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setValue('rating', star)} className="hover:scale-110 transition-transform">
                        <Star size={28} className={star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text *</label>
                  <textarea {...register('testimonialText', { required: 'Text is required' })} rows="4" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200" placeholder="Absolutely incredible craftsmanship..." />
                  {errors.testimonialText && <p className="text-red-500 text-xs mt-1">{errors.testimonialText.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input {...register('location')} className="w-full px-4 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200" placeholder="e.g. Mumbai, India" />
                </div>

                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" {...register('isVisible')} className="w-4 h-4 text-purple-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">Publicly Visible</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-yellow-500 rounded" />
                    <span className="text-sm font-medium text-gray-700">Featured (Homepage)</span>
                  </label>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <button
                type="submit"
                form="testimonial-form"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Re-use our Gallery tool so they can pull images directly from Cloudinary seamlessly */}
      <GalleryModal isOpen={showGallery} onClose={() => setShowGallery(false)} onSelect={handleSelectImage} />
    </div>
  );
};

export default Testimonials;
