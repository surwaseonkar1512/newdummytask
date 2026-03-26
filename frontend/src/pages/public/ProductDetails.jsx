import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ChevronRight, Check, Tag, Info, List as ListIcon, PlayCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  
  // Quote Form State
  const [showQuote, setShowQuote] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', requirements: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        if (data.thumbnail) {
          setActiveImage(data.thumbnail.url);
        } else if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0].url);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Quote request for ${product.name}. Req: ${formData.requirements}`,
        source: 'product',
        product: {
          productId: product._id,
          name: product.name
        }
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting quote:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;
  if (!product) return <div className="text-center py-20 text-2xl font-bold">Product not found.</div>;

  const galleryImages = [
    ...(product.thumbnail ? [product.thumbnail] : []), 
    ...(product.images || [])
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4 top-0 z-10 sticky">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <Link to={`/gallery?category=${product.category?._id}`} className="hover:text-purple-600 transition-colors truncate">{product.category?.name || 'Gallery'}</Link>
          <ChevronRight size={14} className="mx-2 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Hero & Images */}
          <div className="lg:w-1/2 space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No images available</div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img.url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.url ? 'border-purple-600 opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Product Details Panel */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-sm text-purple-600 font-bold tracking-widest uppercase mb-3 px-3 py-1 bg-purple-50 inline-block rounded-full">{product.category?.name || 'Custom Masterpiece'}</div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              <p className="text-2xl font-semibold text-gray-800 mb-8 border-b border-gray-100 pb-8">
                {product.productType === 'Custom' ? 'Commission Inquiry Required' : product.sizes?.length > 0 ? `Starting from ₹${Math.min(...product.sizes.map(s => s.price)).toLocaleString()}` : 'Price Upon Request'}
              </p>
              
              <div className="prose prose-purple text-gray-600 mb-8 leading-relaxed max-w-none text-lg">
                <p>{product.shortDescription || product.description}</p>
              </div>

               {/* Lead Capture Quote Area */}
               {!showQuote ? (
                 <button 
                  onClick={() => setShowQuote(true)}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-xl shadow-gray-900/20 flex items-center justify-center"
                >
                  <Tag size={20} className="mr-2" /> Request Quotation / Inquiry
                </button>
               ) : success ? (
                 <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-inner">
                     <Check size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-green-800 mb-2">Quote Requested Successfully</h3>
                   <p className="text-green-700 mb-4">Our artisan team will review your inquiry and contact you via Email/WhatsApp shortly.</p>
                   <button onClick={() => {setShowQuote(false); setSuccess(false);}} className="text-sm font-bold text-green-800 underline hover:text-green-900 transition-colors">Close panel</button>
                 </div>
               ) : (
                 <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><Tag size={18} className="mr-2 text-purple-600"/> Request Custom Quote</h3>
                   <form onSubmit={handleQuoteSubmit} className="space-y-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                       <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-purple-500 shadow-sm" placeholder="John Doe" />
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-purple-500 shadow-sm" placeholder="john@example.com" />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                         <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-purple-500 shadow-sm" placeholder="+1..." />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Requirements</label>
                       <textarea rows="3" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="Desired size variations, material preferences, shipping constraints..." className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-purple-500 shadow-sm"></textarea>
                     </div>
                     <div className="flex gap-3 pt-2">
                       <button type="button" onClick={() => setShowQuote(false)} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex-1 transition-colors">Cancel</button>
                       <button type="submit" disabled={submitting} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 flex-[2] flex justify-center items-center transition-colors shadow-md">
                         {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Inquiry'}
                       </button>
                     </div>
                   </form>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Dynamic Details Content Blocks Area */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 max-w-4xl">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-10 flex items-center">
            <Info size={28} className="mr-3 text-purple-600" /> Complete Product File
          </h2>
          
          <div className="space-y-16">
            
            {/* Dynamic Content Builder Content */}
            {product.contentBlocks?.length > 0 && (
              <div className="space-y-12">
                {product.contentBlocks.map((block, i) => (
                  <div key={i} className="prose prose-purple max-w-none">
                    {block.type === 'text' && (
                      <div>
                        {block.data.heading && <h3 className="text-2xl font-bold text-gray-900 mb-4">{block.data.heading}</h3>}
                        <p className="text-gray-600 leading-relaxed text-lg">{block.data.paragraph}</p>
                      </div>
                    )}
                    {block.type === 'image' && block.data.url && (
                      <figure className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <img src={block.data.url} alt={block.data.caption || 'Detail'} className="w-full h-auto object-cover max-h-[600px]" />
                        {block.data.caption && <figcaption className="text-center p-4 bg-gray-50 text-gray-500 italic text-sm">{block.data.caption}</figcaption>}
                      </figure>
                    )}
                    {block.type === 'video' && block.data.url && (
                      <div className="my-8">
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-black relative">
                           <iframe 
                             src={getEmbedUrl(block.data.url)} 
                             title="Video player" 
                             className="absolute inset-0 w-full h-full"
                             frameBorder="0" 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen
                           ></iframe>
                        </div>
                        {block.data.caption && <p className="text-center mt-4 text-gray-500 italic text-sm">{block.data.caption}</p>}
                      </div>
                    )}
                    {block.type === 'bullet' && block.data.items?.length > 0 && (
                       <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 my-8">
                          <h4 className="text-xl font-bold text-purple-900 mb-4 flex items-center"><ListIcon size={20} className="mr-2" /> Key Features</h4>
                          <ul className="space-y-3">
                            {block.data.items.map((item, j) => (
                              <li key={j} className="flex items-start">
                                <span className="text-purple-600 mr-2 font-bold">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Sizes & Pricing Table */}
            {product.sizes?.length > 0 && (
              <div className="my-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Available Sizes & Variations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 font-semibold text-gray-600 rounded-l-xl">Size / Variant</th>
                        <th className="p-4 font-semibold text-gray-600">Price</th>
                        <th className="p-4 font-semibold text-gray-600 rounded-r-xl">Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizes.map((sz, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{sz.label}</td>
                          <td className="p-4 font-bold text-gray-700">₹{sz.price.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${sz.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {sz.stock > 0 ? 'In Stock' : 'Made to Order'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Specifications Grid */}
            {product.specifications?.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {product.specifications.map((spec, i) => (
                     <div key={i} className="flex flex-col py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">{spec.key}</span>
                        <span className="text-lg text-gray-900">{spec.value}</span>
                     </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
