import { useState } from "react";
import { Eyebrow, primaryButtonClass, secondaryButtonClass } from "../../pages/shared";
import FieldRenderer from "./FieldRenderer";
import { buildFields } from "./fields";
import { submitRegistration } from "./submitRegistration";

const DEFAULT_SUCCESS = "You can expect to receive a calendar invitation within 2 days.";
const DEFAULT_DECLINED = "We're sorry you can't join us this time.";

/**
 * Registration form for any event.
 *
 * `event` supplies the id, name, dates and optional extra fields (see
 * fields.js). `successActions` is rendered on the confirmation screen, e.g.
 * an "Add to calendar" control. `submit` is injectable for tests.
 */
export default function RegistrationForm({
  event,
  onClose,
  successActions = null,
  submit = submitRegistration,
}) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | declined
  const [error, setError] = useState("");
  const titleId = `registration-title-${event.id}`;
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

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

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
    return (
      <div className="text-center py-6" role="status">
        <h2 id={titleId} className="text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-paper">
          {confirmed ? "You're confirmed" : "Thank you for letting us know"}
        </h2>
        <p className="mt-4 mx-auto max-w-md text-ink/70 dark:text-paper/70">
          {confirmed
            ? event.successMessage || DEFAULT_SUCCESS
            : event.declinedMessage || DEFAULT_DECLINED}
        </p>
        {confirmed && successActions}
        {onClose && (
          <button type="button" onClick={onClose} className={`${secondaryButtonClass} mt-8`}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={(e) => syncImpliedCheckboxes(e.currentTarget)}
      aria-labelledby={titleId}
    >
      <Eyebrow>Registration</Eyebrow>
      <h2
        id={titleId}
        className="text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] font-bold leading-tight tracking-[-0.04em] text-ink dark:text-paper"
      >
        {event.name}
      </h2>
      {event.dateLabel && (
        <p className="mt-3 font-medium text-ink dark:text-paper">{event.dateLabel}</p>
      )}
      <p className="mt-6 mb-6 text-sm text-ink/60 dark:text-paper/60">
        <span className="text-orangeLight dark:text-orangeDark" aria-hidden="true">*</span>{" "}
        Required fields
      </p>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
        {fields.map((field) => (
          <FieldRenderer key={field.name} field={field} />
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
        <p role="alert" className="mt-6 text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={`${primaryButtonClass} mt-8`}
      >
        {status === "submitting" ? "Submitting…" : "Submit registration"}
      </button>
    </form>
  );
}
