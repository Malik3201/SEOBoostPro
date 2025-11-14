import axios from 'axios';
import * as cheerio from 'cheerio';

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

export const scrapeMeta = async (url) => {
  try {
    if (!url) {
      throw new Error('URL is required for scraping metadata');
    }

    const response = await axios.get(url, {
      validateStatus: () => true,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const { data: html = '', status } = response;
    const $ = cheerio.load(html);

    const title = normalizeText($('title').first().text());
    const metaDescription = normalizeText($('meta[name="description"]').attr('content'));
    const firstH1 = normalizeText($('h1').first().text());
    const canonicalLinks = $('link[rel="canonical"]')
      .map((_, el) => normalizeText($(el).attr('href')))
      .get()
      .filter(Boolean);

    const imagesMissingAlt = $('img').filter((_, el) => {
      const alt = $(el).attr('alt');
      return !alt || !alt.trim();
    }).length;

    return {
      url,
      status,
      title,
      metaDescription,
      firstH1,
      imagesMissingAlt,
      canonicalLinks,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('scrapeMeta error:', error);
    throw new Error('Failed to scrape metadata');
  }
};

