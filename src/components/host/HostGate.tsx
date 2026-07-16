import { useState, type FormEvent, type ReactNode } from 'react';
import { getOptionalEnv } from '../../lib/env';

export function HostGate({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);

  function unlock(event: FormEvent) {
    event.preventDefault();
    const expected = getOptionalEnv('VITE_HOST_PASSPHRASE');
    if (!expected) {
      setError('Missing VITE_HOST_PASSPHRASE in .env.local.');
      return;
    }
    if (passphrase !== expected) {
      setError('Incorrect host passphrase.');
      return;
    }
    setIsUnlocked(true);
    setError(null);
  }

  if (isUnlocked) return <>{children}</>;

  return (
    <section className="page-card p-6">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Host controls</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-cjsr-paper">{description}</p>}
      <form className="mt-6 max-w-sm" onSubmit={unlock}>
        <label className="block text-sm font-bold uppercase tracking-wide" htmlFor="host-passphrase">Host passphrase</label>
        <input
          id="host-passphrase"
          type="password"
          className="mt-2 min-h-11 w-full border-2 border-cjsr-red bg-cjsr-black px-3 py-2 text-cjsr-ink"
          value={passphrase}
          onChange={event => setPassphrase(event.target.value)}
        />
        <button type="submit" className="mt-4 min-h-11 border-2 border-cjsr-red bg-cjsr-red px-5 py-2 font-black text-white">
          Unlock
        </button>
      </form>
      {error && <p className="mt-4 font-bold text-cjsr-red-light" role="alert">{error}</p>}
    </section>
  );
}
