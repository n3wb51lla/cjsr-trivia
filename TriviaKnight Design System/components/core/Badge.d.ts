import * as React from "react";

/**
 * Small uppercase mono pill for labels and status: "Most Popular", "Premium".
 * @startingPoint section="Core" subtitle="Uppercase label / status pill" viewport="500x100"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "gold" */
  tone?: "gold" | "navy" | "outline" | "success" | "soft";
  /** Adjust the outline tone for dark surfaces. @default false */
  onDark?: boolean;
  /** Optional leading icon (Lucide SVG). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
