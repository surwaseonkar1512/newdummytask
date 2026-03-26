import React from 'react';
import { useFormContext } from 'react-hook-form';

const TextBlock = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Heading</label>
        <input 
          type="text" 
          {...register(`contentBlocks.${index}.data.heading`)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Section Title"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Paragraph Text</label>
        <textarea 
          rows="4"
          {...register(`contentBlocks.${index}.data.paragraph`)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="Write your long-form text here..."
        ></textarea>
      </div>
    </div>
  );
};

export default TextBlock;
