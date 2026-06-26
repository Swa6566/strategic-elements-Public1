import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { COMPANIES } from '../data/companies';

const WINDOWS = ['1M', '3M', '6M', 'YTD', '1Y'];
const DEFAULT_WEIGHT = 5;

function defaultWeights() {
  return COMPANIES.reduce((acc, c) => {
    acc[c.ticker] = DEFAULT_WEIGHT;
    return acc;
  }, {});
}

export default function PortfolioSimulator({ quotes, loading }) {
  const [amount, setAmount] = useState(10000);
  const [windowKey, setWindowKey] = useState('1Y');
  const [weights, setWeights] = useState(defaultWeights);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const rows = useMemo(() => {
    return COMPANIES.map((c) => {
      const ret = quotes?.[c.ticker]?.metrics?.returns?.[windowKey];
      const share = weights[c.ticker] / totalWeight;
      const allocated = amount * share;
      const contribution = ret != null ? allocated * (ret / 100) : null;
      return { ticker: c.ticker, name: c.name, ret, share, allocated, contribution };
    });
  }, [quotes, windowKey, weights, totalWeight, amount]);

  const validRows = rows.filter((r) => r.contribution != null);
  const totalGain = validRows.reduce((sum, r) => sum + r.contribution, 0);
  const endingValue = amount + totalGain;
  const allocatedTotal = rows.reduce((sum, r) => sum + r.allocated, 0);
  const coveragePct = allocatedTotal ? Math.round((validRows.reduce((s, r) => s + r.allocated, 0) / allocatedTotal) * 100) : 0;

  function updateWeight(ticker, value) {
    setWeights((prev) => ({ ...prev, [ticker]: Number(value) }));
  }

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Portfolio simulator</p>
          <h2 className="section-title">What if you'd invested?</h2>
          <p className="section-sub">
            Split a hypothetical amount across the basket and see what it would be worth today,
            based on each company's real trailing return. A research tool, not advice — for that,
            talk to a licensed advisor.
          </p>
        </div>
      </div>

      <div className="sim-grid card">
        <div className="sim-controls">
          <label className="sim-field">
            <span className="eyebrow">Hypothetical amount</span>
            <div className="sim-amount-input">
              <span>$</span>
              <input
                type="number"
                min="0"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </label>

          <label className="sim-field">
            <span className="eyebrow">Lookback window</span>
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
          </label>

          <button type="button" className="sim-reset" onClick={() => setWeights(defaultWeights())}>
            Reset to equal weight
          </button>
        </div>

        <div className="sim-allocations">
          {COMPANIES.map((c) => {
            const share = Math.round((weights[c.ticker] / totalWeight) * 100);
            return (
              <div className="sim-row" key={c.ticker}>
                <span className="sim-row-ticker mono">{c.ticker}</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights[c.ticker]}
                  onChange={(e) => updateWeight(c.ticker, e.target.value)}
                  aria-label={`Relative weight for ${c.name}`}
                />
                <span className="sim-row-share mono">{share}%</span>
              </div>
            );
          })}
        </div>

        <div className="sim-result">
          {loading ? (
            <p className="status-line">Loading returns…</p>
          ) : (
            <>
              <div className="sim-result-headline">
                <span className="eyebrow">Hypothetical value today</span>
                <span className="sim-result-num mono">${endingValue.toFixed(0)}</span>
                <span className={`delta ${totalGain >= 0 ? 'up' : 'down'}`}>
                  {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(0)} ({((totalGain / amount) * 100).toFixed(1)}%)
                </span>
              </div>
              {coveragePct < 100 && (
                <p className="status-line">Based on {coveragePct}% of your allocation — some tickers are missing live return data right now.</p>
              )}
              <ResponsiveContainer width="100%" height={Math.max(160, validRows.length * 28)}>
                <BarChart data={validRows} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--ink-faint)' }} />
                  <YAxis type="category" dataKey="ticker" tick={{ fontSize: 11, fill: 'var(--ink)' }} width={48} />
                  <Bar dataKey="contribution" radius={[4, 4, 4, 4]} barSize={14}>
                    {validRows.map((r) => (
                      <Cell key={r.ticker} fill={r.contribution >= 0 ? 'var(--terracotta)' : 'var(--violet)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="status-line">$ contribution to gain/loss by company, {windowKey} window.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
