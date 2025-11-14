import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportAPI } from '../config/api';
import Loading from '../components/Loading';
import { SpeedIcon, AnalyticsIcon, SuggestionIcon, MobileIcon, DesktopIcon, ArrowLeftIcon, ErrorIcon, DownloadIcon } from '../components/icons';
import { generateAuditPDF } from '../utils/pdfGenerator';

export default function AuditResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportAPI.getReportById(id);
        const reportData = response.data;
        
        // Debug: Log suggestions to see what we're getting
        console.log('Report data:', reportData);
        console.log('Suggestions:', reportData?.suggestions);
        console.log('Suggestions type:', typeof reportData?.suggestions);
        console.log('Suggestions is array:', Array.isArray(reportData?.suggestions));
        
        // Ensure suggestions is always an array
        if (reportData && !Array.isArray(reportData.suggestions)) {
          if (typeof reportData.suggestions === 'string') {
            // If it's a string, try to split it
            reportData.suggestions = reportData.suggestions
              .split('\n')
              .map(s => s.trim())
              .filter(s => s.length > 0);
          } else {
            reportData.suggestions = [];
          }
        }
        
        setReport(reportData);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Loading report..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-effect p-8 max-w-md w-full text-center">
          <div className="text-red-400 mb-4">
            <ErrorIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-600 to-emerald-600';
    if (score >= 70) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-rose-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500/10 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    try {
      generateAuditPDF(report);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">SEO Audit Report</h1>
          <p className="text-gray-400 break-all text-sm sm:text-base">{report?.url}</p>
        </div>

        {/* Overall Score */}
        <div className={`glass-effect p-4 sm:p-6 md:p-8 mb-8 animate-slide-in border-2 ${getScoreBg(report?.score)}`}>
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <AnalyticsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">Overall SEO Score</h2>
            </div>
            <div className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-4 ${getScoreColor(report?.score)}`}>
              {report?.score || 0}
            </div>
            <div className="w-full bg-gray-800 rounded-full h-6 mt-4 overflow-hidden">
              <div
                className={`h-6 rounded-full bg-gradient-to-r ${getScoreGradient(report?.score)} transition-all duration-1000 flex items-center justify-end pr-2`}
                style={{ width: `${report?.score || 0}%` }}
              >
                <span className="text-xs font-semibold text-white">{report?.score || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PageSpeed Insights */}
          <div className="glass-effect p-4 sm:p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <SpeedIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              PageSpeed Insights
            </h3>
            <div className="space-y-6">
              {report?.pageSpeed?.mobile && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                    <MobileIcon className="w-5 h-5 mr-2" />
                    Mobile
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Performance Score:</span>
                      <span className="font-semibold text-white">{report.pageSpeed.mobile.performanceScore}</span>
                    </div>
                    {report.pageSpeed.mobile.metrics && Object.entries(report.pageSpeed.mobile.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report?.pageSpeed?.desktop && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-400 mb-3 flex items-center">
                    <DesktopIcon className="w-5 h-5 mr-2" />
                    Desktop
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-gray-400">Performance Score:</span>
                      <span className="font-semibold text-white">{report.pageSpeed.desktop.performanceScore}</span>
                    </div>
                    {report.pageSpeed.desktop.metrics && Object.entries(report.pageSpeed.desktop.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="glass-effect p-4 sm:p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <AnalyticsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              </div>
              Meta Information
            </h3>
            <div className="space-y-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">Title</span>
                <span className="font-semibold text-white break-words text-xs sm:text-sm">{report?.meta?.title || 'N/A'}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">Description</span>
                <span className="font-semibold text-white break-words text-xs sm:text-sm">{report?.meta?.metaDescription || 'N/A'}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">First H1</span>
                <span className="font-semibold text-white break-words text-xs sm:text-sm">{report?.meta?.firstH1 || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">Status Code</span>
                  <span className="font-semibold text-white text-xs sm:text-sm">{report?.meta?.statusCode || 'N/A'}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">Missing Alt Tags</span>
                  <span className="font-semibold text-white text-xs sm:text-sm">{report?.meta?.imagesMissingAlt ?? 'N/A'}</span>
                </div>
              </div>
              {report?.meta?.canonicalLinks && report.meta.canonicalLinks.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <span className="text-gray-400 block mb-2 text-xs uppercase tracking-wide">Canonical Links</span>
                  <ul className="space-y-2">
                    {report.meta.canonicalLinks.map((link, idx) => (
                      <li key={idx} className="text-xs text-blue-400 break-all">{link}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Suggestions */}
        <div className="glass-effect p-4 sm:p-6 md:p-8 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
              <SuggestionIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            SEO Suggestions
          </h3>
          {(() => {
            // Normalize suggestions - ensure it's an array
            const suggestions = Array.isArray(report?.suggestions) 
              ? report.suggestions.filter(s => s && String(s).trim().length > 0)
              : [];
            
            // Helper function to parse suggestion text (extract bold parts and descriptions)
            const parseSuggestion = (text) => {
              const cleanText = String(text).trim();
              
              // Check if it contains markdown-style bold (**text**)
              const boldMatch = cleanText.match(/\*\*(.+?)\*\*/);
              if (boldMatch) {
                return {
                  title: boldMatch[1],
                  description: cleanText.replace(/\*\*(.+?)\*\*\s*-?\s*/, '').trim(),
                };
              }
              
              // Check if it has a dash separator (Title - Description)
              const dashMatch = cleanText.match(/^(.+?)\s*-\s*(.+)$/);
              if (dashMatch) {
                return {
                  title: dashMatch[1].trim(),
                  description: dashMatch[2].trim(),
                };
              }
              
              // Check if first sentence is short (likely a title)
              const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim());
              if (sentences.length > 1 && sentences[0].length < 80) {
                return {
                  title: sentences[0].trim(),
                  description: sentences.slice(1).join('. ').trim(),
                };
              }
              
              // Default: use first 60 chars as title, rest as description
              if (cleanText.length > 60) {
                return {
                  title: cleanText.substring(0, 60).trim() + '...',
                  description: cleanText.substring(60).trim(),
                };
              }
              
              return {
                title: cleanText,
                description: '',
              };
            };
            
            if (suggestions.length > 0) {
              return (
                <div className="space-y-5">
                  {suggestions.map((suggestion, idx) => {
                    const suggestionText = String(suggestion).trim();
                    if (!suggestionText) return null;
                    
                    const parsed = parseSuggestion(suggestionText);
                    
                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 sm:p-6 border border-white/10 hover:border-yellow-500/30 transition-all animate-slide-in group"
                        style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Number Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center font-bold text-yellow-400 border border-yellow-500/30 group-hover:scale-110 transition-transform text-sm sm:text-base">
                              {idx + 1}
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                              {parsed.title}
                            </h4>
                            {parsed.description && (
                              <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
                                {parsed.description}
                              </p>
                            )}
                          </div>
                          
                          {/* Icon */}
                          <div className="hidden sm:flex flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            
            return (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SuggestionIcon className="w-8 h-8 text-yellow-400/50" />
                </div>
                <p className="text-gray-400 mb-2 font-medium">No suggestions available.</p>
                <p className="text-gray-500 text-sm">
                  Suggestions are generated using AI analysis. If this persists, the AI service may be temporarily unavailable.
                </p>
              </div>
            );
          })()}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <DownloadIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Download PDF Report</span>
            <span className="sm:hidden">Download PDF</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Run Another Audit
          </button>
          <button
            onClick={() => navigate(`/services/boost?url=${encodeURIComponent(report?.url || '')}`)}
            className="px-6 sm:px-8 py-3 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition-all text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Get SEO Boost Services for Your Website</span>
            <span className="sm:hidden">Get SEO Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}


