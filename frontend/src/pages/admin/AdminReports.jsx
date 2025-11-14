import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../../config/api';
import Loading from '../../components/Loading';
import { ReportIcon, ArrowLeftIcon, ArrowRightIcon } from '../../components/icons';

export default function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await reportAPI.getAdminReports(page, pagination.limit);
      setReports(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchReports(newPage);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status) => {
    const styles = {
      done: 'bg-green-500/20 text-green-400 border-green-500/30',
      queued: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.queued;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <ReportIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">All Reports</h1>
              <p className="text-gray-400 text-sm sm:text-base">Total: {pagination.total} reports</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loading message="Loading reports..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-effect p-6 border-red-500/50 text-red-400 animate-slide-in">
            {error}
          </div>
        )}

        {/* Reports List */}
        {!loading && !error && (
          <>
            <div className="space-y-4 mb-8">
              {reports.length === 0 ? (
                <div className="glass-effect p-12 text-center">
                  <ReportIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 text-lg">No reports found</p>
                </div>
              ) : (
                reports.map((report, idx) => (
                  <div
                    key={report._id}
                    className="glass-effect p-4 sm:p-6 hover:bg-white/10 transition-all cursor-pointer animate-slide-in group"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => navigate(`/audit/${report._id}`)}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-300 break-words sm:truncate group-hover:text-blue-200 transition-colors">{report.url}</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                          <span>
                            Created: {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}
                          </span>
                          <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusBadge(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto sm:ml-4">
                        <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(report.score)}`}>
                          {report.score}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">Score</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 animate-fade-in">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 glass-effect rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.pages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.pages ||
                      (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            pageNum === pagination.page
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'glass-effect hover:bg-white/15'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                      return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 glass-effect rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-all"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


