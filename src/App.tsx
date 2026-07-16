import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ConfigWarning } from './components/common/ConfigWarning';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { HostPage } from './pages/HostPage';
import { PlayerPage } from './pages/PlayerPage';
import { ScreenPage } from './pages/ScreenPage';
import cjsrLogo from './assets/cjsr-logo.png';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-cjsr-black text-cjsr-paper">
          <a className="skip-link" href="#main">Skip to main content</a>
          <header className="border-b-4 border-cjsr-red bg-cjsr-surface px-4 py-3">
            <HeaderContent />
          </header>
          <ConfigWarning />
          <main id="main" className="mx-auto max-w-6xl px-4 py-6">
            <Routes>
              <Route path="/" element={<PlayerPage />} />
              <Route path="/host" element={<HostPage />} />
              <Route path="/screen" element={<ScreenPage />} />
              <Route path="/host/answer-key" element={<AnswerKeyPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function HeaderContent() {
  const location = useLocation();
  const showHostNav = location.pathname.startsWith('/host');

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link to={showHostNav ? '/host' : '/'} className="flex items-center gap-2 font-display text-2xl font-black uppercase tracking-wide text-white">
        <img src={cjsrLogo} alt="" className="h-9 w-9" />
        CJSR Trivia
      </Link>
      {showHostNav && (
        <nav aria-label="Host navigation" className="flex flex-wrap gap-2 text-sm font-bold">
          <Link className="nav-link" to="/host">Host</Link>
          <Link className="nav-link" to="/screen">Screen</Link>
          <Link className="nav-link" to="/host/answer-key">Answer key</Link>
        </nav>
      )}
    </div>
  );
}
