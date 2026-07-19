import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ConfigWarning } from './components/common/ConfigWarning';
import { ThemeToggle } from './components/common/ThemeToggle';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { HostPage } from './pages/HostPage';
import { HostBrandPage } from './pages/HostBrandPage';
import { HostQuestionsPage } from './pages/HostQuestionsPage';
import { PlayerPage } from './pages/PlayerPage';
import { ScreenPage } from './pages/ScreenPage';
import { MarketingPage } from './pages/MarketingPage';
import { TriviaKnightDemoPage } from './pages/TriviaKnightDemoPage';
import { siteConfig } from './config/site';

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
  const isDemoRoute = location.pathname === '/demo';
  const isStandaloneRoute = isMarketingRoute || isDemoRoute;

  return (
    <div className={isMarketingRoute ? 'marketing-shell' : isDemoRoute ? 'tk-demo-shell' : 'app-shell'}>
      <a className={isStandaloneRoute ? 'marketing-skip-link' : 'skip-link'} href="#main">Skip to main content</a>
      {!isScreenRoute && !isStandaloneRoute && (
        <header className="app-header">
          <HeaderContent />
        </header>
      )}
      {!isStandaloneRoute && <ConfigWarning />}
      <main id="main" className={isStandaloneRoute ? '' : isScreenRoute ? 'app-main app-main--screen' : 'app-main'}>
        <Routes>
          <Route path="/" element={<PlayerPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/demo" element={<TriviaKnightDemoPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/host/brand" element={<HostBrandPage />} />
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
    <div className="app-header__inner">
      <Link to={showHostNav ? '/host' : '/'} className="app-wordmark" aria-label={`${siteConfig.headerText} home`}>
        <span>Trivia</span><span>Knight</span>
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {showHostNav && (
          <nav aria-label="Host navigation" className="flex flex-wrap gap-2 text-sm font-bold">
            <Link className="nav-link" to="/host" aria-current={location.pathname === '/host' ? 'page' : undefined}>Host</Link>
            <Link className="nav-link" to="/host/brand" aria-current={location.pathname === '/host/brand' ? 'page' : undefined}>Brand setup</Link>
            <Link className="nav-link" to="/host/questions" aria-current={location.pathname === '/host/questions' ? 'page' : undefined}>Questions</Link>
            <Link className="nav-link" to="/screen">Screen</Link>
            <Link className="nav-link" to="/host/answer-key" aria-current={location.pathname === '/host/answer-key' ? 'page' : undefined}>Answer key</Link>
          </nav>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
