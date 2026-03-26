import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon } from 'lucide-react';
import GalleryModal from '../GalleryModal';

const Step1StoryBasic = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [showGallery, setShowGallery] = useState(false);
  
  const thumbnail = watch('thumbnail');
  const title = watch('title');

  const generateSlug = () => {
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug, { shouldValidate: true });
    }
  };

  const handleSelectImage = (imgObj) => {
    setValue('thumbnail', { url: imgObj.url, publicId: imgObj.publicId }, { shouldValidate: true });
    setShowGallery(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
         <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Case Study Information</h2>
         <label className="block text-sm font-medium text-gray-700 mb-1">Story Title <span className="text-red-500">*</span></label>
         <input 
           {...register('title', { required: 'Title is required' })}
           onBlur={generateSlug}
           className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
           placeholder="e.g. Shivaji Maharaj Statue at Taj Hotel"
         />
         {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug <span className="text-red-500">*</span></label>
         <input 
           {...register('slug', { required: 'Slug is required' })}
           className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all bg-gray-50 text-gray-600"
         />
         {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
      </div>

      <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
         <textarea 
           {...register('shortDescription', { required: 'Description is required' })}
           rows="3"
           placeholder="Summarize the installation or case study."
           className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
         />
         {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
      </div>

      <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">Primary Cover Image <span className="text-red-500">*</span></label>
         <div 
           onClick={() => setShowGallery(true)}
           className={`relative w-64 h-48 rounded-xl border-2 border-dashed ${!thumbnail?.url ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : 'border-purple-200'} flex items-center justify-center cursor-pointer overflow-hidden transition-colors`}
         >
           {thumbnail?.url ? (
             <img src={thumbnail.url} alt="Cover" className="w-full h-full object-cover" />
           ) : (
             <div className="text-center">
               <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
               <span className="text-sm font-medium text-purple-600">Select Thumbnail</span>
             </div>
           )}
         </div>
         <GalleryModal isOpen={showGallery} onClose={() => setShowGallery(false)} onSelect={handleSelectImage} />
      </div>

    </div>
  );
};

export default Step1StoryBasic;
