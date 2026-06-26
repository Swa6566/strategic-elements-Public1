import { COMPANIES } from '../data/companies';

export default function MoverRibbon({ quotes, loading }) {
  if (loading) {
    return <div className="mover-ribbon status-line">Scanning today's moves…</div>;
  }

  let biggest = null;
  for (const company of COMPANIES) {
    const pct = quotes?.[company.ticker]?.quote?.percentChange;
    if (pct == null) continue;
    if (!biggest || Math.abs(pct) > Math.abs(biggest.pct)) {
      biggest = { company, pct };
    }
  }

  if (!biggest) return null;

  const direction = biggest.pct >= 0 ? 'up' : 'down';

  return (
    <div className={`mover-ribbon glow-${direction}-bg`}>
      <span className="mover-label">Today's mover</span>
      <span className="mover-name">{biggest.company.name}</span>
      <span className={`delta ${direction}`}>
        {biggest.pct >= 0 ? '+' : ''}
        {biggest.pct.toFixed(2)}%
      </span>
      <span className="mover-context">
        {direction === 'up' ? 'leading the basket higher today' : "today's softest name in the basket"}
      </span>
    </div>
  );
}
