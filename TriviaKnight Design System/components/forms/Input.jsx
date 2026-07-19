import React from "react";
import { useFieldStyles, useFieldId, FieldError } from "./fieldStyles.js";

/** Labelled text input with hint and error states. Accessible by default. */
export function Input({ label, hint, error, required = false, optional = false, id, className = "", ...rest }) {
  useFieldStyles();
  const fid = useFieldId(id);
  const hintId = hint ? `${fid}-hint` : undefined;
  const errId = error ? `${fid}-err` : undefined;
  return (
    <div className={["tk-field", error ? "tk-field--invalid" : "", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="tk-field__label" htmlFor={fid}>
          {label}
          {required && <span className="tk-field__req" aria-hidden="true">*</span>}
          {optional && <span className="tk-field__opt">(optional)</span>}
        </label>
      )}
      <input
        id={fid}
        className="tk-input"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errId, hintId].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      {hint && !error && <p className="tk-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="tk-field__error" id={errId}><FieldError />{error}</p>}
    </div>
  );
}
