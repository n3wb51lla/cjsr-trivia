import * as React from "react";

/**
 * Labelled text input with hint and error states, wired for accessibility
 * (label association, aria-invalid, aria-describedby).
 * @startingPoint section="Forms" subtitle="Labelled text input with validation states" viewport="480x120"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message; puts the field in the invalid state. */
  error?: React.ReactNode;
  required?: boolean;
  /** Show an "(optional)" affordance next to the label. */
  optional?: boolean;
}

export function Input(props: InputProps): JSX.Element;
