import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ConfigWarning } from './components/common/ConfigWarning';
import { AnswerKeyPage } from './pages/AnswerKeyPage';
import { HostPage } from './pages/HostPage';
import { PlayerPage } from './pages/PlayerPage';
import { ScreenPage } from './pages/ScreenPage';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-cjsr-magenta text-cjsr-black">
          <a className="skip-link" href="#main">Skip to main content</a>
          <header className="border-b-4 border-cjsr-black bg-cjsr-yellow px-4 py-3">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/" className="font-display text-2xl font-black uppercase tracking-wide">
                CJSR Trivia
              </Link>
              <nav aria-label="Primary navigation" className="flex flex-wrap gap-2 text-sm font-bold">
                <Link className="nav-link" to="/">Player</Link>
                <Link className="nav-link" to="/host">Host</Link>
                <Link className="nav-link" to="/screen">Screen</Link>
                <Link className="nav-link" to="/host/answer-key">Answer key</Link>
              </nav>
            </div>
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

