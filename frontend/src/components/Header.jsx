import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SEOBoostPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {!isAdminRoute ? (
              <>
                <NavLink to="/" currentPath={location.pathname} label="Home" />
                <NavLink to="/services/boost" currentPath={location.pathname} label="Services" />
                <NavLink to="/services/progress" currentPath={location.pathname} label="Progress" />
              </>
            ) : (
              <>
                <NavLink to="/admin" currentPath={location.pathname} label="Dashboard" />
                <NavLink to="/admin/reports" currentPath={location.pathname} label="Reports" />
                <NavLink to="/admin/contracts" currentPath={location.pathname} label="Contracts" />
                <NavLink to="/admin/list" currentPath={location.pathname} label="Admins" />
                <NavLink to="/admin/settings" currentPath={location.pathname} label="Settings" />
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {!isAdminRoute ? (
                <>
                  <NavLink to="/" currentPath={location.pathname} label="Home" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/services/boost" currentPath={location.pathname} label="Services" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/services/progress" currentPath={location.pathname} label="Progress" mobile onClick={() => setMobileMenuOpen(false)} />
                </>
              ) : (
                <>
                  <NavLink to="/admin" currentPath={location.pathname} label="Dashboard" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/admin/reports" currentPath={location.pathname} label="Reports" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/admin/contracts" currentPath={location.pathname} label="Contracts" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/admin/list" currentPath={location.pathname} label="Admins" mobile onClick={() => setMobileMenuOpen(false)} />
                  <NavLink to="/admin/settings" currentPath={location.pathname} label="Settings" mobile onClick={() => setMobileMenuOpen(false)} />
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, currentPath, label, mobile = false, onClick }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        mobile
          ? `block px-3 py-2 rounded-lg ${
              isActive ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`
          : isActive
            ? 'text-blue-500'
            : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

