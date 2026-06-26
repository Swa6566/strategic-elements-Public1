import { useState } from 'react';
import { COMPANIES } from '../data/companies';

const WINDOWS = ['1M', '3M', '6M', 'YTD', '1Y'];

function RangeGauge({ low, high, price }) {
  if (low == null || high == null || price == null || high <= low) {
    return <p className="status-line">Range data unavailable.</p>;
  }
  const pct = Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100));
  return (
    <div className="gauge">
      <div className="gauge-track">
        <div className="gauge-marker" style={{ left: `${pct}%` }} />
      </div>
      <div className="gauge-labels">
        <span className="mono">${low.toFixed(2)}</span>
        <span className="mono gauge-current">${price.toFixed(2)}</span>
        <span className="mono">${high.toFixed(2)}</span>
      </div>
      <p className="status-line">52-week range — current price sits at {pct.toFixed(0)}% of the band.</p>
    </div>
  );
}

function ReturnLadder({ returns }) {
  if (!returns) return <p className="status-line">No return data available.</p>;
  const values = WINDOWS.map((w) => returns[w]).filter((v) => v != null);
  const maxAbs = Math.max(1, ...values.map((v) => Math.abs(v)));
  return (
    <div className="ladder">
      {WINDOWS.map((w) => {
        const v = returns[w];
        if (v == null) return null;
        const widthPct = (Math.abs(v) / maxAbs) * 100;
        return (
          <div className="ladder-row" key={w}>
            <span className="ladder-window mono">{w}</span>
            <div className="ladder-bar-track">
              <div
                className={`ladder-bar ${v >= 0 ? 'up' : 'down'}`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <span className={`delta ${v >= 0 ? 'up' : 'down'}`}>
              {v >= 0 ? '+' : ''}
              {v.toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function FundamentalsPanel({ quotes, loading }) {
  const [ticker, setTicker] = useState(COMPANIES[0].ticker);
  const company = COMPANIES.find((c) => c.ticker === ticker);
  const data = quotes?.[ticker];

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Fundamentals</p>
          <h2 className="section-title">Where it sits in its own range</h2>
          <p className="section-sub">52-week positioning and trailing returns, company by company.</p>
        </div>
        <div className="window-pills">
          {COMPANIES.map((c) => (
            <button
              key={c.ticker}
              type="button"
              className={`pill clickable ${ticker === c.ticker ? 'active' : ''}`}
              onClick={() => setTicker(c.ticker)}
            >
              {c.ticker}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="status-line">Loading fundamentals…</p>
      ) : (
        <div className="card fund-card">
          <div className="fund-head">
            <div>
              <h3 className="fund-name">{company.name}</h3>
              <p className="fund-blurb">{company.blurb}</p>
            </div>
            <div className="fund-stats">
              <div>
                <span className="eyebrow">Market cap</span>
                <p className="mono">
                  {data?.metrics?.marketCap ? `$${(data.metrics.marketCap / 1000).toFixed(2)}B` : '—'}
                </p>
              </div>
              <div>
                <span className="eyebrow">Beta</span>
                <p className="mono">{data?.metrics?.beta != null ? data.metrics.beta.toFixed(2) : '—'}</p>
              </div>
            </div>
          </div>

          <div className="fund-body">
            <RangeGauge
              low={data?.metrics?.week52Low}
              high={data?.metrics?.week52High}
              price={data?.quote?.price}
            />
            <ReturnLadder returns={data?.metrics?.returns} />
          </div>
        </div>
      )}
    </section>
  );
}
