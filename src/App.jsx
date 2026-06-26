import { useEffect, useState } from 'react';
import Header from './components/Header';
import MoverRibbon from './components/MoverRibbon';
import PulseStrip from './components/PulseStrip';
import SupplyChainDiagram from './components/SupplyChainDiagram';
import SectorChart from './components/SectorChart';
import PortfolioSimulator from './components/PortfolioSimulator';
import FundamentalsPanel from './components/FundamentalsPanel';
import NewsFeed from './components/NewsFeed';
import QuizCard from './components/QuizCard';
import AboutSection from './components/AboutSection';
import { ALL_TICKERS } from './data/companies';
import { getAllQuotesAndMetrics, hasFinnhubKey } from './services/finnhubService';
import { getSectorNews, hasNewsKey } from './services/newsService';

const REFRESH_MS = 60_000;

export default function App() {
  const [theme, setTheme] = useState('daylight');
  const [quotes, setQuotes] = useState({});
  const [news, setNews] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    async function loadMarket() {
      const data = await getAllQuotesAndMetrics(ALL_TICKERS);
      if (!cancelled) {
        setQuotes(data);
        setLoadingMarket(false);
      }
    }
    loadMarket();
    const id = setInterval(loadMarket, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadNews() {
      const articles = await getSectorNews();
      if (!cancelled) {
        setNews(articles);
        setLoadingNews(false);
      }
    }
    loadNews();
    const id = setInterval(loadNews, 5 * REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'daylight' ? 'ore' : 'daylight'))} />

      {!hasFinnhubKey && (
        <p className="status-line key-warning">
          VITE_FINNHUB_API_KEY is missing — set it in Netlify's environment variables and
          redeploy from a Git-connected build (not a dragged dist folder) so it gets baked in.
        </p>
      )}
      {!hasNewsKey && (
        <p className="status-line key-warning">VITE_FREENEWS_API_KEY is missing — same fix as above.</p>
      )}

      <MoverRibbon quotes={quotes} loading={loadingMarket} />

      <PulseStrip quotes={quotes} news={news} loading={loadingMarket || loadingNews} />

      <SupplyChainDiagram />

      <SectorChart quotes={quotes} loading={loadingMarket} />

      <PortfolioSimulator quotes={quotes} loading={loadingMarket} />

      <FundamentalsPanel quotes={quotes} loading={loadingMarket} />

      <NewsFeed articles={news} loading={loadingNews} />

      <QuizCard />

      <AboutSection />

      <footer className="site-footer">
        <span>Stock data via Finnhub. News via FreeNewsApi.io.</span>
        <span>Built as a portfolio project — not investment advice.</span>
      </footer>
    </div>
  );
}
