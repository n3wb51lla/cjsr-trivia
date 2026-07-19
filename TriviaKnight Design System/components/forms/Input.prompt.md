Labelled, accessible text input with hint and error states. Use for the contact form.

```jsx
<Input label="Email" type="email" required placeholder="you@venue.com"
  error={emailError} hint="We only use this to reply." />
<Input label="Organization or venue" optional />
```

Handles label association, `aria-invalid`, and `aria-describedby` automatically. Pair with Textarea, Select, and Checkbox.
