import { useEffect, useRef, useState } from 'react';
import { HostGate } from '../components/host/HostGate';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { ensureQuestionsSeeded, writeQuestion } from '../lib/firebaseData';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { ROUND_ORDER, SEED_QUESTIONS, getPointsForRound, resolveQuestions, SUDDEN_DEATH_POINTS } from '../lib/triviaData';
import type { Question } from '../types';

export function HostQuestionsPage() {
  return (
    <HostGate title="Unlock question editor" description="Edit question text, choices, and the correct answer. Changes go live immediately for every connected player, screen, and host.">
      <QuestionsEditor />
    </HostGate>
  );
}

function QuestionsEditor() {
  const { gameState } = useGameSubscription(DEFAULT_GAME_CODE);
  const questions = resolveQuestions(gameState);
  const [isSeeding, setIsSeeding] = useState(true);
  const [seedError, setSeedError] = useState<string | null>(null);
  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (hasSeededRef.current) return;
    hasSeededRef.current = true;
    ensureQuestionsSeeded(DEFAULT_GAME_CODE, SEED_QUESTIONS)
      .catch(caught => setSeedError(caught instanceof Error ? caught.message : 'Could not seed question bank.'))
      .finally(() => setIsSeeding(false));
  }, []);

  async function saveQuestion(question: Question) {
    await writeQuestion(DEFAULT_GAME_CODE, question);
  }

  return (
    <section className="page-card p-6">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Host controls</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">Question editor</h1>
      <p className="mt-3 max-w-2xl text-cjsr-paper">
        Round and point value are fixed. Edit the question text, the four choices, and mark the correct answer.
      </p>

      {isSeeding ? (
        <p className="mt-6 text-lg text-cjsr-paper">Loading question bank...</p>
      ) : seedError ? (
        <p className="mt-6 font-bold text-cjsr-red-light" role="alert">{seedError}</p>
      ) : (
        ROUND_ORDER.map(round => {
          const roundQuestions = questions.filter(question => question.round === round);
          if (roundQuestions.length === 0) return null;
          const points = round === 'suddenDeath' ? SUDDEN_DEATH_POINTS : getPointsForRound(round);
          return (
            <section key={round} className="mt-8">
              <h2 className="border-b-2 border-cjsr-ink/50 pb-1 font-display text-2xl uppercase">
                {round === 'suddenDeath' ? 'Sudden death' : `Round ${round}`}
                <span className="ml-2 text-base font-bold normal-case text-cjsr-paper">
                  ({points} pt{points !== 1 ? 's' : ''} each)
                </span>
              </h2>
              <ol className="mt-4 space-y-4">
                {roundQuestions.map(question => (
                  <QuestionEditorRow key={question.id} question={question} onSave={saveQuestion} />
                ))}
              </ol>
            </section>
          );
        })
      )}
    </section>
  );
}

function QuestionEditorRow({ question, onSave }: { question: Question; onSave: (question: Question) => Promise<void> }) {
  const [text, setText] = useState(question.text);
  const [choices, setChoices] = useState<[string, string, string, string]>([...question.choices]);
  const [answer, setAnswer] = useState<0 | 1 | 2 | 3>(question.answer);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isDirty = text !== question.text || choices.some((choice, index) => choice !== question.choices[index]) || answer !== question.answer;

  async function save() {
    if (!text.trim() || choices.some(choice => !choice.trim())) {
      setStatus('Text and all four choices are required.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await onSave({
        ...question,
        text: text.trim(),
        choices: choices.map(choice => choice.trim()) as [string, string, string, string],
        answer,
      });
      setStatus('Saved.');
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Could not save question.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="border-2 border-cjsr-ink/50 p-4">
      <p className="text-sm font-black uppercase tracking-wide text-cjsr-red-light">Q{question.id}</p>
      <label className="sr-only" htmlFor={`question-${question.id}-text`}>Question text</label>
      <textarea
        id={`question-${question.id}-text`}
        value={text}
        maxLength={140}
        rows={2}
        onChange={event => setText(event.target.value)}
        className="mt-2 w-full border-2 border-cjsr-ink bg-cjsr-black px-3 py-2 text-cjsr-ink"
      />
      <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Choices, with the correct one selected</legend>
        {choices.map((choice, index) => (
          <label key={index} className="flex items-center gap-2 border border-cjsr-ink/50 p-2">
            <input
              type="radio"
              name={`question-${question.id}-answer`}
              checked={answer === index}
              onChange={() => setAnswer(index as 0 | 1 | 2 | 3)}
              aria-label={`Mark choice ${String.fromCharCode(65 + index)} as correct`}
            />
            <span className="font-black">{String.fromCharCode(65 + index)}.</span>
            <label className="sr-only" htmlFor={`question-${question.id}-choice-${index}`}>Choice {String.fromCharCode(65 + index)}</label>
            <input
              id={`question-${question.id}-choice-${index}`}
              value={choice}
              onChange={event => setChoices(previous => previous.map((current, i) => (i === index ? event.target.value : current)) as [string, string, string, string])}
              className="min-w-0 flex-1 border border-cjsr-ink/50 bg-cjsr-black px-2 py-1 text-cjsr-ink"
            />
          </label>
        ))}
      </fieldset>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy || !isDirty}
          onClick={() => void save()}
          className="min-h-10 border-2 border-cjsr-red bg-cjsr-red px-4 py-2 font-black text-white disabled:border-cjsr-paper/40 disabled:bg-cjsr-surface disabled:text-cjsr-paper/70"
        >
          {busy ? 'Saving...' : 'Save'}
        </button>
        {status && <span className="text-sm font-bold text-cjsr-paper">{status}</span>}
      </div>
    </li>
  );
}
