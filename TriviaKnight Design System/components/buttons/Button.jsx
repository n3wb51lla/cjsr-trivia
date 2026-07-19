import React from "react";

const STYLE_ID = "tk-button-styles";
const CSS = `
.tk-btn{font-family:var(--font-body);font-weight:600;line-height:1;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border:1.5px solid transparent;border-radius:var(--radius-md);cursor:pointer;text-decoration:none;white-space:nowrap;transition:background var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),transform var(--dur-fast) var(--ease-out),box-shadow var(--dur-base) var(--ease-out);-webkit-tap-highlight-color:transparent}
.tk-btn:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-btn[disabled],.tk-btn[aria-disabled=true]{opacity:.5;pointer-events:none}
.tk-btn--sm{padding:.5rem .85rem;font-size:.875rem}
.tk-btn--md{padding:.7rem 1.15rem;font-size:.95rem}
.tk-btn--lg{padding:.9rem 1.6rem;font-size:1.0625rem}
.tk-btn--block{width:100%}
.tk-btn svg{width:1.15em;height:1.15em;flex:none}
/* primary — gold */
.tk-btn--primary{background:var(--gold-500);color:var(--navy-950);border-color:var(--gold-500)}
.tk-btn--primary:hover{background:var(--gold-600);border-color:var(--gold-600);transform:translateY(-1px);box-shadow:var(--shadow-gold)}
.tk-btn--primary:active{transform:translateY(0) scale(.99);box-shadow:none}
/* secondary — solid navy on light, solid white on dark */
.tk-btn--secondary{background:var(--navy-900);color:#fff;border-color:var(--navy-900)}
.tk-btn--secondary:hover{background:var(--navy-700);border-color:var(--navy-700);transform:translateY(-1px);box-shadow:var(--shadow-md)}
.tk-btn--secondary:active{transform:translateY(0) scale(.99);box-shadow:none}
.tk-btn--secondary.tk-on-dark{background:#fff;color:var(--navy-950);border-color:#fff}
.tk-btn--secondary.tk-on-dark:hover{background:var(--paper-100);border-color:var(--paper-100)}
/* ghost — outline */
.tk-btn--ghost{background:transparent;color:var(--navy-900);border-color:var(--slate-300)}
.tk-btn--ghost:hover{border-color:var(--navy-900);background:var(--paper-100);transform:translateY(-1px)}
.tk-btn--ghost:active{transform:translateY(0) scale(.99)}
.tk-btn--ghost.tk-on-dark{color:#fff;border-color:rgba(255,255,255,.28)}
.tk-btn--ghost.tk-on-dark:hover{border-color:var(--gold-400);color:var(--gold-300);background:rgba(255,255,255,.04)}
`;

function useButtonStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * TriviaKnight primary action button. Renders an <a> when `href` is set,
 * otherwise a <button>.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  block = false,
  href,
  iconLeft,
  iconRight,
  disabled = false,
  className = "",
  ...rest
}) {
  useButtonStyles();
  const cls = [
    "tk-btn",
    `tk-btn--${variant}`,
    `tk-btn--${size}`,
    onDark ? "tk-on-dark" : "",
    block ? "tk-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {iconLeft}
      {children != null && <span>{children}</span>}
      {iconRight}
    </>
  );
  if (href && !disabled) {
    return (
      <a className={cls} href={href} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} disabled={disabled} aria-disabled={disabled || undefined} {...rest}>
      {content}
    </button>
  );
}
