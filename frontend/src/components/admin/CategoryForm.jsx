import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import GalleryModal from './GalleryModal';
import { toast } from 'react-toastify';
import { categoryApi } from '../../api';

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const [showGallery, setShowGallery] = useState(false);
  // Banner uses object for image but schema for Category uses a string, so we'll store just the URL.
  const [selectedImage, setSelectedImage] = useState(category?.image || null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      heading: category?.heading || '',
      paragraph: category?.paragraph || ''
    }
  });

  const nameValue = watch('name');

  // Auto-fill slug when creating new category
  useEffect(() => {
    if (!category && nameValue) {
      const generatedSlug = nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: !!generatedSlug });
    }
  }, [nameValue, category, setValue]);

  const onSubmit = async (data) => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    const payload = {
      ...data,
      image: selectedImage
    };

    setSubmitting(true);
    try {
      if (category) {
        await categoryApi.update(category._id, payload);
        toast.success('Category updated successfully');
      } else {
        await categoryApi.create(payload);
        toast.success('Category created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          {/* Modal Body (Scrollable) */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              
              {/* Image Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image <span className="text-red-500">*</span></label>
                <div 
                  onClick={() => setShowGallery(true)}
                  className={`relative w-full h-40 rounded-xl border-2 border-dashed ${!selectedImage ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : 'border-purple-200'} flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors`}
                >
                  {selectedImage ? (
                    <>
                      <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium bg-black/80 px-4 py-2 rounded-full cursor-pointer">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                      <span className="text-sm font-medium text-purple-600">Select from Gallery</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      {...register('name', { required: 'Name is required' })}
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-200 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-purple-500 bg-gray-50'}`}
                      placeholder="E.g., Shivaji Maharaj Statue"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input 
                      type="text" 
                      {...register('slug')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
                      placeholder="Auto-generated if left empty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                  <input 
                    type="text" 
                    {...register('heading')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
                    placeholder="Optional heading for category page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
                  <textarea 
                    rows="3"
                    {...register('paragraph')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
                    placeholder="Optional descriptive paragraph"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-100 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 shadow-md shadow-purple-600/20 transition-all">
              {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
              {submitting ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>

      <GalleryModal 
        isOpen={showGallery} 
        onClose={() => setShowGallery(false)} 
        onSelect={(img) => { 
          // extract url string from Gallery image object
          setSelectedImage(img.url); 
          setShowGallery(false); 
        }} 
      />
    </div>
  );
};

export default CategoryForm;
