import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import GalleryModal from '../GalleryModal';

const Step3StoryBeforeAfter = () => {
  const { watch, setValue } = useFormContext();
  const [showGallery, setShowGallery] = useState({ open: false, type: null }); // type: 'before' | 'after'
  
  const beforeImages = watch('beforeImages') || [];
  const afterImages = watch('afterImages') || [];

  const handleSelectImage = (imgObj) => {
    if (showGallery.type === 'before') {
      setValue('beforeImages', [...beforeImages, { url: imgObj.url, publicId: imgObj.publicId }]);
    } else {
      setValue('afterImages', [...afterImages, { url: imgObj.url, publicId: imgObj.publicId }]);
    }
  };

  const removeImage = (type, index) => {
    if (type === 'before') {
      setValue('beforeImages', beforeImages.filter((_, idx) => idx !== index));
    } else {
      setValue('afterImages', afterImages.filter((_, idx) => idx !== index));
    }
  };

  const ImageGrid = ({ title, type, images }) => (
    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-32 h-32 rounded-xl border border-gray-200 overflow-hidden group shadow-sm bg-white">
            <img src={img.url} alt={`${type} ${idx}`} className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(type, idx)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:bg-red-600 shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowGallery({ open: true, type })}
          className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition-colors text-gray-400 bg-white"
        >
          <Plus size={24} className="mb-2 transition-transform" />
          <span className="text-xs font-medium">Add Image</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Before & After Perspectives</h2>
      <p className="text-sm text-gray-500 mb-4">Showcase the transformation. These images will be mapped into side-by-side comparators on the frontend.</p>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ImageGrid title="Before Installation" type="before" images={beforeImages} />
        <ImageGrid title="After Installation" type="after" images={afterImages} />
      </div>

      <GalleryModal 
        isOpen={showGallery.open} 
        onClose={() => setShowGallery({ open: false, type: null })} 
        onSelect={handleSelectImage} 
      />
    </div>
  );
};

export default Step3StoryBeforeAfter;
