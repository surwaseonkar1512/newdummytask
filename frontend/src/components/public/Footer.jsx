import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Video, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-white mb-6 inline-block">
              Art<span className="text-purple-400">Portfolio</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Discover unique soil art, breathtaking statues, and detailed miniatures crafted with passion and precision.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Camera size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Video size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-purple-400 transition-colors">Gallery</Link></li>
              <li><Link to="/stories" className="hover:text-purple-400 transition-colors">Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/gallery?category=soil-art" className="hover:text-purple-400 transition-colors">Soil Art</Link></li>
              <li><Link to="/gallery?category=statues" className="hover:text-purple-400 transition-colors">Statues</Link></li>
              <li><Link to="/gallery?category=miniatures" className="hover:text-purple-400 transition-colors">Miniatures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 text-purple-400 flex-shrink-0" />
                <span>123 Art Studio Lane,<br/>Creative City, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-purple-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-purple-400 flex-shrink-0" />
                <span>hello@artportfolio.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ArtPortfolio. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
