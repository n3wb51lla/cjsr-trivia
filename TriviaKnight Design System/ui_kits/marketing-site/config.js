/* TriviaKnight marketing site — centralized configuration.
 * Single source of truth for routes, plans, features, use cases, FAQs, and the
 * pricing comparison. Edit values here to update the whole site.
 * Attached to window.TKC so the Babel-transpiled section scripts can read it. */
(function () {
  // ---- Application / integration destinations (edit here) ----
  // TODO(auth): wire Log In / Start Hosting to the real OAuth flow once ready.
  // TODO(billing): plan hrefs currently deep-link to /signup?plan=… ; connect
  //   these to the Stripe subscription checkout when the backend is complete.
  const ROUTES = {
    logIn: "/login",
    startHosting: "/signup",
    howItWorks: "/how-it-works",
    contact: "#contact",
    pricing: "#pricing",
    privacy: "/privacy",
    terms: "/terms",
    plans: {
      host: "/signup?plan=host",
      pro: "/signup?plan=pro",
      venue: "/signup?plan=venue",
    },
  };

  const CONTACT_EMAIL = "hello@triviaknight.app";

  const NAV = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: ROUTES.howItWorks },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  // ---- Pricing (all money lives here) ----
  const PLANS = [
    {
      id: "host",
      name: "Host",
      monthly: 19,
      annual: 190,
      description: "For independent hosts building and running their own trivia nights.",
      cta: "Start with Host",
      href: ROUTES.plans.host,
      featured: false,
      features: [
        "Unlimited trivia nights",
        "Unlimited saved games",
        "Unlimited custom questions",
        "Live-editable rounds and questions",
        "Multiple-choice, multi-select, and written-answer questions",
        "Live host controls",
        "Presenter view",
        "Timers, scoring, and leaderboards",
        "One host account",
        "TriviaKnight branding",
        "Standard email support",
      ],
    },
    {
      id: "pro",
      name: "Pro Host",
      monthly: 39,
      annual: 390,
      description: "For professional hosts who want stronger production tools and their own brand on the experience.",
      cta: "Choose Pro Host",
      href: ROUTES.plans.pro,
      featured: true,
      badge: "Most Popular",
      features: [
        "Everything in Host",
        "Image and video rounds",
        "Advanced scoring rules",
        "Sudden-death tie-breaker questions",
        "Searchable question and round library",
        "Bulk .xlsx question import and export",
        "Custom logo and brand colours",
        "Sponsor slides and messages",
        "Game history and performance analytics",
        "Up to three host or admin accounts",
        "Priority email support",
      ],
    },
    {
      id: "venue",
      name: "Venue & Teams",
      monthly: 79,
      annual: 790,
      description: "For venues, trivia companies, and organizations coordinating games across multiple hosts or locations.",
      cta: "Choose Venue & Teams",
      href: ROUTES.plans.venue,
      featured: false,
      features: [
        "Everything in Pro Host",
        "Multi-venue workspaces",
        "Centralized game and question library",
        "Up to ten host or admin accounts",
        "Roles and permissions",
        "White-label presenter and player experience",
        "Cross-event and cross-venue analytics",
        "Shared brand assets",
        "Host activity reporting",
        "Guided onboarding",
        "Priority support",
      ],
    },
  ];

  // ---- Features (icon keys map to Lucide names rendered in the section) ----
  const FEATURES = [
    { icon: "layout-grid", title: "Round-based game builder", body: "Create games from scratch and organize them into clearly structured rounds." },
    { icon: "pencil-line", title: "Custom questions and answers", body: "Write your own questions, set the correct answers, and assign point values." },
    { icon: "list-checks", title: "Multiple question formats", body: "Multiple choice, multi-select, and written-answer questions in the same game." },
    { icon: "monitor-play", title: "Live presenter view", body: "A clean projector display for the room with questions, choices, and standings." },
    { icon: "timer", title: "Host controls and timers", body: "Control the pace, reveal answers, and run the countdown from the host desk." },
    { icon: "trophy", title: "Scoring and leaderboards", body: "Automatic scoring on reveal with a live leaderboard and tie handling." },
    { icon: "library", title: "Live-editable question bank", body: "Edit your questions, choices, and answers anytime before or during the event, with bulk .xlsx import and export to speed up setup." },
    { icon: "image", title: "Image and video rounds", body: "Add image or video clues for richer question rounds.", premium: true },
    { icon: "dices", title: "Sudden-death tie-breakers", body: "Settle a tie for first place with a dedicated tie-breaker question.", premium: true },
    { icon: "palette", title: "Custom venue branding", body: "Put your logo and brand colours on the presenter and player experience.", premium: true },
    { icon: "megaphone", title: "Sponsor slides and messages", body: "Drop in sponsor slides and messages between rounds.", premium: true },
    { icon: "bar-chart-3", title: "Game history and analytics", body: "Review past games and performance across events.", premium: true },
  ];

  const USE_CASES = [
    { icon: "mic", title: "Independent trivia hosts", body: "Write and edit your question bank right up until showtime, then run the live show from the host desk.", href: "/trivia-software-for-hosts" },
    { icon: "beer", title: "Bars, pubs, and breweries", body: "Turn a quiet night into a recurring event that gives customers a reason to return.", href: "/bar-trivia-software" },
    { icon: "party-popper", title: "Event professionals", body: "Deliver polished trivia for private events, conferences, parties, and client gatherings.", href: null },
    { icon: "building-2", title: "Corporate teams", body: "Run engaging quiz nights for team building, celebrations, and remote or in-person events.", href: "/corporate-trivia" },
    { icon: "heart-handshake", title: "Fundraisers and community groups", body: "Create an approachable event format that brings supporters together.", href: "/fundraiser-trivia" },
  ];

  const FAQS = [
    { q: "What is trivia night software?", a: "Trivia night software helps hosts build quiz rounds, present questions to a room, manage the flow of the game, track scoring, and display standings during live events. TriviaKnight brings the game builder and the live host controls together in one place." },
    { q: "Can I host unlimited trivia nights?", a: "Yes. Every paid TriviaKnight plan includes unlimited hosted trivia nights, unlimited saved games, and unlimited custom questions. Your plan sets the tools you get, not how often you can host." },
    { q: "Does TriviaKnight charge per game?", a: "No. Paid plans are subscriptions. There are no game credits and no per-event charges." },
    { q: "Can I create my own trivia questions?", a: "Yes. Hosts write their own custom questions and organize them into rounds, with live editing and bulk .xlsx import and export." },
    { q: "Can I edit my questions after I have started building a game?", a: "Yes. Question and round edits are live: changes you make in the question editor show up immediately for players, the presenter screen, and the printable answer key." },
    { q: "Is TriviaKnight suitable for bars and restaurants?", a: "Yes. It is designed for recurring live trivia at bars, pubs, breweries, restaurants, and other venues." },
    { q: "Can TriviaKnight be used for corporate events and fundraisers?", a: "Yes. The game builder and live hosting tools support corporate gatherings, private events, fundraisers, and community quiz nights." },
    { q: "Do I need technical experience?", a: "No. TriviaKnight is designed for hosts who want to concentrate on the room rather than the software." },
    { q: "Can multiple people manage trivia games?", a: "The Pro Host and Venue & Teams plans include additional host or administrator accounts." },
    // TODO(billing): confirm this matches the final Stripe subscription configuration.
    { q: "Can I cancel my subscription?", a: "Yes. Subscriptions can be cancelled and remain active until the end of the current billing period." },
  ];

  // ---- Pricing comparison (grouped). value: true | false | string ----
  const COMPARISON = [
    { group: "Building games", rows: [
      { label: "Unlimited trivia nights", host: true, pro: true, venue: true },
      { label: "Unlimited saved games and questions", host: true, pro: true, venue: true },
      { label: "Live-editable rounds and questions", host: true, pro: true, venue: true },
      { label: "Searchable question and round library", host: false, pro: true, venue: true },
      { label: "Bulk .xlsx question import and export", host: false, pro: true, venue: true },
    ]},
    { group: "Running live trivia", rows: [
      { label: "Live host controls and timers", host: true, pro: true, venue: true },
      { label: "Presenter view", host: true, pro: true, venue: true },
      { label: "Scoring and leaderboards", host: true, pro: true, venue: true },
      { label: "Image and video rounds", host: false, pro: true, venue: true },
      { label: "Sudden-death tie-breakers", host: false, pro: true, venue: true },
    ]},
    { group: "Branding", rows: [
      { label: "TriviaKnight branding", host: true, pro: true, venue: true },
      { label: "Custom logo and brand colours", host: false, pro: true, venue: true },
      { label: "Sponsor slides and messages", host: false, pro: true, venue: true },
      { label: "White-label presenter and player experience", host: false, pro: false, venue: true },
    ]},
    { group: "Reporting", rows: [
      { label: "Game history and analytics", host: false, pro: true, venue: true },
      { label: "Cross-event and cross-venue analytics", host: false, pro: false, venue: true },
      { label: "Host activity reporting", host: false, pro: false, venue: true },
    ]},
    { group: "Collaboration", rows: [
      { label: "Host or admin accounts", host: "1", pro: "Up to 3", venue: "Up to 10" },
      { label: "Roles and permissions", host: false, pro: false, venue: true },
      { label: "Multi-venue workspaces", host: false, pro: false, venue: true },
      { label: "Shared brand assets", host: false, pro: false, venue: true },
    ]},
    { group: "Support", rows: [
      { label: "Standard email support", host: true, pro: false, venue: false },
      { label: "Priority email support", host: false, pro: true, venue: true },
      { label: "Guided onboarding", host: false, pro: false, venue: true },
    ]},
  ];

  const USE_CASE_OPTIONS = [
    "Independent trivia host",
    "Bar, restaurant, or brewery",
    "Trivia company",
    "Corporate event",
    "Fundraiser or community event",
    "Private event",
    "Other",
  ];

  // ---- Lightweight analytics helper (no vendor attached) ----
  // TODO(analytics): forward events to a vendor when one is chosen. Never send
  // sensitive form contents (only event name + safe metadata).
  function track(event, meta) {
    if (typeof console !== "undefined") console.debug("[analytics]", event, meta || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: event, ...(meta || {}) });
  }

  window.TKC = { ROUTES, CONTACT_EMAIL, NAV, PLANS, FEATURES, USE_CASES, FAQS, COMPARISON, USE_CASE_OPTIONS, track };
})();
