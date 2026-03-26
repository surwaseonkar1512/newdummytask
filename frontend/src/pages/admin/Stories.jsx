import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Star, Link as LinkIcon, Check, X, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { storyApi } from '../../api/storyApi';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storyApi.getAllAdmin();
      setStories(data);
    } catch (error) {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      try {
        await storyApi.delete(id);
        toast.success('Story deleted safely');
        setStories(stories.filter(s => s._id !== id));
      } catch (error) {
        toast.error('Failed to delete story');
      }
    }
  };

  const togglePublish = async (story) => {
    try {
      const updated = await storyApi.update(story._id, { isPublished: !story.isPublished });
      toast.success(`Story ${updated.isPublished ? 'published' : 'unpublished'}`);
      setStories(stories.map(s => s._id === story._id ? updated : s));
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  const toggleFeatured = async (story) => {
    try {
      const updated = await storyApi.update(story._id, { isFeatured: !story.isFeatured });
      toast.success(`Story ${updated.isFeatured ? 'featured' : 'unfeatured'}`);
      setStories(stories.map(s => s._id === story._id ? updated : s));
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const filteredStories = stories.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Case Studies & Stories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage installation stories, before/after galleries, and client testimonials.</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="flex items-center px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Add New Story
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search stories by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-semibold text-center w-16">Image</th>
                <th className="p-4 font-semibold">Story Details</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading stories...</td>
                </tr>
              ) : filteredStories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No stories found. Create your first case study!</td>
                </tr>
              ) : (
                filteredStories.map((story) => (
                  <tr key={story._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden mx-auto border border-gray-200">
                        {story.thumbnail?.url ? (
                          <img src={story.thumbnail.url} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={18} /></div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 line-clamp-1">{story.title}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <LinkIcon size={12} className="mr-1" /> /{story.slug}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {story.location?.city ? `${story.location.city}, ${story.location.country}` : 'No location set'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => togglePublish(story)}
                        className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center transition-colors ${story.isPublished ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {story.isPublished ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                        {story.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleFeatured(story)}
                        className={`p-1.5 rounded-full inline-flex items-center transition-colors ${story.isFeatured ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <Star size={18} className={story.isFeatured ? 'fill-yellow-500' : ''} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/stories/edit/${story._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(story._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stories;
