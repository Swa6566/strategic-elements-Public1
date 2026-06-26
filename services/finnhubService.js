const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

function buildUrl(path, params = {}) {
  const url = new URL(`${FINNHUB_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('token', API_KEY);
  return url.toString();
}

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Finnhub ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Finnhub request failed:', err.message);
    return null;
  }
}

// Live quote: current price, change, % change, day high/low, previous close.
export async function getQuote(ticker) {
  if (!API_KEY) return null;
  const data = await safeFetch(buildUrl('/quote', { symbol: ticker }));
  if (!data || data.c === 0) return null;
  return {
    price: data.c,
    change: data.d,
    percentChange: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
  };
}

// Pre-computed return windows + 52-week range + market cap + beta.
// This replaces the old candle-based RSI/MACD/Bollinger setup, since Finnhub
// moved historical candles behind a paid tier — /stock/metric is still free
// and gives us real, accurate trailing-return data to build trend visuals from.
export async function getMetrics(ticker) {
  if (!API_KEY) return null;
  const data = await safeFetch(buildUrl('/stock/metric', { symbol: ticker, metric: 'all' }));
  const m = data?.metric;
  if (!m) return null;
  return {
    week52High: m['52WeekHigh'] ?? null,
    week52Low: m['52WeekLow'] ?? null,
    marketCap: m.marketCapitalization ?? null,
    beta: m.beta ?? null,
    returns: {
      '1M': m.monthToDatePriceReturnDaily ?? null,
      '3M': m['13WeekPriceReturnDaily'] ?? null,
      '6M': m['26WeekPriceReturnDaily'] ?? null,
      YTD: m.yearToDatePriceReturnDaily ?? null,
      '1Y': m['52WeekPriceReturnDaily'] ?? null,
    },
  };
}

export async function getQuoteAndMetrics(ticker) {
  const [quote, metrics] = await Promise.all([getQuote(ticker), getMetrics(ticker)]);
  return { ticker, quote, metrics };
}

export async function getAllQuotesAndMetrics(tickers) {
  // Finnhub's free tier allows 60 calls/min — sequential-ish batching keeps us safe.
  const results = await Promise.all(tickers.map((t) => getQuoteAndMetrics(t)));
  return results.reduce((acc, r) => {
    acc[r.ticker] = { quote: r.quote, metrics: r.metrics };
    return acc;
  }, {});
}

export const hasFinnhubKey = Boolean(API_KEY);
