import { useMemo, useState } from 'react';
import { COMPANIES } from '../data/companies';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function ArticleRow({ article }) {
  return (
    <a href={article.url} target="_blank" rel="noreferrer" className="news-row">
      <span className={`sentiment-dot sentiment-${article.sentiment}`} aria-hidden="true" />
      <div className="news-row-body">
        <span className="news-row-title">{article.title}</span>
        <span className="news-row-meta status-line">
          {article.source} {article.publishedAt ? `· ${timeAgo(article.publishedAt)}` : ''}
          {article.tickers.length > 0 ? ` · ${article.tickers.join(', ')}` : ''}
        </span>
      </div>
    </a>
  );
}

export default function NewsFeed({ articles, loading }) {
  const [filter, setFilter] = useState('all');

  const tickersWithNews = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => a.tickers.forEach((t) => set.add(t)));
    return COMPANIES.filter((c) => set.has(c.ticker)).map((c) => c.ticker);
  }, [articles]);

  const policyArticles = articles.filter((a) => a.isPolicy).slice(0, 3);

  const generalArticles = articles
    .filter((a) => (filter === 'all' ? true : a.tickers.includes(filter)))
    .slice(0, 12);

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Sector news</p>
          <h2 className="section-title">What's moving the story</h2>
          <p className="section-sub">
            Tagged by company where possible, with the policy and trade headlines that tend to
            swing the whole sector pulled into their own lane.
          </p>
        </div>
      </div>

      {policyArticles.length > 0 && (
        <div className="policy-lane card">
          <span className="eyebrow policy-lane-label">Policy &amp; trade</span>
          {policyArticles.map((a) => (
            <ArticleRow article={a} key={a.id} />
          ))}
        </div>
      )}

      <div className="news-filters">
        <button
          type="button"
          className={`pill clickable ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {tickersWithNews.map((t) => (
          <button
            key={t}
            type="button"
            className={`pill clickable ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="status-line">Loading sector news…</p>
      ) : generalArticles.length === 0 ? (
        <p className="status-line">No headlines for this filter right now.</p>
      ) : (
        <div className="news-list card">
          {generalArticles.map((a) => (
            <ArticleRow article={a} key={a.id} />
          ))}
        </div>
      )}
    </section>
  );
}
