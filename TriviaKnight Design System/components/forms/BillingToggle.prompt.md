Monthly/annual switch for the pricing section, with a "2 months free" savings pill. Drives which price strings the PricingCards show.

```jsx
const [billing, setBilling] = React.useState("monthly");
<BillingToggle value={billing} onChange={setBilling} />
```

`role="switch"` with keyboard + focus support. Use `onDark` on navy sections.
