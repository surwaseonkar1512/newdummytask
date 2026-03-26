import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Star } from 'lucide-react';

const Step6StoryTestimonial = () => {
  const { register, watch, setValue } = useFormContext();
  const rating = watch('testimonial.rating');

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">Client Testimonial</h2>
      
      <div className="bg-yellow-50/50 border border-yellow-100 p-6 rounded-2xl space-y-6">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
           <input 
             {...register('testimonial.clientName')}
             className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-200 outline-none"
             placeholder="e.g. Mukesh Ambani"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
           <input 
             {...register('testimonial.designation')}
             className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-200 outline-none"
             placeholder="e.g. Chairman, Reliance"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Message</label>
           <textarea 
             {...register('testimonial.message')}
             rows="4"
             className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-200 outline-none italic text-gray-600"
             placeholder='"The attention to detail and craftsmanship exceeded our expectations..."'
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Rating ({rating || 5} Stars)</label>
           <div className="flex gap-2">
             {[1,2,3,4,5].map(star => (
               <button
                 key={star}
                 type="button"
                 onClick={() => setValue('testimonial.rating', star)}
                 className="focus:outline-none hover:scale-110 transition-transform"
               >
                 <Star 
                   size={32} 
                   className={star <= (rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                 />
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Step6StoryTestimonial;
