import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import GalleryModal from '../GalleryModal';

const Step2Media = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [showGallery, setShowGallery] = useState({ open: false, type: null }); // type: 'thumbnail' | 'image'
  
  const thumbnail = watch('thumbnail');
  const images = watch('images') || [];

  const handleSelectImage = (imgObj) => {
    if (showGallery.type === 'thumbnail') {
      setValue('thumbnail', imgObj.url, { shouldValidate: true });
    } else {
      setValue('images', [...images, imgObj.url]);
    }
  };

  const removeImage = (indexToRemove) => {
    setValue('images', images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Product Media</h2>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Thumbnail <span className="text-red-500">*</span></label>
        <p className="text-xs text-gray-500 mb-3">This image will appear on the catalog page and search results.</p>
        
        <div 
          onClick={() => setShowGallery({ open: true, type: 'thumbnail' })}
          className={`relative w-48 h-48 rounded-xl border-2 border-dashed ${!thumbnail ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : 'border-purple-200'} flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors`}
        >
          {thumbnail ? (
            <>
              <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium bg-black/80 px-3 py-1.5 rounded-full">Change</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
              <span className="text-sm font-medium text-purple-600">Select Thumbnail</span>
            </div>
          )}
        </div>
        {errors.thumbnail && <p className="text-red-500 text-xs mt-2 font-medium">{errors.thumbnail.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Gallery Images</label>
        <p className="text-xs text-gray-500 mb-4">Add multiple angles to show off details of your product.</p>
        
        <div className="flex flex-wrap gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-32 h-32 rounded-xl border border-gray-200 overflow-hidden group">
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowGallery({ open: true, type: 'image' })}
            className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition-colors text-gray-400 group"
          >
            <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Add Image</span>
          </button>
        </div>
      </div>

      <GalleryModal 
        isOpen={showGallery.open} 
        onClose={() => setShowGallery({ open: false, type: null })} 
        onSelect={handleSelectImage} 
      />
    </div>
  );
};

export default Step2Media;
