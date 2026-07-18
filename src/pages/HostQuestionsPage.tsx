import { useEffect, useMemo, useRef, useState } from 'react';
import { HostGate } from '../components/host/HostGate';
import { useGameSubscription } from '../hooks/useGameSubscription';
import { bulkWriteQuestions, ensureQuestionsSeeded, writeQuestion } from '../lib/firebaseData';
import { DEFAULT_GAME_CODE } from '../lib/hostState';
import { downloadQuestionTemplate, parseQuestionWorkbook } from '../lib/questionImport';
import { validateQuestionRow, type QuestionRowResult } from '../lib/questionValidation';
import { isMediaUploadConfigured, uploadQuestionMedia } from '../lib/storageMedia';
import { ROUND_ORDER, SEED_QUESTIONS, getPointsForRound, resolveQuestions, SUDDEN_DEATH_POINTS } from '../lib/triviaData';
import type { ChoiceIndex, Question, QuestionMedia } from '../types';

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
      <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">Host controls</p>
      <h1 className="mt-2 font-display text-4xl leading-tight">Question editor</h1>
      <p className="mt-3 max-w-2xl text-brand-paper">
        Round and point value are fixed. Edit the question text, the four choices, mark the correct answer, and optionally attach an image or video clue.
      </p>

      {isSeeding ? (
        <p className="mt-6 text-lg text-brand-paper">Loading question bank...</p>
      ) : seedError ? (
        <p className="mt-6 font-bold text-brand-red-light" role="alert">{seedError}</p>
      ) : (
        <>
          <ImportPanel questions={questions} />
          {ROUND_ORDER.map(round => {
          const roundQuestions = questions.filter(question => question.round === round);
          if (roundQuestions.length === 0) return null;
          const points = round === 'suddenDeath' ? SUDDEN_DEATH_POINTS : getPointsForRound(round);
          return (
            <section key={round} className="mt-8">
              <h2 className="border-b-2 border-brand-ink/50 pb-1 font-display text-2xl uppercase">
                {round === 'suddenDeath' ? 'Sudden death' : `Round ${round}`}
                <span className="ml-2 text-base font-bold normal-case text-brand-paper">
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
        })}
        </>
      )}
    </section>
  );
}

function ImportPanel({ questions }: { questions: readonly Question[] }) {
  const [rows, setRows] = useState<QuestionRowResult[] | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setMessage(null);
    try {
      const parsedRows = await parseQuestionWorkbook(file);
      if (parsedRows.length === 0) {
        setRows(null);
        setMessage('No rows to import - the file has no filled-in questions, or no "Questions" sheet.');
        return;
      }
      setRows(parsedRows.map(row => validateQuestionRow(row, questions)));
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not read that file.');
      setRows(null);
    } finally {
      setIsParsing(false);
    }
  }

  function clearImport() {
    setRows(null);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function confirmImport() {
    if (!rows || rows.some(row => row.errors.length > 0)) return;
    setIsImporting(true);
    setMessage(null);
    try {
      const importedQuestions = rows.map(row => row.question).filter((question): question is Question => question !== null);
      await bulkWriteQuestions(DEFAULT_GAME_CODE, importedQuestions);
      setRows(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage(`Imported ${importedQuestions.length} question${importedQuestions.length !== 1 ? 's' : ''}.`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not import questions.');
    } finally {
      setIsImporting(false);
    }
  }

  const errorCount = rows?.filter(row => row.errors.length > 0).length ?? 0;
  const canImport = rows !== null && rows.length > 0 && errorCount === 0;

  return (
    <section className="mb-8 border-2 border-brand-ink/50 p-4">
      <h2 className="font-display text-2xl">Bulk import from spreadsheet</h2>
      <p className="mt-2 text-brand-paper">
        Download a template, fill in the questions you want to change, then upload it here. Import only edits existing questions - it can't add or remove any.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void downloadQuestionTemplate(questions)}
          className="min-h-11 border-2 border-brand-ink px-4 py-2 font-bold text-brand-ink"
        >
          Download template
        </button>
        <label className="min-h-11 cursor-pointer border-2 border-brand-red bg-brand-red px-4 py-2 font-black text-white">
          Upload filled template
          <input ref={fileInputRef} type="file" accept=".xlsx" onChange={event => void handleFileSelected(event)} className="sr-only" />
        </label>
        {isParsing && <span className="text-sm font-bold text-brand-paper">Reading file...</span>}
      </div>

      {rows && rows.length > 0 && (
        <div className="mt-4">
          <div className="max-h-80 overflow-y-auto border border-brand-ink/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-ink/50 text-brand-red-light">
                  <th className="p-2">Row</th>
                  <th className="p-2">Q#</th>
                  <th className="p-2">Text</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.rowNumber} className="border-b border-brand-ink/20 align-top">
                    <td className="p-2">{row.rowNumber}</td>
                    <td className="p-2">{row.id ?? '-'}</td>
                    <td className="p-2">{row.text ? `${row.text.slice(0, 40)}${row.text.length > 40 ? '...' : ''}` : '-'}</td>
                    <td className="p-2">
                      {row.errors.length === 0 ? (
                        <span className="text-brand-correct">Valid</span>
                      ) : (
                        <span className="text-brand-red-light">{row.errors.join(' ')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canImport || isImporting}
              onClick={() => void confirmImport()}
              className="min-h-10 border-2 border-brand-red bg-brand-red px-4 py-2 font-black text-white disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
            >
              {isImporting ? 'Importing...' : `Import ${rows.length} question${rows.length !== 1 ? 's' : ''}`}
            </button>
            <button type="button" onClick={clearImport} disabled={isImporting} className="min-h-10 border border-brand-ink/50 px-4 py-2 font-bold text-brand-paper">
              Clear
            </button>
            {errorCount > 0 && <span className="text-sm font-bold text-brand-red-light">{errorCount} row{errorCount !== 1 ? 's' : ''} need fixing before you can import.</span>}
          </div>
        </div>
      )}

      {message && <p className="mt-3 font-bold text-brand-paper" role="status">{message}</p>}
    </section>
  );
}

function QuestionEditorRow({ question, onSave }: { question: Question; onSave: (question: Question) => Promise<void> }) {
  const isFreeText = question.type === 'free_text';
  const isMultiSelect = question.type === 'multi_select';
  const syncedQuestionRef = useRef(question);
  const [text, setText] = useState(question.text);
  const [choices, setChoices] = useState<[string, string, string, string]>(question.type === 'free_text' ? ['', '', '', ''] : [...question.choices]);
  const [answer, setAnswer] = useState<ChoiceIndex>(question.type === 'multiple_choice' ? question.answer : 0);
  const [selectedAnswers, setSelectedAnswers] = useState<ChoiceIndex[]>(question.type === 'multi_select' ? [...question.answers] : []);
  const [acceptedAnswersText, setAcceptedAnswersText] = useState(question.type === 'free_text' ? question.acceptedAnswers.join('\n') : '');
  const [media, setMedia] = useState<QuestionMedia | null>(question.media);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaUploadConfigured = isMediaUploadConfigured();

  const parsedAcceptedAnswers = useMemo(
    () => acceptedAnswersText.split('\n').map(line => line.trim()).filter(line => line !== ''),
    [acceptedAnswersText],
  );
  const draft = useMemo(() => ({
    text,
    choices,
    answer,
    selectedAnswers,
    acceptedAnswers: parsedAcceptedAnswers,
    media,
  }), [answer, choices, media, parsedAcceptedAnswers, selectedAnswers, text]);
  const isDirty = isQuestionDraftDirty(syncedQuestionRef.current, draft);

  useEffect(() => {
    if (syncedQuestionRef.current === question) return;
    if (isQuestionDraftDirty(syncedQuestionRef.current, draft)) return;
    syncedQuestionRef.current = question;
    setText(question.text);
    setChoices(question.type === 'free_text' ? ['', '', '', ''] : [...question.choices]);
    setAnswer(question.type === 'multiple_choice' ? question.answer : 0);
    setSelectedAnswers(question.type === 'multi_select' ? [...question.answers] : []);
    setAcceptedAnswersText(question.type === 'free_text' ? question.acceptedAnswers.join('\n') : '');
    setMedia(question.media);
  }, [draft, question]);

  async function save() {
    if (!text.trim()) {
      setStatus('Question text is required.');
      return;
    }
    if (isFreeText && parsedAcceptedAnswers.length === 0) {
      setStatus('At least one accepted answer is required.');
      return;
    }
    if (!isFreeText && choices.some(choice => !choice.trim())) {
      setStatus('All four choices are required.');
      return;
    }
    if (isMultiSelect && selectedAnswers.length === 0) {
      setStatus('Select at least one correct choice.');
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const trimmedChoices = choices.map(choice => choice.trim()) as [string, string, string, string];
      const updated: Question = isFreeText
        ? { id: question.id, round: question.round, text: text.trim(), media, type: 'free_text', acceptedAnswers: parsedAcceptedAnswers }
        : isMultiSelect
          ? { id: question.id, round: question.round, text: text.trim(), choices: trimmedChoices, media, type: 'multi_select', answers: selectedAnswers }
          : { id: question.id, round: question.round, text: text.trim(), choices: trimmedChoices, media, type: 'multiple_choice', answer };
      await onSave(updated);
      syncedQuestionRef.current = updated;
      setStatus('Saved.');
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Could not save question.');
    } finally {
      setBusy(false);
    }
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsUploading(true);
    setStatus(null);
    try {
      const uploaded = await uploadQuestionMedia(DEFAULT_GAME_CODE, question.id, file);
      setMedia(uploaded);
      setStatus('Media uploaded. Click Save to attach it to this question.');
    } catch (caught) {
      setStatus(caught instanceof Error ? caught.message : 'Could not upload media.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <li className="border-2 border-brand-ink/50 p-4">
      <p className="text-sm font-black uppercase tracking-wide text-brand-red-light">
        Q{question.id}
        {isMultiSelect && <span className="ml-2 text-brand-paper">Multi-select — mark all correct choices</span>}
        {isFreeText && <span className="ml-2 text-brand-paper">Free text — auto-graded, review answers after reveal</span>}
      </p>
      <label className="sr-only" htmlFor={`question-${question.id}-text`}>Question text</label>
      <textarea
        id={`question-${question.id}-text`}
        value={text}
        maxLength={140}
        rows={2}
        onChange={event => setText(event.target.value)}
        className="mt-2 w-full border-2 border-brand-ink bg-brand-black px-3 py-2 text-brand-ink"
      />
      {isFreeText ? (
        <div className="mt-3">
          <label className="text-sm font-bold uppercase tracking-wide text-brand-paper" htmlFor={`question-${question.id}-accepted`}>
            Accepted answers (one per line)
          </label>
          <textarea
            id={`question-${question.id}-accepted`}
            value={acceptedAnswersText}
            rows={3}
            onChange={event => setAcceptedAnswersText(event.target.value)}
            className="mt-2 w-full border-2 border-brand-ink bg-brand-black px-3 py-2 text-brand-ink"
          />
        </div>
      ) : (
        <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
          <legend className="sr-only">{isMultiSelect ? 'Choices, with all correct ones selected' : 'Choices, with the correct one selected'}</legend>
          {choices.map((choice, index) => {
            const choiceIndex = index as ChoiceIndex;
            const checked = isMultiSelect ? selectedAnswers.includes(choiceIndex) : answer === choiceIndex;
            return (
              <label key={index} className="flex items-center gap-2 border border-brand-ink/50 p-2">
                <input
                  type={isMultiSelect ? 'checkbox' : 'radio'}
                  name={`question-${question.id}-answer`}
                  checked={checked}
                  onChange={() => {
                    if (isMultiSelect) {
                      setSelectedAnswers(previous => (previous.includes(choiceIndex) ? previous.filter(value => value !== choiceIndex) : [...previous, choiceIndex]));
                    } else {
                      setAnswer(choiceIndex);
                    }
                  }}
                  aria-label={`Mark choice ${String.fromCharCode(65 + index)} as correct`}
                />
                <span className="font-black">{String.fromCharCode(65 + index)}.</span>
                <label className="sr-only" htmlFor={`question-${question.id}-choice-${index}`}>Choice {String.fromCharCode(65 + index)}</label>
                <input
                  id={`question-${question.id}-choice-${index}`}
                  value={choice}
                  onChange={event => setChoices(previous => previous.map((current, i) => (i === index ? event.target.value : current)) as [string, string, string, string])}
                  className="min-w-0 flex-1 border border-brand-ink/50 bg-brand-black px-2 py-1 text-brand-ink"
                />
              </label>
            );
          })}
        </fieldset>
      )}

      <div className="mt-3">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-paper">Image / video clue (optional)</p>
        {media && (
          <div className="mt-2 flex items-center gap-3">
            {media.type === 'image' ? (
              <img src={media.url} alt="" className="h-20 w-20 border border-brand-ink/50 object-cover" />
            ) : (
              <video src={media.url} muted controls className="h-20 w-32 border border-brand-ink/50" />
            )}
            <button type="button" onClick={() => setMedia(null)} className="min-h-9 border border-brand-ink/50 px-3 py-1 text-sm font-bold text-brand-paper">
              Remove
            </button>
          </div>
        )}
        {mediaUploadConfigured ? (
          <label className="mt-2 inline-block min-h-10 cursor-pointer border-2 border-brand-ink px-4 py-2 font-bold text-brand-ink">
            {isUploading ? 'Uploading...' : media ? 'Replace image/video' : 'Upload image/video'}
            <input type="file" accept="image/*,video/*" disabled={isUploading} onChange={event => void handleFileSelected(event)} className="sr-only" />
          </label>
        ) : (
          <p className="mt-2 text-sm text-brand-paper">Media upload is not configured for this deployment (set VITE_FIREBASE_STORAGE_BUCKET).</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy || !isDirty}
          onClick={() => void save()}
          className="min-h-10 border-2 border-brand-red bg-brand-red px-4 py-2 font-black text-white disabled:border-brand-paper/40 disabled:bg-brand-surface disabled:text-brand-paper/70"
        >
          {busy ? 'Saving...' : 'Save'}
        </button>
        {status && <span className="text-sm font-bold text-brand-paper">{status}</span>}
      </div>
    </li>
  );
}

function sameChoiceSet(a: readonly ChoiceIndex[], b: readonly ChoiceIndex[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every(value => setB.has(value));
}

function sameStringSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

function isQuestionDraftDirty(question: Question, draft: {
  readonly text: string;
  readonly choices: readonly [string, string, string, string];
  readonly answer: ChoiceIndex;
  readonly selectedAnswers: readonly ChoiceIndex[];
  readonly acceptedAnswers: readonly string[];
  readonly media: QuestionMedia | null;
}): boolean {
  return draft.text !== question.text
    || draft.media?.url !== question.media?.url
    || draft.media?.type !== question.media?.type
    || (question.type === 'free_text'
      ? !sameStringSet(draft.acceptedAnswers, question.acceptedAnswers)
      : draft.choices.some((choice, index) => choice !== question.choices[index])
        || (question.type === 'multi_select' ? !sameChoiceSet(draft.selectedAnswers, question.answers) : draft.answer !== question.answer));
}
