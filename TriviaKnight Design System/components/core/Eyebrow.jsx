import React from "react";

const STYLE_ID = "tk-eyebrow-styles";
const CSS = `
.tk-eyebrow{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:var(--tracking-eyebrow);font-size:var(--text-eyebrow);font-weight:600;line-height:1.2;display:inline-flex;align-items:center;gap:.5rem;color:var(--accent-strong);margin:0}
.tk-eyebrow.tk-on-dark{color:var(--gold-400)}
.tk-eyebrow::before{content:"";width:1.4rem;height:2px;background:currentColor;border-radius:2px;opacity:.7}
.tk-eyebrow--plain::before{display:none}
`;

function useEyebrowStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Mono uppercase kicker above a heading, with a short leading rule. */
export function Eyebrow({ children, onDark = false, rule = true, className = "", ...rest }) {
  useEyebrowStyles();
  const cls = ["tk-eyebrow", onDark ? "tk-on-dark" : "", rule ? "" : "tk-eyebrow--plain", className]
    .filter(Boolean)
    .join(" ");
  return (
    <p className={cls} {...rest}>
      {children}
    </p>
  );
}
