// Sector headlines, assembled from Finnhub company-news across the watchlist.
// Using Finnhub here means the site needs one key instead of two.

const BASE = 'https://finnhub.io/api/v1';
const TICKERS = ['MP', 'UUUU', 'ALB', 'LAC'];

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
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

  const from = isoDaysAgo(14);
  const to = isoDaysAgo(0);

  try {
    const batches = await Promise.all(
      TICKERS.map(async (symbol) => {
        const res = await fetch(
          `${BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${key}`
        );
        if (!res.ok) return [];
        const items = await res.json();
        return (Array.isArray(items) ? items : []).map((n) => ({
          symbol,
          headline: n.headline,
          source: n.source,
          url: n.url,
          datetime: n.datetime,
        }));
      })
    );

    const seen = new Set();
    const items = batches
      .flat()
      .filter((n) => {
        if (!n.headline || seen.has(n.headline)) return false;
        seen.add(n.headline);
        return true;
      })
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 12);

    return Response.json(
      { items },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=900' } }
    );
  } catch (err) {
    return Response.json(
      { error: 'upstream_failed', message: err.message },
      { status: 502 }
    );
  }
};
