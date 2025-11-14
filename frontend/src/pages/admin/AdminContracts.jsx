import { useEffect, useState } from 'react';
import { serviceAPI } from '../../config/api';
import Loading from '../../components/Loading';
import { ArrowRightIcon } from '../../components/icons';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function AdminContracts() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteInputs, setNoteInputs] = useState({});

  const loadContracts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await serviceAPI.listContracts(page, pagination.limit);
      setContracts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async (id) => {
    try {
      await serviceAPI.startContract(id);
      loadContracts(pagination.page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to start contract');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await serviceAPI.updateContractStatus(id, { status });
      loadContracts(pagination.page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (id, currentStatus) => {
    const note = noteInputs[id];
    if (!note?.trim()) return;
    try {
      await serviceAPI.updateContractStatus(id, { status: currentStatus, note });
      setNoteInputs((prev) => ({ ...prev, [id]: '' }));
      loadContracts(pagination.page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add note');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-10 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">Service Contracts</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track, start, and complete SEO boost engagements.</p>
        </div>

        {loading ? (
          <Loading message="Loading contracts..." />
        ) : (
          <>
            {error && (
              <div className="glass-effect p-4 text-red-400 border border-red-500/40 mb-6">{error}</div>
            )}

            <div className="space-y-6">
              {contracts.length === 0 ? (
                <div className="glass-effect p-12 text-center text-gray-400">No service contracts yet.</div>
              ) : (
                contracts.map((contract) => (
                  <div key={contract._id} className="glass-effect p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 mb-1">Website</p>
                        <p className="text-white font-semibold break-words">{contract.url}</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Duration: {contract.durationValue} {contract.durationUnit}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Status:{' '}
                          <span className="text-white font-semibold capitalize">
                            {contract.status.replace('_', ' ')}
                          </span>
                        </p>
                        {contract.uniqueKey && (
                          <p className="text-sm text-blue-400 mt-2">
                            Unique Key: <span className="font-semibold">{contract.uniqueKey}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {contract.status === 'pending' && (
                          <button
                            onClick={() => handleStart(contract._id)}
                            className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-500 transition"
                          >
                            Start Processing
                          </button>
                        )}
                        <select
                          value={contract.status}
                          onChange={(e) => handleStatusChange(contract._id, e.target.value)}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-gray-400 mb-2">Progress Notes</p>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {contract.progress?.length ? (
                          contract.progress
                            .slice()
                            .reverse()
                            .map((entry, idx) => (
                              <div key={`${entry.createdAt}-${idx}`} className="bg-white/5 rounded-lg p-3">
                                <p className="text-white text-sm">{entry.message}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(entry.createdAt).toLocaleString()}
                                </p>
                              </div>
                            ))
                        ) : (
                          <p className="text-gray-500 text-sm">No updates yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={noteInputs[contract._id] || ''}
                        onChange={(e) =>
                          setNoteInputs((prev) => ({ ...prev, [contract._id]: e.target.value }))
                        }
                        placeholder="Add a progress update"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => handleAddNote(contract._id, contract.status)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        Update
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => loadContracts(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 glass-effect rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-gray-400 text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => loadContracts(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 glass-effect rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

