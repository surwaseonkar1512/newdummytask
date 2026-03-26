import React, { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const Step4Pricing = () => {
  const { register, control, watch } = useFormContext();
  const productType = watch('productType');
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes"
  });

  // Ensure there's at least one row by default for Fixed Price
  useEffect(() => {
    if (fields.length === 0 && productType === 'Fixed Price') {
      append({ label: '', price: 0, stock: 0 });
    }
  }, [fields, append, productType]);

  if (productType === 'Custom') {
    return (
      <div className="py-20 text-center text-gray-500">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing Hidden</h3>
        <p>This product is set to "Custom Order". Pricing and sizes are discussed dynamically per inquiry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-900">Pricing & Size Variations</h2>
        <button
          type="button"
          onClick={() => append({ label: '', price: 0, stock: 0 })}
          className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
        >
          <Plus size={16} className="mr-1" /> Add Size Variant
        </button>
      </div>
      
      <p className="text-sm text-gray-500">Provide different dimension variations, pricing, and current inventory stock for this item.</p>

      {fields.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-2 py-3 bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Size Label</div>
            <div className="col-span-3">Price (₹)</div>
            <div className="col-span-3">Stock</div>
            <div className="col-span-1 border-gray-100 text-center">Delete</div>
          </div>
          
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-bottom-2">
              <div className="col-span-5">
                <input
                  {...register(`sizes.${index}.label`, { required: true })}
                  placeholder="E.g., 3ft Bronze Base"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  {...register(`sizes.${index}.price`, { required: true, valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  {...register(`sizes.${index}.stock`, { valueAsNumber: true })}
                  placeholder="Stock"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">No size variants added.</p>
        </div>
      )}
    </div>
  );
};

export default Step4Pricing;
