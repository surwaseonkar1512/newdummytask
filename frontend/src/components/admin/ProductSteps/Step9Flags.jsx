import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Star, Eye, Tag, RefreshCcw } from 'lucide-react';

const Step9Flags = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Status & Visibility Flags</h2>
      
      <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 mb-6">
        <label className="block text-sm font-bold text-purple-900 mb-2">Publishing Status</label>
        <select 
          {...register('status')}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 bg-white transition-colors"
        >
          <option value="Draft">Draft (Hidden from public)</option>
          <option value="Published">Published (Live on site)</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <input type="checkbox" {...register('isVisible')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 transition-colors"></div>
          <div className="ml-4 flex items-center">
            <Eye size={18} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Visible in Catalog</span>
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">(Turn off to hide without deleting)</span>
          </div>
        </label>

        <label className="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <input type="checkbox" {...register('featured')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500 transition-colors"></div>
          <div className="ml-4 flex items-center">
            <Star size={18} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Featured Placement</span>
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">(Shows on homepage)</span>
          </div>
        </label>

        <label className="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <input type="checkbox" {...register('bestSeller')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 transition-colors"></div>
          <div className="ml-4 flex items-center">
            <Tag size={18} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Best Seller Tag</span>
          </div>
        </label>

        <label className="flex items-center cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
          <input type="checkbox" {...register('recent')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 transition-colors"></div>
          <div className="ml-4 flex items-center">
            <RefreshCcw size={18} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Mark as New Arrival</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Step9Flags;
