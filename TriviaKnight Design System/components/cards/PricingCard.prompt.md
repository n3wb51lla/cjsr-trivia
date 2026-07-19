Subscription plan card with amount, description, feature checklist, and CTA. Featured plan gets a gold border and "Most Popular" ribbon.

```jsx
<PricingCard name="Pro Host" price="$39" period="/mo" sublabel="$390 billed yearly"
  description="For professional hosts who want stronger production tools."
  features={["Everything in Host", "Image and video rounds", "Custom brand colours"]}
  ctaLabel="Choose Pro Host" ctaHref="/signup?plan=pro" featured />
```

Price/period/sublabel are presentational strings; the parent (e.g. a billing toggle) decides monthly vs annual and passes the right values. The first feature is emphasized.
