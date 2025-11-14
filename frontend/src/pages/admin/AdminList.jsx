import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../config/api';
import Loading from '../../components/Loading';
import { UsersIcon, ArrowLeftIcon } from '../../components/icons';

export default function AdminList() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await adminAPI.listAdmins();
        setAdmins(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admins');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Admin List</h1>
              <p className="text-gray-400">Total: {admins.length} administrators</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loading message="Loading administrators..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-effect p-6 border-red-500/50 text-red-400 animate-slide-in">
            {error}
          </div>
        )}

        {/* Admins List */}
        {!loading && !error && (
          <div className="space-y-4">
            {admins.length === 0 ? (
              <div className="glass-effect p-12 text-center">
                <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">No administrators found</p>
              </div>
            ) : (
              admins.map((admin, idx) => (
                <div
                  key={admin._id}
                  className="glass-effect p-6 animate-slide-in hover:bg-white/5 transition-all"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{admin.email}</h3>
                        <p className="text-sm text-gray-400">
                          Joined: {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-semibold">
                      Admin
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}


