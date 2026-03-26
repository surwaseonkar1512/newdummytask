import React, { useState, useEffect } from 'react';
import { Loader2, Briefcase, MessageCircle, Target, CheckCircle2, Quote } from 'lucide-react';
import { aboutApi } from '../../api/aboutApi';

const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const res = await aboutApi.get();
        setData(res);
      } catch (error) {
        console.error('Failed to load about page', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  // Fallback defaults if the user has never hit "Save" on the empty CMS template
  const hero = data?.hero || { title: 'About the Studio' };
  const story = data?.story || {};
  const journey = data?.journey || [];
  const team = data?.team || [];
  const vision = data?.vision || { points: [] };

  return (
    <div className="pb-24 bg-white overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.backgroundImage?.url || "https://images.unsplash.com/photo-1544605553-7bcf9537decd?q=80&w=2600&auto=format&fit=crop"}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-slide-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="text-xl md:text-2xl text-purple-200 mb-8 font-light italic">"{hero.subtitle}"</p>
          )}
          {hero.introText && (
            <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              {hero.introText}
            </p>
          )}
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      {story.heading && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="w-16 h-1 bg-purple-600 mb-6 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-8">{story.heading}</h2>
              <div className="prose prose-lg text-gray-600 font-serif leading-relaxed whitespace-pre-wrap">
                {story.paragraph || 'No story provided yet.'}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                {story.image?.url ? (
                  <img src={story.image.url} alt={story.heading} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Story Image Missing</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. TIMELINE / JOURNEY SECTION */}
      {journey.length > 0 && (
        <section className="py-24 bg-gray-50 border-y border-gray-100 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-gray-500">The milestones that forged our legacy.</p>
            </div>

            <div className="relative">
              {/* Timeline Central Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-purple-200 rounded-full"></div>

              <div className="space-y-16">
                {journey.map((item, index) => (
                  <div key={item._id || index} className={`flex flex-col md:flex-row items-center justify-between group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="hidden md:flex w-12 h-12 absolute left-1/2 transform -translate-x-1/2 bg-white border-4 border-purple-600 rounded-full z-10 items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-xl"></div>

                    <div className="w-full md:w-5/12 mb-8 md:mb-0">
                      {item.image?.url && (
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                          <img src={item.image.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}
                    </div>

                    <div className={`w-full md:w-5/12 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-50 group-hover:-translate-y-2 transition-transform duration-300 ${index % 2 === 0 ? 'md:text-right md:pl-0' : 'md:text-left md:pr-0'}`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-purple-700">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. TEAM SECTION */}
      {team.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">The Master Artisans</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <div key={member._id || idx} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col">
                <div className="relative h-80 overflow-hidden bg-gray-100">
                  {member.image?.url ? (
                    <img src={member.image.url} alt={member.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-purple-300 font-medium uppercase tracking-wider text-sm">{member.role}</p>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  {member.thoughts && (
                    <div className="relative mb-6 flex-1">
                      <Quote size={32} className="absolute -top-4 -left-2 text-purple-100 z-0" />
                      <p className="relative z-10 text-gray-600 font-serif italic text-lg leading-relaxed">
                        "{member.thoughts}"
                      </p>
                    </div>
                  )}

                  {(member.socialLinks?.linkedin || member.socialLinks?.instagram || member.socialLinks?.twitter) && (
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                      {member.socialLinks.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors"><Briefcase size={20} /></a>}
                      {member.socialLinks.instagram && <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors"><Briefcase size={20} /></a>}
                      {member.socialLinks.twitter && <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><MessageCircle size={20} /></a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. VISION & VALUES SECTION */}
      {vision?.points?.length > 0 && (
        <section className="py-24 bg-gray-900 border-t-8 border-purple-600 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <Target size={48} className="text-purple-500 mb-6" />
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-10">Vision & Core Values</h2>
              <ul className="space-y-6">
                {vision.points.map((point, idx) => {
                  const pointText = typeof point === 'object' && point !== null ? point.value : point;
                  if (!pointText) return null;
                  return (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="text-purple-500 mr-4 shrink-0 mt-1" size={24} />
                      <span className="text-xl text-gray-300 font-light leading-relaxed">{pointText}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {vision.image?.url && (
              <div className="lg:w-1/2 w-full">
                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/40">
                  <img src={vision.image.url} alt="Vision" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default About;
