/* Dedicated /how-it-works page. Content grounded strictly in the confirmed
 * Trivia Knight workflow from CLAUDE.md. No invented capabilities:
 * no QR joining, AI, analytics dashboards, white-label, or multi-venue claims. */
(function () {
  const NS = window.TriviaKnightDesignSystem_88085a;
  const { Button, Logo, Eyebrow, Badge } = NS;
  const { ROUTES, CONTACT_EMAIL, track } = window.TKC;

  const CSS = `
  .hw{font-family:var(--font-body);color:var(--text-body);background:var(--surface-content)}
  .hw-ct{max-width:var(--container-max);margin:0 auto;padding:0 var(--gutter)}
  .hw-narrow{max-width:var(--container-narrow)}
  .hw-nav{position:sticky;top:0;z-index:40;background:rgba(11,17,32,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--surface-line-dark)}
  .hw-nav__row{display:flex;align-items:center;gap:1rem;height:66px}
  .hw-nav__row .sp{flex:1}
  .hw-crumb{background:var(--surface-content-alt);border-bottom:1px solid var(--surface-line)}
  .hw-crumb ol{max-width:var(--container-max);margin:0 auto;padding:.75rem var(--gutter);display:flex;gap:.5rem;list-style:none;font-size:.85rem;color:var(--text-muted)}
  .hw-crumb a{color:var(--link);text-decoration:none}
  .hw-crumb a:hover{text-decoration:underline}
  .hw-hero{background:var(--surface-canvas);color:var(--text-on-dark);padding:clamp(3rem,6vw,5.5rem) 0}
  .hw-hero h1{font-family:var(--font-display);font-weight:900;font-size:var(--text-5xl);line-height:1.05;letter-spacing:-.03em;margin:1rem 0 0;max-width:18ch;text-wrap:balance}
  .hw-hero p{font-size:var(--text-lg);color:var(--text-on-dark-muted);max-width:56ch;margin:1.25rem 0 0;line-height:1.5}
  .hw-sec{padding:clamp(3rem,6vw,5rem) 0}
  .hw-h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-3xl);letter-spacing:-.02em;color:var(--text-strong);margin:.4rem 0 0}
  .hw-lead{font-size:var(--text-md);color:var(--text-muted);max-width:60ch;margin:1rem 0 0;line-height:1.6}
  .hw-steps{display:flex;flex-direction:column;gap:1.25rem;margin-top:2.5rem;counter-reset:step}
  .hw-step{display:grid;grid-template-columns:auto 1fr;gap:1.25rem;background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem}
  .hw-step__n{counter-increment:step;font-family:var(--font-display);font-weight:800;font-size:1.1rem;width:2.5rem;height:2.5rem;border-radius:var(--radius-md);background:var(--navy-900);color:var(--gold-400);display:inline-flex;align-items:center;justify-content:center}
  .hw-step__n::before{content:counter(step)}
  .hw-step h3{font-family:var(--font-display);font-weight:700;font-size:1.2rem;letter-spacing:-.01em;color:var(--text-strong);margin:.2rem 0 0}
  .hw-step p{margin:.5rem 0 0;line-height:1.6;font-size:.95rem}
  .hw-step ul{margin:.7rem 0 0;padding-left:1.1rem;font-size:.92rem;line-height:1.55;color:var(--text-body)}
  .hw-step ul li{margin:.2rem 0}
  .hw-alt{background:var(--surface-content-alt)}
  .hw-two{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
  .hw-panel{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.75rem}
  .hw-panel h3{font-family:var(--font-display);font-weight:700;font-size:1.25rem;color:var(--text-strong);margin:.5rem 0 0;letter-spacing:-.01em}
  .hw-panel ul{margin:1rem 0 0;padding-left:1.1rem;line-height:1.6;font-size:.95rem}
  .hw-cta{background:var(--surface-canvas);color:var(--text-on-dark);text-align:center;padding:clamp(3rem,6vw,5rem) 0}
  .hw-cta h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-3xl);letter-spacing:-.02em;margin:0}
  .hw-cta p{color:var(--text-on-dark-muted);max-width:50ch;margin:1rem auto 0;font-size:var(--text-md)}
  .hw-cta__row{display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;margin-top:1.75rem}
  .hw-foot{background:var(--surface-canvas-deep);color:var(--text-on-dark-muted);padding:2rem 0;border-top:1px solid var(--surface-line-dark)}
  .hw-foot__row{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center;font-size:.85rem}
  .hw-foot a{color:var(--gold-300);text-decoration:none}
  @media (max-width:860px){.hw-two{grid-template-columns:1fr}}
  @media (max-width:640px){.hw-step{grid-template-columns:1fr}}
  `;

  const STEPS = [
    { h: "Build your game and rounds", p: "Create a trivia game and organize it into clearly structured rounds. Round count, the number of questions per round, and the points each round is worth are all yours to set.", extra: null },
    { h: "Add and edit your questions", p: "Write your own questions and set the correct answers and point values. TriviaKnight supports:", extra: ["Multiple-choice questions", "Multi-select questions with more than one correct answer", "Written-answer questions that are graded automatically", "Optional image or video clues on a question"] },
    { h: "Run the room from the host desk", p: "Open the lobby, then move the game forward at your pace. From the host controls you can:", extra: ["Advance from lobby to each question, reveal, break, and the final", "Run the countdown timer and watch how many teams have locked in", "Reveal answers manually, or force a reveal when you are ready", "Settle a tie for first place with a sudden-death question", "Make manual score corrections at any point"] },
    { h: "Let teams join and lock in", p: "Teams join from their own devices at the game link, choose or type a team name, and add one to four players. During each question they select their answer and lock it in before the timer runs out.", extra: null },
    { h: "Put the game on the big screen", p: "The presenter view is a clean, read-only display for the room. It shows the lobby and joined teams, the live question with its choices, the reveal with the correct answer, standings between rounds, and the final winner.", extra: null },
  ];

  function Nav() {
    return (
      <header className="hw-nav">
        <div className="hw-ct hw-nav__row">
          <Logo href="/" size="sm" onDark />
          <span className="sp" />
          <Button variant="ghost" size="sm" onDark href={ROUTES.logIn}>Log In</Button>
          <Button variant="primary" size="sm" href={ROUTES.startHosting}>Start Hosting</Button>
        </div>
      </header>
    );
  }

  function HowItWorks() {
    return (
      <div className="hw">
        <Nav />
        <nav className="hw-crumb" aria-label="Breadcrumb">
          <ol><li><a href="/">Home</a></li><li aria-hidden="true">/</li><li aria-current="page">How It Works</li></ol>
        </nav>

        <section className="hw-hero">
          <div className="hw-ct">
            <Eyebrow onDark>How TriviaKnight works</Eyebrow>
            <h1>From your questions to a live trivia night.</h1>
            <p>TriviaKnight brings the game builder and the live host controls together. Build your rounds, run the game at your own pace, and put the whole thing on the big screen for the room.</p>
          </div>
        </section>

        <section className="hw-sec">
          <div className="hw-ct">
            <div className="hw-narrow">
              <Eyebrow>The workflow</Eyebrow>
              <h2 className="hw-h2">Five steps to a hosted game.</h2>
              <p className="hw-lead">Everything here reflects how TriviaKnight works today. Each step maps to a part of the product you use on the night.</p>
            </div>
            <div className="hw-steps">
              {STEPS.map((s, i) => (
                <div className="hw-step" key={i}>
                  <span className="hw-step__n" aria-hidden="true" />
                  <div>
                    <h3>{s.h}</h3>
                    <p>{s.p}</p>
                    {s.extra && <ul>{s.extra.map((x) => <li key={x}>{x}</li>)}</ul>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hw-sec hw-alt">
          <div className="hw-ct">
            <div className="hw-narrow">
              <Eyebrow>During and after the game</Eyebrow>
              <h2 className="hw-h2">What the room sees, and what you keep.</h2>
            </div>
            <div className="hw-two" style={{ marginTop: "2.5rem" }}>
              <div className="hw-panel">
                <Badge tone="soft">Live experience</Badge>
                <h3>A shared game, in real time</h3>
                <ul>
                  <li>Teams answer on their phones while the presenter screen leads the room.</li>
                  <li>The host desk shows the timer, lock-in count, and which teams are still answering.</li>
                  <li>Scores are finalized on each reveal and the leaderboard updates for everyone.</li>
                </ul>
              </div>
              <div className="hw-panel">
                <Badge tone="soft">After the game</Badge>
                <h3>Standings and a clean record</h3>
                <ul>
                  <li>The final leaderboard ranks teams by score, breaking ties by who locked in fastest.</li>
                  <li>A printable answer key lists every question and answer, grouped by round.</li>
                  <li>Your questions and rounds stay saved and live-editable for next time.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="hw-cta">
          <div className="hw-ct">
            <h2>Ready to build your first game?</h2>
            <p>Start hosting and put your rounds together, or see the plans to find the right tools for your venue.</p>
            <div className="hw-cta__row">
              <Button variant="primary" size="lg" href={ROUTES.startHosting} onClick={() => track("hero_cta_clicked", { cta: "start_hosting", location: "how_it_works" })}>Start Hosting</Button>
              <Button variant="ghost" size="lg" onDark href="/#pricing">Explore Pricing</Button>
            </div>
          </div>
        </section>

        <footer className="hw-foot">
          <div className="hw-ct hw-foot__row">
            <span>© {new Date().getFullYear()} TriviaKnight. Trivia night software for hosts, venues, and event teams.</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </footer>
      </div>
    );
  }

  if (!document.getElementById("hw-styles")) {
    const el = document.createElement("style");
    el.id = "hw-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
  window.HowItWorks = HowItWorks;
})();
