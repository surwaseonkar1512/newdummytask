import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, Filter, Search } from 'lucide-react';

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products${categoryFilter ? `?category=${categoryFilter}` : ''}`),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.get(`/api/products?search=${searchTerm}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Art Gallery</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore our complete collection of handmade statues, miniatures, and expressive soil art pieces.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-28">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Filter size={18} className="mr-2"/> Categories</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setSearchParams({})} 
                  className={`text-sm hover:text-purple-600 transition-colors ${!categoryFilter ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}
                >
                  All Artworks
                </button>
              </li>
              {categories?.map?.(cat => (
                <li key={cat._id}>
                  <button 
                    onClick={() => setSearchParams({ category: cat._id })} 
                    className={`text-sm hover:text-purple-600 transition-colors ${categoryFilter === cat._id ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleSearch} className="mt-8">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Search Catalog</h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Keywords..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-purple-600" size={40} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map?.(prod => (
                <Link key={prod._id} to={`/product/${prod._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {prod.images && prod.images.length > 0 ? (
                      <img src={prod.images[0].url} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-purple-600 font-medium mb-2 uppercase tracking-wider">{prod.category?.name}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">{prod.name}</h3>
                    <div className="text-gray-900 font-semibold">{prod.price === 'Custom Quote' ? 'Custom Quote' : `From ${prod.price}`}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
               <h3 className="text-xl font-medium text-gray-900 mb-2">No artworks found</h3>
               <p className="text-gray-500">Try adjusting your filters or search terms.</p>
               <button onClick={() => {setSearchParams({}); setSearchTerm('');}} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">Clear Filters</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
