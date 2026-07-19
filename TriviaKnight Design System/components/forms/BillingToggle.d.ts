import * as React from "react";

/**
 * Monthly/annual billing switch for the pricing section. Controlled via
 * `value` + `onChange`, or uncontrolled with internal state.
 */
export interface BillingToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** "monthly" | "annual". Omit for uncontrolled. */
  value?: "monthly" | "annual";
  onChange?: (value: "monthly" | "annual") => void;
  /** Savings pill text. @default "2 months free" */
  saveLabel?: React.ReactNode;
  /** Style for dark backgrounds. @default false */
  onDark?: boolean;
}

export function BillingToggle(props: BillingToggleProps): JSX.Element;
