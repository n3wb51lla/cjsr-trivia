import { useEffect, useState } from 'react';

const capabilities = [
  {
    label: 'BUILD',
    title: 'Shape every round',
    body: 'Organize multiple-choice, multi-select, and written-answer questions into a game that fits your room.',
  },
  {
    label: 'HOST',
    title: 'Run the room from one desk',
    body: 'Control the timer, watch teams lock in, reveal answers, correct scores, and settle ties without losing the room.',
  },
  {
    label: 'PRESENT',
    title: 'Give every screen a job',
    body: 'Teams answer on their own devices while the projector keeps everyone on the same question, reveal, and standings.',
  },
];

const plans = [
  {
    name: 'Host',
    price: '$19',
    description: 'For independent hosts building and running recurring trivia nights.',
    features: ['Unlimited trivia nights', 'Round-based game builder', 'Live host controls', 'Presenter view'],
  },
  {
    name: 'Pro Host',
    price: '$39',
    description: 'For working hosts who need richer rounds and stronger production tools.',
    features: ['Everything in Host', 'Image and video clues', 'Sudden-death tie-breakers', 'Question import and export'],
    featured: true,
  },
  {
    name: 'Venue & Teams',
    price: '$79',
    description: 'For venues and teams coordinating a regular calendar of events.',
    features: ['Everything in Pro Host', 'Venue-ready workflows', 'Reusable game library', 'Guided onboarding'],
  },
];

const faqs = [
  {
    question: 'Can I host unlimited trivia nights?',
    answer: 'Yes. Your plan determines the tools you receive, not how many times you are allowed to host.',
  },
  {
    question: 'How do teams join?',
    answer: 'Players open the game URL on their own devices, choose or enter a team name, and lock in answers before the timer runs out.',
  },
  {
    question: 'What question formats are supported?',
    answer: 'TriviaKnight supports multiple choice, multi-select, and written answers, plus optional image and video clues when media storage is configured.',
  },
  {
    question: 'What appears on the projector?',
    answer: 'A dedicated presenter view shows the lobby, questions, choices, answer reveals, standings checkpoints, and the final winner.',
  },
];

export function MarketingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'TriviaKnight | Unlimited trivia nights';

    const metadata = [
      ['name', 'description', 'Build, host, and present unlimited trivia nights with one subscription.'],
      ['property', 'og:title', 'TriviaKnight | Unlimited trivia nights'],
      ['property', 'og:description', 'One subscription. Unlimited trivia nights.'],
      ['property', 'og:type', 'website'],
      ['property', 'og:image', new URL('/og.png', window.location.origin).href],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', 'TriviaKnight | Unlimited trivia nights'],
      ['name', 'twitter:description', 'One subscription. Unlimited trivia nights.'],
      ['name', 'twitter:image', new URL('/og.png', window.location.origin).href],
    ] as const;
    const addedMetadata: HTMLMetaElement[] = [];

    metadata.forEach(([attribute, key, content]) => {
      const meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      meta.content = content;
      meta.dataset.triviaKnightMarketing = 'true';
      document.head.appendChild(meta);
      addedMetadata.push(meta);
    });

    return () => {
      document.title = previousTitle;
      addedMetadata.forEach((meta) => meta.remove());
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="marketing-page">
      <div className="marketing-announcement">
        <span>One subscription.</span>
        <strong>Unlimited trivia nights.</strong>
        <a href="#pricing">See plans</a>
      </div>

      <header className="marketing-header">
        <div className="marketing-nav-wrap">
          <a className="marketing-wordmark" href="#top" aria-label="TriviaKnight home">
            Trivia<span>Knight</span>
          </a>
          <button
            className="marketing-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="marketing-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="marketing-menu-line" />
            <span className="marketing-menu-line" />
            <span className="sr-only">Toggle navigation</span>
          </button>
          <nav id="marketing-navigation" className={menuOpen ? 'marketing-nav is-open' : 'marketing-nav'} aria-label="Marketing navigation">
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#pricing" onClick={closeMenu}>Pricing</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
            <a className="marketing-nav-cta" href="/host" onClick={closeMenu}>Open host desk</a>
          </nav>
        </div>
      </header>

      <section className="marketing-hero" id="top">
        <div className="marketing-hero-glow" aria-hidden="true" />
        <div className="marketing-container marketing-hero-grid">
          <div className="marketing-hero-copy">
            <p className="marketing-eyebrow"><span /> TRIVIA NIGHT SOFTWARE BUILT FOR HOSTS</p>
            <h1>Build and host <em>unlimited</em> trivia nights.</h1>
            <p className="marketing-lede">
              Create better rounds, run a calmer host desk, and keep every team in the game. No event credits. No per-game fees.
            </p>
            <div className="marketing-hero-actions">
              <a className="marketing-button marketing-button-primary" href="/host">Explore the host desk <span aria-hidden="true">→</span></a>
              <a className="marketing-button marketing-button-secondary" href="#how-it-works">See how it works</a>
            </div>
            <ul className="marketing-proof-list" aria-label="Included with every plan">
              <li>Unlimited games</li>
              <li>Live scoring</li>
              <li>Presenter view</li>
            </ul>
          </div>

          <div className="product-window" aria-label="Preview of the TriviaKnight host desk">
            <div className="product-window-topbar">
              <div className="product-window-dots" aria-hidden="true"><i /><i /><i /></div>
              <span>LIVE HOST DESK</span>
              <span className="product-live-pill">LIVE</span>
            </div>
            <div className="product-window-body">
              <aside className="product-sidebar" aria-label="Game rounds">
                <p className="product-label">TONIGHT'S GAME</p>
                <strong>Friday Night General</strong>
                <div className="product-round active"><span>01</span><div><b>General knowledge</b><small>Question 4 of 8</small></div></div>
                <div className="product-round"><span>02</span><div><b>Picture round</b><small>8 questions</small></div></div>
                <div className="product-round"><span>03</span><div><b>Music & culture</b><small>8 questions</small></div></div>
              </aside>
              <div className="product-stage">
                <div className="product-stage-meta"><span>ROUND 1 · QUESTION 4</span><strong>00:18</strong></div>
                <p className="product-question">Which city hosted the first modern Olympic Games in 1896?</p>
                <div className="product-options">
                  <span><b>A</b>Paris</span><span className="selected"><b>B</b>Athens</span><span><b>C</b>Rome</span><span><b>D</b>London</span>
                </div>
                <div className="product-lockins">
                  <div><span><i style={{ width: '78%' }} /></span><small>14 of 18 teams locked in</small></div>
                  <button type="button">Reveal answer</button>
                </div>
              </div>
            </div>
            <div className="product-float-card">
              <p>TEAMS LOCKED IN</p><strong>14<span>/18</span></strong><small>Four teams are still thinking</small>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-strip" aria-label="Product promise">
        <div className="marketing-container marketing-strip-grid">
          <p>NO CREDITS</p><p>NO PER-GAME FEES</p><p>NO HOSTING LIMITS</p><p>JUST BETTER TRIVIA</p>
        </div>
      </section>

      <section className="marketing-section marketing-section-light" id="features">
        <div className="marketing-container">
          <div className="marketing-section-heading split">
            <div><p className="marketing-eyebrow dark"><span /> EVERYTHING IN ONE PLACE</p><h2>Your whole trivia night, from first question to final score.</h2></div>
            <p>Build the game, run the room, and keep the standings moving without juggling a patchwork of tools.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability, index) => (
              <article className="capability-card" key={capability.title}>
                <div className="capability-number">0{index + 1}</div>
                <p className="marketing-eyebrow dark">{capability.label}</p>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section-dark" id="how-it-works">
        <div className="marketing-container how-grid">
          <div className="how-copy">
            <p className="marketing-eyebrow"><span /> HOW IT WORKS</p>
            <h2>Three screens. One smooth night.</h2>
            <p>TriviaKnight keeps the host, teams, and room display synchronized in real time, with a purpose-built view for each.</p>
            <a className="marketing-text-link" href="/screen">Open the presenter view <span aria-hidden="true">→</span></a>
          </div>
          <ol className="how-steps">
            <li><span>01</span><div><h3>Build your game</h3><p>Organize questions into data-driven rounds, set points, and add optional media clues.</p></div></li>
            <li><span>02</span><div><h3>Teams join</h3><p>Players open your game URL, choose a team name, and answer together on their own device.</p></div></li>
            <li><span>03</span><div><h3>You run the room</h3><p>Advance the game, watch lock-ins, reveal answers, correct scores, and finish on a live leaderboard.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="marketing-section marketing-section-paper" id="pricing">
        <div className="marketing-container">
          <div className="marketing-section-heading centered">
            <p className="marketing-eyebrow dark"><span /> SIMPLE MONTHLY PLANS</p>
            <h2>Host more trivia, not more subscription math.</h2>
            <p>Every plan includes unlimited trivia nights. Choose based on the tools you need.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={plan.featured ? 'pricing-card featured' : 'pricing-card'} key={plan.name}>
                {plan.featured && <span className="pricing-badge">MOST POPULAR</span>}
                <h3>{plan.name}</h3>
                <p className="pricing-price">{plan.price}<span>/month</span></p>
                <p className="pricing-description">{plan.description}</p>
                <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <a className={plan.featured ? 'marketing-button marketing-button-primary' : 'marketing-button marketing-button-dark'} href="mailto:hello@triviaknight.app?subject=TriviaKnight%20early%20access">Join early access</a>
              </article>
            ))}
          </div>
          <p className="pricing-note">Pricing is shown for the current launch plan and may change before paid subscriptions open.</p>
        </div>
      </section>

      <section className="marketing-section marketing-section-light" id="faq">
        <div className="marketing-container faq-grid">
          <div className="marketing-section-heading">
            <p className="marketing-eyebrow dark"><span /> GOOD QUESTIONS</p>
            <h2>What hosts ask first.</h2>
            <p>Need something more specific? <a href="mailto:hello@triviaknight.app">Send a note.</a></p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-final-cta">
        <div className="marketing-container">
          <p className="marketing-eyebrow"><span /> YOUR NEXT TRIVIA NIGHT</p>
          <h2>Less setup. More room command.</h2>
          <p>One subscription. Unlimited trivia nights.</p>
          <div className="marketing-hero-actions centered-actions">
            <a className="marketing-button marketing-button-primary" href="/host">Explore the host desk <span aria-hidden="true">→</span></a>
            <a className="marketing-button marketing-button-secondary" href="mailto:hello@triviaknight.app">Contact TriviaKnight</a>
          </div>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-container marketing-footer-grid">
          <div><a className="marketing-wordmark" href="#top">Trivia<span>Knight</span></a><p>Trivia night software built for hosts.</p></div>
          <nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav>
          <p>© {new Date().getFullYear()} TriviaKnight</p>
        </div>
      </footer>
    </div>
  );
}
