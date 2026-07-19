import { useEffect, useMemo, useState } from 'react';
import './TriviaKnightDemoPage.css';

type DemoView = 'player' | 'host' | 'projector';
type DemoPhase = 'lobby' | 'question' | 'reveal' | 'standings' | 'final';

const ANSWERS = ['Paris', 'Athens', 'Rome', 'London'] as const;
const CORRECT_ANSWER = 1;

const STANDINGS = [
  { name: 'Sudden Death Row', score: 42 },
  { name: 'Ctrl Alt Trivia', score: 39 },
  { name: 'Buzzer Beaters', score: 37 },
  { name: 'The Answer Is Yes', score: 33 },
];

const PHASE_LABELS: Record<DemoPhase, string> = {
  lobby: 'Lobby open',
  question: 'Question live',
  reveal: 'Answer reveal',
  standings: 'Standings',
  final: 'Final',
};

export function TriviaKnightDemoPage() {
  const [view, setView] = useState<DemoView>('player');
  const [phase, setPhase] = useState<DemoPhase>('lobby');
  const [joined, setJoined] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [teamName, setTeamName] = useState('Quiz Me Baby One More Time');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(8);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Trivia Knight | Product demo';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const demoStandings = useMemo(() => {
    const playerEntry = { name: teamName || 'Your team', score };
    return [...STANDINGS, playerEntry]
      .sort((a, b) => b.score - a.score)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  }, [score, teamName]);

  const playerRank = demoStandings.find((team) => team.name === (teamName || 'Your team'))?.rank ?? 5;
  const isCorrect = selectedAnswer === CORRECT_ANSWER;
  const lockInCount = locked ? 15 : 14;

  const joinGame = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (teamName.trim()) setJoined(true);
  };

  const revealAnswer = () => {
    setPhase('reveal');
    if (locked && isCorrect) setScore((current) => current + 2);
  };

  const startQuestion = () => {
    setPhase('question');
    setSelectedAnswer(null);
    setLocked(false);
  };

  const resetDemo = () => {
    setPhase('lobby');
    setJoined(false);
    setPlayerCount(2);
    setTeamName('Quiz Me Baby One More Time');
    setSelectedAnswer(null);
    setLocked(false);
    setScore(8);
    setView('player');
  };

  const selectAnswer = (index: number) => {
    if (!locked && phase === 'question') setSelectedAnswer(index);
  };

  const handleAnswerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || locked) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const nextIndex = (index + direction + ANSWERS.length) % ANSWERS.length;
    setSelectedAnswer(nextIndex);
    document.getElementById(`demo-answer-${nextIndex}`)?.focus();
  };

  return (
    <div className="tk-demo">
      <header className="tk-demo-topbar">
        <a className="tk-demo-brand" href="/marketing" aria-label="Trivia Knight marketing page">
          Trivia <span>Knight</span>
        </a>
        <div className="tk-demo-status"><i /> LOCAL PRODUCT DEMO</div>
        <button className="tk-demo-reset" type="button" onClick={resetDemo}>Reset demo</button>
      </header>

      <div className="tk-demo-workspace">
        <aside className="tk-demo-rail" aria-label="Demo controls">
          <div>
            <p className="tk-demo-label">PREVIEW AS</p>
            <div className="tk-demo-view-tabs" role="tablist" aria-label="Product surfaces">
              <ViewButton label="Player" detail="Team device" active={view === 'player'} onClick={() => setView('player')} />
              <ViewButton label="Host" detail="Control desk" active={view === 'host'} onClick={() => setView('host')} />
              <ViewButton label="Projector" detail="Room display" active={view === 'projector'} onClick={() => setView('projector')} />
            </div>
          </div>

          <div className="tk-demo-rail-state">
            <p className="tk-demo-label">SHARED GAME STATE</p>
            <div className="tk-demo-phase"><span>{PHASE_LABELS[phase]}</span><i /></div>
            <dl>
              <div><dt>Round</dt><dd>1 of 4</dd></div>
              <div><dt>Question</dt><dd>{phase === 'lobby' ? 'Not started' : '4 of 8'}</dd></div>
              <div><dt>Teams</dt><dd>18 joined</dd></div>
            </dl>
            <p className="tk-demo-safety">This demo uses local sample state. Nothing here connects to the live event.</p>
          </div>
        </aside>

        <section className="tk-demo-canvas" aria-live="polite">
          <div className="tk-demo-canvas-header">
            <div>
              <p className="tk-demo-label">{view.toUpperCase()} VIEW</p>
              <h1>{view === 'player' ? 'The team experience' : view === 'host' ? 'The control desk' : 'The room display'}</h1>
            </div>
            <span>{view === 'player' ? 'PHONE' : view === 'host' ? 'LAPTOP' : 'PROJECTOR'}</span>
          </div>

          {view === 'player' && (
            <PlayerPreview
              phase={phase}
              joined={joined}
              playerCount={playerCount}
              teamName={teamName}
              selectedAnswer={selectedAnswer}
              locked={locked}
              score={score}
              rank={playerRank}
              standings={demoStandings}
              isCorrect={isCorrect}
              onJoin={joinGame}
              onPlayerCountChange={setPlayerCount}
              onTeamNameChange={setTeamName}
              onSelectAnswer={selectAnswer}
              onAnswerKeyDown={handleAnswerKeyDown}
              onLock={() => selectedAnswer !== null && setLocked(true)}
            />
          )}

          {view === 'host' && (
            <HostPreview
              phase={phase}
              lockInCount={lockInCount}
              selectedAnswer={selectedAnswer}
              locked={locked}
              teamName={teamName}
              standings={demoStandings}
              onStartQuestion={startQuestion}
              onReveal={revealAnswer}
              onShowStandings={() => setPhase('standings')}
              onFinal={() => setPhase('final')}
              onLobby={() => setPhase('lobby')}
            />
          )}

          {view === 'projector' && (
            <ProjectorPreview phase={phase} lockInCount={lockInCount} standings={demoStandings} />
          )}
        </section>
      </div>
    </div>
  );
}

function ViewButton({ label, detail, active, onClick }: { label: string; detail: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" role="tab" aria-selected={active} className={active ? 'is-active' : ''} onClick={onClick}>
      <span>{label}</span><small>{detail}</small>
    </button>
  );
}

interface PlayerPreviewProps {
  phase: DemoPhase;
  joined: boolean;
  playerCount: number;
  teamName: string;
  selectedAnswer: number | null;
  locked: boolean;
  score: number;
  rank: number;
  standings: Array<{ name: string; score: number; rank: number }>;
  isCorrect: boolean;
  onJoin: (event: React.FormEvent<HTMLFormElement>) => void;
  onPlayerCountChange: (count: number) => void;
  onTeamNameChange: (name: string) => void;
  onSelectAnswer: (index: number) => void;
  onAnswerKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onLock: () => void;
}

function PlayerPreview(props: PlayerPreviewProps) {
  return (
    <div className="tk-device tk-phone">
      <div className="tk-device-bar"><BrandMini /><span><i /> CONNECTED</span></div>
      {!props.joined ? (
        <form className="tk-player-panel tk-join-panel" onSubmit={props.onJoin}>
          <p className="tk-demo-label">PLAYER JOIN</p>
          <h2>Join tonight's trivia.</h2>
          <p>Pick your team size and enter a name. You can change both before joining.</p>
          <fieldset>
            <legend>How many players?</legend>
            <div className="tk-count-options">
              {[1, 2, 3, 4].map((count) => (
                <button key={count} type="button" className={props.playerCount === count ? 'is-selected' : ''} aria-pressed={props.playerCount === count} onClick={() => props.onPlayerCountChange(count)}>{count}</button>
              ))}
            </div>
          </fieldset>
          <label htmlFor="demo-team-name">Team name</label>
          <input id="demo-team-name" value={props.teamName} maxLength={40} onChange={(event) => props.onTeamNameChange(event.target.value)} />
          <button className="tk-primary-action" type="submit" disabled={!props.teamName.trim()}>Join game</button>
        </form>
      ) : props.phase === 'lobby' ? (
        <div className="tk-player-panel tk-waiting-panel">
          <div className="tk-orbit" aria-hidden="true"><span /></div>
          <p className="tk-demo-label">YOU'RE IN</p>
          <h2>{props.teamName}</h2>
          <p>{props.playerCount} players · Waiting for the host to start.</p>
          <div className="tk-mini-stat"><span>18</span><small>TEAMS IN THE LOBBY</small></div>
        </div>
      ) : props.phase === 'question' ? (
        <div className="tk-player-panel tk-question-panel">
          <div className="tk-question-meta"><span>ROUND 1 · QUESTION 4</span><strong>00:18</strong></div>
          <h2>Which city hosted the first modern Olympic Games in 1896?</h2>
          <div className="tk-answer-grid" role="radiogroup" aria-label="Answer choices">
            {ANSWERS.map((answer, index) => (
              <button
                id={`demo-answer-${index}`}
                key={answer}
                type="button"
                role="radio"
                aria-checked={props.selectedAnswer === index}
                tabIndex={props.selectedAnswer === index || (props.selectedAnswer === null && index === 0) ? 0 : -1}
                disabled={props.locked}
                className={props.selectedAnswer === index ? 'is-selected' : ''}
                onClick={() => props.onSelectAnswer(index)}
                onKeyDown={(event) => props.onAnswerKeyDown(event, index)}
              ><span>{String.fromCharCode(65 + index)}</span>{answer}</button>
            ))}
          </div>
          <button className="tk-primary-action" type="button" disabled={props.selectedAnswer === null || props.locked} onClick={props.onLock}>{props.locked ? 'Answer locked in' : 'Lock in answer'}</button>
          <p className="tk-player-help">{props.locked ? 'Your answer is safe. Waiting for the reveal.' : 'Choose one answer before the timer ends.'}</p>
        </div>
      ) : props.phase === 'reveal' ? (
        <div className="tk-player-panel tk-reveal-panel">
          <p className="tk-demo-label">ANSWER REVEAL</p>
          <div className={props.isCorrect && props.locked ? 'tk-result is-correct' : 'tk-result'}><span>{props.isCorrect && props.locked ? '+2' : '+0'}</span><small>{props.isCorrect && props.locked ? 'CORRECT' : 'NOT THIS TIME'}</small></div>
          <h2>Athens</h2>
          <p>Athens hosted the first modern Olympic Games in April 1896.</p>
          <div className="tk-score-line"><span>Your score</span><strong>{props.score} points</strong></div>
        </div>
      ) : (
        <StandingsPanel standings={props.standings} highlight={props.teamName} final={props.phase === 'final'} />
      )}
    </div>
  );
}

interface HostPreviewProps {
  phase: DemoPhase;
  lockInCount: number;
  selectedAnswer: number | null;
  locked: boolean;
  teamName: string;
  standings: Array<{ name: string; score: number; rank: number }>;
  onStartQuestion: () => void;
  onReveal: () => void;
  onShowStandings: () => void;
  onFinal: () => void;
  onLobby: () => void;
}

function HostPreview(props: HostPreviewProps) {
  const primaryAction = props.phase === 'lobby'
    ? { label: 'Start question', action: props.onStartQuestion }
    : props.phase === 'question'
      ? { label: 'Reveal answer', action: props.onReveal }
      : props.phase === 'reveal'
        ? { label: 'Show standings', action: props.onShowStandings }
        : props.phase === 'standings'
          ? { label: 'Finish game', action: props.onFinal }
          : { label: 'Return to lobby', action: props.onLobby };

  return (
    <div className="tk-device tk-host-device">
      <div className="tk-device-bar"><BrandMini /><span><i /> HOST CONNECTED</span></div>
      <div className="tk-host-layout">
        <aside className="tk-host-sidebar">
          <p className="tk-demo-label">TONIGHT'S GAME</p>
          <h2>Friday Night General</h2>
          {['General knowledge', 'Picture round', 'Music & culture', 'Final round'].map((round, index) => (
            <div className={index === 0 ? 'tk-round-row is-current' : 'tk-round-row'} key={round}><span>0{index + 1}</span><div><strong>{round}</strong><small>{index === 0 ? 'Question 4 of 8' : '8 questions'}</small></div></div>
          ))}
        </aside>
        <div className="tk-host-main">
          <div className="tk-host-headline"><div><p className="tk-demo-label">CONTROL DESK · {PHASE_LABELS[props.phase]}</p><h2>{props.phase === 'lobby' ? 'The room is ready.' : props.phase === 'final' ? 'That is the game.' : 'Question 4 of 8'}</h2></div><span>ROUND 1</span></div>

          {props.phase === 'lobby' ? (
            <div className="tk-host-cards"><Metric label="Teams joined" value="18" /><Metric label="Players" value="47" /><Metric label="Presenter" value="Ready" /></div>
          ) : props.phase === 'question' ? (
            <>
              <div className="tk-host-question"><span>00:18</span><h3>Which city hosted the first modern Olympic Games in 1896?</h3><p>Correct answer: Athens</p></div>
              <div className="tk-lock-progress"><div><span style={{ width: `${(props.lockInCount / 18) * 100}%` }} /></div><p><strong>{props.lockInCount} of 18</strong> teams locked in</p></div>
              <div className="tk-waiting-teams"><span>WAITING ON</span><p>Four Score · Quiztopher Walken · The Know It Owls</p>{props.locked && <small>{props.teamName} locked in {props.selectedAnswer === null ? '' : ANSWERS[props.selectedAnswer]}</small>}</div>
            </>
          ) : props.phase === 'reveal' ? (
            <div className="tk-host-reveal"><p className="tk-demo-label">CORRECT ANSWER</p><h3>Athens</h3><div><Metric label="Correct teams" value="11" /><Metric label="Points awarded" value="22" /><Metric label="Needs review" value="0" /></div></div>
          ) : (
            <StandingsPanel standings={props.standings} final={props.phase === 'final'} />
          )}

          <div className="tk-host-actions">
            <button type="button" className="tk-host-secondary" onClick={() => props.phase === 'lobby' ? props.onFinal() : props.onLobby()}>{props.phase === 'lobby' ? 'Skip to final' : 'Back to lobby'}</button>
            <button type="button" className="tk-primary-action" onClick={primaryAction.action}>{primaryAction.label}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectorPreview({ phase, lockInCount, standings }: { phase: DemoPhase; lockInCount: number; standings: Array<{ name: string; score: number; rank: number }> }) {
  return (
    <div className="tk-device tk-projector-device">
      <div className="tk-projector-header"><BrandMini /><span>FRIDAY NIGHT GENERAL · ROUND 1</span></div>
      <div className="tk-projector-stage">
        {phase === 'lobby' ? (
          <><p className="tk-demo-label">WELCOME TO TONIGHT'S GAME</p><h2>Find your team. Pick a name. Get ready.</h2><div className="tk-projector-code"><span>JOIN AT</span><strong>play.triviaknight.app</strong></div><p>18 teams are in the lobby</p></>
        ) : phase === 'question' ? (
          <><div className="tk-projector-meta"><span>QUESTION 4 OF 8</span><strong>00:18</strong></div><h2>Which city hosted the first modern Olympic Games in 1896?</h2><div className="tk-projector-answers">{ANSWERS.map((answer, index) => <div key={answer}><span>{String.fromCharCode(65 + index)}</span>{answer}</div>)}</div><p>{lockInCount} of 18 teams locked in</p></>
        ) : phase === 'reveal' ? (
          <><p className="tk-demo-label">CORRECT ANSWER</p><h2 className="tk-projector-answer">Athens</h2><p>Hosted in April 1896, with athletes from 14 nations.</p></>
        ) : (
          <StandingsPanel standings={standings} final={phase === 'final'} />
        )}
      </div>
    </div>
  );
}

function BrandMini() {
  return <strong className="tk-brand-mini">Trivia <span>Knight</span></strong>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="tk-metric"><span>{label}</span><strong>{value}</strong></div>;
}

function StandingsPanel({ standings, highlight, final = false }: { standings: Array<{ name: string; score: number; rank: number }>; highlight?: string; final?: boolean }) {
  return (
    <div className="tk-standings-panel">
      <p className="tk-demo-label">{final ? 'FINAL STANDINGS' : 'LEADERBOARD'}</p>
      <h2>{final ? 'Tonight’s winners.' : 'Here is where things stand.'}</h2>
      <div className="tk-standings-list">
        {standings.slice(0, 5).map((team) => (
          <div className={team.name === highlight ? 'is-highlighted' : ''} key={team.name}><span>{String(team.rank).padStart(2, '0')}</span><strong>{team.name}</strong><b>{team.score}</b></div>
        ))}
      </div>
    </div>
  );
}
