export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="wordmark">
        <span className="wordmark-main">Strategic Elements</span>
        <span className="wordmark-sub">Critical Minerals &amp; Rare Earth Tracker</span>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle between Daylight and Ore themes"
      >
        <span className={theme === 'daylight' ? 'theme-toggle-active' : ''}>Daylight</span>
        <span className="theme-toggle-divider">/</span>
        <span className={theme === 'ore' ? 'theme-toggle-active' : ''}>Ore</span>
      </button>
    </header>
  );
}
