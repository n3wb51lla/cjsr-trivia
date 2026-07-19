# TriviaKnight Design System

TriviaKnight is trivia night software for hosts, venues, and event teams. Hosts use it
to build trivia games, organize questions into rounds, present games to a live audience,
run the live experience, and track scores. The core market promise:

> **One subscription. Unlimited trivia nights.**

This design system encodes the **TriviaKnight marketing brand** — a confident, clever,
reliable SaaS identity with subtle knight/heraldic cues (deep navy, warm gold, off-white
content). It is the visual foundation for the marketing website, decks, and future
product surfaces.

## Sources

- **Codebase:** `Trivia Knight/` — a Vite + React 18 + TypeScript + Tailwind + Firebase
  Realtime Database app. This is the live multiplayer Trivia Knight product. Its `CLAUDE.md` is the
  authoritative record of the real product workflow and capabilities.
- **Logo:** no approved production logo has been provided. Product surfaces use live text.
  The assets in this package are temporary exploration only and must not be treated as source material.

### Product visual language

This design system defines the Trivia Knight brand across both marketing and product
surfaces: navy, gold, off-white, soft elevation, moderate radii, and visible gold focus
states. Product UI should follow the real information architecture while remaining
faster, denser, and more room-readable than the marketing site.

## Real product capabilities (source of truth for "How It Works")

Confirmed from `Trivia Knight/CLAUDE.md` and the app code. Do **not** invent beyond these:

- **Build & organize:** questions organized into **rounds** (round count, per-round
  question count, per-round points are all data-driven). Question types: **multiple
  choice**, **multi-select**, **free-text** (fuzzy auto-graded), plus optional
  **image/video media** clues (Firebase Storage, gated per deployment).
- **Live host control desk:** initialize lobby → advance question → reveal → break →
  final. Live timer, lock-in count, waiting-team list, force-reveal override, scoring
  finalized on reveal, **sudden death** tie-breaker, kick (lobby only), manual score
  corrections.
- **Players join on their own devices** at the game URL, pick or type a **team name**
  (1–4 players), select and **lock in** answers within the timer. (No QR-code joining is
  implemented — players navigate to the URL.)
- **Projector / presenter screen** (`/screen`): read-only display of lobby, question +
  choices, reveal, standings checkpoints, and final winner.
- **Printable answer key**, **leaderboard** (ranked by score; ties broken by fastest
  cumulative lock time), **bulk `.xlsx` import/export** of questions.
- **Editable question bank** live during the event; changes propagate to all connected
  clients in realtime.

Not implemented / do not claim without confirmation: OAuth accounts, Stripe billing,
multi-venue workspaces, white-label player experience, analytics dashboards,
AI question generation, team registration flows. The marketing site describes these as
**plan features / roadmap positioning** — keep product-workflow pages (How It Works)
grounded strictly in the confirmed list above.

---

## CONTENT FUNDAMENTALS

**Voice:** confident, clever, plain-spoken, reliable. Talks to a working professional
host, not a hobbyist. Energetic without being chaotic; never game-show corny.

**Person:** address the reader as **you** ("Build and host unlimited trivia nights").
Refer to the product as **TriviaKnight** or "your subscription/plan," rarely "we"
(reserved for the contact/company voice: "Send us a message").

**Casing:** sentence case for headings and body ("Host more trivia, not more subscription
math."). Title Case only for proper nouns, plan names (Host, Pro Host, Venue & Teams),
and nav labels. Mono eyebrows are UPPERCASE with wide tracking ("TRIVIA NIGHT SOFTWARE
BUILT FOR HOSTS").

**Sentences:** short, declarative, benefit-first. Lead with the outcome, then the
mechanism. Lists over long paragraphs when enumerating features.

**Do not use:**
- Em dashes (use periods or commas).
- Hype words: revolutionary, world-class, next-generation, cutting-edge, ultimate.
- Invented social proof: no testimonials, customer logos, usage stats, ratings, awards,
  customer counts, uptime claims.
- Emoji (not part of the brand).
- Lorem ipsum.

**Signature message, used prominently and repeatedly:**
"One subscription. Unlimited trivia nights." / "No event credits. No per-game fees. No
limit on how often you host." / "Your plan determines the tools you receive, not how many
times you are allowed to use them."

**Examples of on-brand copy:**
- H1: "Build and host unlimited trivia nights."
- Eyebrow: "TRIVIA NIGHT SOFTWARE BUILT FOR HOSTS"
- Differentiator: "Host more trivia, not more subscription math."
- CTA labels: "Start Hosting", "See How TriviaKnight Works", "Build Your First Game".

---

## VISUAL FOUNDATIONS

**Palette.** Deep navy foundations (`--navy-900 #0b1120` primary dark canvas, down to
`--navy-950`), warm gold accent (`--gold-500 #e3a838`, hover `--gold-600`), warm off-white
content areas (`--paper-50 #faf8f3`). Cool slate neutral ramp for UI text/borders. Status
colors are restrained and brand-harmonious (green `#237a52`, amber, muted red `#b33f32`,
steel blue). Max one or two background colors per view: dark navy sections and off-white
content sections alternate. Gold is an accent, never a full background wash.

**Typography.** Display = **Archivo** 700–900 (headings, wordmark), tight tracking on
large sizes. Body = **IBM Plex Sans** 400–600 (professional, highly legible). Mono =
**IBM Plex Mono** for eyebrows, labels, badges, and small technical accents (uppercase,
`0.16em` tracking). Fluid clamp() scale for the big headings; fixed steps below.

**Spacing & layout.** 4px base rhythm. Content max-width `1200px` (`760px` for prose).
Generous section padding (`clamp(3.5rem, ~7vw, 7rem)`). Grid + gap for all groups.

**Backgrounds.** Solid navy or solid off-white, alternating by section. No parchment
textures, no castle imagery, no aggressive multi-stop gradients. Subtle heraldic geometry
allowed as low-contrast decoration: thin gold hairlines, a faint chevron/shield motif, a
knight glyph watermark at very low opacity. Product mockups sit in soft-shadowed cards.

**Corner radii.** Moderate, modern SaaS: cards `--radius-lg 16px`, large panels
`--radius-xl/2xl`, buttons `--radius-md 10px`, pills/badges `--radius-pill`. Never sharp
brutalist 0-radius, never fully-rounded blobs.

**Borders.** Hairline `1px` slate on light surfaces; `rgba(255,255,255,0.10)` on dark.
Featured/selected states use a `1.5–2px` gold border. No thick black brutalist frames.

**Shadows / elevation.** Soft, cool-tinted, layered (`--shadow-sm` → `--shadow-xl`).
Cards rest on `--shadow-md`, lift to `--shadow-lg` on hover. Featured plan and hero CTA
get a warm `--shadow-gold` glow. Dark surfaces use `--shadow-dark`. No hard offset
(brutalist) shadows.

**Motion.** Gentle and purposeful. `--ease-out` for entrances, `--dur-base 220ms`
default. Hover: subtle lift (`translateY(-2px)`) + shadow deepen; gold underline grows on
links. Press: slight scale-down (`0.98`) or darker fill. All motion collapses to `0ms`
under `prefers-reduced-motion` (wired in `effects.css`).

**Hover states.** Primary button: gold darkens to `--gold-600` + slight lift + gold glow.
Secondary/ghost: background tints, border brightens. Links: color shifts to
`--link-hover` with a growing underline. Cards: lift + deepen shadow + border warms.

**Focus.** Visible `3px` gold ring (`--focus-ring`) with `2px` offset on every
interactive element (WCAG 2.2 AA). Never remove outlines.

**Transparency / blur.** Sticky nav uses a translucent navy with `backdrop-filter: blur`.
Otherwise surfaces are solid for contrast and no layout shift.

**Imagery vibe.** Clean software interface mockups built in HTML/CSS (no borrowed
screenshots). Warm, confident, high-contrast. Knight/heraldic cues are geometric and
restrained, never illustrative or fantasy.

---

## ICONOGRAPHY

The **original source app uses no icon library** — it relies on text labels and a couple of
Unicode glyphs (the theme toggle is a "cross" character). For the TriviaKnight marketing
brand, the brand brief specifies **Lucide** icons.

- **System:** [Lucide](https://lucide.dev) — clean, consistent 24px, ~2px stroke, rounded
  joins. Matches the modern-SaaS feel and the moderate radii used throughout.
- **Loading:** CDN via `lucide` UMD (`<script src="https://unpkg.com/lucide@latest">` then
  `lucide.createIcons()`), or inline SVG copied from lucide.dev. This is a substitution:
  the source codebase ships no icon set, so Lucide is introduced fresh for the brand.
  **Flagged for confirmation.**
- **Usage:** feature cards, step markers, nav affordances, form field adornments,
  checkmarks in pricing/comparison. Stroke icons only; keep them monochrome (inherit
  `currentColor`) — gold or navy depending on surface. No filled/duotone icon styles.
- **Emoji:** never. **Unicode-as-icon:** avoid; use Lucide.
- **Brand mark:** the knight chess piece (`assets/logo-mark.svg`) is the one bespoke
  glyph — used as the logo mark, favicon, and a low-opacity watermark motif.

---

## ASSETS

- `assets/logo-mark.svg` — knight-chess-piece mark in a gold badge (works on light & dark).
  **Temporary placeholder**, easy to replace.
- `assets/logo.svg` — full lockup for light backgrounds (mark + "TriviaKnight" wordmark,
  "Knight" in gold).
- `assets/logo-lockup-dark.svg` — full lockup for dark backgrounds (white wordmark).

The wordmark SVGs use live `<text>` in Archivo with a system fallback so they can be
edited as text; convert to outlines when finalizing the real brand mark.

---

## INDEX

Root:
- `styles.css` — the single entry point consumers link. `@import` manifest only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `assets/` — logo mark and lockups.
- `thumbnail.html` — design-system homepage tile.
- `SKILL.md` — Agent-Skills-compatible entry describing how to use this system.

Foundation specimen cards (Design System tab): `foundations/` — colors, type, spacing,
effects, brand/logo, iconography.

Components (`components/`): reusable React primitives — see each directory's card and
`.prompt.md`. Namespace confirmed via `check_design_system`.

UI kit (`ui_kits/marketing-site/`): high-fidelity marketing website surfaces — the full
landing page (`index.html`) and the dedicated How It Works page (`how-it-works.html`),
rendered in the TriviaKnight brand with centralized `config.js`.

Templates (`templates/`): `landing-hero/` — a reusable `.dc.html` marketing-hero starting
point for consuming projects (announcement bar, nav, headline, CTAs).

### Components

Namespace: `window.TriviaKnightDesignSystem_88085a`. Reusable React primitives:

- **buttons/** — `Button` (primary / secondary / ghost, sizes, `onDark`, icon slots).
- **core/** — `Logo` + `KnightMark` (brand lockup / glyph), `Badge` (label & status
  pills), `Eyebrow` (mono section kicker).
- **cards/** — `Card` (generic surface), `FeatureCard` (icon + copy, premium flag),
  `UseCaseCard` (audience card, guide link or "coming soon"), `PricingCard` (plan card
  with feature checklist and CTA).
- **forms/** — `Input`, `Textarea`, `Select`, `Checkbox` (all with label/hint/error and
  a11y wiring), `BillingToggle` (monthly/annual switch).
- **disclosure/** — `FaqItem` (accessible accordion row), `AnnouncementBar` (dismissible
  top bar).

Each component directory has a `.d.ts` props contract, a `.prompt.md` usage note, and an
`@dsCard`-tagged card HTML demonstrating states.
