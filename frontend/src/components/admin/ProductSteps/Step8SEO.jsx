import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step8SEO = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Search Engine Optimization</h2>
      <p className="text-sm text-gray-500 mb-4">Improve how this product appears on Google and other search engines.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title Tag</label>
        <input 
          type="text" 
          {...register('seoTitle')}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Leave blank to use Product Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Meta Description</label>
        <p className="text-xs text-gray-400 mb-2">Optimal length is 150-160 characters.</p>
        <textarea 
          rows="3"
          {...register('seoDescription')}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Leave blank to use Short Description"
        ></textarea>
      </div>
    </div>
  );
};

export default Step8SEO;
