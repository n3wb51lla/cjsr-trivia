import * as React from "react";

/**
 * Feature card: navy icon tile, title, short description, optional premium tag.
 * @startingPoint section="Marketing" subtitle="Icon + title + description feature card" viewport="360x220"
 */
export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element (Lucide SVG). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Mark the feature as belonging to a higher tier. @default false */
  premium?: boolean;
  /** Badge text when premium. @default "Premium" */
  badgeLabel?: string;
  children?: React.ReactNode;
}

export function FeatureCard(props: FeatureCardProps): JSX.Element;
