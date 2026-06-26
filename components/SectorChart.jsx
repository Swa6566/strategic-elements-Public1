import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Cell, Tooltip,
} from 'recharts';
import { COMPANIES, ETFS } from '../data/companies';

const WINDOWS = ['1M', '3M', '6M', 'YTD', '1Y'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="chart-tooltip card">
      <strong>{p.name}</strong>
      <div className={`delta ${p.value >= 0 ? 'up' : 'down'}`}>
        {p.value >= 0 ? '+' : ''}
        {p.value.toFixed(1)}%
      </div>
    </div>
  );
}

export default function SectorChart({ quotes, loading }) {
  const [windowKey, setWindowKey] = useState('YTD');

  const rows = COMPANIES
    .map((c) => ({
      ticker: c.ticker,
      name: c.name,
      value: quotes?.[c.ticker]?.metrics?.returns?.[windowKey] ?? null,
    }))
    .filter((r) => r.value != null)
    .sort((a, b) => b.value - a.value);

  const etfValues = ETFS.map((e) => ({
    ticker: e.ticker,
    value: quotes?.[e.ticker]?.metrics?.returns?.[windowKey] ?? null,
  })).filter((e) => e.value != null);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Sector performance</p>
          <h2 className="section-title">Who's leading the basket</h2>
          <p className="section-sub">
            Trailing return by company, with REMX and SETM marked as sector benchmarks so you can
            see who's beating — or trailing — the broader index.
          </p>
        </div>
        <div className="window-pills">
          {WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              className={`pill clickable ${windowKey === w ? 'active' : ''}`}
              onClick={() => setWindowKey(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="status-line">Loading sector performance…</p>
      ) : rows.length === 0 ? (
        <p className="status-line">No return data available for this window yet.</p>
      ) : (
        <div className="card chart-card">
          <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 38)}>
            <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ink-faint)' }} unit="%" />
              <YAxis
                type="category"
                dataKey="ticker"
                tick={{ fontSize: 12, fill: 'var(--ink)' }}
                width={56}
              />
              <Tooltip content={<CustomTooltip />} />
              {etfValues.map((e) => (
                <ReferenceLine
                  key={e.ticker}
                  x={e.value}
                  stroke="var(--ink-faint)"
                  strokeDasharray="4 3"
                  label={{ value: e.ticker, position: 'top', fontSize: 10, fill: 'var(--ink-faint)' }}
                />
              ))}
              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={18}>
                {rows.map((r) => (
                  <Cell key={r.ticker} fill={r.value >= 0 ? 'var(--terracotta)' : 'var(--violet)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
