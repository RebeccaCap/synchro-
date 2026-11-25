import FieldMessage from "./FieldMessage";

/** Label, required marker, hint and error text around a form control. */
export default function FormField({
  id,
  label,
  required = false,
  optional = false,
  hint,
  error,
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-2 text-[0.95rem] font-medium text-ink dark:text-paper"
      >
        {label}
        {required && (
          <span className="ml-1 text-orangeLight dark:text-orangeDark" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="ml-1 font-normal text-ink/60 dark:text-paper/60">(optional)</span>
        )}
      </label>
      {children}
      <FieldMessage id={id} hint={hint} error={error} />
    </div>
  );
}
