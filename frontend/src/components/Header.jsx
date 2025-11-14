import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SEOBoostPro
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
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
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, currentPath, label }) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-blue-500' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}

