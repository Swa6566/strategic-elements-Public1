import ElementBadge from './ElementBadge';
import ReturnTrendSpark from './ReturnTrendSpark';
import { COMPANIES } from '../data/companies';

function topHeadlineFor(ticker, news) {
  return news.find((n) => n.tickers.includes(ticker)) ?? null;
}

function PulseCard({ company, quote, metrics, news }) {
  const pct = quote?.percentChange;
  const direction = pct == null ? 'flat' : pct >= 0 ? 'up' : 'down';
  const headline = topHeadlineFor(company.ticker, news);

  return (
    <div className="pulse-card card">
      <div className="pulse-top">
        <ElementBadge element={company.element} percentChange={pct} size="sm" />
        <div className="pulse-id">
          <span className="pulse-ticker mono">{company.ticker}</span>
          <span className="pulse-name">{company.name}</span>
        </div>
        <div className="pulse-price">
          {quote ? (
            <>
              <span className="mono pulse-price-num">${quote.price.toFixed(2)}</span>
              <span className={`delta ${direction === 'flat' ? 'up' : direction}`}>
                {pct >= 0 ? '+' : ''}
                {pct?.toFixed(2)}%
              </span>
            </>
          ) : (
            <span className="status-line">no quote</span>
          )}
        </div>
      </div>

      <div className="pulse-trend" title="Trailing return trend across 1M → 1Y windows">
        <ReturnTrendSpark returns={metrics?.returns} />
      </div>

      <div className="pulse-news">
        {headline ? (
          <>
            <span className={`sentiment-dot sentiment-${headline.sentiment}`} aria-hidden="true" />
            <a href={headline.url} target="_blank" rel="noreferrer" className="pulse-headline">
              {headline.title}
            </a>
          </>
        ) : (
          <span className="status-line">No tagged headline right now</span>
        )}
      </div>
    </div>
  );
}

export default function PulseStrip({ quotes, news, loading }) {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Pulse</p>
          <h2 className="section-title">Everything at a glance</h2>
          <p className="section-sub">
            Price, trailing-return trend, and the most relevant headline for each company —
            in one row, instead of three separate sections.
          </p>
        </div>
      </div>
      {loading ? (
        <p className="status-line">Loading live pulse…</p>
      ) : (
        <div className="pulse-grid">
          {COMPANIES.map((company) => (
            <PulseCard
              key={company.ticker}
              company={company}
              quote={quotes?.[company.ticker]?.quote}
              metrics={quotes?.[company.ticker]?.metrics}
              news={news}
            />
          ))}
        </div>
      )}
    </section>
  );
}
