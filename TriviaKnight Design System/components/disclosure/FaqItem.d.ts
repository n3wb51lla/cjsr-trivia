import * as React from "react";

/**
 * Accessible FAQ accordion row (aria-expanded / aria-controls, animated height).
 * Stack several to build the FAQ section.
 * @startingPoint section="Marketing" subtitle="Accessible FAQ accordion row" viewport="640x140"
 */
export interface FaqItemProps extends React.HTMLAttributes<HTMLDivElement> {
  question: React.ReactNode;
  /** Open on first render (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called with the next open state when toggled. */
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function FaqItem(props: FaqItemProps): JSX.Element;
