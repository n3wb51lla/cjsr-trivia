Accessible accordion row for the FAQ section; animates open/closed and manages ARIA. Stack multiple in a list.

```jsx
<FaqItem question="Can I host unlimited trivia nights?" defaultOpen>
  Every paid TriviaKnight plan includes unlimited hosted trivia nights.
</FaqItem>
<FaqItem question="Does TriviaKnight charge per game?">No. Paid plans are subscriptions.</FaqItem>
```

Works uncontrolled (`defaultOpen`) or controlled (`open` + `onToggle`) if you want single-open behavior.
