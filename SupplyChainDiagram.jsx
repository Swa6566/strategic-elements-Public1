import { COMPANIES } from '../data/companies';

const STAGES = [
  {
    name: 'Extraction',
    description: 'Mining and ore concentration',
    tickers: ['MP', 'NB', 'CRML', 'METC', 'LAC', 'UUUU'],
  },
  {
    name: 'Separation & Processing',
    description: 'Turning ore into usable oxides and chemicals',
    tickers: ['LYSCF', 'UUUU', 'ALB', 'USAR'],
  },
  {
    name: 'Metal & Magnet Making',
    description: 'Alloys, magnets, and battery-grade materials',
    tickers: ['MP', 'USAR', 'ALB'],
  },
  {
    name: 'End Use',
    description: 'EV motors, wind turbines, defense systems, grid batteries',
    tickers: [],
  },
];

function byTicker(ticker) {
  return COMPANIES.find((c) => c.ticker === ticker);
}

export default function SupplyChainDiagram() {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">How it fits together</p>
          <h2 className="section-title">The supply chain</h2>
          <p className="section-sub">
            Where each tracked company sits between raw ore and a finished motor, turbine, or battery.
          </p>
        </div>
      </div>
      <div className="chain">
        {STAGES.map((stage, i) => (
          <div className="chain-stage" key={stage.name}>
            <div className="chain-stage-card card">
              <span className="chain-stage-index mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="chain-stage-name">{stage.name}</h3>
              <p className="chain-stage-desc">{stage.description}</p>
              <div className="chain-tickers">
                {stage.tickers.length === 0 ? (
                  <span className="status-line">Where it all lands</span>
                ) : (
                  stage.tickers.map((t) => {
                    const company = byTicker(t);
                    if (!company) return null;
                    return (
                      <span className="chain-ticker-pill pill" key={t}>
                        {company.element.symbol} · {t}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
            {i < STAGES.length - 1 && <div className="chain-arrow" aria-hidden="true">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
