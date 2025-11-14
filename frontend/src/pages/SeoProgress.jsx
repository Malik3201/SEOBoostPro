import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { serviceAPI } from '../config/api';
import { CheckCircleIcon, ArrowRightIcon } from '../components/icons';

export default function SeoProgress() {
  const [uniqueKey, setUniqueKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!uniqueKey.trim()) {
      setError('Please enter your unique key.');
      return;
    }

    try {
      setLoading(true);
      const response = await serviceAPI.getProgressByKey(uniqueKey.trim().toUpperCase());
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to find progress for that key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <p className="text-blue-400 font-semibold uppercase tracking-wide mb-2 text-sm sm:text-base">Track Your Campaign</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">SEO Progress Tracker</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Enter the unique key shared by our admin team to view the status, recent updates, and completion timeline of
            your SEO boost engagement.
          </p>
        </div>

        <div className="glass-effect p-4 sm:p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-gray-400">Unique Progress Key</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={uniqueKey}
                onChange={(e) => setUniqueKey(e.target.value.toUpperCase())}
                placeholder="E.g. 9A3F2C"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest uppercase"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                Check Progress
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>
        </div>

        {loading && (
          <div className="glass-effect p-8">
            <Loading message="Fetching your progress..." />
          </div>
        )}

        {result && !loading && (
          <div className="glass-effect p-8 space-y-6">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Website</p>
              <p className="text-white font-semibold break-words">{result.url}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/?url=${encodeURIComponent(result.url ?? '')}`)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                You Can Audit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="text-white font-semibold">
                  {result.durationValue} {result.durationUnit}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-semibold capitalize">{result.status.replace('_', ' ')}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Started On</p>
                <p className="text-white font-semibold">{new Date(result.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-3">Progress Updates</p>
              {result.progress?.length ? (
                <div className="space-y-4">
                  {result.progress
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <div key={`${item.createdAt}-${idx}`} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.message}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400">No progress updates shared yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

