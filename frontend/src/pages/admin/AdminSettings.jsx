import { useEffect, useState } from 'react';
import { serviceAPI } from '../../config/api';

export default function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await serviceAPI.getWhatsAppNumber();
        setWhatsappNumber(response.data.whatsappNumber || '');
      } catch (err) {
        console.error(err);
        setStatus({ type: 'error', message: 'Unable to load settings.' });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!whatsappNumber.trim()) {
      setStatus({ type: 'error', message: 'WhatsApp number is required.' });
      return;
    }

    try {
      setSaving(true);
      await serviceAPI.updateWhatsAppNumber(whatsappNumber.trim());
      setStatus({ type: 'success', message: 'WhatsApp number updated successfully.' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update number.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Platform Settings</h1>
          <p className="text-gray-400">Update contact channels and service defaults.</p>
        </div>

        <div className="glass-effect p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">WhatsApp Contact</h2>
          {loading ? (
            <p className="text-gray-400">Loading settings...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+1 555 123 4567"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {status.message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    status.type === 'success'
                      ? 'bg-green-500/10 text-green-300 border border-green-500/30'
                      : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

