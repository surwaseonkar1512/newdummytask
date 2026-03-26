import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const Step4StoryProcess = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'processSteps'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Process Timeline</h2>
      <p className="text-sm text-gray-500">Document the step-by-step lifecycle of this installation.</p>

      <div className="space-y-4 max-w-3xl">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-4 transition-all">
            <div className="mt-2 text-gray-400 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1 space-y-3">
              <input
                {...register(`processSteps.${index}.title`)}
                placeholder="e.g. Design & Drafting"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none font-bold text-gray-900"
              />
              <textarea
                {...register(`processSteps.${index}.description`)}
                placeholder="Describe the activities performed in this step..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none text-sm"
              />
            </div>
            
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => append({ title: '', description: '' })}
          className="flex items-center px-4 py-2 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 w-full justify-center border-dashed"
        >
          <Plus size={16} className="mr-2" /> Add Timeline Event
        </button>
      </div>
    </div>
  );
};

export default Step4StoryProcess;
