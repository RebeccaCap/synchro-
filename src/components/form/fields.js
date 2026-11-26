/**
 * Field definitions for event registration.
 *
 * Every event gets the STANDARD fields. An event can add its own through
 * `event.extraFields`, but cannot remove or reorder the standard ones.
 *
 * Field shape: { name, type, label, required?, optional?, width?, hint?,
 *                options?, maxLength?, autoComplete?, placement? }
 * Set `collectAttendance: false` on an event to drop the yes/no attendance
 * question; everyone who submits is then recorded as attending.
 * `placement: "identity"` puts an extra field with the name/email fields,
 * before the attendance question. Other extras come after it.
 * Types: text | email | tel | textarea | select | radio | checkbox
 */

export const PRIVACY_URL = "/privacy-policy.html";

const IDENTITY_FIELDS = [
  { name: "first_name", type: "text", label: "First name", required: true, width: "half", autoComplete: "given-name", maxLength: 100 },
  { name: "last_name", type: "text", label: "Last name", required: true, width: "half", autoComplete: "family-name", maxLength: 100 },
  { name: "email", type: "email", label: "Work email", required: true, width: "half", autoComplete: "email", maxLength: 254 },
  { name: "organisation", type: "text", label: "Organisation", required: true, width: "half", autoComplete: "organization", maxLength: 150 },
];

function attendanceField(event) {
  return {
    name: "attendance",
    type: "radio",
    required: true,
    label: event.attendanceQuestion || `Will you attend ${event.name}?`,
    options: [
      { value: "yes", label: event.attendYesLabel || "Yes, I will attend" },
      { value: "no", label: event.attendNoLabel || "No, I will not be able to attend" },
    ],
  };
}

const PRIVACY_FIELD = {
  name: "privacy_policy",
  type: "checkbox",
  required: true,
  label: "I confirm that I have read the",
  link: { text: "SynCHRO Privacy Policy", href: PRIVACY_URL },
  suffix: ".",
};

export const STANDARD_FIELD_NAMES = [
  ...IDENTITY_FIELDS.map((f) => f.name),
  "attendance",
  PRIVACY_FIELD.name,
];

/**
 * Identity fields (plus any extras placed there), the attendance question,
 * the remaining extras, then the privacy confirmation.
 */
export function buildFields(event) {
  const taken = new Set(STANDARD_FIELD_NAMES);
  const extras = (event.extraFields || []).filter((f) => f && f.name && !taken.has(f.name));
  const identityExtras = extras.filter((f) => f.placement === "identity");
  const laterExtras = extras.filter((f) => f.placement !== "identity");
  return [
    ...IDENTITY_FIELDS,
    ...identityExtras,
    ...(event.collectAttendance === false ? [] : [attendanceField(event)]),
    ...laterExtras,
    PRIVACY_FIELD,
  ];
}
