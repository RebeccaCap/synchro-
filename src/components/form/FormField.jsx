import FieldMessage from "./FieldMessage";

// The label is inside the control's box. Unfloated it reads like a
// placeholder; it floats to the top when the control is focused, has a value
// (placeholder not shown) or is autofilled.
const labelBase =
  "pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate text-base " +
  "text-ink/50 dark:text-paper/50 transition-all duration-200 motion-reduce:transition-none";
const labelFloated = "top-1.5 text-xs";
const labelFloats =
  "peer-focus:top-1.5 peer-focus:text-xs " +
  "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs " +
  "peer-[:-webkit-autofill]:top-1.5 peer-[:-webkit-autofill]:text-xs " +
  "peer-focus:text-orangeLight dark:peer-focus:text-orangeDark";

/**
 * Floating label, required marker, hint and error text around a control.
 * The control is passed as `children` and must carry the `peer` class and
 * `placeholder=" "` (see controlClass). Set `floated` for controls that always
 * show a value, such as a select.
 */
export default function FormField({
  id,
  label,
  required = false,
  optional = false,
  hint,
  error,
  floated = false,
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <div className="relative">
        {children}
        <label htmlFor={id} className={`${labelBase} ${floated ? labelFloated : labelFloats}`}>
          {label}
          {required && (
            <span className="ml-1 text-orangeLight dark:text-orangeDark" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="ml-1 font-normal">(optional)</span>}
        </label>
      </div>
      <FieldMessage id={id} hint={hint} error={error} />
    </div>
  );
}
