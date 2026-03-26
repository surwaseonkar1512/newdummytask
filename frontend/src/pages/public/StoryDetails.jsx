import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, MapPin, ArrowLeft, Star, Quote, List as ListIcon, PlayCircle, Clock, ArrowRight } from 'lucide-react';

const StoryDetails = () => {
  const { slug } = useParams(); // Using slug routing instead of ID
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, url: '' });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { data } = await axios.get(`/api/stories/${slug}`);
        setStory(data);
      } catch (error) {
        console.error('Error fetching case study:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><Loader2 className="animate-spin text-purple-600" size={50} /></div>;
  if (!story) return <div className="min-h-screen text-center py-40 text-3xl font-bold text-gray-900">Case Study not found.</div>;

  return (
    <div className="bg-white min-h-screen">

      {/* Lightbox */}
      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setLightbox({ open: false, url: '' })}>
          <img src={lightbox.url} alt="Enlarged view" className="max-w-full max-h-[90vh] object-contain cursor-default" onClick={e => e.stopPropagation()} />
          <button className="absolute top-6 right-6 text-white text-xl font-bold bg-white/10 w-12 h-12 rounded-full hover:bg-white/20 transition-colors">✕</button>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-gray-900 flex items-center pt-20">
        {story.thumbnail?.url && (
          <>
            <img src={story.thumbnail.url} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-xl">{story.title}</h1>

          {(story.location?.city || story.location?.country) && (
            <div className="flex items-center justify-center text-lg md:text-xl text-purple-200 font-medium mb-8 uppercase tracking-widest drop-shadow-md">
              <MapPin size={24} className="mr-2" />
              {story.location.placeName && `${story.location.placeName}, `}
              {story.location.city}, {story.location.country}
            </div>
          )}

          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed border-t border-white/20 pt-8 drop-shadow-md">
            {story.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 space-y-24">

        {/* Before & After Section */}
        {(story.beforeImages?.length > 0 || story.afterImages?.length > 0) && (
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="text-center mb-12">
              <span className="text-sm font-bold tracking-widest text-purple-600 uppercase">Transformation</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Before & After</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Before */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest">Before</h3>
                {story.beforeImages.map((img, idx) => (
                  <img key={`before-${idx}`} src={img.url} alt="Before" className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-lg border-4 border-white cursor-zoom-in" onClick={() => setLightbox({ open: true, url: img.url })} />
                ))}
              </div>

              {/* After */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 text-center uppercase tracking-widest">After</h3>
                {story.afterImages.map((img, idx) => (
                  <img key={`after-${idx}`} src={img.url} alt="After" className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-2xl border-4 border-white cursor-zoom-in relative z-10 scale-105" onClick={() => setLightbox({ open: true, url: img.url })} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Content Builder Parse Region */}
        {story.contentBlocks?.length > 0 && (
          <section className="space-y-12 max-w-4xl mx-auto">
            {story.contentBlocks.map((block, i) => (
              <div key={i} className="prose prose-lg prose-purple max-w-none text-gray-700">
                {block.type === 'text' && (
                  <div>
                    {block.data.heading && <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">{block.data.heading}</h3>}
                    <p className="leading-loose text-xl">{block.data.paragraph}</p>
                  </div>
                )}
                {block.type === 'image' && block.data.url && (
                  <figure className="my-12">
                    <img src={block.data.url} alt={block.data.caption || 'Detail'} className="w-full rounded-3xl shadow-xl cursor-zoom-in" onClick={() => setLightbox({ open: true, url: block.data.url })} />
                    {block.data.caption && <figcaption className="text-center p-4 text-gray-500 italic font-medium">{block.data.caption}</figcaption>}
                  </figure>
                )}
                {block.type === 'video' && block.data.url && (
                  <div className="my-12 rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <div className="aspect-video w-full relative">
                      <iframe
                        src={getEmbedUrl(block.data.url)}
                        title="Video player"
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                {block.type === 'bullet' && block.data.items?.length > 0 && (
                  <div className="bg-purple-50 p-8 md:p-12 rounded-3xl border border-purple-100 my-10 shadow-sm">
                    <h4 className="text-2xl font-bold text-purple-900 mb-6 flex items-center font-serif"><ListIcon size={24} className="mr-3" /> Key Highlights</h4>
                    <ul className="space-y-4 text-lg">
                      {block.data.items.map((item, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-purple-600 mr-3 mt-1 font-bold text-xl">•</span>
                          <span className="text-purple-950 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Process Timeline */}
        {story.processSteps?.length > 0 && (
          <section className="bg-white py-10">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Methodology</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">Project Execution Timeline</h2>
            </div>

            <div className="max-w-3xl mx-auto pl-4 md:pl-0 border-l-4 border-purple-100 ml-4 md:mx-auto relative">
              {story.processSteps.map((step, idx) => (
                <div key={idx} className="relative pl-10 md:pl-16 py-6 group">
                  <div className="absolute left-[-12px] top-8 w-6 h-6 rounded-full bg-white border-4 border-purple-600 group-hover:scale-125 transition-transform shadow-md"></div>
                  <div className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="text-purple-600 font-bold tracking-widest text-xs uppercase mb-2 flex items-center"><Clock size={14} className="mr-2" /> Phase {idx + 1}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonial */}
        {story.testimonial?.clientName && story.testimonial?.message && (
          <section className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <Quote className="absolute top-10 left-10 text-white/10" size={120} />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex text-yellow-400 mb-8">
                {[...Array(story.testimonial.rating || 5)].map((_, i) => <Star key={i} size={32} className="fill-yellow-400 drop-shadow-md" />)}
              </div>
              <p className="text-2xl md:text-4xl font-serif leading-relaxed mb-10 text-gray-100 italic font-light drop-shadow-lg">
                "{story.testimonial.message}"
              </p>
              <div className="border-t border-white/20 pt-8 w-32 mx-auto mb-6"></div>
              <h4 className="text-xl font-bold tracking-wider uppercase">{story.testimonial.clientName}</h4>
              <p className="text-purple-300 mt-2 text-lg font-medium">{story.testimonial.designation}</p>
            </div>
          </section>
        )}

        {/* Infinite Gallery Masonry */}
        {story.galleryImages?.length > 0 && (
          <section className="pt-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Installation Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {story.galleryImages.map((img, idx) => (
                <div key={idx} className="aspect-square relative group overflow-hidden rounded-2xl cursor-zoom-in shadow-sm bg-gray-100" onClick={() => setLightbox({ open: true, url: img.url })}>
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium border border-white/40 rounded-full px-4 py-2 backdrop-blur-sm">View</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Call to Action */}
        <section className="py-20 mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Inspired by this project?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Contact our studio to discuss your vision for a custom masterwork installation.</p>
          <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-purple-600 text-white text-lg font-bold rounded-full hover:bg-purple-700 hover:scale-105 transition-all shadow-xl shadow-purple-600/30">
            Request Similar Commission <ArrowRight className="ml-3" />
          </Link>
        </section>

      </div>
    </div>
  );
};

export default StoryDetails;
