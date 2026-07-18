import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ConfigWarning } from './components/common/ConfigWarning';
import { ThemeToggle } from './components/common/ThemeToggle';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { HostPage } from './pages/HostPage';
import { HostQuestionsPage } from './pages/HostQuestionsPage';
import { PlayerPage } from './pages/PlayerPage';
import { ScreenPage } from './pages/ScreenPage';
import { MarketingPage } from './pages/MarketingPage';
import { siteConfig } from './config/site';
import logo from './assets/logo.png';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppLayout() {
  const location = useLocation();
  const isScreenRoute = location.pathname === '/screen';
  const isMarketingRoute = location.pathname === '/marketing';

  return (
    <div className={isMarketingRoute ? 'marketing-shell' : 'min-h-screen bg-brand-black text-brand-paper'}>
      <a className={isMarketingRoute ? 'marketing-skip-link' : 'skip-link'} href="#main">Skip to main content</a>
      {!isScreenRoute && !isMarketingRoute && (
        <header className="border-b-4 border-brand-red bg-brand-surface px-4 py-3">
          <HeaderContent />
        </header>
      )}
      {!isMarketingRoute && <ConfigWarning />}
      <main id="main" className={isMarketingRoute ? '' : isScreenRoute ? 'mx-auto max-w-none px-4 py-4' : 'mx-auto max-w-6xl px-4 py-6'}>
        <Routes>
          <Route path="/" element={<PlayerPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/host/questions" element={<HostQuestionsPage />} />
          <Route path="/screen" element={<ScreenPage />} />
          <Route path="/host/answer-key" element={<AnswerKeyPage />} />
        </Routes>
      </main>
    </div>
  );
}

function HeaderContent() {
  const location = useLocation();
  const showHostNav = location.pathname.startsWith('/host');

  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <Link to={showHostNav ? '/host' : '/'} className="flex items-center gap-2 font-display text-2xl font-black uppercase tracking-wide text-brand-ink">
        <img src={logo} alt="" className="h-9 w-9" />
        {siteConfig.headerText}
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {showHostNav && (
          <nav aria-label="Host navigation" className="flex flex-wrap gap-2 text-sm font-bold">
            <Link className="nav-link" to="/host">Host</Link>
            <Link className="nav-link" to="/host/questions">Questions</Link>
            <Link className="nav-link" to="/screen">Screen</Link>
            <Link className="nav-link" to="/host/answer-key">Answer key</Link>
          </nav>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
