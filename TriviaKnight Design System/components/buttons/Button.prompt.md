Primary action button for TriviaKnight; use for CTAs like "Start Hosting" and any clickable action or link-styled-as-button.

```jsx
<Button variant="primary" size="lg" href="/signup">Start Hosting</Button>
<Button variant="ghost" onDark>See How It Works</Button>
```

Variants: `primary` (gold, main CTA), `secondary` (solid navy, or solid white with `onDark`), `ghost` (outlined). Sizes: `sm` / `md` / `lg`. Pass `onDark` on navy sections, `block` for full width, `href` to render an anchor, and `iconLeft`/`iconRight` for Lucide icons.
