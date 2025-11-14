import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { serviceAPI } from '../config/api';

const durationUnits = [
  { value: 'days', label: 'Days' },
  { value: 'months', label: 'Months' },
  { value: 'years', label: 'Years' },
];

export default function SeoServices() {
  const location = useLocation();
  const queryUrl = useMemo(() => new URLSearchParams(location.search).get('url') || '', [location.search]);

  const [url, setUrl] = useState(queryUrl);
  const [durationValue, setDurationValue] = useState(3);
  const [durationUnit, setDurationUnit] = useState('months');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getWhatsAppNumber();
        setWhatsappNumber(response.data.whatsappNumber || '');
      } catch (err) {
        console.error(err);
        setError('Unable to load contact information at the moment.');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please provide a website URL');
      return;
    }

    if (!durationValue || durationValue <= 0) {
      setError('Duration must be greater than zero');
      return;
    }

    try {
      setSaving(true);
      const response = await serviceAPI.requestService({ url, durationValue, durationUnit });
      setContract(response.data.contract);
      if (response.data.whatsappNumber) {
        setWhatsappNumber(response.data.whatsappNumber);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Preparing SEO boost services..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center px-4">
          <p className="text-blue-400 font-semibold uppercase tracking-wide mb-2 text-sm sm:text-base">Premium SEO Partnership</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Personalized SEO Boost Services
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Let our experts manage your SEO operations with tailored strategies. Confirm your website, select how long we
            should manage your SEO, and we&lsquo;ll take care of the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <div className="glass-effect p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Your Website &amp; Timeline</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm text-gray-400 mb-2">
                  Website URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="durationValue" className="block text-sm text-gray-400 mb-2">
                    Duration
                  </label>
                  <input
                    id="durationValue"
                    type="number"
                    min="1"
                    value={durationValue}
                    onChange={(e) => setDurationValue(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="durationUnit" className="block text-sm text-gray-400 mb-2">
                    Unit
                  </label>
                  <select
                    id="durationUnit"
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {durationUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 text-red-300 border border-red-500/30 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {saving ? 'Submitting Request...' : 'Confirm & Continue'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-effect p-6">
              <h3 className="text-xl font-semibold text-white mb-4">What Happens Next?</h3>
              <ol className="space-y-4 text-gray-300">
                <li>
                  <span className="font-semibold text-blue-400">1.</span> We review your website and confirm the
                  engagement details.
                </li>
                <li>
                  <span className="font-semibold text-blue-400">2.</span> Our admin team starts processing and shares a
                  unique progress key via WhatsApp.
                </li>
                <li>
                  <span className="font-semibold text-blue-400">3.</span> Use that key anytime to monitor live SEO
                  progress.
                </li>
              </ol>
            </div>

            <div className="glass-effect p-6">
              <h3 className="text-xl font-semibold text-white mb-2">WhatsApp Contact</h3>
              {whatsappNumber ? (
                <p className="text-gray-300">
                  Our verified WhatsApp line:{' '}
                  <span className="text-white font-semibold">{whatsappNumber}</span>
                </p>
              ) : (
                <p className="text-gray-400">The admin team will share a WhatsApp number once available.</p>
              )}
            </div>

            {contract && (
              <div className="glass-effect p-6 border border-blue-500/30">
                <h3 className="text-xl font-semibold text-white mb-4">Request Received</h3>
                <p className="text-gray-300 mb-2">We&lsquo;ve logged your request for:</p>
                <p className="text-white font-semibold break-all">{contract.url}</p>
                <p className="text-gray-300 mt-2">
                  Duration: <span className="text-white">{contract.durationValue} {contract.durationUnit}</span>
                </p>
                <p className="text-gray-400 mt-4 text-sm">
                  Our admin team will review, start the process, and share your unique progress key on WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

