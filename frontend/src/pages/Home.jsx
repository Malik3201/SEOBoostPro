import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auditAPI } from '../config/api';
import Loading from '../components/Loading';
import { SpeedIcon } from '../components/icons';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryUrl = params.get('url');
    if (queryUrl) {
      setUrl(queryUrl);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      const response = await auditAPI.createAudit(url);
      const reportId = response.data._id;
      navigate(`/audit/${reportId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create audit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Analyzing your website..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl animate-float">
              <SpeedIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            SEOBoostPro
          </h1>
          <p className="text-xl text-gray-300">
            Analyze your website's SEO performance in seconds
          </p>
        </div>

        {/* Audit Form */}
        <div className="glass-effect p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-2 text-gray-200">
                Enter Website URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400 transition-all"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 animate-slide-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 shadow-lg"
            >
              Start SEO Audit
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <SpeedIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Fast Analysis</h3>
            <p className="text-sm text-gray-400">Get comprehensive SEO insights in seconds</p>
          </div>
          <div className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Accurate Results</h3>
            <p className="text-sm text-gray-400">Powered by advanced AI and PageSpeed Insights</p>
          </div>
          <div className="glass-effect p-6 text-center">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Detailed Reports</h3>
            <p className="text-sm text-gray-400">Comprehensive analysis with actionable insights</p>
          </div>
        </div>

        {/* SEO Services Section */}
        <div className="mt-16 glass-effect p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-blue-400 font-semibold uppercase tracking-wide mb-3">Managed SEO</p>
              <h2 className="text-3xl font-bold text-white mb-4">Need more than a report?</h2>
              <p className="text-gray-300 mb-6">
                Let our team execute continuous SEO improvements for you. Choose how long you want us to manage your
                website, stay informed through WhatsApp, and track progress via a secure key at any time.
              </p>
              <div className="space-y-4 text-gray-300 text-sm">
                <p>✔️ Dedicated SEO specialists aligned with your goals</p>
                <p>✔️ Transparent communication via WhatsApp</p>
                <p>✔️ Live progress tracking through your unique key</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/services/boost')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Get SEO Boost Services
                </button>
                <button
                  onClick={() => navigate('/services/progress')}
                  className="px-6 py-3 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Track Existing Project
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
              <ol className="space-y-4 text-gray-300">
                <li>
                  <span className="font-semibold text-blue-400">1.</span> Request managed services with your website URL
                  and preferred duration.
                </li>
                <li>
                  <span className="font-semibold text-blue-400">2.</span> Our admin shares a verified WhatsApp number for
                  payment and onboarding.
                </li>
                <li>
                  <span className="font-semibold text-blue-400">3.</span> Once processing starts, you receive a unique
                  key to monitor progress anytime.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


