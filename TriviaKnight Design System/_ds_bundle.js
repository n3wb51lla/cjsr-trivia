/* @ds-bundle: {"format":4,"namespace":"TriviaKnightDesignSystem_88085a","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Card","sourcePath":"components/cards/Card.jsx"},{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.jsx"},{"name":"PricingCard","sourcePath":"components/cards/PricingCard.jsx"},{"name":"UseCaseCard","sourcePath":"components/cards/UseCaseCard.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"KnightMark","sourcePath":"components/core/Logo.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"AnnouncementBar","sourcePath":"components/disclosure/AnnouncementBar.jsx"},{"name":"FaqItem","sourcePath":"components/disclosure/FaqItem.jsx"},{"name":"BillingToggle","sourcePath":"components/forms/BillingToggle.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"FieldError","sourcePath":"components/forms/fieldStyles.js"}],"sourceHashes":{"components/buttons/Button.jsx":"f96c4b51f164","components/cards/Card.jsx":"3590c38d76be","components/cards/FeatureCard.jsx":"1902b94b6ace","components/cards/PricingCard.jsx":"91749c6604c0","components/cards/UseCaseCard.jsx":"3546bcc30897","components/core/Badge.jsx":"0dd01c6e67c0","components/core/Eyebrow.jsx":"b3331d6151d4","components/core/Logo.jsx":"24e5802420c1","components/disclosure/AnnouncementBar.jsx":"ca8ea3236070","components/disclosure/FaqItem.jsx":"38dae43fe2fd","components/forms/BillingToggle.jsx":"962a5eea0f94","components/forms/Checkbox.jsx":"eed6d16c4ff1","components/forms/Input.jsx":"b8c3380779a6","components/forms/Select.jsx":"be3d60ac2ffc","components/forms/Textarea.jsx":"5555b5fc0370","components/forms/fieldStyles.js":"03e5f0bb191e","ui_kits/marketing-site/HowItWorks.jsx":"5ccd7e64789f","ui_kits/marketing-site/MarketingSite.jsx":"d263732a2e90","ui_kits/marketing-site/ProductMockup.jsx":"8ab3115a9d37","ui_kits/marketing-site/config.js":"ea4ec19a9060"},"inlinedExternals":[],"unexposedExports":[{"name":"useFieldId","sourcePath":"components/forms/fieldStyles.js"},{"name":"useFieldStyles","sourcePath":"components/forms/fieldStyles.js"}]} */

(() => {

const __ds_ns = (window.TriviaKnightDesignSystem_88085a = window.TriviaKnightDesignSystem_88085a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Button({
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
  const cls = ["tk-btn", `tk-btn--${variant}`, `tk-btn--${size}`, onDark ? "tk-on-dark" : "", block ? "tk-btn--block" : "", className].filter(Boolean).join(" ");
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft, children != null && /*#__PURE__*/React.createElement("span", null, children), iconRight);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled,
    "aria-disabled": disabled || undefined
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Card({
  children,
  tone = "light",
  hover = false,
  flat = false,
  padding = "md",
  className = "",
  ...rest
}) {
  useCardStyles();
  const cls = ["tk-card", tone === "dark" ? "tk-card--dark" : "", hover ? "tk-card--hover" : "", flat ? "tk-card--flat" : "", padding === "lg" ? "tk-card--pad-lg" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.jsx", error: String((e && e.message) || e) }); }

// components/cards/UseCaseCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-usecase-styles";
const CSS = `
.tk-uc{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;display:flex;flex-direction:column;gap:.6rem;text-decoration:none;color:inherit;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)}
a.tk-uc:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-300)}
.tk-uc__icon{width:2.5rem;height:2.5rem;border-radius:var(--radius-md);background:var(--gold-200);color:var(--gold-700);display:inline-flex;align-items:center;justify-content:center}
.tk-uc__icon svg{width:1.35rem;height:1.35rem}
.tk-uc__title{font-family:var(--font-display);font-weight:700;font-size:1.125rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-uc__body{font-family:var(--font-body);font-size:.95rem;line-height:1.55;color:var(--text-body);margin:0;flex:1}
.tk-uc__link{font-family:var(--font-body);font-weight:600;font-size:.9rem;display:inline-flex;align-items:center;gap:.35rem;margin-top:.25rem}
.tk-uc__link--live{color:var(--link)}
a.tk-uc:hover .tk-uc__link--live{color:var(--link-hover)}
.tk-uc__link--soon{color:var(--text-muted)}
.tk-uc__link svg{width:1rem;height:1rem}
`;
function useUseCaseStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Audience/use-case card. Links to a guide route when `href` is set; otherwise
 * renders a non-interactive "Guides coming soon" note (no broken links).
 */
function UseCaseCard({
  icon,
  title,
  children,
  href,
  linkLabel = "Explore guide",
  className = "",
  ...rest
}) {
  useUseCaseStyles();
  const cls = ["tk-uc", className].filter(Boolean).join(" ");
  const body = /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement("span", {
    className: "tk-uc__icon"
  }, icon), /*#__PURE__*/React.createElement("h3", {
    className: "tk-uc__title"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "tk-uc__body"
  }, children), href ? /*#__PURE__*/React.createElement("span", {
    className: "tk-uc__link tk-uc__link--live"
  }, linkLabel, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  }))) : /*#__PURE__*/React.createElement("span", {
    className: "tk-uc__link tk-uc__link--soon"
  }, "Guides coming soon"));
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), body);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), body);
}
Object.assign(__ds_scope, { UseCaseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/UseCaseCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-badge-styles";
const CSS = `
.tk-badge{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.1em;font-size:.6875rem;font-weight:600;line-height:1;display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;border-radius:var(--radius-pill);border:1px solid transparent}
.tk-badge svg{width:.85rem;height:.85rem}
.tk-badge--gold{background:var(--gold-300);color:var(--navy-950)}
.tk-badge--navy{background:var(--navy-900);color:#fff}
.tk-badge--outline{background:transparent;border-color:var(--slate-300);color:var(--text-body)}
.tk-badge--outline.tk-on-dark{border-color:rgba(255,255,255,.28);color:var(--text-on-dark-muted)}
.tk-badge--success{background:var(--success-soft);color:var(--success)}
.tk-badge--soft{background:var(--gold-200);color:var(--gold-700)}
`;
function useBadgeStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Small uppercase status/label pill. Use for "Most Popular", "Premium", "Pro". */
function Badge({
  children,
  tone = "gold",
  onDark = false,
  icon,
  className = "",
  ...rest
}) {
  useBadgeStyles();
  const cls = ["tk-badge", `tk-badge--${tone}`, onDark ? "tk-on-dark" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-featurecard-styles";
const CSS = `
.tk-feat{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;transition:transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out)}
.tk-feat:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-300)}
.tk-feat__icon{width:2.75rem;height:2.75rem;border-radius:var(--radius-md);background:var(--navy-900);color:var(--gold-400);display:inline-flex;align-items:center;justify-content:center}
.tk-feat__icon svg{width:1.4rem;height:1.4rem}
.tk-feat__head{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.tk-feat__title{font-family:var(--font-display);font-weight:700;font-size:1.125rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-feat__body{font-family:var(--font-body);font-size:.95rem;line-height:1.55;color:var(--text-body);margin:0}
`;
function useFeatureStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Icon + title + description feature card, with an optional premium/tier badge. */
function FeatureCard({
  icon,
  title,
  children,
  premium = false,
  badgeLabel = "Premium",
  className = "",
  ...rest
}) {
  useFeatureStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tk-feat", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "tk-feat__icon"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "tk-feat__head"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tk-feat__title"
  }, title), premium && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "soft"
  }, badgeLabel)), /*#__PURE__*/React.createElement("p", {
    className: "tk-feat__body"
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/PricingCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-pricing-styles";
const CSS = `
.tk-price{position:relative;background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);padding:1.75rem;display:flex;flex-direction:column;gap:1.1rem}
.tk-price--featured{border:2px solid var(--gold-500);box-shadow:var(--shadow-gold)}
.tk-price__ribbon{position:absolute;top:-.75rem;left:1.75rem}
.tk-price__name{font-family:var(--font-display);font-weight:800;font-size:1.375rem;color:var(--text-strong);margin:0;letter-spacing:-.01em}
.tk-price__desc{font-family:var(--font-body);font-size:.9rem;line-height:1.5;color:var(--text-muted);margin:0}
.tk-price__amount{display:flex;align-items:baseline;gap:.35rem}
.tk-price__num{font-family:var(--font-display);font-weight:800;font-size:2.5rem;color:var(--text-strong);letter-spacing:-.02em;line-height:1}
.tk-price__per{font-family:var(--font-body);font-size:.9rem;color:var(--text-muted)}
.tk-price__sub{font-family:var(--font-mono);font-size:.75rem;color:var(--text-muted);margin:-.5rem 0 0}
.tk-price__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.55rem;flex:1}
.tk-price__list li{display:flex;gap:.55rem;font-family:var(--font-body);font-size:.9rem;line-height:1.4;color:var(--text-body)}
.tk-price__list li svg{width:1.05rem;height:1.05rem;flex:none;margin-top:.1rem;color:var(--success)}
.tk-price__list li.is-first{font-weight:600;color:var(--text-strong)}
`;
function usePricingStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}
function Check() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }));
}

/**
 * Pricing plan card. `price`, `period`, and `sublabel` are presentational —
 * the parent decides monthly vs annual and passes the current strings.
 */
function PricingCard({
  name,
  price,
  period = "/mo",
  sublabel,
  description,
  features = [],
  ctaLabel = "Choose plan",
  ctaHref,
  featured = false,
  badgeLabel = "Most Popular",
  className = "",
  ...rest
}) {
  usePricingStyles();
  const cls = ["tk-price", featured ? "tk-price--featured" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), featured && /*#__PURE__*/React.createElement("span", {
    className: "tk-price__ribbon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "gold"
  }, badgeLabel)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "tk-price__name"
  }, name), description && /*#__PURE__*/React.createElement("p", {
    className: "tk-price__desc"
  }, description)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tk-price__amount"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tk-price__num"
  }, price), /*#__PURE__*/React.createElement("span", {
    className: "tk-price__per"
  }, period)), sublabel && /*#__PURE__*/React.createElement("p", {
    className: "tk-price__sub"
  }, sublabel)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? "primary" : "secondary",
    block: true,
    href: ctaHref
  }, ctaLabel), /*#__PURE__*/React.createElement("ul", {
    className: "tk-price__list"
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: i === 0 ? "is-first" : ""
  }, /*#__PURE__*/React.createElement(Check, null), /*#__PURE__*/React.createElement("span", null, f)))));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Eyebrow({
  children,
  onDark = false,
  rule = true,
  className = "",
  ...rest
}) {
  useEyebrowStyles();
  const cls = ["tk-eyebrow", onDark ? "tk-on-dark" : "", rule ? "" : "tk-eyebrow--plain", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("p", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function KnightMark({
  size = 34,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 64 64",
    width: size,
    height: size,
    className: "tk-logo__mark",
    "aria-hidden": "true"
  }, rest), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "60",
    height: "60",
    rx: "15",
    fill: "var(--gold-500)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "60",
    height: "60",
    rx: "15",
    fill: "none",
    stroke: "var(--gold-600)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 32 C16 24 20 18 27 14 L31 7 L36 15 C41 17 45 22 44 27 L40 29 L45 33 L41 36 L45 40 C46 44 45 47 45 50 L23 50 C21 44 21 38 24 33 L17 33 L14 36 Z",
    fill: "var(--navy-950)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "25",
    cy: "23",
    r: "1.7",
    fill: "var(--gold-500)"
  }));
}

/** TriviaKnight lockup: knight mark + wordmark. Temporary placeholder brand. */
function Logo({
  size = "md",
  onDark = false,
  href,
  wordmark = true,
  className = "",
  ...rest
}) {
  useLogoStyles();
  const cls = ["tk-logo", `tk-logo--${size}`, onDark ? "tk-on-dark" : "", className].filter(Boolean).join(" ");
  const markPx = size === "sm" ? 28 : size === "lg" ? 44 : 34;
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KnightMark, {
    size: markPx
  }), wordmark && /*#__PURE__*/React.createElement("span", {
    className: "tk-logo__word"
  }, "Trivia", /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Knight")));
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      "aria-label": "TriviaKnight"
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), inner);
}
Object.assign(__ds_scope, { KnightMark, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/disclosure/AnnouncementBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-announce-styles";
const CSS = `
.tk-announce{background:var(--navy-950);color:var(--text-on-dark);font-family:var(--font-body);border-bottom:1px solid var(--surface-line-dark)}
.tk-announce__row{max-width:var(--container-max);margin:0 auto;padding:.6rem var(--gutter);display:flex;align-items:center;justify-content:center;gap:.75rem;position:relative}
.tk-announce__mark{color:var(--gold-400);display:inline-flex;flex:none}
.tk-announce__mark svg{width:1.05rem;height:1.05rem}
.tk-announce__text{font-size:.875rem;line-height:1.35;text-align:center}
.tk-announce__text b{color:var(--gold-300);font-weight:600}
.tk-announce__close{position:absolute;right:var(--gutter);top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-on-dark-muted);cursor:pointer;width:32px;height:32px;min-height:0;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-sm)}
.tk-announce__close:hover{color:var(--text-on-dark);background:rgba(255,255,255,.06)}
.tk-announce__close:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:2px}
.tk-announce__close svg{width:1rem;height:1rem}
`;
function useAnnounceStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Dismissible top-of-page announcement bar. Not a limited-time promo style. */
function AnnouncementBar({
  children,
  dismissible = true,
  onDismiss,
  className = "",
  ...rest
}) {
  useAnnounceStyles();
  const [open, setOpen] = React.useState(true);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tk-announce", className].filter(Boolean).join(" "),
    role: "region",
    "aria-label": "Announcement"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tk-announce__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tk-announce__mark",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "tk-announce__text"
  }, children), dismissible && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tk-announce__close",
    "aria-label": "Dismiss announcement",
    onClick: () => {
      setOpen(false);
      onDismiss && onDismiss();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })))));
}
Object.assign(__ds_scope, { AnnouncementBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/disclosure/AnnouncementBar.jsx", error: String((e && e.message) || e) }); }

// components/disclosure/FaqItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-faq-styles";
const CSS = `
.tk-faq{border-bottom:1px solid var(--surface-line)}
.tk-faq__btn{width:100%;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;text-align:left;padding:1.15rem 0;font-family:var(--font-display);font-weight:700;font-size:1.0625rem;color:var(--text-strong);letter-spacing:-.01em}
.tk-faq__btn:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-faq__icon{flex:none;width:1.5rem;height:1.5rem;border-radius:var(--radius-pill);border:1.5px solid var(--slate-300);display:inline-flex;align-items:center;justify-content:center;color:var(--accent-strong);transition:transform var(--dur-base) var(--ease-out),border-color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.tk-faq__icon svg{width:.9rem;height:.9rem}
.tk-faq[data-open=true] .tk-faq__icon{transform:rotate(45deg);background:var(--gold-200);border-color:var(--gold-400)}
.tk-faq__panel{overflow:hidden;transition:height var(--dur-base) var(--ease-out)}
.tk-faq__inner{padding:0 0 1.15rem;font-family:var(--font-body);font-size:.95rem;line-height:1.6;color:var(--text-body);max-width:60ch}
`;
function useFaqStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}
let _fc = 0;
/** Single accessible FAQ accordion row. Controlled or self-managed. */
function FaqItem({
  question,
  children,
  defaultOpen = false,
  open,
  onToggle,
  className = "",
  ...rest
}) {
  useFaqStyles();
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = open != null ? open : internal;
  const [id] = React.useState(() => `tk-faq-${++_fc}`);
  const panelRef = React.useRef(null);
  const [h, setH] = React.useState(isOpen ? "auto" : 0);
  React.useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    setH(isOpen ? node.scrollHeight : 0);
  }, [isOpen, children]);
  const toggle = () => {
    if (open == null) setInternal(v => !v);
    onToggle && onToggle(!isOpen);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tk-faq", className].filter(Boolean).join(" "),
    "data-open": isOpen
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tk-faq__btn",
    "aria-expanded": isOpen,
    "aria-controls": `${id}-p`,
    id: `${id}-b`,
    onClick: toggle
  }, /*#__PURE__*/React.createElement("span", null, question), /*#__PURE__*/React.createElement("span", {
    className: "tk-faq__icon",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "tk-faq__panel",
    id: `${id}-p`,
    role: "region",
    "aria-labelledby": `${id}-b`,
    style: {
      height: h === "auto" ? "auto" : `${h}px`
    },
    hidden: !isOpen && h === 0
  }, /*#__PURE__*/React.createElement("div", {
    className: "tk-faq__inner",
    ref: panelRef
  }, children)));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/disclosure/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/forms/BillingToggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-billing-styles";
const CSS = `
.tk-billing{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--font-body)}
.tk-billing__opt{font-size:.9rem;font-weight:600;color:var(--text-muted);transition:color var(--dur-base) var(--ease-out)}
.tk-billing__opt.is-active{color:var(--text-strong)}
.tk-billing.tk-on-dark .tk-billing__opt{color:var(--text-on-dark-muted)}
.tk-billing.tk-on-dark .tk-billing__opt.is-active{color:var(--text-on-dark)}
.tk-billing__track{position:relative;width:52px;height:28px;border-radius:var(--radius-pill);border:1.5px solid var(--slate-300);background:var(--surface-card);cursor:pointer;padding:0;flex:none;min-height:0;transition:border-color var(--dur-base) var(--ease-out)}
.tk-billing.tk-on-dark .tk-billing__track{background:var(--navy-800);border-color:var(--surface-line-dark)}
.tk-billing__track:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-billing__knob{position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:var(--gold-500);transition:transform var(--dur-base) var(--ease-out)}
.tk-billing__track[aria-checked=true] .tk-billing__knob{transform:translateX(24px)}
.tk-billing__save{font-family:var(--font-mono);font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--success);background:var(--success-soft);padding:.25rem .5rem;border-radius:var(--radius-pill)}
`;
function useBillingStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Monthly / annual billing switch. Controlled: pass `value` ("monthly"|"annual")
 * and `onChange`. Uncontrolled fallback keeps internal state.
 */
function BillingToggle({
  value,
  onChange,
  saveLabel = "2 months free",
  onDark = false,
  className = "",
  ...rest
}) {
  useBillingStyles();
  const [internal, setInternal] = React.useState(value || "monthly");
  const current = value != null ? value : internal;
  const annual = current === "annual";
  const toggle = () => {
    const next = annual ? "monthly" : "annual";
    if (value == null) setInternal(next);
    onChange && onChange(next);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tk-billing", onDark ? "tk-on-dark" : "", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: ["tk-billing__opt", !annual ? "is-active" : ""].join(" ")
  }, "Monthly"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": annual,
    "aria-label": "Toggle annual billing",
    className: "tk-billing__track",
    onClick: toggle
  }, /*#__PURE__*/React.createElement("span", {
    className: "tk-billing__knob"
  })), /*#__PURE__*/React.createElement("span", {
    className: ["tk-billing__opt", annual ? "is-active" : ""].join(" ")
  }, "Annual"), saveLabel && /*#__PURE__*/React.createElement("span", {
    className: "tk-billing__save"
  }, saveLabel));
}
Object.assign(__ds_scope, { BillingToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/BillingToggle.jsx", error: String((e && e.message) || e) }); }

// components/forms/fieldStyles.js
try { (() => {
const STYLE_ID = "tk-field-styles";
const CSS = `
.tk-field{display:flex;flex-direction:column;gap:.4rem;font-family:var(--font-body)}
.tk-field__label{font-size:.875rem;font-weight:600;color:var(--text-strong)}
.tk-field__req{color:var(--danger);margin-left:.15rem}
.tk-field__opt{font-weight:400;color:var(--text-muted);margin-left:.35rem}
.tk-field__hint{font-size:.8125rem;color:var(--text-muted);margin:0}
.tk-field__error{font-size:.8125rem;color:var(--danger);margin:0;display:flex;align-items:center;gap:.3rem}
.tk-input,.tk-textarea,.tk-select{font-family:var(--font-body);font-size:.95rem;color:var(--text-strong);background:var(--surface-card);border:1.5px solid var(--slate-300);border-radius:var(--radius-md);padding:.65rem .8rem;width:100%;box-sizing:border-box;transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)}
.tk-input::placeholder,.tk-textarea::placeholder{color:var(--text-faint)}
.tk-input:hover,.tk-textarea:hover,.tk-select:hover{border-color:var(--slate-400)}
.tk-input:focus,.tk-textarea:focus,.tk-select:focus{outline:none;border-color:var(--gold-500);box-shadow:0 0 0 3px rgba(227,168,56,.28)}
.tk-textarea{min-height:7rem;resize:vertical;line-height:1.5}
.tk-field--invalid .tk-input,.tk-field--invalid .tk-textarea,.tk-field--invalid .tk-select{border-color:var(--danger)}
.tk-field--invalid .tk-input:focus,.tk-field--invalid .tk-textarea:focus,.tk-field--invalid .tk-select:focus{box-shadow:0 0 0 3px rgba(179,63,50,.22)}
.tk-select-wrap{position:relative}
.tk-select-wrap svg{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);width:1.1rem;height:1.1rem;color:var(--text-muted);pointer-events:none}
.tk-select{appearance:none;padding-right:2.2rem}
`;
function useFieldStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}
let _idc = 0;
function useFieldId(explicit) {
  const [id] = React.useState(() => explicit || `tk-f-${++_idc}`);
  return explicit || id;
}
function FieldError() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16h.01"
  }));
}
Object.assign(__ds_scope, { useFieldStyles, useFieldId, FieldError });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/fieldStyles.js", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = "tk-checkbox-styles";
const CSS = `
.tk-check{display:flex;gap:.6rem;align-items:flex-start;font-family:var(--font-body);cursor:pointer}
.tk-check input{position:absolute;opacity:0;width:1px;height:1px;margin:0}
.tk-check__box{flex:none;width:1.2rem;height:1.2rem;min-height:0;border:1.5px solid var(--slate-400);border-radius:var(--radius-xs);background:var(--surface-card);display:inline-flex;align-items:center;justify-content:center;margin-top:.1rem;transition:background var(--dur-fast) var(--ease-out),border-color var(--dur-fast) var(--ease-out)}
.tk-check__box svg{width:.85rem;height:.85rem;color:var(--navy-950);opacity:0;transform:scale(.6);transition:opacity var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)}
.tk-check input:checked+.tk-check__box{background:var(--gold-500);border-color:var(--gold-600)}
.tk-check input:checked+.tk-check__box svg{opacity:1;transform:scale(1)}
.tk-check input:focus-visible+.tk-check__box{outline:var(--focus-width) solid var(--focus-ring);outline-offset:var(--focus-offset)}
.tk-check__label{font-size:.9rem;line-height:1.45;color:var(--text-body)}
.tk-check--invalid .tk-check__box{border-color:var(--danger)}
.tk-check__req{color:var(--danger);margin-left:.15rem}
`;
function useCheckboxStyles() {
  React.useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** Custom checkbox with a real underlying input. Use for the consent field. */
function Checkbox({
  label,
  children,
  required = false,
  error,
  id,
  className = "",
  ...rest
}) {
  useCheckboxStyles();
  const fid = __ds_scope.useFieldId(id);
  return /*#__PURE__*/React.createElement("label", {
    className: ["tk-check", error ? "tk-check--invalid" : "", className].filter(Boolean).join(" "),
    htmlFor: fid
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: fid,
    required: required,
    "aria-invalid": error ? true : undefined
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "tk-check__box",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "tk-check__label"
  }, label || children, required && /*#__PURE__*/React.createElement("span", {
    className: "tk-check__req",
    "aria-hidden": "true"
  }, "*")));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled text input with hint and error states. Accessible by default. */
function Input({
  label,
  hint,
  error,
  required = false,
  optional = false,
  id,
  className = "",
  ...rest
}) {
  __ds_scope.useFieldStyles();
  const fid = __ds_scope.useFieldId(id);
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: ["tk-field", error ? "tk-field--invalid" : "", className].filter(Boolean).join(" ")
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tk-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__req",
    "aria-hidden": "true"
  }, "*"), optional && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__opt"
  }, "(optional)")), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: "tk-input",
    required: required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [errId, hintId].filter(Boolean).join(" ") || undefined
  }, rest)), hint && !error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__hint",
    id: hintId
  }, hint), error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__error",
    id: errId
  }, /*#__PURE__*/React.createElement(__ds_scope.FieldError, null), error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chevron() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }));
}

/** Labelled native select. Pass `options` as strings or {value,label} objects. */
function Select({
  label,
  hint,
  error,
  required = false,
  optional = false,
  options = [],
  placeholder,
  id,
  className = "",
  children,
  ...rest
}) {
  __ds_scope.useFieldStyles();
  const fid = __ds_scope.useFieldId(id);
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: ["tk-field", error ? "tk-field--invalid" : "", className].filter(Boolean).join(" ")
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tk-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__req",
    "aria-hidden": "true"
  }, "*"), optional && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__opt"
  }, "(optional)")), /*#__PURE__*/React.createElement("div", {
    className: "tk-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: "tk-select",
    required: required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [errId, hintId].filter(Boolean).join(" ") || undefined,
    defaultValue: placeholder ? "" : undefined
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map((o, i) => {
    const val = typeof o === "string" ? o : o.value;
    const lbl = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: i,
      value: val
    }, lbl);
  }), children), /*#__PURE__*/React.createElement(Chevron, null)), hint && !error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__hint",
    id: hintId
  }, hint), error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__error",
    id: errId
  }, /*#__PURE__*/React.createElement(__ds_scope.FieldError, null), error));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled multi-line text area with hint and error states. */
function Textarea({
  label,
  hint,
  error,
  required = false,
  optional = false,
  id,
  className = "",
  ...rest
}) {
  __ds_scope.useFieldStyles();
  const fid = __ds_scope.useFieldId(id);
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: ["tk-field", error ? "tk-field--invalid" : "", className].filter(Boolean).join(" ")
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tk-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__req",
    "aria-hidden": "true"
  }, "*"), optional && /*#__PURE__*/React.createElement("span", {
    className: "tk-field__opt"
  }, "(optional)")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    className: "tk-textarea",
    required: required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [errId, hintId].filter(Boolean).join(" ") || undefined
  }, rest)), hint && !error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__hint",
    id: hintId
  }, hint), error && /*#__PURE__*/React.createElement("p", {
    className: "tk-field__error",
    id: errId
  }, /*#__PURE__*/React.createElement(__ds_scope.FieldError, null), error));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/HowItWorks.jsx
try { (() => {
/* Dedicated /how-it-works page. Content grounded strictly in the confirmed
 * TriviaKnight (Trivia Knight) workflow from CLAUDE.md. No invented capabilities:
 * no QR joining, AI, analytics dashboards, white-label, or multi-venue claims. */
(function () {
  const NS = window.TriviaKnightDesignSystem_88085a;
  const {
    Button,
    Logo,
    Eyebrow,
    Badge
  } = NS;
  const {
    ROUTES,
    CONTACT_EMAIL,
    track
  } = window.TKC;
  const CSS = `
  .hw{font-family:var(--font-body);color:var(--text-body);background:var(--surface-content)}
  .hw-ct{max-width:var(--container-max);margin:0 auto;padding:0 var(--gutter)}
  .hw-narrow{max-width:var(--container-narrow)}
  .hw-nav{position:sticky;top:0;z-index:40;background:rgba(11,17,32,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--surface-line-dark)}
  .hw-nav__row{display:flex;align-items:center;gap:1rem;height:66px}
  .hw-nav__row .sp{flex:1}
  .hw-crumb{background:var(--surface-content-alt);border-bottom:1px solid var(--surface-line)}
  .hw-crumb ol{max-width:var(--container-max);margin:0 auto;padding:.75rem var(--gutter);display:flex;gap:.5rem;list-style:none;font-size:.85rem;color:var(--text-muted)}
  .hw-crumb a{color:var(--link);text-decoration:none}
  .hw-crumb a:hover{text-decoration:underline}
  .hw-hero{background:var(--surface-canvas);color:var(--text-on-dark);padding:clamp(3rem,6vw,5.5rem) 0}
  .hw-hero h1{font-family:var(--font-display);font-weight:900;font-size:var(--text-5xl);line-height:1.05;letter-spacing:-.03em;margin:1rem 0 0;max-width:18ch;text-wrap:balance}
  .hw-hero p{font-size:var(--text-lg);color:var(--text-on-dark-muted);max-width:56ch;margin:1.25rem 0 0;line-height:1.5}
  .hw-sec{padding:clamp(3rem,6vw,5rem) 0}
  .hw-h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-3xl);letter-spacing:-.02em;color:var(--text-strong);margin:.4rem 0 0}
  .hw-lead{font-size:var(--text-md);color:var(--text-muted);max-width:60ch;margin:1rem 0 0;line-height:1.6}
  .hw-steps{display:flex;flex-direction:column;gap:1.25rem;margin-top:2.5rem;counter-reset:step}
  .hw-step{display:grid;grid-template-columns:auto 1fr;gap:1.25rem;background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem}
  .hw-step__n{counter-increment:step;font-family:var(--font-display);font-weight:800;font-size:1.1rem;width:2.5rem;height:2.5rem;border-radius:var(--radius-md);background:var(--navy-900);color:var(--gold-400);display:inline-flex;align-items:center;justify-content:center}
  .hw-step__n::before{content:counter(step)}
  .hw-step h3{font-family:var(--font-display);font-weight:700;font-size:1.2rem;letter-spacing:-.01em;color:var(--text-strong);margin:.2rem 0 0}
  .hw-step p{margin:.5rem 0 0;line-height:1.6;font-size:.95rem}
  .hw-step ul{margin:.7rem 0 0;padding-left:1.1rem;font-size:.92rem;line-height:1.55;color:var(--text-body)}
  .hw-step ul li{margin:.2rem 0}
  .hw-alt{background:var(--surface-content-alt)}
  .hw-two{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
  .hw-panel{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.75rem}
  .hw-panel h3{font-family:var(--font-display);font-weight:700;font-size:1.25rem;color:var(--text-strong);margin:.5rem 0 0;letter-spacing:-.01em}
  .hw-panel ul{margin:1rem 0 0;padding-left:1.1rem;line-height:1.6;font-size:.95rem}
  .hw-cta{background:var(--surface-canvas);color:var(--text-on-dark);text-align:center;padding:clamp(3rem,6vw,5rem) 0}
  .hw-cta h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-3xl);letter-spacing:-.02em;margin:0}
  .hw-cta p{color:var(--text-on-dark-muted);max-width:50ch;margin:1rem auto 0;font-size:var(--text-md)}
  .hw-cta__row{display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;margin-top:1.75rem}
  .hw-foot{background:var(--surface-canvas-deep);color:var(--text-on-dark-muted);padding:2rem 0;border-top:1px solid var(--surface-line-dark)}
  .hw-foot__row{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center;font-size:.85rem}
  .hw-foot a{color:var(--gold-300);text-decoration:none}
  @media (max-width:860px){.hw-two{grid-template-columns:1fr}}
  @media (max-width:640px){.hw-step{grid-template-columns:1fr}}
  `;
  const STEPS = [{
    h: "Build your game and rounds",
    p: "Create a trivia game and organize it into clearly structured rounds. Round count, the number of questions per round, and the points each round is worth are all yours to set.",
    extra: null
  }, {
    h: "Add and edit your questions",
    p: "Write your own questions and set the correct answers and point values. TriviaKnight supports:",
    extra: ["Multiple-choice questions", "Multi-select questions with more than one correct answer", "Written-answer questions that are graded automatically", "Optional image or video clues on a question"]
  }, {
    h: "Run the room from the host desk",
    p: "Open the lobby, then move the game forward at your pace. From the host controls you can:",
    extra: ["Advance from lobby to each question, reveal, break, and the final", "Run the countdown timer and watch how many teams have locked in", "Reveal answers manually, or force a reveal when you are ready", "Settle a tie for first place with a sudden-death question", "Make manual score corrections at any point"]
  }, {
    h: "Let teams join and lock in",
    p: "Teams join from their own devices at the game link, choose or type a team name, and add one to four players. During each question they select their answer and lock it in before the timer runs out.",
    extra: null
  }, {
    h: "Put the game on the big screen",
    p: "The presenter view is a clean, read-only display for the room. It shows the lobby and joined teams, the live question with its choices, the reveal with the correct answer, standings between rounds, and the final winner.",
    extra: null
  }];
  function Nav() {
    return /*#__PURE__*/React.createElement("header", {
      className: "hw-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct hw-nav__row"
    }, /*#__PURE__*/React.createElement(Logo, {
      href: "/",
      size: "sm",
      onDark: true
    }), /*#__PURE__*/React.createElement("span", {
      className: "sp"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onDark: true,
      href: ROUTES.logIn
    }, "Log In"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      href: ROUTES.startHosting
    }, "Start Hosting")));
  }
  function HowItWorks() {
    return /*#__PURE__*/React.createElement("div", {
      className: "hw"
    }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement("nav", {
      className: "hw-crumb",
      "aria-label": "Breadcrumb"
    }, /*#__PURE__*/React.createElement("ol", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "Home")), /*#__PURE__*/React.createElement("li", {
      "aria-hidden": "true"
    }, "/"), /*#__PURE__*/React.createElement("li", {
      "aria-current": "page"
    }, "How It Works"))), /*#__PURE__*/React.createElement("section", {
      className: "hw-hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      onDark: true
    }, "How TriviaKnight works"), /*#__PURE__*/React.createElement("h1", null, "From your questions to a live trivia night."), /*#__PURE__*/React.createElement("p", null, "TriviaKnight brings the game builder and the live host controls together. Build your rounds, run the game at your own pace, and put the whole thing on the big screen for the room."))), /*#__PURE__*/React.createElement("section", {
      className: "hw-sec"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-narrow"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "The workflow"), /*#__PURE__*/React.createElement("h2", {
      className: "hw-h2"
    }, "Five steps to a hosted game."), /*#__PURE__*/React.createElement("p", {
      className: "hw-lead"
    }, "Everything here reflects how TriviaKnight works today. Each step maps to a part of the product you use on the night.")), /*#__PURE__*/React.createElement("div", {
      className: "hw-steps"
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement("div", {
      className: "hw-step",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "hw-step__n",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, s.h), /*#__PURE__*/React.createElement("p", null, s.p), s.extra && /*#__PURE__*/React.createElement("ul", null, s.extra.map(x => /*#__PURE__*/React.createElement("li", {
      key: x
    }, x))))))))), /*#__PURE__*/React.createElement("section", {
      className: "hw-sec hw-alt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-narrow"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "During and after the game"), /*#__PURE__*/React.createElement("h2", {
      className: "hw-h2"
    }, "What the room sees, and what you keep.")), /*#__PURE__*/React.createElement("div", {
      className: "hw-two",
      style: {
        marginTop: "2.5rem"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-panel"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "soft"
    }, "Live experience"), /*#__PURE__*/React.createElement("h3", null, "A shared game, in real time"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Teams answer on their phones while the presenter screen leads the room."), /*#__PURE__*/React.createElement("li", null, "The host desk shows the timer, lock-in count, and which teams are still answering."), /*#__PURE__*/React.createElement("li", null, "Scores are finalized on each reveal and the leaderboard updates for everyone."))), /*#__PURE__*/React.createElement("div", {
      className: "hw-panel"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "soft"
    }, "After the game"), /*#__PURE__*/React.createElement("h3", null, "Standings and a clean record"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The final leaderboard ranks teams by score, breaking ties by who locked in fastest."), /*#__PURE__*/React.createElement("li", null, "A printable answer key lists every question and answer, grouped by round."), /*#__PURE__*/React.createElement("li", null, "Your questions and rounds stay saved and live-editable for next time.")))))), /*#__PURE__*/React.createElement("section", {
      className: "hw-cta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct"
    }, /*#__PURE__*/React.createElement("h2", null, "Ready to build your first game?"), /*#__PURE__*/React.createElement("p", null, "Start hosting and put your rounds together, or see the plans to find the right tools for your venue."), /*#__PURE__*/React.createElement("div", {
      className: "hw-cta__row"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      href: ROUTES.startHosting,
      onClick: () => track("hero_cta_clicked", {
        cta: "start_hosting",
        location: "how_it_works"
      })
    }, "Start Hosting"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "lg",
      onDark: true,
      href: "/#pricing"
    }, "Explore Pricing")))), /*#__PURE__*/React.createElement("footer", {
      className: "hw-foot"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hw-ct hw-foot__row"
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " TriviaKnight. Trivia night software for hosts, venues, and event teams."), /*#__PURE__*/React.createElement("a", {
      href: `mailto:${CONTACT_EMAIL}`
    }, CONTACT_EMAIL))));
  }
  if (!document.getElementById("hw-styles")) {
    const el = document.createElement("style");
    el.id = "hw-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
  window.HowItWorks = HowItWorks;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/HowItWorks.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/MarketingSite.jsx
try { (() => {
/* TriviaKnight marketing website — all sections, composed from the design-system
 * components (window.TriviaKnightDesignSystem_88085a) + config (window.TKC) +
 * the hero mockup (window.ProductMockup). Mounted by index.html. */
(function () {
  const NS = window.TriviaKnightDesignSystem_88085a;
  const {
    Button,
    Logo,
    Badge,
    Eyebrow,
    FeatureCard,
    UseCaseCard,
    PricingCard,
    BillingToggle,
    FaqItem,
    AnnouncementBar,
    Input,
    Textarea,
    Select,
    Checkbox
  } = NS;
  const {
    ROUTES,
    CONTACT_EMAIL,
    NAV,
    PLANS,
    FEATURES,
    USE_CASES,
    FAQS,
    COMPARISON,
    USE_CASE_OPTIONS,
    track
  } = window.TKC;
  const ProductMockup = window.ProductMockup;
  const CSS = `
  .tk-site{font-family:var(--font-body);color:var(--text-body);background:var(--surface-content)}
  .tk-ct{max-width:var(--container-max);margin:0 auto;padding-left:var(--gutter);padding-right:var(--gutter)}
  .tk-sec{padding-top:var(--section-pad-y);padding-bottom:var(--section-pad-y)}
  .tk-dark{background:var(--surface-canvas);color:var(--text-on-dark)}
  .tk-h2{font-family:var(--font-display);font-weight:800;font-size:var(--text-4xl);line-height:var(--leading-tight);letter-spacing:-.02em;color:var(--text-strong);margin:.4rem 0 0;text-wrap:balance}
  .tk-dark .tk-h2{color:var(--text-on-dark)}
  .tk-lead{font-size:var(--text-lg);line-height:var(--leading-normal);color:var(--text-muted);max-width:56ch;margin:1rem 0 0}
  .tk-dark .tk-lead{color:var(--text-on-dark-muted)}
  .tk-head{max-width:60ch}
  .tk-center{text-align:center;margin-left:auto;margin-right:auto}
  .tk-center .tk-lead{margin-left:auto;margin-right:auto}
  .tk-a{color:var(--link);text-decoration:none;font-weight:600}
  .tk-a:hover{color:var(--link-hover);text-decoration:underline}
  /* nav */
  .tk-nav{position:sticky;top:0;z-index:40;background:rgba(11,17,32,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--surface-line-dark)}
  .tk-nav__row{display:flex;align-items:center;gap:1.25rem;height:66px}
  .tk-nav__links{display:flex;align-items:center;gap:.35rem;margin-left:1rem}
  .tk-nav__link{font-size:.9rem;font-weight:500;color:var(--text-on-dark-muted);text-decoration:none;padding:.5rem .6rem;border-radius:var(--radius-sm)}
  .tk-nav__link:hover{color:var(--text-on-dark);background:rgba(255,255,255,.06)}
  .tk-nav__spacer{flex:1}
  .tk-nav__actions{display:flex;align-items:center;gap:.6rem}
  .tk-nav__burger{display:none;background:none;border:1px solid var(--surface-line-dark);border-radius:var(--radius-sm);width:42px;height:42px;color:var(--text-on-dark);align-items:center;justify-content:center;cursor:pointer}
  .tk-nav__burger:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:2px}
  .tk-mobile{display:none;flex-direction:column;gap:.25rem;padding:.5rem var(--gutter) 1rem;background:var(--navy-900);border-bottom:1px solid var(--surface-line-dark)}
  .tk-mobile a{color:var(--text-on-dark-muted);text-decoration:none;padding:.7rem .5rem;border-radius:var(--radius-sm);font-weight:500}
  .tk-mobile a:hover{background:rgba(255,255,255,.06);color:var(--text-on-dark)}
  .tk-mobile__cta{display:flex;gap:.6rem;margin-top:.6rem}
  /* hero */
  .tk-hero{background:var(--surface-canvas);color:var(--text-on-dark);position:relative;overflow:hidden}
  .tk-hero__grid{display:grid;grid-template-columns:1.05fr 1.15fr;gap:clamp(2rem,4vw,4rem);align-items:center}
  .tk-hero h1{font-family:var(--font-display);font-weight:900;font-size:var(--text-5xl);line-height:var(--leading-tight);letter-spacing:-.03em;margin:1rem 0 0;text-wrap:balance}
  .tk-hero__sub{font-size:var(--text-lg);line-height:var(--leading-normal);color:var(--text-on-dark-muted);max-width:48ch;margin:1.25rem 0 0}
  .tk-hero__cta{display:flex;flex-wrap:wrap;gap:.85rem;margin-top:1.75rem}
  .tk-hero__proof{margin-top:1.5rem;font-size:.9rem;color:var(--text-on-dark-faint);display:flex;align-items:center;gap:.5rem}
  .tk-hero__proof b{color:var(--gold-300);font-weight:600}
  .tk-hero__glow{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(227,168,56,.16),transparent 68%);top:-160px;right:-120px;pointer-events:none}
  /* generic grids */
  .tk-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
  .tk-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}
  .tk-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
  /* differentiation */
  .tk-diff__list{display:grid;grid-template-columns:1fr 1fr;gap:.75rem 1.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
  .tk-diff__list li{display:flex;align-items:center;gap:.6rem;font-size:1rem;font-weight:500;color:var(--text-strong)}
  .tk-diff__list li svg{color:var(--success);flex:none}
  .tk-highlight{margin-top:2rem;background:var(--navy-900);color:var(--text-on-dark);border-radius:var(--radius-xl);padding:1.5rem 1.75rem;border-left:4px solid var(--gold-500);font-family:var(--font-display);font-weight:700;font-size:var(--text-xl);line-height:1.35;letter-spacing:-.01em}
  .tk-highlight b{color:var(--gold-300)}
  /* pricing */
  .tk-price__toggle{display:flex;justify-content:center;margin:2rem 0 2.5rem}
  .tk-price__note{text-align:center;margin-top:2rem}
  .tk-price__cap{font-family:var(--font-display);font-weight:800;font-size:var(--text-xl);color:var(--text-strong);letter-spacing:-.01em;max-width:44ch;margin:0 auto;text-wrap:balance}
  .tk-price__usd{font-family:var(--font-mono);font-size:.8rem;color:var(--text-muted);margin-top:.6rem}
  /* comparison */
  .tk-cmp{width:100%;border-collapse:collapse;margin-top:2rem}
  .tk-cmp th,.tk-cmp td{text-align:left;padding:.8rem 1rem;border-bottom:1px solid var(--surface-line);font-size:.9rem}
  .tk-cmp thead th{position:sticky;top:66px;background:var(--surface-content);font-family:var(--font-display);font-size:1rem;color:var(--text-strong);z-index:1}
  .tk-cmp thead th.tk-cmp__feat{color:var(--gold-700)}
  .tk-cmp__group td{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;font-weight:600;color:var(--text-muted);background:var(--surface-content-alt);padding-top:.9rem;padding-bottom:.9rem}
  .tk-cmp td.tk-cmp__val{text-align:center;width:150px}
  .tk-cmp__yes{color:var(--success)}
  .tk-cmp__no{color:var(--slate-300)}
  .tk-cmp__txt{font-weight:600;color:var(--text-strong)}
  .tk-cmp-cards{display:none;flex-direction:column;gap:1.25rem;margin-top:2rem}
  .tk-cmp-card{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden}
  .tk-cmp-card__h{font-family:var(--font-display);font-weight:800;font-size:1.1rem;color:var(--text-strong);padding:1rem 1.1rem;border-bottom:1px solid var(--surface-line)}
  .tk-cmp-card__grp{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.08em;font-size:.7rem;font-weight:600;color:var(--text-muted);padding:.8rem 1.1rem .3rem}
  .tk-cmp-row{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 1.1rem;font-size:.9rem}
  .tk-cmp-row span:first-child{color:var(--text-body)}
  /* callout */
  .tk-callout{text-align:center;position:relative;overflow:hidden}
  .tk-callout .tk-h2{margin-bottom:.5rem}
  .tk-callout__glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 120%,rgba(227,168,56,.14),transparent 60%);pointer-events:none}
  /* faq */
  .tk-faq-wrap{max-width:var(--container-narrow);margin:2.5rem auto 0}
  /* contact */
  .tk-contact__grid{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(2rem,4vw,4rem);align-items:start}
  .tk-form{background:var(--surface-card);border:1px solid var(--surface-line);border-radius:var(--radius-xl);box-shadow:var(--shadow-md);padding:clamp(1.5rem,3vw,2.25rem)}
  .tk-form__grid{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem}
  .tk-form__full{grid-column:1/-1}
  .tk-form__hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
  .tk-success{text-align:center;padding:2rem 1rem}
  .tk-success__ic{width:56px;height:56px;border-radius:50%;background:var(--success-soft);color:var(--success);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem}
  .tk-alert{background:#fbecea;border:1px solid #e7b7b0;color:var(--red-600);border-radius:var(--radius-md);padding:.8rem 1rem;font-size:.9rem;margin-bottom:1.1rem}
  .tk-alert a{color:var(--red-600);font-weight:600}
  .tk-contact__aside p{margin:.75rem 0 0}
  .tk-contact__email{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--font-mono);font-size:1rem;color:var(--text-strong);font-weight:600;margin-top:.5rem}
  /* footer */
  .tk-footer{background:var(--surface-canvas-deep);color:var(--text-on-dark-muted);padding-top:3.5rem;padding-bottom:2rem;border-top:1px solid var(--surface-line-dark)}
  .tk-footer__top{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:2rem}
  .tk-footer__desc{font-size:.92rem;line-height:1.6;max-width:34ch;margin:1rem 0 0}
  .tk-footer__col h4{font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.1em;font-size:.72rem;color:var(--text-on-dark-faint);margin:0 0 1rem;font-weight:600}
  .tk-footer__col a{display:block;color:var(--text-on-dark-muted);text-decoration:none;font-size:.9rem;padding:.3rem 0}
  .tk-footer__col a:hover{color:var(--gold-300)}
  .tk-footer__bottom{display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;align-items:center;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--surface-line-dark);font-size:.85rem}
  .tk-footer__pos{color:var(--text-on-dark-faint);max-width:52ch}
  .tk-feat-ico svg,.tk-uc-ico svg{width:1.4rem;height:1.4rem}
  /* responsive */
  @media (max-width:960px){
    .tk-hero__grid,.tk-contact__grid{grid-template-columns:1fr}
    .tk-grid-3,.tk-grid-4{grid-template-columns:1fr 1fr}
    .tk-nav__links{display:none}
    .tk-nav__actions .tk-hide-sm{display:none}
    .tk-nav__burger{display:inline-flex}
    .tk-footer__top{grid-template-columns:1fr 1fr}
  }
  @media (max-width:760px){
    .tk-cmp{display:none}
    .tk-cmp-cards{display:flex}
    .tk-diff__list,.tk-grid-2{grid-template-columns:1fr}
  }
  @media (max-width:560px){
    .tk-grid-3,.tk-grid-4{grid-template-columns:1fr}
    .tk-form__grid{grid-template-columns:1fr}
    .tk-footer__top{grid-template-columns:1fr}
  }
  `;
  const Ico = ({
    name,
    cls
  }) => /*#__PURE__*/React.createElement("span", {
    className: cls
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name
  }));
  const Check = ({
    s = 18
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: s,
    height: s,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }));
  function money(n) {
    return "$" + n;
  }

  /* ---------------- Nav ---------------- */
  function NavBar() {
    const [open, setOpen] = React.useState(false);
    return /*#__PURE__*/React.createElement("header", {
      className: "tk-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-nav__row"
    }, /*#__PURE__*/React.createElement(Logo, {
      href: "#top",
      size: "sm",
      onDark: true
    }), /*#__PURE__*/React.createElement("nav", {
      className: "tk-nav__links",
      "aria-label": "Primary"
    }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
      key: n.label,
      className: "tk-nav__link",
      href: n.href
    }, n.label))), /*#__PURE__*/React.createElement("div", {
      className: "tk-nav__spacer"
    }), /*#__PURE__*/React.createElement("div", {
      className: "tk-nav__actions"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onDark: true,
      className: "tk-hide-sm",
      href: ROUTES.logIn,
      onClick: () => track("login_clicked", {
        location: "nav"
      })
    }, "Log In"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      href: ROUTES.startHosting,
      onClick: () => track("hero_cta_clicked", {
        location: "nav",
        cta: "start_hosting"
      })
    }, "Start Hosting"), /*#__PURE__*/React.createElement("button", {
      className: "tk-nav__burger",
      "aria-label": "Menu",
      "aria-expanded": open,
      onClick: () => setOpen(v => !v)
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "20",
      height: "20",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round"
    }, open ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M18 6 6 18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m6 6 12 12"
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M4 6h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 12h16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4 18h16"
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "tk-mobile",
      style: {
        display: open ? "flex" : "none"
      }
    }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
      key: n.label,
      href: n.href,
      onClick: () => setOpen(false)
    }, n.label)), /*#__PURE__*/React.createElement("div", {
      className: "tk-mobile__cta"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      onDark: true,
      block: true,
      href: ROUTES.logIn
    }, "Log In"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      block: true,
      href: ROUTES.startHosting
    }, "Start Hosting"))));
  }

  /* ---------------- Hero ---------------- */
  function Hero() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-hero",
      id: "top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-hero__glow"
    }), /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-sec tk-hero__grid"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
      onDark: true
    }, "Trivia night software built for hosts"), /*#__PURE__*/React.createElement("h1", null, "Build and host unlimited trivia nights."), /*#__PURE__*/React.createElement("p", {
      className: "tk-hero__sub"
    }, "Create polished quiz nights, organize every round, and run the live show from one place. Your subscription includes unlimited games, so you can host as often as your crowd keeps coming back."), /*#__PURE__*/React.createElement("div", {
      className: "tk-hero__cta"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      href: ROUTES.startHosting,
      onClick: () => track("hero_cta_clicked", {
        cta: "start_hosting"
      })
    }, "Start Hosting"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "lg",
      onDark: true,
      href: ROUTES.howItWorks,
      onClick: () => track("hero_cta_clicked", {
        cta: "how_it_works"
      })
    }, "See How It Works")), /*#__PURE__*/React.createElement("p", {
      className: "tk-hero__proof"
    }, /*#__PURE__*/React.createElement("b", null, "No event credits. No per-game fees."), " No limit on how often you host.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProductMockup, null))));
  }

  /* ---------------- Differentiation ---------------- */
  function Differentiation() {
    const items = ["Unlimited trivia nights", "Unlimited saved games", "Unlimited custom questions", "Unlimited reuse of rounds and question sets"];
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-head"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "The unlimited difference"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Host more trivia, not more subscription math."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "Most trivia hosts do not run identical schedules. Some host once a month. Others run several events every week. TriviaKnight does not punish active hosts for using the product more often.")), /*#__PURE__*/React.createElement("ul", {
      className: "tk-diff__list"
    }, items.map(t => /*#__PURE__*/React.createElement("li", {
      key: t
    }, /*#__PURE__*/React.createElement(Check, null), t))), /*#__PURE__*/React.createElement("p", {
      className: "tk-highlight"
    }, "Your plan determines the tools you receive, ", /*#__PURE__*/React.createElement("b", null, "not how many times you are allowed to use them."))));
  }

  /* ---------------- How it works preview ---------------- */
  function HowItWorksPreview() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      style: {
        background: "var(--surface-content-alt)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-center tk-head"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "How it works"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "From your game to the live room."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "Build your questions and rounds, run the game from the host desk, and put it on the big screen for the room. See the full walkthrough on the How It Works page."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "1.75rem"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      href: ROUTES.howItWorks,
      onClick: () => track("how_it_works_clicked", {
        location: "preview"
      })
    }, "See How TriviaKnight Works"))));
  }

  /* ---------------- Features ---------------- */
  function Features() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      id: "features"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-head tk-center"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "Features"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Everything a trivia host needs to run the room.")), /*#__PURE__*/React.createElement("div", {
      className: "tk-grid-4",
      style: {
        marginTop: "2.5rem"
      }
    }, FEATURES.map(f => /*#__PURE__*/React.createElement(FeatureCard, {
      key: f.title,
      title: f.title,
      premium: f.premium,
      icon: /*#__PURE__*/React.createElement(Ico, {
        name: f.icon,
        cls: "tk-feat-ico"
      })
    }, f.body)))));
  }

  /* ---------------- Use cases ---------------- */
  function UseCases() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      id: "use-cases",
      style: {
        background: "var(--surface-content-alt)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-head tk-center"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "Use cases"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Built for the people bringing trivia to the crowd.")), /*#__PURE__*/React.createElement("div", {
      className: "tk-grid-3",
      style: {
        marginTop: "2.5rem"
      }
    }, USE_CASES.map(u => /*#__PURE__*/React.createElement(UseCaseCard, {
      key: u.title,
      title: u.title,
      href: u.href,
      icon: /*#__PURE__*/React.createElement(Ico, {
        name: u.icon,
        cls: "tk-uc-ico"
      })
    }, u.body)))));
  }

  /* ---------------- Pricing ---------------- */
  function Pricing() {
    const [billing, setBilling] = React.useState("monthly");
    const annual = billing === "annual";
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      id: "pricing"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-head tk-center"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Simple plans. Unlimited trivia nights."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "Every paid plan includes unlimited games, questions, and hosted events. Choose your plan based on the tools, branding, and team support you need.")), /*#__PURE__*/React.createElement("div", {
      className: "tk-price__toggle"
    }, /*#__PURE__*/React.createElement(BillingToggle, {
      value: billing,
      onChange: v => {
        setBilling(v);
        track("billing_frequency_changed", {
          frequency: v
        });
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "tk-grid-3"
    }, PLANS.map(p => /*#__PURE__*/React.createElement(PricingCard, {
      key: p.id,
      name: p.name,
      featured: p.featured,
      badgeLabel: p.badge,
      price: money(annual ? p.annual : p.monthly),
      period: annual ? "/yr" : "/mo",
      sublabel: annual ? `${money(p.annual)} billed yearly` : `${money(p.annual)} billed yearly saves 2 months`,
      description: p.description,
      features: p.features,
      ctaLabel: p.cta,
      ctaHref: p.href,
      onClickCapture: () => track("pricing_cta_clicked", {
        plan: p.id,
        billing
      })
    }))), /*#__PURE__*/React.createElement("div", {
      className: "tk-price__note"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tk-price__cap"
    }, "There is no cap on the number of trivia nights you can host on any paid plan."), /*#__PURE__*/React.createElement("p", {
      className: "tk-price__usd"
    }, "Prices shown in USD. Cancel any time.")), /*#__PURE__*/React.createElement(Comparison, null)));
  }

  /* ---------------- Comparison ---------------- */
  function Val({
    v
  }) {
    if (v === true) return /*#__PURE__*/React.createElement("span", {
      className: "tk-cmp__yes",
      "aria-label": "Included"
    }, /*#__PURE__*/React.createElement(Check, {
      s: 17
    }));
    if (v === false) return /*#__PURE__*/React.createElement("span", {
      className: "tk-cmp__no",
      "aria-label": "Not included"
    }, "\u2014");
    return /*#__PURE__*/React.createElement("span", {
      className: "tk-cmp__txt"
    }, v);
  }
  function Comparison() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "4rem"
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "tk-h2",
      style: {
        fontSize: "var(--text-2xl)",
        textAlign: "center"
      }
    }, "Compare every plan"), /*#__PURE__*/React.createElement("table", {
      className: "tk-cmp"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "tk-cmp__feat"
    }, "Feature"), /*#__PURE__*/React.createElement("th", {
      className: "tk-cmp__val",
      style: {
        textAlign: "center"
      }
    }, "Host"), /*#__PURE__*/React.createElement("th", {
      className: "tk-cmp__val",
      style: {
        textAlign: "center"
      }
    }, "Pro Host"), /*#__PURE__*/React.createElement("th", {
      className: "tk-cmp__val",
      style: {
        textAlign: "center"
      }
    }, "Venue & Teams"))), /*#__PURE__*/React.createElement("tbody", null, COMPARISON.map(g => /*#__PURE__*/React.createElement(React.Fragment, {
      key: g.group
    }, /*#__PURE__*/React.createElement("tr", {
      className: "tk-cmp__group"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 4
    }, g.group)), g.rows.map(r => /*#__PURE__*/React.createElement("tr", {
      key: r.label
    }, /*#__PURE__*/React.createElement("td", null, r.label), /*#__PURE__*/React.createElement("td", {
      className: "tk-cmp__val"
    }, /*#__PURE__*/React.createElement(Val, {
      v: r.host
    })), /*#__PURE__*/React.createElement("td", {
      className: "tk-cmp__val"
    }, /*#__PURE__*/React.createElement(Val, {
      v: r.pro
    })), /*#__PURE__*/React.createElement("td", {
      className: "tk-cmp__val"
    }, /*#__PURE__*/React.createElement(Val, {
      v: r.venue
    })))))))), /*#__PURE__*/React.createElement("div", {
      className: "tk-cmp-cards"
    }, [["Host", "host"], ["Pro Host", "pro"], ["Venue & Teams", "venue"]].map(([name, key]) => /*#__PURE__*/React.createElement("div", {
      className: "tk-cmp-card",
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-cmp-card__h"
    }, name), COMPARISON.map(g => /*#__PURE__*/React.createElement("div", {
      key: g.group
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-cmp-card__grp"
    }, g.group), g.rows.map(r => /*#__PURE__*/React.createElement("div", {
      className: "tk-cmp-row",
      key: r.label
    }, /*#__PURE__*/React.createElement("span", null, r.label), /*#__PURE__*/React.createElement(Val, {
      v: r[key]
    })))))))));
  }

  /* ---------------- Unlimited callout ---------------- */
  function Callout() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec tk-dark tk-callout"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-callout__glow"
    }), /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-center tk-head",
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      onDark: true,
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "Unlimited hosting"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Your best month should not cost more."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "When your trivia business grows, you should be able to say yes to another event without wondering whether it will use up your plan. TriviaKnight gives every paid customer unlimited trivia nights from day one."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "1.75rem"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      href: ROUTES.startHosting,
      onClick: () => track("hero_cta_clicked", {
        cta: "build_first_game",
        location: "callout"
      })
    }, "Build Your First Game"))));
  }

  /* ---------------- FAQ ---------------- */
  function FAQ() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      id: "faq"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-head tk-center"
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      rule: false,
      style: {
        justifyContent: "center"
      }
    }, "FAQ"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Questions, answered.")), /*#__PURE__*/React.createElement("div", {
      className: "tk-faq-wrap"
    }, FAQS.map((f, i) => /*#__PURE__*/React.createElement(FaqItem, {
      key: i,
      question: f.q,
      defaultOpen: i === 0
    }, f.a)))));
  }

  /* ---------------- Contact ---------------- */
  function Contact() {
    const [status, setStatus] = React.useState("idle"); // idle | loading | success | error
    const [errors, setErrors] = React.useState({});
    const started = React.useRef(false);
    const onStart = () => {
      if (!started.current) {
        started.current = true;
        track("contact_form_started");
      }
    };
    function validate(fd) {
      const e = {};
      if (!fd.get("name").trim()) e.name = "Please enter your name.";
      const email = fd.get("email").trim();
      if (!email) e.email = "Please enter your email.";else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
      if (!fd.get("useCase")) e.useCase = "Select how you run trivia.";
      if (!fd.get("message").trim()) e.message = "Please add a short message.";
      if (!fd.get("consent")) e.consent = "Please agree to the privacy policy.";
      return e;
    }
    async function onSubmit(ev) {
      ev.preventDefault();
      const form = ev.target;
      const fd = new FormData(form);
      // Honeypot: if filled, silently succeed without sending.
      if (fd.get("company_website")) {
        setStatus("success");
        return;
      }
      const e = validate(fd);
      setErrors(e);
      if (Object.keys(e).length) return;
      setStatus("loading");
      track("contact_form_submitted", {
        useCase: fd.get("useCase")
      });
      try {
        // TODO(contact): POST to the server contact endpoint (Firebase Function
        // / App Hosting route) which sends via Resend. See README. No API keys
        // in the browser. Reply-to = visitor email; subject "TriviaKnight
        // website inquiry from [Name]". Demo mock below:
        await new Promise(res => setTimeout(res, 1100));
        setStatus("success");
      } catch (err) {
        track("contact_form_failed");
        setStatus("error");
      }
    }
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec",
      id: "contact",
      style: {
        background: "var(--surface-content-alt)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-contact__grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-contact__aside"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Contact"), /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Talk to TriviaKnight."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "Have a question about your venue, hosting setup, or upcoming event? Send us a message and tell us how you run trivia."), /*#__PURE__*/React.createElement("p", {
      className: "tk-contact__email"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "18",
      height: "18",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "4",
      width: "20",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m22 7-10 5L2 7"
    })), /*#__PURE__*/React.createElement("a", {
      className: "tk-a",
      href: `mailto:${CONTACT_EMAIL}`
    }, CONTACT_EMAIL))), /*#__PURE__*/React.createElement("div", {
      className: "tk-form"
    }, status === "success" ? /*#__PURE__*/React.createElement("div", {
      className: "tk-success"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tk-success__ic"
    }, /*#__PURE__*/React.createElement(Check, {
      s: 28
    })), /*#__PURE__*/React.createElement("h3", {
      className: "tk-h2",
      style: {
        fontSize: "var(--text-xl)"
      }
    }, "Message sent."), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead",
      style: {
        margin: "0.6rem auto 0"
      }
    }, "Thanks for reaching out. We will reply to your email soon.")) : /*#__PURE__*/React.createElement("form", {
      onSubmit: onSubmit,
      noValidate: true,
      onFocusCapture: onStart
    }, status === "error" && /*#__PURE__*/React.createElement("div", {
      className: "tk-alert",
      role: "alert"
    }, "Something went wrong sending your message. Please email us directly at ", /*#__PURE__*/React.createElement("a", {
      href: `mailto:${CONTACT_EMAIL}`
    }, CONTACT_EMAIL), "."), /*#__PURE__*/React.createElement("div", {
      className: "tk-form__hp",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("label", null, "Do not fill this in", /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "company_website",
      tabIndex: -1,
      autoComplete: "off"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "tk-form__grid"
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Name",
      name: "name",
      required: true,
      error: errors.name,
      placeholder: "Your name"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Email",
      name: "email",
      type: "email",
      required: true,
      error: errors.email,
      placeholder: "you@venue.com"
    }), /*#__PURE__*/React.createElement(Input, {
      className: "tk-form__full",
      label: "Organization or venue",
      name: "org",
      optional: true,
      placeholder: "The Anvil Pub"
    }), /*#__PURE__*/React.createElement("div", {
      className: "tk-form__full"
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Primary use case",
      name: "useCase",
      required: true,
      error: errors.useCase,
      placeholder: "Select one",
      options: USE_CASE_OPTIONS
    })), /*#__PURE__*/React.createElement("div", {
      className: "tk-form__full"
    }, /*#__PURE__*/React.createElement(Textarea, {
      label: "Message",
      name: "message",
      required: true,
      error: errors.message,
      placeholder: "Tell us how you run trivia."
    })), /*#__PURE__*/React.createElement("div", {
      className: "tk-form__full"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      name: "consent",
      required: true,
      error: !!errors.consent,
      label: /*#__PURE__*/React.createElement(React.Fragment, null, "I agree to the ", /*#__PURE__*/React.createElement("a", {
        className: "tk-a",
        href: ROUTES.privacy
      }, "privacy policy"), ".")
    }), errors.consent && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--danger)",
        fontSize: ".8125rem",
        margin: ".4rem 0 0"
      }
    }, errors.consent))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "1.25rem"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      variant: "primary",
      size: "lg",
      block: true,
      disabled: status === "loading"
    }, status === "loading" ? "Sending…" : "Send Message"))))));
  }

  /* ---------------- Final CTA ---------------- */
  function FinalCTA() {
    return /*#__PURE__*/React.createElement("section", {
      className: "tk-sec tk-dark tk-callout"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-callout__glow"
    }), /*#__PURE__*/React.createElement("div", {
      className: "tk-ct tk-center tk-head",
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "tk-h2"
    }, "Ready to rule the round?"), /*#__PURE__*/React.createElement("p", {
      className: "tk-lead"
    }, "Build your game, bring your crowd together, and host as many trivia nights as you like."), /*#__PURE__*/React.createElement("div", {
      className: "tk-hero__cta",
      style: {
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      href: ROUTES.startHosting,
      onClick: () => track("hero_cta_clicked", {
        cta: "start_hosting",
        location: "final"
      })
    }, "Start Hosting"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "lg",
      onDark: true,
      href: ROUTES.pricing
    }, "View Pricing"))));
  }

  /* ---------------- Footer ---------------- */
  function Footer() {
    const year = new Date().getFullYear();
    return /*#__PURE__*/React.createElement("footer", {
      className: "tk-footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-ct"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tk-footer__top"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
      size: "md",
      onDark: true
    }), /*#__PURE__*/React.createElement("p", {
      className: "tk-footer__desc"
    }, "Trivia night software for hosts, venues, and event teams. Build games, run the live show, and host as often as you like.")), /*#__PURE__*/React.createElement("div", {
      className: "tk-footer__col"
    }, /*#__PURE__*/React.createElement("h4", null, "Product"), /*#__PURE__*/React.createElement("a", {
      href: "#features"
    }, "Features"), /*#__PURE__*/React.createElement("a", {
      href: "#pricing"
    }, "Pricing"), /*#__PURE__*/React.createElement("a", {
      href: "#use-cases"
    }, "Use Cases"), /*#__PURE__*/React.createElement("a", {
      href: "#faq"
    }, "FAQ"), /*#__PURE__*/React.createElement("a", {
      href: ROUTES.howItWorks
    }, "How It Works")), /*#__PURE__*/React.createElement("div", {
      className: "tk-footer__col"
    }, /*#__PURE__*/React.createElement("h4", null, "Company"), /*#__PURE__*/React.createElement("a", {
      href: "#contact"
    }, "Contact"), /*#__PURE__*/React.createElement("a", {
      href: ROUTES.privacy
    }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
      href: ROUTES.terms
    }, "Terms of Service"), /*#__PURE__*/React.createElement("a", {
      href: `mailto:${CONTACT_EMAIL}`
    }, CONTACT_EMAIL)), /*#__PURE__*/React.createElement("div", {
      className: "tk-footer__col"
    }, /*#__PURE__*/React.createElement("h4", null, "Get started"), /*#__PURE__*/React.createElement("a", {
      href: ROUTES.logIn
    }, "Log In"), /*#__PURE__*/React.createElement("a", {
      href: ROUTES.startHosting
    }, "Start Hosting"))), /*#__PURE__*/React.createElement("div", {
      className: "tk-footer__bottom"
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", year, " TriviaKnight. All rights reserved."), /*#__PURE__*/React.createElement("span", {
      className: "tk-footer__pos"
    }, "TriviaKnight is trivia night software for hosts, venues, and event teams."))));
  }
  function MarketingSite() {
    React.useEffect(() => {
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "tk-site"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#top",
      className: "tk-skip"
    }, "Skip to content"), /*#__PURE__*/React.createElement(AnnouncementBar, null, "Built for hosts who believe a subscription should include ", /*#__PURE__*/React.createElement("b", null, "unlimited trivia nights"), "."), /*#__PURE__*/React.createElement(NavBar, null), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Differentiation, null), /*#__PURE__*/React.createElement(HowItWorksPreview, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(UseCases, null), /*#__PURE__*/React.createElement(Pricing, null), /*#__PURE__*/React.createElement(Callout, null), /*#__PURE__*/React.createElement(FAQ, null), /*#__PURE__*/React.createElement(Contact, null), /*#__PURE__*/React.createElement(FinalCTA, null)), /*#__PURE__*/React.createElement(Footer, null));
  }

  // inject styles
  if (!document.getElementById("tk-site-styles")) {
    const el = document.createElement("style");
    el.id = "tk-site-styles";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
  window.MarketingSite = MarketingSite;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/MarketingSite.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/ProductMockup.jsx
try { (() => {
/* Hero product-interface mockup for TriviaKnight. Static visual built in
 * HTML/CSS/React, styled in the TriviaKnight brand. Grounded in the real app
 * information architecture: rounds, questions within rounds, a host control
 * panel, a leaderboard, and a "Ready to Present" state. Not a screenshot. */
(function () {
  const S = {
    shell: {
      fontFamily: "var(--font-body)",
      background: "var(--navy-800)",
      border: "1px solid var(--surface-line-dark)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-xl)",
      overflow: "hidden",
      color: "var(--text-on-dark)",
      width: "100%"
    },
    top: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      background: "var(--navy-950)",
      borderBottom: "1px solid var(--surface-line-dark)"
    },
    dot: c => ({
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: c
    }),
    topTitle: {
      marginLeft: 8,
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--text-on-dark-muted)",
      fontFamily: "var(--font-mono)"
    },
    ready: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".08em",
      color: "#7fe0ad",
      background: "rgba(47,158,107,.16)",
      border: "1px solid rgba(47,158,107,.4)",
      padding: "4px 9px",
      borderRadius: "var(--radius-pill)"
    },
    body: {
      display: "grid",
      gridTemplateColumns: "180px 1fr 190px",
      minHeight: 330
    },
    col: {
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    },
    left: {
      borderRight: "1px solid var(--surface-line-dark)",
      background: "var(--navy-900)"
    },
    right: {
      borderLeft: "1px solid var(--surface-line-dark)",
      background: "var(--navy-900)"
    },
    kicker: {
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".1em",
      color: "var(--text-on-dark-faint)",
      margin: 0
    },
    gameName: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: "-.01em",
      lineHeight: 1.1,
      margin: "2px 0 6px"
    },
    round: active => ({
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 9px",
      borderRadius: "var(--radius-sm)",
      fontSize: 12.5,
      fontWeight: active ? 600 : 500,
      color: active ? "var(--navy-950)" : "var(--text-on-dark-muted)",
      background: active ? "var(--gold-400)" : "transparent",
      cursor: "default"
    }),
    roundNum: active => ({
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      width: 16,
      textAlign: "center",
      color: active ? "var(--navy-900)" : "var(--text-on-dark-faint)"
    }),
    qCard: {
      background: "var(--navy-800)",
      border: "1px solid var(--surface-line-dark)",
      borderRadius: "var(--radius-md)",
      padding: "12px 13px",
      display: "flex",
      flexDirection: "column",
      gap: 9
    },
    qMeta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    qTag: {
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".08em",
      color: "var(--gold-300)"
    },
    qPts: {
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      color: "var(--text-on-dark-faint)"
    },
    qText: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0
    },
    choices: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 7
    },
    choice: correct => ({
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12,
      padding: "7px 9px",
      borderRadius: "var(--radius-sm)",
      border: correct ? "1.5px solid var(--gold-500)" : "1px solid var(--surface-line-dark)",
      background: correct ? "rgba(227,168,56,.12)" : "var(--navy-900)",
      color: correct ? "var(--gold-200)" : "var(--text-on-dark-muted)"
    }),
    choiceKey: correct => ({
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      width: 15,
      height: 15,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 3,
      background: correct ? "var(--gold-500)" : "var(--navy-700)",
      color: correct ? "var(--navy-950)" : "var(--text-on-dark-muted)"
    }),
    controls: {
      display: "flex",
      gap: 8,
      marginTop: 2
    },
    btn: primary => ({
      flex: primary ? 1.4 : 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      padding: "8px 10px",
      borderRadius: "var(--radius-sm)",
      border: primary ? "none" : "1px solid var(--surface-line-dark)",
      background: primary ? "var(--gold-500)" : "transparent",
      color: primary ? "var(--navy-950)" : "var(--text-on-dark-muted)"
    }),
    timer: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11.5,
      color: "var(--text-on-dark-muted)"
    },
    bar: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      background: "var(--navy-700)",
      overflow: "hidden"
    },
    barFill: {
      width: "62%",
      height: "100%",
      background: "var(--gold-500)"
    },
    lbRow: rank => ({
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 8px",
      borderRadius: "var(--radius-sm)",
      background: rank === 1 ? "rgba(227,168,56,.12)" : "var(--navy-800)",
      border: rank === 1 ? "1px solid rgba(227,168,56,.35)" : "1px solid var(--surface-line-dark)"
    }),
    lbRank: rank => ({
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      fontWeight: 700,
      width: 16,
      color: rank === 1 ? "var(--gold-300)" : "var(--text-on-dark-faint)"
    }),
    lbName: {
      fontSize: 12,
      fontWeight: 500,
      flex: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    lbScore: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--gold-300)"
    }
  };
  const Icon = ({
    d,
    size = 14
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, d);
  const play = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
    points: "6 3 20 12 6 21 6 3"
  }));
  const eye = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }));
  const clock = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6v6l4 2"
  }));
  const rounds = [{
    n: 1,
    name: "General Knowledge",
    active: true
  }, {
    n: 2,
    name: "Music",
    active: false
  }, {
    n: 3,
    name: "Picture Round",
    active: false
  }, {
    n: 4,
    name: "History",
    active: false
  }, {
    n: 5,
    name: "Sports",
    active: false
  }, {
    n: 6,
    name: "The Final Cut",
    active: false
  }];
  const leaders = [{
    rank: 1,
    name: "Sudden Death Row",
    score: 42
  }, {
    rank: 2,
    name: "Ctrl+Alt+Trivia",
    score: 39
  }, {
    rank: 3,
    name: "Buzzer Beaters",
    score: 37
  }, {
    rank: 4,
    name: "The Answer Is Yes",
    score: 33
  }];
  function ProductMockup() {
    return /*#__PURE__*/React.createElement("div", {
      style: S.shell,
      role: "img",
      "aria-label": "TriviaKnight host interface showing a game called Friday Night General Knowledge with rounds, questions, live host controls, and a leaderboard in a Ready to Present state."
    }, /*#__PURE__*/React.createElement("div", {
      style: S.top
    }, /*#__PURE__*/React.createElement("span", {
      style: S.dot("#e5695e")
    }), /*#__PURE__*/React.createElement("span", {
      style: S.dot("#e3b341")
    }), /*#__PURE__*/React.createElement("span", {
      style: S.dot("#4aa564")
    }), /*#__PURE__*/React.createElement("span", {
      style: S.topTitle
    }, "TriviaKnight \xB7 Host Desk"), /*#__PURE__*/React.createElement("span", {
      style: S.ready
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#4aa564"
      }
    }), "Ready to Present")), /*#__PURE__*/React.createElement("div", {
      style: S.body,
      className: "tk-mock-body"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...S.col,
        ...S.left
      },
      className: "tk-mock-left"
    }, /*#__PURE__*/React.createElement("p", {
      style: S.kicker
    }, "Game"), /*#__PURE__*/React.createElement("h3", {
      style: S.gameName
    }, "Friday Night General Knowledge"), /*#__PURE__*/React.createElement("p", {
      style: S.kicker
    }, "Rounds"), rounds.map(r => /*#__PURE__*/React.createElement("div", {
      key: r.n,
      style: S.round(r.active)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.roundNum(r.active)
    }, r.n), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, r.name)))), /*#__PURE__*/React.createElement("div", {
      style: S.col
    }, /*#__PURE__*/React.createElement("p", {
      style: S.kicker
    }, "Round 1 \xB7 Question 3 of 5"), /*#__PURE__*/React.createElement("div", {
      style: S.qCard
    }, /*#__PURE__*/React.createElement("div", {
      style: S.qMeta
    }, /*#__PURE__*/React.createElement("span", {
      style: S.qTag
    }, "Multiple choice"), /*#__PURE__*/React.createElement("span", {
      style: S.qPts
    }, "3 pts")), /*#__PURE__*/React.createElement("p", {
      style: S.qText
    }, "Which planet in our solar system rotates on its side?"), /*#__PURE__*/React.createElement("div", {
      style: S.choices
    }, /*#__PURE__*/React.createElement("span", {
      style: S.choice(false)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.choiceKey(false)
    }, "A"), "Jupiter"), /*#__PURE__*/React.createElement("span", {
      style: S.choice(true)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.choiceKey(true)
    }, "B"), "Uranus"), /*#__PURE__*/React.createElement("span", {
      style: S.choice(false)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.choiceKey(false)
    }, "C"), "Neptune"), /*#__PURE__*/React.createElement("span", {
      style: S.choice(false)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.choiceKey(false)
    }, "D"), "Saturn"))), /*#__PURE__*/React.createElement("div", {
      style: S.timer
    }, /*#__PURE__*/React.createElement(Icon, {
      d: clock,
      size: 13
    }), /*#__PURE__*/React.createElement("span", {
      style: S.bar
    }, /*#__PURE__*/React.createElement("span", {
      style: S.barFill
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)"
      }
    }, "0:09")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: "var(--text-on-dark-muted)",
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        color: "var(--gold-300)"
      }
    }, "9 / 12"), " teams locked in"), /*#__PURE__*/React.createElement("div", {
      style: S.controls
    }, /*#__PURE__*/React.createElement("span", {
      style: S.btn(true)
    }, /*#__PURE__*/React.createElement(Icon, {
      d: play,
      size: 13
    }), "Reveal answer"), /*#__PURE__*/React.createElement("span", {
      style: S.btn(false)
    }, /*#__PURE__*/React.createElement(Icon, {
      d: eye,
      size: 13
    }), "Presenter"))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...S.col,
        ...S.right
      },
      className: "tk-mock-right"
    }, /*#__PURE__*/React.createElement("p", {
      style: S.kicker
    }, "Leaderboard"), leaders.map(t => /*#__PURE__*/React.createElement("div", {
      key: t.rank,
      style: S.lbRow(t.rank)
    }, /*#__PURE__*/React.createElement("span", {
      style: S.lbRank(t.rank)
    }, t.rank), /*#__PURE__*/React.createElement("span", {
      style: S.lbName
    }, t.name), /*#__PURE__*/React.createElement("span", {
      style: S.lbScore
    }, t.score))))));
  }
  window.ProductMockup = ProductMockup;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/ProductMockup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/config.js
try { (() => {
/* TriviaKnight marketing site — centralized configuration.
 * Single source of truth for routes, plans, features, use cases, FAQs, and the
 * pricing comparison. Edit values here to update the whole site.
 * Attached to window.TKC so the Babel-transpiled section scripts can read it. */
(function () {
  // ---- Application / integration destinations (edit here) ----
  // TODO(auth): wire Log In / Start Hosting to the real OAuth flow once ready.
  // TODO(billing): plan hrefs currently deep-link to /signup?plan=… ; connect
  //   these to the Stripe subscription checkout when the backend is complete.
  const ROUTES = {
    logIn: "/login",
    startHosting: "/signup",
    howItWorks: "/how-it-works",
    contact: "#contact",
    pricing: "#pricing",
    privacy: "/privacy",
    terms: "/terms",
    plans: {
      host: "/signup?plan=host",
      pro: "/signup?plan=pro",
      venue: "/signup?plan=venue"
    }
  };
  const CONTACT_EMAIL = "hello@triviaknight.app";
  const NAV = [{
    label: "Features",
    href: "#features"
  }, {
    label: "How It Works",
    href: ROUTES.howItWorks
  }, {
    label: "Use Cases",
    href: "#use-cases"
  }, {
    label: "Pricing",
    href: "#pricing"
  }, {
    label: "FAQ",
    href: "#faq"
  }, {
    label: "Contact",
    href: "#contact"
  }];

  // ---- Pricing (all money lives here) ----
  const PLANS = [{
    id: "host",
    name: "Host",
    monthly: 19,
    annual: 190,
    description: "For independent hosts building and running their own trivia nights.",
    cta: "Start with Host",
    href: ROUTES.plans.host,
    featured: false,
    features: ["Unlimited trivia nights", "Unlimited saved games", "Unlimited custom questions", "Live-editable rounds and questions", "Multiple-choice, multi-select, and written-answer questions", "Live host controls", "Presenter view", "Timers, scoring, and leaderboards", "One host account", "TriviaKnight branding", "Standard email support"]
  }, {
    id: "pro",
    name: "Pro Host",
    monthly: 39,
    annual: 390,
    description: "For professional hosts who want stronger production tools and their own brand on the experience.",
    cta: "Choose Pro Host",
    href: ROUTES.plans.pro,
    featured: true,
    badge: "Most Popular",
    features: ["Everything in Host", "Image and video rounds", "Advanced scoring rules", "Sudden-death tie-breaker questions", "Searchable question and round library", "Bulk .xlsx question import and export", "Custom logo and brand colours", "Sponsor slides and messages", "Game history and performance analytics", "Up to three host or admin accounts", "Priority email support"]
  }, {
    id: "venue",
    name: "Venue & Teams",
    monthly: 79,
    annual: 790,
    description: "For venues, trivia companies, and organizations coordinating games across multiple hosts or locations.",
    cta: "Choose Venue & Teams",
    href: ROUTES.plans.venue,
    featured: false,
    features: ["Everything in Pro Host", "Multi-venue workspaces", "Centralized game and question library", "Up to ten host or admin accounts", "Roles and permissions", "White-label presenter and player experience", "Cross-event and cross-venue analytics", "Shared brand assets", "Host activity reporting", "Guided onboarding", "Priority support"]
  }];

  // ---- Features (icon keys map to Lucide names rendered in the section) ----
  const FEATURES = [{
    icon: "layout-grid",
    title: "Round-based game builder",
    body: "Create games from scratch and organize them into clearly structured rounds."
  }, {
    icon: "pencil-line",
    title: "Custom questions and answers",
    body: "Write your own questions, set the correct answers, and assign point values."
  }, {
    icon: "list-checks",
    title: "Multiple question formats",
    body: "Multiple choice, multi-select, and written-answer questions in the same game."
  }, {
    icon: "monitor-play",
    title: "Live presenter view",
    body: "A clean projector display for the room with questions, choices, and standings."
  }, {
    icon: "timer",
    title: "Host controls and timers",
    body: "Control the pace, reveal answers, and run the countdown from the host desk."
  }, {
    icon: "trophy",
    title: "Scoring and leaderboards",
    body: "Automatic scoring on reveal with a live leaderboard and tie handling."
  }, {
    icon: "library",
    title: "Live-editable question bank",
    body: "Edit your questions, choices, and answers anytime before or during the event, with bulk .xlsx import and export to speed up setup."
  }, {
    icon: "image",
    title: "Image and video rounds",
    body: "Add image or video clues for richer question rounds.",
    premium: true
  }, {
    icon: "dices",
    title: "Sudden-death tie-breakers",
    body: "Settle a tie for first place with a dedicated tie-breaker question.",
    premium: true
  }, {
    icon: "palette",
    title: "Custom venue branding",
    body: "Put your logo and brand colours on the presenter and player experience.",
    premium: true
  }, {
    icon: "megaphone",
    title: "Sponsor slides and messages",
    body: "Drop in sponsor slides and messages between rounds.",
    premium: true
  }, {
    icon: "bar-chart-3",
    title: "Game history and analytics",
    body: "Review past games and performance across events.",
    premium: true
  }];
  const USE_CASES = [{
    icon: "mic",
    title: "Independent trivia hosts",
    body: "Write and edit your question bank right up until showtime, then run the live show from the host desk.",
    href: "/trivia-software-for-hosts"
  }, {
    icon: "beer",
    title: "Bars, pubs, and breweries",
    body: "Turn a quiet night into a recurring event that gives customers a reason to return.",
    href: "/bar-trivia-software"
  }, {
    icon: "party-popper",
    title: "Event professionals",
    body: "Deliver polished trivia for private events, conferences, parties, and client gatherings.",
    href: null
  }, {
    icon: "building-2",
    title: "Corporate teams",
    body: "Run engaging quiz nights for team building, celebrations, and remote or in-person events.",
    href: "/corporate-trivia"
  }, {
    icon: "heart-handshake",
    title: "Fundraisers and community groups",
    body: "Create an approachable event format that brings supporters together.",
    href: "/fundraiser-trivia"
  }];
  const FAQS = [{
    q: "What is trivia night software?",
    a: "Trivia night software helps hosts build quiz rounds, present questions to a room, manage the flow of the game, track scoring, and display standings during live events. TriviaKnight brings the game builder and the live host controls together in one place."
  }, {
    q: "Can I host unlimited trivia nights?",
    a: "Yes. Every paid TriviaKnight plan includes unlimited hosted trivia nights, unlimited saved games, and unlimited custom questions. Your plan sets the tools you get, not how often you can host."
  }, {
    q: "Does TriviaKnight charge per game?",
    a: "No. Paid plans are subscriptions. There are no game credits and no per-event charges."
  }, {
    q: "Can I create my own trivia questions?",
    a: "Yes. Hosts write their own custom questions and organize them into rounds, with live editing and bulk .xlsx import and export."
  }, {
    q: "Can I edit my questions after I have started building a game?",
    a: "Yes. Question and round edits are live: changes you make in the question editor show up immediately for players, the presenter screen, and the printable answer key."
  }, {
    q: "Is TriviaKnight suitable for bars and restaurants?",
    a: "Yes. It is designed for recurring live trivia at bars, pubs, breweries, restaurants, and other venues."
  }, {
    q: "Can TriviaKnight be used for corporate events and fundraisers?",
    a: "Yes. The game builder and live hosting tools support corporate gatherings, private events, fundraisers, and community quiz nights."
  }, {
    q: "Do I need technical experience?",
    a: "No. TriviaKnight is designed for hosts who want to concentrate on the room rather than the software."
  }, {
    q: "Can multiple people manage trivia games?",
    a: "The Pro Host and Venue & Teams plans include additional host or administrator accounts."
  },
  // TODO(billing): confirm this matches the final Stripe subscription configuration.
  {
    q: "Can I cancel my subscription?",
    a: "Yes. Subscriptions can be cancelled and remain active until the end of the current billing period."
  }];

  // ---- Pricing comparison (grouped). value: true | false | string ----
  const COMPARISON = [{
    group: "Building games",
    rows: [{
      label: "Unlimited trivia nights",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Unlimited saved games and questions",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Live-editable rounds and questions",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Searchable question and round library",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "Bulk .xlsx question import and export",
      host: false,
      pro: true,
      venue: true
    }]
  }, {
    group: "Running live trivia",
    rows: [{
      label: "Live host controls and timers",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Presenter view",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Scoring and leaderboards",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Image and video rounds",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "Sudden-death tie-breakers",
      host: false,
      pro: true,
      venue: true
    }]
  }, {
    group: "Branding",
    rows: [{
      label: "TriviaKnight branding",
      host: true,
      pro: true,
      venue: true
    }, {
      label: "Custom logo and brand colours",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "Sponsor slides and messages",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "White-label presenter and player experience",
      host: false,
      pro: false,
      venue: true
    }]
  }, {
    group: "Reporting",
    rows: [{
      label: "Game history and analytics",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "Cross-event and cross-venue analytics",
      host: false,
      pro: false,
      venue: true
    }, {
      label: "Host activity reporting",
      host: false,
      pro: false,
      venue: true
    }]
  }, {
    group: "Collaboration",
    rows: [{
      label: "Host or admin accounts",
      host: "1",
      pro: "Up to 3",
      venue: "Up to 10"
    }, {
      label: "Roles and permissions",
      host: false,
      pro: false,
      venue: true
    }, {
      label: "Multi-venue workspaces",
      host: false,
      pro: false,
      venue: true
    }, {
      label: "Shared brand assets",
      host: false,
      pro: false,
      venue: true
    }]
  }, {
    group: "Support",
    rows: [{
      label: "Standard email support",
      host: true,
      pro: false,
      venue: false
    }, {
      label: "Priority email support",
      host: false,
      pro: true,
      venue: true
    }, {
      label: "Guided onboarding",
      host: false,
      pro: false,
      venue: true
    }]
  }];
  const USE_CASE_OPTIONS = ["Independent trivia host", "Bar, restaurant, or brewery", "Trivia company", "Corporate event", "Fundraiser or community event", "Private event", "Other"];

  // ---- Lightweight analytics helper (no vendor attached) ----
  // TODO(analytics): forward events to a vendor when one is chosen. Never send
  // sensitive form contents (only event name + safe metadata).
  function track(event, meta) {
    if (typeof console !== "undefined") console.debug("[analytics]", event, meta || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: event,
      ...(meta || {})
    });
  }
  window.TKC = {
    ROUTES,
    CONTACT_EMAIL,
    NAV,
    PLANS,
    FEATURES,
    USE_CASES,
    FAQS,
    COMPARISON,
    USE_CASE_OPTIONS,
    track
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/config.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.UseCaseCard = __ds_scope.UseCaseCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.KnightMark = __ds_scope.KnightMark;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.AnnouncementBar = __ds_scope.AnnouncementBar;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.BillingToggle = __ds_scope.BillingToggle;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.FieldError = __ds_scope.FieldError;

})();
