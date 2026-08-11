import { useEffect, useMemo, useState } from 'react';
import { ALL, GLOSSARY } from './data/watchlist';

const fmtPrice = (v) =>
  typeof v === 'number' ? `$${v.toFixed(2)}` : '—';

const fmtPct = (v) =>
  typeof v === 'number' ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : '—';

const fmtCap = (v) => {
  if (typeof v !== 'number') return '—';
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${Math.round(v)}M`;
};

const dirClass = (v) =>
  typeof v !== 'number' ? 'flat' : v > 0 ? 'up' : v < 0 ? 'down' : 'flat';

function Tile({ meta, row, selected, onSelect }) {
  return (
    <li>
      <button
        className="tile"
        aria-pressed={selected}
        onClick={() => onSelect(meta.symbol)}
      >
        <span className="tile-num">{meta.element.number ?? '\u00a0'}</span>
        <span className="tile-sym">{meta.element.symbol}</span>
        <span className="tile-ticker">{meta.symbol}</span>
        <span className="tile-price">{fmtPrice(row?.price)}</span>
        <span className={`tile-delta ${dirClass(row?.changePercent)}`}>
          {fmtPct(row?.changePercent)}
        </span>
      </button>
    </li>
  );
}

function ReturnBars({ returns }) {
  if (!returns?.length) {
    return <p className="empty">No return data available for this symbol.</p>;
  }
  const max = Math.max(...returns.map((r) => Math.abs(r.value)), 1);

  return (
    <div className="bars">
      {returns.map((r) => {
        const width = (Math.abs(r.value) / max) * 50;
        return (
          <div className="bar-row" key={r.label}>
            <span className="muted">{r.label}</span>
            <span className="bar-track">
              <span className="bar-mid" />
              <span
                className={`bar-fill ${dirClass(r.value)}`}
                style={{ width: `${width}%` }}
              />
            </span>
            <span className={`bar-val ${dirClass(r.value)}`}>
              {fmtPct(r.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Detail({ meta, row }) {
  const range =
    typeof row?.low52 === 'number' && typeof row?.high52 === 'number'
      ? `${fmtPrice(row.low52)} – ${fmtPrice(row.high52)}`
      : '—';

  return (
    <div>
      <p className="eyebrow">
        {meta.element.name} · {meta.role}
      </p>
      <h2>{meta.name}</h2>
      <p className="lede">{meta.note}</p>

      <div className="cards">
        <div className="card">
          <span className="card-label">52-week range</span>
          <span className="card-value" style={{ fontSize: '1.15rem' }}>
            {range}
          </span>
          <p className="card-note">Where the past year has traded.</p>
        </div>
        <div className="card">
          <span className="card-label">Beta</span>
          <span className="card-value">
            {typeof row?.beta === 'number' ? row.beta.toFixed(2) : '—'}
          </span>
          <p className="card-note">
            Against the S&amp;P 500. Above 1.0 swings harder than the market.
          </p>
        </div>
        <div className="card">
          <span className="card-label">Market cap</span>
          <span className="card-value">{fmtCap(row?.marketCap)}</span>
          <p className="card-note">Share price times shares outstanding.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '12px' }}>
        <span className="card-label">Return by window</span>
        <ReturnBars returns={row?.returns} />
        <p className="card-note">
          Trailing periods, not a price chart. The free data tier has no
          historical candles, so these windows are the honest substitute.
        </p>
      </div>
    </div>
  );
}

function News({ items, state }) {
  if (state === 'loading') return <p className="skeleton">Loading headlines…</p>;
  if (state === 'error' || !items?.length) {
    return (
      <p className="empty">
        No recent headlines for the watchlist. Check back after the next
        refresh.
      </p>
    );
  }
  return (
    <div className="news">
      {items.map((n) => (
        <a
          className="news-item"
          key={n.url + n.headline}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="news-meta">
            <span>{n.symbol}</span>
            <span>{n.source}</span>
            <span>
              {new Date(n.datetime * 1000).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </span>
          <span className="news-headline">{n.headline}</span>
        </a>
      ))}
    </div>
  );
}

export default function App() {
  const [market, setMarket] = useState({ state: 'loading', rows: [], asOf: null });
  const [news, setNews] = useState({ state: 'loading', items: [] });
  const [selected, setSelected] = useState('MP');

  useEffect(() => {
    fetch('/.netlify/functions/market')
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw Object.assign(new Error(body.message), { body });
        return body;
      })
      .then((d) => setMarket({ state: 'ready', rows: d.rows, asOf: d.asOf }))
      .catch((e) =>
        setMarket({
          state: 'error',
          rows: [],
          asOf: null,
          message: e.body?.message ?? e.message,
          kind: e.body?.error,
        })
      );

    fetch('/.netlify/functions/news')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setNews({ state: 'ready', items: d.items }))
      .catch(() => setNews({ state: 'error', items: [] }));
  }, []);

  const bySymbol = useMemo(() => {
    const map = {};
    for (const row of market.rows) map[row.symbol] = row;
    return map;
  }, [market.rows]);

  const activeMeta = ALL.find((m) => m.symbol === selected) ?? ALL[0];

  return (
    <div className="shell">
      <header className="masthead">
        <p className="eyebrow">Sector intelligence · Not investment advice</p>
        <h1>
          Five companies trying to refine what <em>China</em> currently
          controls.
        </h1>
        <p className="lede">
          China refines the large majority of the world's rare earth oxides.
          The watchlist below tracks the small group of Western and allied
          producers — miners, refiners, and the funds that bundle them —
          attempting to build an alternative supply chain. Element by element.
        </p>
        <div className="stamp">
          <span>
            {market.asOf
              ? `Data as of ${new Date(market.asOf).toLocaleString()}`
              : 'Awaiting data'}
          </span>
          <span>Source: Finnhub</span>
        </div>

        {market.state === 'error' && (
          <div className="notice">
            <h3>
              {market.kind === 'missing_key'
                ? 'Running without live data'
                : 'Could not reach the data source'}
            </h3>
            <p>{market.message}</p>
          </div>
        )}

        <ul className="tiles">
          {ALL.map((meta) => (
            <Tile
              key={meta.symbol}
              meta={meta}
              row={bySymbol[meta.symbol]}
              selected={meta.symbol === selected}
              onSelect={setSelected}
            />
          ))}
        </ul>
      </header>

      <section>
        <div className="detail-grid">
          <Detail meta={activeMeta} row={bySymbol[activeMeta.symbol]} />
          <div>
            <div className="section-head">
              <h2>Sector news</h2>
            </div>
            <News items={news.items} state={news.state} />
          </div>
        </div>
      </section>

      <section>
        <div className="about">
          <div>
            <h3>Why this sector</h3>
            <p>
              Rare earths and battery metals sit underneath almost everything
              the energy transition and modern defense manufacturing need — and
              the refining step is concentrated in one country. That is a supply
              chain story with a real investable angle, not just a chart of
              stock prices.
            </p>
          </div>
          <div>
            <h3>How it's built</h3>
            <p>
              React and Vite, deployed on Netlify. Quotes, fundamentals, and
              headlines come from Finnhub's free tier, requested through a
              Netlify Function so the API key stays on the server and never
              ships to the browser.
            </p>
          </div>
          <div>
            <h3>Honest limits</h3>
            <p>
              The free data tier has no intraday historical candles, so the
              trend view is built from pre-computed trailing return windows
              rather than custom indicators. Company-to-element mapping is
              editorial: it names the primary output, not the full product mix.
              Both are disclosed rather than dressed up.
            </p>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: '48px' }}>
          <h2>Reading the numbers</h2>
        </div>
        <dl className="glossary">
          {GLOSSARY.map(([term, def]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer>
        <span>Strategic Elements</span>
        <span>Built by Swatiika Manikanddan</span>
      </footer>
    </div>
  );
}
