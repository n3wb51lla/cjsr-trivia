import * as React from "react";

/** Generic rounded surface with soft elevation. Base for other cards. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "light" */
  tone?: "light" | "dark";
  /** Add lift-on-hover interaction. @default false */
  hover?: boolean;
  /** Remove the shadow. @default false */
  flat?: boolean;
  /** @default "md" */
  padding?: "md" | "lg";
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
