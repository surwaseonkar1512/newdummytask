import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const Step5Specs = () => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
        <button
          type="button"
          onClick={() => append({ key: '', value: '' })}
          className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
        >
          <Plus size={16} className="mr-1" /> Add Specification
        </button>
      </div>
      
      <p className="text-sm text-gray-500">Highlight important facts like material, weight, artisanship, and origin in a clean table format.</p>

      {fields.length > 0 ? (
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-3 items-center animate-in fade-in slide-in-from-bottom-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
              <div className="w-1/3">
                <input
                  {...register(`specifications.${index}.key`, { required: true })}
                  placeholder="Key (e.g. Material)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none bg-white"
                />
              </div>
              <div className="flex-1">
                <input
                  {...register(`specifications.${index}.value`, { required: true })}
                  placeholder="Value (e.g. Pure Bronze 99%)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm mb-4">You haven't added any specifications yet.</p>
          <button
            type="button"
            onClick={() => append({ key: 'Material', value: '' })}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Start with "Material"
          </button>
        </div>
      )}
    </div>
  );
};

export default Step5Specs;
