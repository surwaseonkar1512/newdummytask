import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step2StoryLocation = () => {
  const { register } = useFormContext();
  
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Installation Location</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700 mb-1">Place Name / Institution</label>
           <input 
             {...register('location.placeName')}
             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none"
             placeholder="e.g. Taj Hotel Lobby"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
           <input 
             {...register('location.city')}
             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none"
             placeholder="e.g. Mumbai"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
           <input 
             {...register('location.state')}
             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none"
             placeholder="e.g. Maharashtra"
           />
        </div>

        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
           <input 
             {...register('location.country')}
             className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none"
             defaultValue="India"
           />
        </div>
      </div>
    </div>
  );
};

export default Step2StoryLocation;
