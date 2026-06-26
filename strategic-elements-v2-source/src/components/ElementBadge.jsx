import { ELEMENT_FACTS } from '../data/companies';

export default function ElementBadge({ element, percentChange, size = 'md' }) {
  const direction = percentChange == null ? 'flat' : percentChange >= 0 ? 'up' : 'down';
  const fact = ELEMENT_FACTS[element.symbol];

  return (
    <div className={`element-badge-wrap size-${size}`} tabIndex={0}>
      <div className={`element-badge glow-${direction}`}>
        <span className="element-number">{element.number}</span>
        <span className="element-symbol">{element.symbol}</span>
        <span className="element-name">{element.name}</span>
      </div>
      {fact && (
        <div className="element-fact-card" role="tooltip">
          {fact}
        </div>
      )}
    </div>
  );
}
