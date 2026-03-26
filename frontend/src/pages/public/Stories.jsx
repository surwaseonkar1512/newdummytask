import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, MapPin, Search } from 'lucide-react';
import { storyApi } from '../../api/storyApi';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await storyApi.getAllPublic(); // ONLY pulls isPublished=true
        setStories(data);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = stories.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.location?.city && s.location.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">Masterpiece Installations</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore our portfolio of monumental case studies, from intimate gallery commissions to towering public landmarks. Witness the scale, process, and incredible before-and-after transformations.
        </p>

        <div className="max-w-lg mx-auto mt-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by monument or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border-0 focus:ring-2 focus:ring-purple-500 shadow-xl shadow-gray-200/50 outline-none text-gray-700 bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredStories.map((story) => (
              <Link key={story._id} to={`/stories/${story.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 flex flex-col border border-gray-100">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {story.thumbnail?.url ? (
                    <img src={story.thumbnail.url} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  {story.isFeatured && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                      Featured Work
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                  {story.location?.city && (
                    <div className="absolute bottom-4 left-4 text-white flex items-center text-sm font-medium z-10">
                      <MapPin size={14} className="mr-1 text-purple-400" /> {story.location.city}, {story.location.country}
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">{story.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">{story.shortDescription}</p>

                  <div className="mt-auto flex items-center text-purple-600 font-bold group-hover:text-purple-500 transition-colors">
                    Read Case Study <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Case Studies Found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stories;
