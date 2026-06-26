import { COMPANIES } from '../data/companies';

const NEWS_BASE = 'https://api.freenewsapi.io/v1/search';
const API_KEY = import.meta.env.VITE_FREENEWS_API_KEY;

const POSITIVE_WORDS = ['surge', 'jump', 'win', 'wins', 'approve', 'approved', 'funding', 'grant', 'partnership', 'agreement', 'offtake', 'record', 'breakthrough', 'soar'];
const NEGATIVE_WORDS = ['drop', 'fall', 'falls', 'delay', 'delayed', 'loss', 'losses', 'restriction', 'ban', 'lawsuit', 'cut', 'plunge', 'warn', 'warns', 'shortfall'];

const POLICY_WORDS = ['export', 'tariff', 'sanction', 'ban', 'restriction', 'executive order', 'department of', 'white house', 'congress', 'eu commission', 'beijing', 'export control', 'quota', 'trade'];

function scoreSentiment(text) {
  const lower = text.toLowerCase();
  const positives = POSITIVE_WORDS.filter((w) => lower.includes(w)).length;
  const negatives = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length;
  if (positives > negatives) return 'positive';
  if (negatives > positives) return 'negative';
  return 'neutral';
}

function tagTickers(text) {
  const lower = text.toLowerCase();
  return COMPANIES.filter(
    (c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.ticker.toLowerCase())
  ).map((c) => c.ticker);
}

function isPolicyStory(text) {
  const lower = text.toLowerCase();
  return POLICY_WORDS.some((w) => lower.includes(w));
}

export async function getSectorNews(query = 'critical minerals rare earth mining') {
  if (!API_KEY) return [];
  try {
    const url = new URL(NEWS_BASE);
    url.searchParams.set('q', query);
    url.searchParams.set('language', 'en');
    url.searchParams.set('limit', '24');
    url.searchParams.set('apikey', API_KEY);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`FreeNewsApi ${res.status}`);
    const data = await res.json();
    const articles = data?.articles ?? data?.results ?? [];
    return articles.map((a, i) => {
      const text = `${a.title ?? ''} ${a.description ?? ''}`;
      return {
        id: a.id ?? `${i}-${a.url}`,
        title: a.title ?? 'Untitled',
        description: a.description ?? '',
        url: a.url,
        source: a.source ?? a.source_name ?? 'Unknown source',
        publishedAt: a.publishedAt ?? a.published_at ?? null,
        sentiment: scoreSentiment(text),
        tickers: tagTickers(text),
        isPolicy: isPolicyStory(text),
      };
    });
  } catch (err) {
    console.warn('FreeNewsApi request failed:', err.message);
    return [];
  }
}

export const hasNewsKey = Boolean(API_KEY);
