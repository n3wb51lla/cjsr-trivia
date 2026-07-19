import * as React from "react";

/**
 * TriviaKnight action button. Primary is warm gold; secondary is solid; ghost
 * is outlined. Set `onDark` when the button sits on a navy background.
 *
 * @startingPoint section="Core" subtitle="Primary / secondary / ghost action button" viewport="700x120"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Adjust secondary/ghost styling for dark (navy) surfaces. @default false */
  onDark?: boolean;
  /** Full-width. @default false */
  block?: boolean;
  /** Render as a link to this URL instead of a <button>. */
  href?: string;
  /** Icon element rendered before the label (e.g. a Lucide SVG). */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label. */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
