import { useState, type FormEvent } from 'react';
import { getOptionalEnv } from '../lib/env';
import { QUESTIONS, SUDDEN_DEATH_POINTS, getPointsForRound } from '../lib/triviaData';
import type { QuestionRound } from '../types';

const ROUND_ORDER: readonly QuestionRound[] = [1, 2, 3, 4, 5, 6, 'suddenDeath'];

export function AnswerKeyPage() {
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

  if (!isUnlocked) {
    return (
      <section className="page-card p-6">
        <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Host controls</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Unlock answer key</h1>
        <p className="mt-3 max-w-2xl text-cjsr-paper">This page lists every correct answer. Keep it host-side only.</p>
        <form className="mt-6 max-w-sm" onSubmit={unlock}>
          <label className="block text-sm font-bold uppercase tracking-wide" htmlFor="answer-key-passphrase">Host passphrase</label>
          <input
            id="answer-key-passphrase"
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

  return (
    <section className="border-4 border-black bg-white p-6 text-black shadow-none print:border-0 print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide print:hidden">Printable answer key</p>
          <h1 className="mt-1 font-display text-4xl leading-tight">Answer key backup</h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 border-2 border-black bg-black px-5 py-2 font-black text-white print:hidden"
        >
          Print
        </button>
      </div>

      {ROUND_ORDER.map(round => {
        const questions = QUESTIONS.filter(question => question.round === round);
        if (questions.length === 0) return null;
        const points = round === 'suddenDeath' ? SUDDEN_DEATH_POINTS : getPointsForRound(round);
        return (
          <section key={round} className="mt-6 break-inside-avoid">
            <h2 className="border-b-2 border-black pb-1 font-display text-2xl uppercase">
              {round === 'suddenDeath' ? 'Sudden death' : `Round ${round}`}
              <span className="ml-2 text-base font-bold normal-case">
                ({points} pt{points !== 1 ? 's' : ''} each)
              </span>
            </h2>
            <ol className="mt-3 space-y-4">
              {questions.map(question => (
                <li key={question.id} className="break-inside-avoid">
                  <p className="font-bold">Q{question.id}. {question.text}</p>
                  <ul className="mt-1 grid gap-1 sm:grid-cols-2">
                    {question.choices.map((choice, index) => (
                      <li key={index} className={index === question.answer ? 'font-black underline decoration-2' : ''}>
                        {String.fromCharCode(65 + index)}. {choice}
                        {index === question.answer && ' ✓'}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </section>
  );
}
