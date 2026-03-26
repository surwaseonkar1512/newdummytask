import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step8StorySettings = () => {
  const { register, watch } = useFormContext();
  
  const isPublished = watch('isPublished');
  const isFeatured = watch('isFeatured');

  return (
    <div className="space-y-8 max-w-xl">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Publication Settings</h2>

      {/* Publish Toggle */}
      <label className="flex items-start cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors">
        <div className="relative mt-1">
          <input type="checkbox" className="sr-only" {...register('isPublished')} />
          <div className={`block w-14 h-8 rounded-full transition-colors ${isPublished ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isPublished ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-4 flex-1">
          <div className="font-bold text-gray-900">Publish Case Study</div>
          <p className="text-sm text-gray-500 mt-1">If active, this story will be fully visible on the public website layout and portfolios.</p>
        </div>
      </label>

      {/* Featured Toggle */}
      <label className="flex items-start cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-yellow-200 transition-colors">
        <div className="relative mt-1">
          <input type="checkbox" className="sr-only" {...register('isFeatured')} />
          <div className={`block w-14 h-8 rounded-full transition-colors ${isFeatured ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isFeatured ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-4 flex-1">
          <div className="font-bold text-gray-900">Feature this Story</div>
          <p className="text-sm text-gray-500 mt-1">Featured stories appear at the top of the main portfolio layout dynamically or in scrolling carousels.</p>
        </div>
      </label>

    </div>
  );
};

export default Step8StorySettings;
