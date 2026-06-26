export default function AboutSection() {
  return (
    <section className="section about-section">
      <div className="card about-card">
        <span className="eyebrow">About this tracker</span>
        <h2 className="section-title">Why this project exists</h2>
        <p>
          Strategic Elements is a portfolio project tracking the companies building a Western
          alternative to China's grip on critical minerals and rare-earth processing — the
          materials behind EV motors, wind turbines, defense systems, and the modern grid.
        </p>
        <p>
          Live prices and trailing returns come from Finnhub's free tier; sector news comes from
          FreeNewsApi.io. The portfolio simulator and sector chart use real trailing-return data —
          nothing here is fabricated or backfilled. This is a research and demonstration tool,
          not investment advice.
        </p>
      </div>
    </section>
  );
}
