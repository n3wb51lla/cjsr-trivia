Feature card with a navy icon tile, title, and short description; use in the "Everything a trivia host needs" grid.

```jsx
<FeatureCard icon={<Icon.LayoutGrid/>} title="Round-based game builder">
  Organize every game into clearly structured rounds.
</FeatureCard>
<FeatureCard icon={...} title="Sponsor slides" premium>...</FeatureCard>
```

Pass `premium` to subtly flag higher-tier features (renders a soft badge); customize the label with `badgeLabel`.
