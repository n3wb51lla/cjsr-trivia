import * as React from "react";

/** Labelled native select with a custom chevron and validation states. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Options as strings or {value,label} objects. */
  options?: Array<string | { value: string; label: string }>;
  /** Disabled placeholder option shown first. */
  placeholder?: string;
}

export function Select(props: SelectProps): JSX.Element;
