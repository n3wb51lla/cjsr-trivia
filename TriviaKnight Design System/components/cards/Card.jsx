import React from "react";

const STYLE_ID = "tk-card-styles";
const CSS = `
.tk-card{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)}
.tk-card--hover:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-300)}
.tk-card--dark{background:var(--surface-raised);border-color:var(--surface-line-dark);color:var(--text-on-dark);box-shadow:var(--shadow-dark)}
.tk-card--flat{box-shadow:none}
.tk-card--pad-lg{padding:2rem}
`;

function useCardStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Generic surface container. Building block for feature/pricing/use-case cards. */
export function Card({ children, tone = "light", hover = false, flat = false, padding = "md", className = "", ...rest }) {
  useCardStyles();
  const cls = [
    "tk-card",
    tone === "dark" ? "tk-card--dark" : "",
    hover ? "tk-card--hover" : "",
    flat ? "tk-card--flat" : "",
    padding === "lg" ? "tk-card--pad-lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
