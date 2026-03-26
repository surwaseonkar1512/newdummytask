import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step3Description = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Product Descriptions</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <p className="text-xs text-gray-500 mb-2">A quick summary shown on product cards and preview snippets.</p>
        <textarea 
          rows="3"
          {...register('shortDescription')}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="E.g., A handcrafted 5ft bronze masterpiece representing peace and prosperity."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
        <p className="text-xs text-gray-500 mb-2">Detailed overview of the product, its origin, and significance.</p>
        <textarea 
          rows="6"
          {...register('description')}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Write the extensive product description here..."
        ></textarea>
      </div>
    </div>
  );
};

export default Step3Description;
