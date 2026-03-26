import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const BulletBlock = ({ index }) => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `contentBlocks.${index}.data.points`
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">List Title</label>
        <input 
          type="text" 
          {...register(`contentBlocks.${index}.data.title`)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="E.g., Key Features"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Bullet Points</label>
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="flex items-center text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Plus size={14} className="mr-1" /> Add Point
          </button>
        </div>

        {fields.length > 0 ? (
          <div className="space-y-2">
            {fields.map((item, pointIndex) => (
              <div key={item.id} className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                <input
                  {...register(`contentBlocks.${index}.data.points.${pointIndex}.value`, { required: true })}
                  placeholder="Enter list item..."
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-200 bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => remove(pointIndex)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-400">No bullet points added.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletBlock;
