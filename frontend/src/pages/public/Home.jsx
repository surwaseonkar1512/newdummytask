import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, prodRes, catRes, storyRes, testRes] = await Promise.all([
          axios.get('/api/banners'),
          axios.get('/api/products?featured=true'),
          axios.get('/api/categories'),
          axios.get('/api/stories?isPublished=true&isFeatured=true'),
          axios.get('/api/testimonials?isVisible=true&isFeatured=true')
        ]);
        setBanners(bannerRes.data);
        setFeaturedProducts(prodRes.data.slice(0, 4));
        setCategories(catRes.data.slice(0, 3));
        setFeaturedStories(storyRes.data.slice(0, 4));
        setTestimonials(testRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  const heroBanner = banners.length > 0 ? banners[0] : {
    title: "Masterpieces Crafted With Soul",
    subtitle: "Discover exclusive statues, miniatures, and breathtaking soil art.",
    image: { url: "https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=2600&auto=format&fit=crop" },
    ctaText: "Explore Gallery",
    ctaLink: "/gallery"
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBanner.image?.url} alt={heroBanner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            {heroBanner.title}
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            {heroBanner.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={heroBanner.ctaLink || '/gallery'} className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              {heroBanner.ctaText || 'Explore Gallery'}
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors">
              Request Custom Art
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Explore by Category</h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {categories?.map?.((cat, idx) => (
            <Link key={cat._id} to={`/gallery?category=${cat._id}`} className="snap-start flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] group relative h-96 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] block border border-gray-100">
              <img 
                src={cat.image?.url || `https://images.unsplash.com/photo-${['1513364776144-60967b0f800f', '1582200845347-195cbb4fa506', '1618022325802-7e5e732d97a1'][idx % 3]}?q=80&w=800&auto=format&fit=crop`} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-4">{cat.description || cat.paragraph || 'Explore our exclusive statues.'}</p>
                <div className="inline-flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                  View Collection <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Featured Masterpieces</h2>
              <div className="w-24 h-1 bg-purple-600 rounded-full"></div>
            </div>
            <Link to="/gallery" className="hidden md:flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.length > 0 ? featuredProducts?.map?.(prod => (
              <Link key={prod._id} to={`/product/${prod._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
                  {prod.thumbnail?.url || (prod.images && prod.images.length > 0) ? (
                    <img src={prod.thumbnail?.url || prod.images[0].url} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">No image</div>
                  )}
                  {prod.bestSeller && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg uppercase tracking-wider">
                      <Star size={12} className="mr-1 fill-yellow-900" /> Best Seller
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-purple-600 font-bold mb-2 uppercase tracking-wider">{prod.category?.name || 'Collection'}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">{prod.name}</h3>
                  <div className="text-gray-900 font-medium mt-auto">
                    {prod.productType === 'Custom' ? 'Custom Quote' : 
                      prod.sizes?.length > 0 ? `From ₹${Math.min(...prod.sizes.map(s=>s.price)).toLocaleString()}` : 'Price on Request'
                    }
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-4 text-center py-12 text-gray-500">More products arriving soon.</div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/gallery" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              View All Gallery <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Case Studies (Stories) */}
      {featuredStories?.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-widest text-purple-600 uppercase mb-2 block">Case Studies</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Monumental Installations</h2>
              <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {featuredStories.map((story) => (
                <Link key={story._id} to={`/stories/${story.slug}`} className="group bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 flex flex-col md:flex-row border border-gray-100">
                  <div className="md:w-1/2 relative aspect-square md:aspect-auto overflow-hidden bg-gray-200">
                    {story.thumbnail?.url && (
                      <img src={story.thumbnail.url} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-3 leading-tight">{story.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{story.shortDescription}</p>
                    <div className="mt-auto inline-flex items-center font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      View Installation Phase <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/stories" className="inline-flex items-center px-8 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors">
                View All Case Studies
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Client Testimonials Carousel */}
      {testimonials?.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Client Excellence</h2>
              <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear directly from the visionary institutions and collectors who commissioned our masterpiece works.</p>
            </div>

            <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 pt-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {testimonials.map((test) => (
                <div key={test._id} className="snap-center flex-shrink-0 w-[85vw] sm:w-[400px] bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 flex flex-col">
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(test.rating || 5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400" />)}
                  </div>
                  <p className="text-xl text-gray-700 italic font-serif leading-relaxed flex-1 mb-8">
                    "{test.testimonialText}"
                  </p>
                  <div className="flex items-center mt-auto pt-6 border-t border-gray-50">
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold mr-4 overflow-hidden border-2 border-purple-200 shadow-sm shrink-0">
                      {test.image?.url ? <img src={test.image.url} alt={test.clientName} className="w-full h-full object-cover" /> : test.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 uppercase tracking-widest text-sm">{test.clientName}</div>
                      {(test.designation || test.company) && (
                        <div className="text-sm text-purple-600 font-medium">
                          {test.designation} {test.company && <span className="text-gray-400">@ {test.company}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </section>
      )}

      {/* About CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Commission Your Vision</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Looking for something entirely unique? We specialize in custom art requests bringing your imagination into reality. Working closely with you through every step.
              </p>
              <div>
                <Link to="/contact" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-colors shadow-lg shadow-purple-900/50">
                  Start Your Project
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[400px] relative">
              <img src="https://images.unsplash.com/photo-1510912170669-02ee639e76f5?q=80&w=1200&auto=format&fit=crop" alt="Artist working" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
