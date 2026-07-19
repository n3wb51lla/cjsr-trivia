import * as React from "react";

/**
 * Pricing plan card with amount, description, feature checklist, and CTA.
 * Price strings are presentational; the parent toggles monthly/annual.
 * @startingPoint section="Marketing" subtitle="Plan card with features and CTA" viewport="360x520"
 */
export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  /** Displayed amount, e.g. "$39". */
  price: React.ReactNode;
  /** Period suffix. @default "/mo" */
  period?: React.ReactNode;
  /** Secondary line, e.g. "$390 billed yearly". */
  sublabel?: React.ReactNode;
  description?: React.ReactNode;
  /** Feature bullet strings; the first is emphasized. */
  features?: React.ReactNode[];
  /** @default "Choose plan" */
  ctaLabel?: string;
  ctaHref?: string;
  /** Highlight as the recommended plan (gold border + ribbon). @default false */
  featured?: boolean;
  /** Ribbon text when featured. @default "Most Popular" */
  badgeLabel?: string;
}

export function PricingCard(props: PricingCardProps): JSX.Element;
