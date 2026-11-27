import { useId, useRef, useState } from "react";
import { Eyebrow, primaryButtonClass, secondaryButtonClass } from "../../pages/shared";
import FieldRenderer from "./FieldRenderer";
import { buildFields } from "./fields";
import { FormIdContext } from "./fieldId";
import { submitRegistration } from "./submitRegistration";

const DEFAULT_SUCCESS = "";
const DEFAULT_DECLINED = "We're sorry you can't join us this time.";
const TITLE = "Register for SynCHRO";
const PINNED_SUBMIT =
  "sticky bottom-0 z-10 mt-4 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-4 bg-paper dark:bg-[#1f1f3a] border-t border-ink/10 dark:border-white/10";
const CHECKBOX_ERROR = "Please tick this box to continue.";
const REQUIRED_ERROR = "Please complete this field.";
const CHOOSE_ERROR = "Please choose an option.";

/**
 * Registration form for any event.
 *
 * `event` supplies the id, name, dates and optional extra fields (see
 * fields.js). `successActions` is rendered on the confirmation screen, e.g.
 * an "Add to calendar" control. `titleId` lets a wrapper (the dialog) label itself with the form heading.
 * `inline` is for a form that sits on the page
 * rather than in a dialog (no pinned submit bar). `submit` is injectable for
 * tests.
 */
export default function RegistrationForm({
  event,
  onClose,
  successActions = null,
  inline = false,
  titleId: titleIdProp,
  submit = submitRegistration,
}) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | declined
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const pendingInvalid = useRef(null);
  const idPrefix = `${useId()}-`;
  const titleId = titleIdProp || `${idPrefix}registration-title-${event.id}`;
  const fields = buildFields(event);

  // A checkbox with `impliedBy: "<field>"` is ticked, and becomes required,
  // while that field has a value. Emptying the field releases it again.
  function syncImpliedCheckboxes(form) {
    for (const field of fields) {
      if (field.type !== "checkbox" || !field.impliedBy) continue;
      const source = form.elements[field.impliedBy];
      const box = form.elements[field.name];
      if (!source || !box) continue;
      const filled = source.value.trim() !== "";
      if (filled && !box.required) box.checked = true;
      if (!filled && box.required) box.checked = false;
      box.required = filled;
    }
  }

  function messageFor(el) {
    if (el.type === "checkbox") return CHECKBOX_ERROR;
    if (el.type === "radio") return CHOOSE_ERROR;
    return el.validity.valueMissing ? REQUIRED_ERROR : el.validationMessage;
  }

  // Show validation messages under each field instead of the browser's
  // floating bubble, which can land on top of other controls. Every invalid
  // field fires its own event, so collect them and apply once.
  function handleInvalid(e) {
    e.preventDefault();
    if (!pendingInvalid.current) {
      pendingInvalid.current = { first: e.target, errors: {} };
      queueMicrotask(() => {
        const { first, errors } = pendingInvalid.current;
        pendingInvalid.current = null;
        setFieldErrors(errors);
        first.focus();
      });
    }
    pendingInvalid.current.errors[e.target.name] = messageFor(e.target);
  }

  function handleInput(e) {
    const name = e.target.name;
    if (name && fieldErrors[name]) {
      setFieldErrors(({ [name]: _cleared, ...rest }) => rest);
    }
    syncImpliedCheckboxes(e.currentTarget);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    setFieldErrors({});

    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await submit({ ...values, event_id: event.id });
      // Without the attendance question, submitting means attending.
      const attending = event.collectAttendance === false || values.attendance === "yes";
      setStatus(attending ? "success" : "declined");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success" || status === "declined") {
    const confirmed = status === "success";
    const message = confirmed
      ? event.successMessage || DEFAULT_SUCCESS
      : event.declinedMessage || DEFAULT_DECLINED;
    return (
      <FormIdContext.Provider value={idPrefix}>
        <div className="text-center py-6" role="status">
          <h2 id={titleId} className="text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-paper">
            {confirmed ? "You're confirmed" : "Thank you for letting us know"}
          </h2>
          {message && (
            <p className="mt-4 mx-auto max-w-md text-ink/70 dark:text-paper/70">{message}</p>
          )}
          {confirmed && successActions}
          {onClose && (
            <button type="button" onClick={onClose} className={`${secondaryButtonClass} mt-8`}>
              Close
            </button>
          )}
        </div>
      </FormIdContext.Provider>
    );
  }

  return (
    <FormIdContext.Provider value={idPrefix}>
      <form
        onSubmit={handleSubmit}
        onInvalidCapture={handleInvalid}
        onInput={handleInput}
        aria-labelledby={titleId}
      >
        <Eyebrow>Registration</Eyebrow>
        <h2
          id={titleId}
          className="text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] font-bold leading-tight tracking-[-0.04em] text-ink dark:text-paper"
        >
          {TITLE}
        </h2>
        {event.dateLabel && (
          <p className="mt-3 font-medium text-ink dark:text-paper">{event.dateLabel}</p>
        )}
        <p className="mt-4 mb-4 text-sm text-ink/60 dark:text-paper/60">
          <span className="text-orangeLight dark:text-orangeDark" aria-hidden="true">*</span>{" "}
          Required fields
        </p>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-0">
          {fields.map((field) => (
            <FieldRenderer key={field.name} field={field} error={fieldErrors[field.name]} />
          ))}

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-red-400">
            {error}
          </p>
        )}

        {/* In a dialog the button is pinned to the bottom so it stays in reach without scrolling. */}
        <div className={inline ? "mt-4" : PINNED_SUBMIT}>
          <button
            type="submit"
            disabled={status === "submitting"}
            className={primaryButtonClass}
          >
            {status === "submitting" ? "Submitting…" : "Submit registration"}
          </button>
        </div>
      </form>
    </FormIdContext.Provider>
  );
}
