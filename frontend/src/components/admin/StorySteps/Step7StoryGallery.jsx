import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import GalleryModal from '../GalleryModal';

const Step7StoryGallery = () => {
  const { watch, setValue } = useFormContext();
  const [showGallery, setShowGallery] = useState(false);
  
  const galleryImages = watch('galleryImages') || [];

  const handleSelectImage = (imgObj) => {
    setValue('galleryImages', [...galleryImages, { url: imgObj.url, publicId: imgObj.publicId }]);
  };

  const removeImage = (index) => {
    setValue('galleryImages', galleryImages.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Massive Architecture Gallery</h2>
      <p className="text-sm text-gray-500 mb-6">Attach infinite images to show off the completed installation from every possible angle.</p>
      
      <div className="flex flex-wrap gap-4">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="relative w-36 h-36 rounded-xl border border-gray-200 overflow-hidden group shadow-sm bg-white">
            <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:bg-red-600 shadow-md"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="w-36 h-36 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition-colors text-gray-400 bg-white"
        >
          <Plus size={32} className="mb-2 transition-transform" />
          <span className="text-sm font-medium">Add Gallery Map</span>
        </button>
      </div>

      <GalleryModal 
        isOpen={showGallery} 
        onClose={() => setShowGallery(false)} 
        onSelect={handleSelectImage} 
      />
    </div>
  );
};

export default Step7StoryGallery;
