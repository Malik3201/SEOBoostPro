const API_BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const parseLighthouseMetrics = (data = {}) => {
  const lighthouse = data.lighthouseResult || {};
  const audits = lighthouse.audits || {};

  const toMilliseconds = (value) => (typeof value === 'number' ? Math.round(value) : null);

  return {
    url: lighthouse.requestedUrl || data.id || null,
    performanceScore: lighthouse.categories?.performance?.score != null
      ? Math.round(lighthouse.categories.performance.score * 100)
      : null,
    lcp: toMilliseconds(audits['largest-contentful-paint']?.numericValue),
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    fcp: toMilliseconds(audits['first-contentful-paint']?.numericValue),
    tbt: toMilliseconds(audits['total-blocking-time']?.numericValue),
  };
};

const fetchStrategyReport = async (url, strategy, apiKey) => {
  const params = new URLSearchParams({
    url,
    strategy,
  });

  if (apiKey) {
    params.append('key', apiKey);
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `PageSpeed API request failed (${strategy}): ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const json = await response.json();

  return parseLighthouseMetrics(json);
};

export const runPageSpeed = async (url) => {
  try {
    if (!url) {
      throw new Error('URL is required for PageSpeed analysis');
    }

    const apiKey = process.env.PAGESPEED_API_KEY;

    const [mobile, desktop] = await Promise.all([
      fetchStrategyReport(url, 'mobile', apiKey),
      fetchStrategyReport(url, 'desktop', apiKey),
    ]);

    return {
      url,
      mobile,
      desktop,
      retrievedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('runPageSpeed error:', error);
    throw new Error('Failed to retrieve PageSpeed data');
  }
};

