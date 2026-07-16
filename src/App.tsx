import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ConfigWarning } from './components/common/ConfigWarning';
import { ThemeToggle } from './components/common/ThemeToggle';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { HostPage } from './pages/HostPage';
import { PlayerPage } from './pages/PlayerPage';
import { ScreenPage } from './pages/ScreenPage';
import cjsrLogo from './assets/cjsr-logo.png';

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

  return (
    <div className="min-h-screen bg-cjsr-black text-cjsr-paper">
      <a className="skip-link" href="#main">Skip to main content</a>
      {!isScreenRoute && (
        <header className="border-b-4 border-cjsr-red bg-cjsr-surface px-4 py-3">
          <HeaderContent />
        </header>
      )}
      <ConfigWarning />
      <main id="main" className={isScreenRoute ? 'mx-auto max-w-none px-4 py-4' : 'mx-auto max-w-6xl px-4 py-6'}>
        <Routes>
          <Route path="/" element={<PlayerPage />} />
          <Route path="/host" element={<HostPage />} />
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
      <Link to={showHostNav ? '/host' : '/'} className="flex items-center gap-2 font-display text-2xl font-black uppercase tracking-wide text-cjsr-ink">
        <img src={cjsrLogo} alt="" className="h-9 w-9" />
        CJSR Trivia
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {showHostNav && (
          <nav aria-label="Host navigation" className="flex flex-wrap gap-2 text-sm font-bold">
            <Link className="nav-link" to="/host">Host</Link>
            <Link className="nav-link" to="/screen">Screen</Link>
            <Link className="nav-link" to="/host/answer-key">Answer key</Link>
          </nav>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
