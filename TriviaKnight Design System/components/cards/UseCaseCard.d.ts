import * as React from "react";

/**
 * Audience card for the "Built for the people bringing trivia to the crowd"
 * grid. Becomes a link when `href` is set, else shows "Guides coming soon".
 */
export interface UseCaseCardProps extends React.HTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Future SEO guide route. Omit to render the non-linked "coming soon" state. */
  href?: string;
  /** @default "Explore guide" */
  linkLabel?: string;
  children?: React.ReactNode;
}

export function UseCaseCard(props: UseCaseCardProps): JSX.Element;
