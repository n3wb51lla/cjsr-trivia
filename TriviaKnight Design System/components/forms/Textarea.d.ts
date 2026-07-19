import * as React from "react";

/** Labelled multi-line textarea with hint and error states. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}

export function Textarea(props: TextareaProps): JSX.Element;
