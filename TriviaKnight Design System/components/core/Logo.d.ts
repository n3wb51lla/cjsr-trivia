import * as React from "react";

/**
 * TriviaKnight logo lockup (temporary placeholder): inlined knight-chess-piece
 * mark plus the wordmark. Swap the mark path / word for a final SVG later.
 * @startingPoint section="Core" subtitle="Knight mark + TriviaKnight wordmark" viewport="400x80"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Use light wordmark for dark backgrounds. @default false */
  onDark?: boolean;
  /** Render the whole lockup as a link. */
  href?: string;
  /** Show the wordmark text next to the mark. @default true */
  wordmark?: boolean;
}

export function Logo(props: LogoProps): JSX.Element;

export interface KnightMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}
/** Just the knight badge mark, for favicons / compact spots. */
export function KnightMark(props: KnightMarkProps): JSX.Element;
