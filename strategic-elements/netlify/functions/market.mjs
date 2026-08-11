// Server-side proxy for Finnhub.
// The key is read from process.env and never reaches the browser.
// Change the key in the Netlify UI and it takes effect without a rebuild.

const BASE = 'https://finnhub.io/api/v1';

const TICKERS = ['MP', 'LYSCF', 'UUUU', 'ALB', 'LAC', 'REMX', 'SETM'];

async function get(path, key) {
  const res = await fetch(`${BASE}${path}&token=${key}`);
  if (!res.ok) throw new Error(`Finnhub ${res.status} on ${path.split('?')[0]}`);
  return res.json();
}

// Finnhub's free tier has no historical candles, so trend comes from the
// trailing return windows already computed inside /stock/metric.
function returnWindows(metric = {}) {
  const windows = [
    ['5D', metric['5DayPriceReturnDaily']],
    ['13W', metric['13WeekPriceReturnDaily']],
    ['26W', metric['26WeekPriceReturnDaily']],
    ['52W', metric['52WeekPriceReturnDaily']],
    ['YTD', metric['yearToDatePriceReturnDaily']],
  ];
  return windows
    .filter(([, v]) => typeof v === 'number' && Number.isFinite(v))
    .map(([label, value]) => ({ label, value }));
}

export default async () => {
  const key = process.env.FINNHUB_API_KEY;

  if (!key) {
    return Response.json(
      {
        error: 'missing_key',
        message:
          'FINNHUB_API_KEY is not set. Add it under Project configuration, Environment variables, then redeploy.',
      },
      { status: 503 }
    );
  }

  try {
    const rows = await Promise.all(
      TICKERS.map(async (symbol) => {
        const [quote, fundamentals] = await Promise.all([
          get(`/quote?symbol=${symbol}`, key),
          get(`/stock/metric?symbol=${symbol}&metric=all`, key),
        ]);

        const m = fundamentals?.metric ?? {};

        return {
          symbol,
          price: quote?.c ?? null,
          change: quote?.d ?? null,
          changePercent: quote?.dp ?? null,
          previousClose: quote?.pc ?? null,
          high52: m['52WeekHigh'] ?? null,
          low52: m['52WeekLow'] ?? null,
          beta: m.beta ?? null,
          marketCap: m.marketCapitalization ?? null,
          returns: returnWindows(m),
        };
      })
    );

    return Response.json(
      { asOf: new Date().toISOString(), rows },
      {
        headers: {
          // Cache at the edge for five minutes so we stay well inside
          // Finnhub's free-tier rate limit.
          'Cache-Control': 'public, max-age=0, s-maxage=300',
        },
      }
    );
  } catch (err) {
    return Response.json(
      { error: 'upstream_failed', message: err.message },
      { status: 502 }
    );
  }
};
