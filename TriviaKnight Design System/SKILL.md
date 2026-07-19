---
name: triviaknight-design
description: Use this skill to generate well-branded interfaces and assets for TriviaKnight, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping TriviaKnight trivia-night software surfaces.
user-invocable: true
---

Read the `readme.md` file within this skill for the full brand and system guide, then
explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and
create static HTML files for the user to view. If working on production code, copy assets
and read the rules here to become an expert in designing with the TriviaKnight brand.

If the user invokes this skill without other guidance, ask them what they want to build
or design, ask some clarifying questions, and act as an expert designer who outputs HTML
artifacts or production code, depending on the need.

## What's here

- `readme.md` — brand story, content fundamentals, visual foundations, iconography, and a
  full file index. Start here.
- `styles.css` + `tokens/` — the CSS custom properties (navy/gold/off-white colors, type,
  spacing, radii, shadows, motion) and the Google Fonts import (Archivo, IBM Plex Sans,
  IBM Plex Mono). Link `styles.css` to inherit the real tokens.
- `assets/` — the temporary knight-mark logo and wordmark lockups (light + dark).
- `foundations/` — specimen cards for colors, type, spacing, effects, and brand.
- `components/` — reusable React primitives (Button, Logo, Badge, Eyebrow, Card,
  FeatureCard, UseCaseCard, PricingCard, Input, Textarea, Select, Checkbox,
  BillingToggle, FaqItem, AnnouncementBar). Each has a `.d.ts` contract, `.prompt.md`
  usage note, and a card HTML demo. Mount from `window.TriviaKnightDesignSystem_88085a`.
- `ui_kits/marketing-site/` — the full marketing website and the How It Works page,
  with centralized config.

## Key brand rules

- One subscription, unlimited trivia nights — lead with this positioning.
- Deep navy + warm gold + off-white. Alternate navy and off-white sections; gold is an
  accent, never a full background. Soft layered shadows, moderate radii, gold focus rings.
- Voice: confident, clever, plain-language, address the reader as "you". No em dashes, no
  hype words, no emoji, no invented social proof, no lorem ipsum.
- Icons: Lucide (24px, ~2px stroke, monochrome). The knight chess piece is the one
  bespoke mark.
- Keep product-workflow claims grounded in the real app; market tier features only on
  pricing/marketing surfaces.
