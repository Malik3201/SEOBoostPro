import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SEOBoostPro
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Professional SEO analysis and optimization tools to boost your website's performance.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services/boost" className="text-gray-400 hover:text-white text-sm transition-colors">
                  SEO Services
                </Link>
              </li>
              <li>
                <Link to="/services/progress" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Track Progress
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">support@seoboostpro.com</li>
              <li className="text-gray-400 text-sm">© 2024 SEOBoostPro. All rights reserved.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

