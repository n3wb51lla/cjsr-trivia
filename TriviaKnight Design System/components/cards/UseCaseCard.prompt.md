Audience/use-case card for the use-cases grid. Links to a guide route or safely shows "Guides coming soon".

```jsx
<UseCaseCard icon={...} title="Bars, pubs, and breweries" href="/bar-trivia-software">
  Turn a quiet night into a recurring event.
</UseCaseCard>
<UseCaseCard icon={...} title="Corporate teams">Run engaging quiz nights.</UseCaseCard>
```

Omit `href` to render the non-interactive "Guides coming soon" state so navigation never breaks.
