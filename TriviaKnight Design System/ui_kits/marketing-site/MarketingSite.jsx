/* TriviaKnight marketing website — all sections, composed from the design-system
 * components (window.TriviaKnightDesignSystem_88085a) + config (window.TKC) +
 * the hero mockup (window.ProductMockup). Mounted by index.html. */
(function () {
  const NS = window.TriviaKnightDesignSystem_88085a;
  const { Button, Logo, Badge, Eyebrow, FeatureCard, UseCaseCard, PricingCard, BillingToggle, FaqItem, AnnouncementBar, Input, Textarea, Select, Checkbox } = NS;
  const { ROUTES, CONTACT_EMAIL, NAV, PLANS, FEATURES, USE_CASES, FAQS, COMPARISON, USE_CASE_OPTIONS, track } = window.TKC;
  const ProductMockup = window.ProductMockup;

  const CSS = `
  .tk-site{font-family:var(--font-body);color:var(--text-body);background:var(--surface-content)}
  .tk-ct{max-width:var(--container-max);margin:0 auto;padding-left:var(--gutter);padding-right:var(--gutter)}
  .tk-sec{padding-top:var(--section-pad-y);padding-bottom:var(--section-pad-y)}
  .tk-dark{background:var(--surface-canvas);color:var(--text-on-dark)}
  .tk-h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-4xl);line-height:var(--leading-tight);letter-spacing:-.02em;color:var(--text-strong);margin:.4rem 0 0;text-wrap:balance}
  .tk-dark .tk-h2{color:var(--text-on-dark)}
  .tk-lead{font-size:var(--text-lg);line-height:var(--leading-normal);color:var(--text-muted);max-width:56ch;margin:1rem 0 0}
  .tk-dark .tk-lead{color:var(--text-on-dark-muted)}
  .tk-head{max-width:60ch}
  .tk-center{text-align:center;margin-left:auto;margin-right:auto}
  .tk-center .tk-lead{margin-left:auto;margin-right:auto}
  .tk-a{color:var(--link);text-decoration:none;font-weight:600}
  .tk-a:hover{color:var(--link-hover);text-decoration:underline}
  /* nav */
  .tk-nav{position:sticky;top:0;z-index:40;background:rgba(11,17,32,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--surface-line-dark)}
  .tk-nav__row{display:flex;align-items:center;gap:1.25rem;height:66px}
  .tk-nav__links{display:flex;align-items:center;gap:.35rem;margin-left:1rem}
  .tk-nav__link{font-size:.9rem;font-weight:500;color:var(--text-on-dark-muted);text-decoration:none;padding:.5rem .6rem;border-radius:var(--radius-sm)}
  .tk-nav__link:hover{color:var(--text-on-dark);background:rgba(255,255,255,.06)}
  .tk-nav__spacer{flex:1}
  .tk-nav__actions{display:flex;align-items:center;gap:.6rem}
  .tk-nav__burger{display:none;background:none;border:1px solid var(--surface-line-dark);border-radius:var(--radius-sm);width:42px;height:42px;color:var(--text-on-dark);align-items:center;justify-content:center;cursor:pointer}
  .tk-nav__burger:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:2px}
  .tk-mobile{display:none;flex-direction:column;gap:.25rem;padding:.5rem var(--gutter) 1rem;background:var(--navy-900);border-bottom:1px solid var(--surface-line-dark)}
  .tk-mobile a{color:var(--text-on-dark-muted);text-decoration:none;padding:.7rem .5rem;border-radius:var(--radius-sm);font-weight:500}
  .tk-mobile a:hover{background:rgba(255,255,255,.06);color:var(--text-on-dark)}
  .tk-mobile__cta{display:flex;gap:.6rem;margin-top:.6rem}
  /* hero */
  .tk-hero{background:var(--surface-canvas);color:var(--text-on-dark);position:relative;overflow:hidden}
  .tk-hero__grid{display:grid;grid-template-columns:1.05fr 1.15fr;gap:clamp(2rem,4vw,4rem);align-items:center}
  .tk-hero h1{font-family:var(--font-display);font-weight:900;font-size:var(--text-5xl);line-height:var(--leading-tight);letter-spacing:-.03em;margin:1rem 0 0;text-wrap:balance}
  .tk-hero__sub{font-size:var(--text-lg);line-height:var(--leading-normal);color:var(--text-on-dark-muted);max-width:48ch;margin:1.25rem 0 0}
  .tk-hero__cta{display:flex;flex-wrap:wrap;gap:.85rem;margin-top:1.75rem}
  .tk-hero__proof{margin-top:1.5rem;font-size:.9rem;color:var(--text-on-dark-faint);display:flex;align-items:center;gap:.5rem}
  .tk-hero__proof b{color:var(--gold-300);font-weight:600}
  .tk-hero__glow{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(227,168,56,.16),transparent 68%);top:-160px;right:-120px;pointer-events:none}
  /* generic grids */
  .tk-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
  .tk-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
  .tk-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
  /* differentiation */
  .tk-diff__list{display:grid;grid-template-columns:1fr 1fr;gap:.75rem 1.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
  .tk-diff__list li{display:flex;align-items:center;gap:.6rem;font-size:1rem;font-weight:500;color:var(--text-strong)}
  .tk-diff__list li svg{color:var(--success);flex:none}
  .tk-highlight{margin-top:2rem;background:var(--navy-900);color:var(--text-on-dark);border-radius:var(--radius-xl);padding:1.5rem 1.75rem;border-left:4px solid var(--gold-500);font-family:var(--font-display);font-weight:700;font-size:var(--text-xl);line-height:1.35;letter-spacing:-.01em}
  .tk-highlight b{color:var(--gold-300)}
  /* pricing */
  .tk-price__toggle{display:flex;justify-content:center;margin:2rem 0 2.5rem}
  .tk-price__note{text-align:center;margin-top:2rem}
  .tk-price__cap{font-family:var(--font-display);font-weight:800;font-size:var(--text-xl);color:var(--text-strong);letter-spacing:-.01em;max-width:44ch;margin:0 auto;text-wrap:balance}
  .tk-price__usd{font-family:var(--font-mono);font-size:.8rem;color:var(--text-muted);margin-top:.6rem}
  /* comparison */
  .tk-cmp{width:100%;border-collapse:collapse;margin-top:2rem}
  .tk-cmp th,.tk-cmp td{text-align:left;padding:.8rem 1rem;border-bottom:1px solid var(--surface-line);font-size:.9rem}
  .tk-cmp thead th{position:sticky;top:66px;background:var(--surface-content);font-family:var(--font-display);font-size:1rem;color:var(--text-strong);z-index:1}
  .tk-cmp thead th.tk-cmp__feat{color:var(--gold-700)}
  .tk-cmp__group td{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;font-weight:600;color:var(--text-muted);background:var(--surface-content-alt);padding-top:.9rem;padding-bottom:.9rem}
  .tk-cmp td.tk-cmp__val{text-align:center;width:150px}
  .tk-cmp__yes{color:var(--success)}
  .tk-cmp__no{color:var(--slate-300)}
  .tk-cmp__txt{font-weight:600;color:var(--text-strong)}
  .tk-cmp-cards{display:none;flex-direction:column;gap:1.25rem;margin-top:2rem}
  .tk-cmp-card{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden}
  .tk-cmp-card__h{font-family:var(--font-display);font-weight:800;font-size:1.1rem;color:var(--text-strong);padding:1rem 1.1rem;border-bottom:1px solid var(--surface-line)}
  .tk-cmp-card__grp{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em;font-size:.7rem;font-weight:600;color:var(--text-muted);padding:.8rem 1.1rem .3rem}
  .tk-cmp-row{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 1.1rem;font-size:.9rem}
  .tk-cmp-row span:first-child{color:var(--text-body)}
  /* callout */
  .tk-callout{text-align:center;position:relative;overflow:hidden}
  .tk-callout .tk-h2{margin-bottom:.5rem}
  .tk-callout__glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 120%,rgba(227,168,56,.14),transparent 60%);pointer-events:none}
  /* faq */
  .tk-faq-wrap{max-width:var(--container-narrow);margin:2.5rem auto 0}
  /* contact */
  .tk-contact__grid{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(2rem,4vw,4rem);align-items:start}
  .tk-form{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-xl);box-shadow:var(--shadow-md);padding:clamp(1.5rem,3vw,2.25rem)}
  .tk-form__grid{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem}
  .tk-form__full{grid-column:1/-1}
  .tk-form__hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
  .tk-success{text-align:center;padding:2rem 1rem}
  .tk-success__ic{width:56px;height:56px;border-radius:50%;background:var(--success-soft);color:var(--success);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem}
  .tk-alert{background:#fbecea;border:1px solid #e7b7b0;color:var(--red-600);border-radius:var(--radius-md);padding:.8rem 1rem;font-size:.9rem;margin-bottom:1.1rem}
  .tk-alert a{color:var(--red-600);font-weight:600}
  .tk-contact__aside p{margin:.75rem 0 0}
  .tk-contact__email{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--font-mono);font-size:1rem;color:var(--text-strong);font-weight:600;margin-top:.5rem}
  /* footer */
  .tk-footer{background:var(--surface-canvas-deep);color:var(--text-on-dark-muted);padding-top:3.5rem;padding-bottom:2rem;border-top:1px solid var(--surface-line-dark)}
  .tk-footer__top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:2rem}
  .tk-footer__desc{font-size:.92rem;line-height:1.6;max-width:34ch;margin:1rem 0 0}
  .tk-footer__col h4{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;color:var(--text-on-dark-faint);margin:0 0 1rem;font-weight:600}
  .tk-footer__col a{display:block;color:var(--text-on-dark-muted);text-decoration:none;font-size:.9rem;padding:.3rem 0}
  .tk-footer__col a:hover{color:var(--gold-300)}
  .tk-footer__bottom{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--surface-line-dark);font-size:.85rem}
  .tk-footer__pos{color:var(--text-on-dark-faint);max-width:52ch}
  .tk-feat-ico svg,.tk-uc-ico svg{width:1.4rem;height:1.4rem}
  /* responsive */
  @media (max-width:960px){
    .tk-hero__grid,.tk-contact__grid{grid-template-columns:1fr}
    .tk-grid-3,.tk-grid-4{grid-template-columns:1fr 1fr}
    .tk-nav__links{display:none}
    .tk-nav__actions .tk-hide-sm{display:none}
    .tk-nav__burger{display:inline-flex}
    .tk-footer__top{grid-template-columns:1fr 1fr}
  }
  @media (max-width:760px){
    .tk-cmp{display:none}
    .tk-cmp-cards{display:flex}
    .tk-diff__list,.tk-grid-2{grid-template-columns:1fr}
  }
  @media (max-width:560px){
    .tk-grid-3,.tk-grid-4{grid-template-columns:1fr}
    .tk-form__grid{grid-template-columns:1fr}
    .tk-footer__top{grid-template-columns:1fr}
  }
  `;

  const Ico = ({ name, cls }) => <span className={cls}><i data-lucide={name}></i></span>;
  const Check = ({ s = 18 }) => (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  );

  function money(n) { return "$" + n; }

  /* ---------------- Nav ---------------- */
  function NavBar() {
    const [open, setOpen] = React.useState(false);
    return (
      <header className="tk-nav">
        <div className="tk-ct tk-nav__row">
          <Logo href="#top" size="sm" onDark />
          <nav className="tk-nav__links" aria-label="Primary">
            {NAV.map((n) => <a key={n.label} className="tk-nav__link" href={n.href}>{n.label}</a>)}
          </nav>
          <div className="tk-nav__spacer" />
          <div className="tk-nav__actions">
            <Button variant="ghost" size="sm" onDark className="tk-hide-sm" href={ROUTES.logIn} onClick={() => track("login_clicked", { location: "nav" })}>Log In</Button>
            <Button variant="primary" size="sm" href={ROUTES.startHosting} onClick={() => track("hero_cta_clicked", { location: "nav", cta: "start_hosting" })}>Start Hosting</Button>
            <button className="tk-nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{open ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></> : <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>}</svg>
            </button>
          </div>
        </div>
        <div className="tk-mobile" style={{ display: open ? "flex" : "none" }}>
          {NAV.map((n) => <a key={n.label} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}
          <div className="tk-mobile__cta">
            <Button variant="ghost" size="sm" onDark block href={ROUTES.logIn}>Log In</Button>
            <Button variant="primary" size="sm" block href={ROUTES.startHosting}>Start Hosting</Button>
          </div>
        </div>
      </header>
    );
  }

  /* ---------------- Hero ---------------- */
  function Hero() {
    return (
      <section className="tk-hero" id="top">
        <div className="tk-hero__glow" />
        <div className="tk-ct tk-sec tk-hero__grid">
          <div>
            <Eyebrow onDark>Trivia night software built for hosts</Eyebrow>
            <h1>Build and host unlimited trivia nights.</h1>
            <p className="tk-hero__sub">Create polished quiz nights, organize every round, and run the live show from one place. Your subscription includes unlimited games, so you can host as often as your crowd keeps coming back.</p>
            <div className="tk-hero__cta">
              <Button variant="primary" size="lg" href={ROUTES.startHosting} onClick={() => track("hero_cta_clicked", { cta: "start_hosting" })}>Start Hosting</Button>
              <Button variant="ghost" size="lg" onDark href={ROUTES.howItWorks} onClick={() => track("hero_cta_clicked", { cta: "how_it_works" })}>See How It Works</Button>
            </div>
            <p className="tk-hero__proof"><b>No event credits. No per-game fees.</b> No limit on how often you host.</p>
          </div>
          <div><ProductMockup /></div>
        </div>
      </section>
    );
  }

  /* ---------------- Differentiation ---------------- */
  function Differentiation() {
    const items = ["Unlimited trivia nights", "Unlimited saved games", "Unlimited custom questions", "Unlimited reuse of rounds and question sets"];
    return (
      <section className="tk-sec">
        <div className="tk-ct">
          <div className="tk-head">
            <Eyebrow>The unlimited difference</Eyebrow>
            <h2 className="tk-h2">Host more trivia, not more subscription math.</h2>
            <p className="tk-lead">Most trivia hosts do not run identical schedules. Some host once a month. Others run several events every week. TriviaKnight does not punish active hosts for using the product more often.</p>
          </div>
          <ul className="tk-diff__list">
            {items.map((t) => <li key={t}><Check />{t}</li>)}
          </ul>
          <p className="tk-highlight">Your plan determines the tools you receive, <b>not how many times you are allowed to use them.</b></p>
        </div>
      </section>
    );
  }

  /* ---------------- How it works preview ---------------- */
  function HowItWorksPreview() {
    return (
      <section className="tk-sec" style={{ background: "var(--surface-content-alt)" }}>
        <div className="tk-ct tk-center tk-head">
          <Eyebrow rule={false} style={{ justifyContent: "center" }}>How it works</Eyebrow>
          <h2 className="tk-h2">From your game to the live room.</h2>
          <p className="tk-lead">Build your questions and rounds, run the game from the host desk, and put it on the big screen for the room. See the full walkthrough on the How It Works page.</p>
          <div style={{ marginTop: "1.75rem" }}>
            <Button variant="secondary" size="lg" href={ROUTES.howItWorks} onClick={() => track("how_it_works_clicked", { location: "preview" })}>See How TriviaKnight Works</Button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Features ---------------- */
  function Features() {
    return (
      <section className="tk-sec" id="features">
        <div className="tk-ct">
          <div className="tk-head tk-center">
            <Eyebrow rule={false} style={{ justifyContent: "center" }}>Features</Eyebrow>
            <h2 className="tk-h2">Everything a trivia host needs to run the room.</h2>
          </div>
          <div className="tk-grid-4" style={{ marginTop: "2.5rem" }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} title={f.title} premium={f.premium} icon={<Ico name={f.icon} cls="tk-feat-ico" />}>{f.body}</FeatureCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Use cases ---------------- */
  function UseCases() {
    return (
      <section className="tk-sec" id="use-cases" style={{ background: "var(--surface-content-alt)" }}>
        <div className="tk-ct">
          <div className="tk-head tk-center">
            <Eyebrow rule={false} style={{ justifyContent: "center" }}>Use cases</Eyebrow>
            <h2 className="tk-h2">Built for the people bringing trivia to the crowd.</h2>
          </div>
          <div className="tk-grid-3" style={{ marginTop: "2.5rem" }}>
            {USE_CASES.map((u) => (
              <UseCaseCard key={u.title} title={u.title} href={u.href} icon={<Ico name={u.icon} cls="tk-uc-ico" />}>{u.body}</UseCaseCard>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Pricing ---------------- */
  function Pricing() {
    const [billing, setBilling] = React.useState("monthly");
    const annual = billing === "annual";
    return (
      <section className="tk-sec" id="pricing">
        <div className="tk-ct">
          <div className="tk-head tk-center">
            <Eyebrow rule={false} style={{ justifyContent: "center" }}>Pricing</Eyebrow>
            <h2 className="tk-h2">Simple plans. Unlimited trivia nights.</h2>
            <p className="tk-lead">Every paid plan includes unlimited games, questions, and hosted events. Choose your plan based on the tools, branding, and team support you need.</p>
          </div>
          <div className="tk-price__toggle">
            <BillingToggle value={billing} onChange={(v) => { setBilling(v); track("billing_frequency_changed", { frequency: v }); }} />
          </div>
          <div className="tk-grid-3">
            {PLANS.map((p) => (
              <PricingCard key={p.id} name={p.name} featured={p.featured} badgeLabel={p.badge}
                price={money(annual ? p.annual : p.monthly)}
                period={annual ? "/yr" : "/mo"}
                sublabel={annual ? `${money(p.annual)} billed yearly` : `${money(p.annual)} billed yearly saves 2 months`}
                description={p.description}
                features={p.features}
                ctaLabel={p.cta}
                ctaHref={p.href}
                onClickCapture={() => track("pricing_cta_clicked", { plan: p.id, billing })} />
            ))}
          </div>
          <div className="tk-price__note">
            <p className="tk-price__cap">There is no cap on the number of trivia nights you can host on any paid plan.</p>
            <p className="tk-price__usd">Prices shown in USD. Cancel any time.</p>
          </div>
          <Comparison />
        </div>
      </section>
    );
  }

  /* ---------------- Comparison ---------------- */
  function Val({ v }) {
    if (v === true) return <span className="tk-cmp__yes" aria-label="Included"><Check s={17} /></span>;
    if (v === false) return <span className="tk-cmp__no" aria-label="Not included">—</span>;
    return <span className="tk-cmp__txt">{v}</span>;
  }
  function Comparison() {
    return (
      <div style={{ marginTop: "4rem" }}>
        <h3 className="tk-h2" style={{ fontSize: "var(--text-2xl)", textAlign: "center" }}>Compare every plan</h3>
        <table className="tk-cmp">
          <thead><tr><th className="tk-cmp__feat">Feature</th><th className="tk-cmp__val" style={{ textAlign: "center" }}>Host</th><th className="tk-cmp__val" style={{ textAlign: "center" }}>Pro Host</th><th className="tk-cmp__val" style={{ textAlign: "center" }}>Venue &amp; Teams</th></tr></thead>
          <tbody>
            {COMPARISON.map((g) => (
              <React.Fragment key={g.group}>
                <tr className="tk-cmp__group"><td colSpan={4}>{g.group}</td></tr>
                {g.rows.map((r) => (
                  <tr key={r.label}><td>{r.label}</td><td className="tk-cmp__val"><Val v={r.host} /></td><td className="tk-cmp__val"><Val v={r.pro} /></td><td className="tk-cmp__val"><Val v={r.venue} /></td></tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="tk-cmp-cards">
          {[["Host", "host"], ["Pro Host", "pro"], ["Venue & Teams", "venue"]].map(([name, key]) => (
            <div className="tk-cmp-card" key={key}>
              <div className="tk-cmp-card__h">{name}</div>
              {COMPARISON.map((g) => (
                <div key={g.group}>
                  <div className="tk-cmp-card__grp">{g.group}</div>
                  {g.rows.map((r) => (
                    <div className="tk-cmp-row" key={r.label}><span>{r.label}</span><Val v={r[key]} /></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- Unlimited callout ---------------- */
  function Callout() {
    return (
      <section className="tk-sec tk-dark tk-callout">
        <div className="tk-callout__glow" />
        <div className="tk-ct tk-center tk-head" style={{ position: "relative" }}>
          <Eyebrow onDark rule={false} style={{ justifyContent: "center" }}>Unlimited hosting</Eyebrow>
          <h2 className="tk-h2">Your best month should not cost more.</h2>
          <p className="tk-lead">When your trivia business grows, you should be able to say yes to another event without wondering whether it will use up your plan. TriviaKnight gives every paid customer unlimited trivia nights from day one.</p>
          <div style={{ marginTop: "1.75rem" }}>
            <Button variant="primary" size="lg" href={ROUTES.startHosting} onClick={() => track("hero_cta_clicked", { cta: "build_first_game", location: "callout" })}>Build Your First Game</Button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- FAQ ---------------- */
  function FAQ() {
    return (
      <section className="tk-sec" id="faq">
        <div className="tk-ct">
          <div className="tk-head tk-center">
            <Eyebrow rule={false} style={{ justifyContent: "center" }}>FAQ</Eyebrow>
            <h2 className="tk-h2">Questions, answered.</h2>
          </div>
          <div className="tk-faq-wrap">
            {FAQS.map((f, i) => <FaqItem key={i} question={f.q} defaultOpen={i === 0}>{f.a}</FaqItem>)}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Contact ---------------- */
  function Contact() {
    const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
    const [errors, setErrors] = React.useState({});
    const started = React.useRef(false);
    const onStart = () => { if (!started.current) { started.current = true; track("contact_form_started"); } };

    function validate(fd) {
      const e = {};
      if (!fd.get("name").trim()) e.name = "Please enter your name.";
      const email = fd.get("email").trim();
      if (!email) e.email = "Please enter your email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
      if (!fd.get("useCase")) e.useCase = "Select how you run trivia.";
      if (!fd.get("message").trim()) e.message = "Please add a short message.";
      if (!fd.get("consent")) e.consent = "Please agree to the privacy policy.";
      return e;
    }

    async function onSubmit(ev) {
      ev.preventDefault();
      const form = ev.target;
      const fd = new FormData(form);
      // Honeypot: if filled, silently succeed without sending.
      if (fd.get("company_website")) { setStatus("success"); return; }
      const e = validate(fd);
      setErrors(e);
      if (Object.keys(e).length) return;
      setStatus("loading");
      track("contact_form_submitted", { useCase: fd.get("useCase") });
      try {
        // TODO(contact): POST to the server contact endpoint (Firebase Function
        // / App Hosting route) which sends via Resend. See README. No API keys
        // in the browser. Reply-to = visitor email; subject "TriviaKnight
        // website inquiry from [Name]". Demo mock below:
        await new Promise((res) => setTimeout(res, 1100));
        setStatus("success");
      } catch (err) {
        track("contact_form_failed");
        setStatus("error");
      }
    }

    return (
      <section className="tk-sec" id="contact" style={{ background: "var(--surface-content-alt)" }}>
        <div className="tk-ct tk-contact__grid">
          <div className="tk-contact__aside">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="tk-h2">Talk to TriviaKnight.</h2>
            <p className="tk-lead">Have a question about your venue, hosting setup, or upcoming event? Send us a message and tell us how you run trivia.</p>
            <p className="tk-contact__email"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg><a className="tk-a" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </div>
          <div className="tk-form">
            {status === "success" ? (
              <div className="tk-success">
                <span className="tk-success__ic"><Check s={28} /></span>
                <h3 className="tk-h2" style={{ fontSize: "var(--text-xl)" }}>Message sent.</h3>
                <p className="tk-lead" style={{ margin: "0.6rem auto 0" }}>Thanks for reaching out. We will reply to your email soon.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate onFocusCapture={onStart}>
                {status === "error" && <div className="tk-alert" role="alert">Something went wrong sending your message. Please email us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</div>}
                <div className="tk-form__hp" aria-hidden="true"><label>Do not fill this in<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
                <div className="tk-form__grid">
                  <Input label="Name" name="name" required error={errors.name} placeholder="Your name" />
                  <Input label="Email" name="email" type="email" required error={errors.email} placeholder="you@venue.com" />
                  <Input className="tk-form__full" label="Organization or venue" name="org" optional placeholder="The Anvil Pub" />
                  <div className="tk-form__full"><Select label="Primary use case" name="useCase" required error={errors.useCase} placeholder="Select one" options={USE_CASE_OPTIONS} /></div>
                  <div className="tk-form__full"><Textarea label="Message" name="message" required error={errors.message} placeholder="Tell us how you run trivia." /></div>
                  <div className="tk-form__full"><Checkbox name="consent" required error={!!errors.consent} label={<>I agree to the <a className="tk-a" href={ROUTES.privacy}>privacy policy</a>.</>} />{errors.consent && <p style={{ color: "var(--danger)", fontSize: ".8125rem", margin: ".4rem 0 0" }}>{errors.consent}</p>}</div>
                </div>
                <div style={{ marginTop: "1.25rem" }}>
                  <Button type="submit" variant="primary" size="lg" block disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send Message"}</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Final CTA ---------------- */
  function FinalCTA() {
    return (
      <section className="tk-sec tk-dark tk-callout">
        <div className="tk-callout__glow" />
        <div className="tk-ct tk-center tk-head" style={{ position: "relative" }}>
          <h2 className="tk-h2">Ready to rule the round?</h2>
          <p className="tk-lead">Build your game, bring your crowd together, and host as many trivia nights as you like.</p>
          <div className="tk-hero__cta" style={{ justifyContent: "center" }}>
            <Button variant="primary" size="lg" href={ROUTES.startHosting} onClick={() => track("hero_cta_clicked", { cta: "start_hosting", location: "final" })}>Start Hosting</Button>
            <Button variant="ghost" size="lg" onDark href={ROUTES.pricing}>View Pricing</Button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Footer ---------------- */
  function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer className="tk-footer">
        <div className="tk-ct">
          <div className="tk-footer__top">
            <div>
              <Logo size="md" onDark />
              <p className="tk-footer__desc">Trivia night software for hosts, venues, and event teams. Build games, run the live show, and host as often as you like.</p>
            </div>
            <div className="tk-footer__col"><h4>Product</h4>
              <a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#use-cases">Use Cases</a><a href="#faq">FAQ</a><a href={ROUTES.howItWorks}>How It Works</a>
            </div>
            <div className="tk-footer__col"><h4>Company</h4>
              <a href="#contact">Contact</a><a href={ROUTES.privacy}>Privacy Policy</a><a href={ROUTES.terms}>Terms of Service</a><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
            <div className="tk-footer__col"><h4>Get started</h4>
              <a href={ROUTES.logIn}>Log In</a><a href={ROUTES.startHosting}>Start Hosting</a>
            </div>
          </div>
          <div className="tk-footer__bottom">
            <span>© {year} TriviaKnight. All rights reserved.</span>
            <span className="tk-footer__pos">TriviaKnight is trivia night software for hosts, venues, and event teams.</span>
          </div>
        </div>
      </footer>
    );
  }

  function MarketingSite() {
    React.useEffect(() => {
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    });
    return (
      <div className="tk-site">
        <a href="#top" className="tk-skip">Skip to content</a>
        <AnnouncementBar>Built for hosts who believe a subscription should include <b>unlimited trivia nights</b>.</AnnouncementBar>
        <NavBar />
        <main>
          <Hero />
          <Differentiation />
          <HowItWorksPreview />
          <Features />
          <UseCases />
          <Pricing />
          <Callout />
          <FAQ />
          <Contact />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    );
  }

  // inject styles
  if (!document.getElementById("tk-site-styles")) {
    const el = document.createElement("style");
    el.id = "tk-site-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
  window.MarketingSite = MarketingSite;
})();
