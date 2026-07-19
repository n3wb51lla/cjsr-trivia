import * as React from "react";

/** Mono uppercase kicker line above a section heading. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Use the light-on-dark gold tone. @default false */
  onDark?: boolean;
  /** Show the short leading rule. @default true */
  rule?: boolean;
  children?: React.ReactNode;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
