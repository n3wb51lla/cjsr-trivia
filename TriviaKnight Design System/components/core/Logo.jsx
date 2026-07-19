import React from "react";

const STYLE_ID = "tk-logo-styles";
const CSS = `
.tk-logo{display:inline-flex;align-items:center;gap:.6rem;text-decoration:none;font-family:var(--font-display);font-weight:800;letter-spacing:-.02em;line-height:1;color:var(--navy-900)}
.tk-logo.tk-on-dark{color:var(--text-on-dark)}
.tk-logo__mark{flex:none;display:block}
.tk-logo__word .k{color:var(--gold-600)}
.tk-logo.tk-on-dark .tk-logo__word .k{color:var(--gold-400)}
.tk-logo--sm{font-size:1.05rem}.tk-logo--sm .tk-logo__mark{width:28px;height:28px}
.tk-logo--md{font-size:1.35rem}.tk-logo--md .tk-logo__mark{width:34px;height:34px}
.tk-logo--lg{font-size:1.75rem}.tk-logo--lg .tk-logo__mark{width:44px;height:44px}
`;

function useLogoStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * The knight-piece mark. Inlined so the component is self-contained and easy to
 * swap for a final SVG.
 */
export function KnightMark({ size = 34, ...rest }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="tk-logo__mark" aria-hidden="true" {...rest}>
      <rect x="2" y="2" width="60" height="60" rx="15" fill="var(--gold-500)" />
      <rect x="2" y="2" width="60" height="60" rx="15" fill="none" stroke="var(--gold-600)" strokeWidth="1.5" />
      <path
        d="M14 32 C16 24 20 18 27 14 L31 7 L36 15 C41 17 45 22 44 27 L40 29 L45 33 L41 36 L45 40 C46 44 45 47 45 50 L23 50 C21 44 21 38 24 33 L17 33 L14 36 Z"
        fill="var(--navy-950)"
      />
      <circle cx="25" cy="23" r="1.7" fill="var(--gold-500)" />
    </svg>
  );
}

/** TriviaKnight lockup: knight mark + wordmark. Temporary placeholder brand. */
export function Logo({ size = "md", onDark = false, href, wordmark = true, className = "", ...rest }) {
  useLogoStyles();
  const cls = ["tk-logo", `tk-logo--${size}`, onDark ? "tk-on-dark" : "", className].filter(Boolean).join(" ");
  const markPx = size === "sm" ? 28 : size === "lg" ? 44 : 34;
  const inner = (
    <>
      <KnightMark size={markPx} />
      {wordmark && (
        <span className="tk-logo__word">
          Trivia<span className="k">Knight</span>
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} aria-label="TriviaKnight" {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <span className={cls} {...rest}>
      {inner}
    </span>
  );
}
