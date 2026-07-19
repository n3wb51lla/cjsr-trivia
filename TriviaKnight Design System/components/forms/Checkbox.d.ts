import * as React from "react";

/** Custom-styled checkbox over a real input. Use for consent and opt-ins. */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label content (can include links). */
  label?: React.ReactNode;
  required?: boolean;
  /** Puts the box in the invalid state. */
  error?: boolean;
  children?: React.ReactNode;
}

export function Checkbox(props: CheckboxProps): JSX.Element;
