import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Type, Image as ImageIcon, Video, List, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import BulletBlock from './BulletBlock';

const Step6ContentBuilder = () => {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "contentBlocks"
  });

  const addBlock = (type) => {
    let emptyData = {};
    if (type === 'text') emptyData = { heading: '', paragraph: '' };
    if (type === 'image') emptyData = { url: '', caption: '' };
    if (type === 'video') emptyData = { url: '' };
    if (type === 'bullet') emptyData = { title: '', points: [{ value: '' }] }; // using {value: ''} for field array nested strings

    append({ type, data: emptyData });
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case 'text': return <Type size={18} className="text-blue-500" />;
      case 'image': return <ImageIcon size={18} className="text-purple-500" />;
      case 'video': return <Video size={18} className="text-red-500" />;
      case 'bullet': return <List size={18} className="text-green-500" />;
      default: return null;
    }
  };

  const getBlockTitle = (type) => type.charAt(0).toUpperCase() + type.slice(1) + ' Block';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Dynamic Content Builder</h2>
        <p className="text-sm text-gray-500 mt-2">Construct a rich, multimedia product description page by stacking blocks.</p>
      </div>

      {fields.length > 0 ? (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              
              {/* Block Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  {getBlockIcon(field.type)}
                  {getBlockTitle(field.type)}
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-200 transition-colors"><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-200 transition-colors"><ArrowDown size={16} /></button>
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                  <button type="button" onClick={() => remove(index)} className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Block Body */}
              <div className="p-5">
                {field.type === 'text' && <TextBlock index={index} />}
                {field.type === 'image' && <ImageBlock index={index} />}
                {field.type === 'video' && <VideoBlock index={index} />}
                {field.type === 'bullet' && <BulletBlock index={index} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">No content blocks added yet.</p>
          <p className="text-xs text-gray-400">Add a block below to start building the page layout.</p>
        </div>
      )}

      <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-purple-900">Add Section:</span>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => addBlock('text')} className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:shadow-sm border border-gray-200 transition-all">
            <Type size={16} className="text-blue-500 mr-2" /> Text
          </button>
          <button type="button" onClick={() => addBlock('image')} className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:shadow-sm border border-gray-200 transition-all">
            <ImageIcon size={16} className="text-purple-500 mr-2" /> Image
          </button>
          <button type="button" onClick={() => addBlock('video')} className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:shadow-sm border border-gray-200 transition-all">
            <Video size={16} className="text-red-500 mr-2" /> Video
          </button>
          <button type="button" onClick={() => addBlock('bullet')} className="flex items-center px-4 py-2 bg-white text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:shadow-sm border border-gray-200 transition-all">
            <List size={16} className="text-green-500 mr-2" /> Bullets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6ContentBuilder;
