import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Video } from 'lucide-react';

const VideoBlock = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <Video size={14} className="mr-1 text-red-500" /> YouTube Embed URL
        </label>
        <p className="text-xs text-gray-400 mb-2">Provide the embed link, usually formatted like: `https://www.youtube.com/embed/XXXXX`</p>
        <input
          type="text"
          {...register(`contentBlocks.${index}.data.url`)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50 transition-colors"
          placeholder="https://www.youtube.com/embed/..."
        />
      </div>
    </div>
  );
};

export default VideoBlock;
