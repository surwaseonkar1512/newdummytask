import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Banners from './pages/admin/Banners';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Leads from './pages/admin/Leads';
import Settings from './pages/admin/Settings';
import StoriesAdmin from './pages/admin/Stories';
import StoryForm from './pages/admin/StoryForm';
import Testimonials from './pages/admin/Testimonials';
import AboutAdmin from './pages/admin/AboutAdmin';

import PublicLayout from './components/public/PublicLayout';
import Home from './pages/public/Home';
import Gallery from './pages/public/Gallery';
import ProductDetails from './pages/public/ProductDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import StoriesPublic from './pages/public/Stories';
import StoryDetails from './pages/public/StoryDetails';
import CategoryForm from './components/admin/CategoryForm';

const Dashboard = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold">Dashboard Overview</h2><p className="text-gray-500 mt-2">Welcome to your art portfolio admin panel.</p></div>;

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="banners" element={<Banners />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id" element={<CategoryForm />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="stories" element={<StoriesAdmin />} />
            <Route path="stories/new" element={<StoryForm />} />
            <Route path="stories/edit/:id" element={<StoryForm />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="leads" element={<Leads />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            {/* If public stories are enabled, route here: */}
            <Route path="stories" element={<StoriesPublic />} />
            <Route path="stories/:slug" element={<StoryDetails />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
