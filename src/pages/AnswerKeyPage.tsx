import { HostGate } from '../components/host/HostGate';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { ROUND_ORDER, SUDDEN_DEATH_POINTS, getPointsForRound, resolveQuestions } from '../lib/triviaData';

export function AnswerKeyPage() {
  const { gameState } = useGameSubscription(DEFAULT_GAME_CODE);
  const questions = resolveQuestions(gameState);

  return (
    <HostGate title="Unlock answer key" description="This page lists every correct answer. Keep it host-side only.">
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
          const roundQuestions = questions.filter(question => question.round === round);
          if (roundQuestions.length === 0) return null;
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
                {roundQuestions.map(question => (
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
    </HostGate>
  );
}
