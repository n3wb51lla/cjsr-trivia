# TriviaKnight — Marketing site UI kit

High-fidelity recreation of the TriviaKnight marketing website, rendered in the
TriviaKnight brand and composed from the design-system components
(`window.TriviaKnightDesignSystem_88085a`).

## Screens

- **`index.html`** — the full landing page: announcement bar, sticky nav, hero with
  a live product mockup, unlimited-hosting differentiation, a How It Works preview,
  the 12-card features grid, use-case cards, pricing (monthly/annual toggle + three
  plan cards + comparison table), an unlimited-hosting callout, FAQ accordion, a
  contact form with validation/loading/success/error states, final CTA, and footer.
  Includes full SEO metadata and Organization / SoftwareApplication / Product /
  FAQPage structured data.
- **`how-it-works.html`** — the dedicated `/how-it-works` page. Content is grounded
  strictly in the confirmed product workflow (see below); it does not claim
  unconfirmed capabilities.

## Files

- `config.js` — centralized, editable configuration (`window.TKC`): app routes,
  contact email, nav, plans + pricing, features, use cases, FAQs, the pricing
  comparison, contact use-case options, and a lightweight `track()` analytics helper.
  **This is the one file to edit** for copy, prices, routes, and links.
- `ProductMockup.jsx` — the hero product-interface mockup (`window.ProductMockup`).
  Static HTML/CSS, not a screenshot; grounded in the real app IA.
- `MarketingSite.jsx` — all landing-page sections (`window.MarketingSite`).
- `HowItWorks.jsx` — the How It Works page (`window.HowItWorks`).

## Grounding (what is real vs. marketing positioning)

The How It Works page and the hero mockup only depict capabilities confirmed in the
source app (`CJSR Trivia/CLAUDE.md`): round-based game building; multiple-choice,
multi-select, and written-answer questions with optional image/video clues; a live
host desk (lobby → question → reveal → break → final, timers, lock-in counts, force
reveal, sudden-death tie-break, manual score corrections); players joining on their
own devices and locking in answers; a presenter/projector view; a score-ranked
leaderboard; and a printable answer key.

The landing page additionally markets **plan-tier features** (analytics, white-label,
multi-venue, sponsor slides, custom branding) as product positioning. Keep those on
the marketing/pricing pages, not on How It Works.

## Integration TODOs (front-end only — see project README for backend)

- Log In / Start Hosting and plan CTAs deep-link to `/login` and `/signup?plan=…`.
  Wire these to the real OAuth + Stripe flow when the backend is ready
  (`config.js`, marked with TODO).
- The contact form validates client-side and mocks submission. Point `onSubmit` at
  the server contact endpoint (Resend via the app's server layer). No API keys in
  the browser.
- Replace the social-share image and favicon placeholders with real exports.
