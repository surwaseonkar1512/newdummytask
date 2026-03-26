import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon } from 'lucide-react';
import GalleryModal from '../GalleryModal'; // Note: Adjust import if not exactly in parent

const ImageBlock = ({ index }) => {
  const { register, watch, setValue } = useFormContext();
  const [showGallery, setShowGallery] = useState(false);

  const watchUrl = watch(`contentBlocks.${index}.data.url`);

  const handleSelectImage = (imgObj) => {
    setValue(`contentBlocks.${index}.data.url`, imgObj.url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Block Image</label>
        
        <div 
          onClick={() => setShowGallery(true)}
          className={`relative w-full h-48 rounded-xl border-2 border-dashed ${!watchUrl ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : 'border-purple-200'} flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors`}
        >
          {watchUrl ? (
            <>
              <img src={watchUrl} alt="Block img" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium bg-black/80 px-3 py-1.5 rounded-full">Change Image</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
              <span className="text-sm font-medium text-purple-600">Select Image from Gallery</span>
            </div>
          )}
        </div>
        {/* Hidden field to keep react-hook-form sync if needed, though dynamically setting value is generally enough */}
        <input type="hidden" {...register(`contentBlocks.${index}.data.url`)} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Image Caption / Alt Text</label>
        <input 
          type="text" 
          {...register(`contentBlocks.${index}.data.caption`)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Short descriptive caption"
        />
      </div>

      {showGallery && (
        <GalleryModal 
          isOpen={showGallery} 
          onClose={() => setShowGallery(false)} 
          onSelect={handleSelectImage} 
        />
      )}
    </div>
  );
};

export default ImageBlock;
