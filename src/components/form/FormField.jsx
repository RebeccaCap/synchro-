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
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink/60 dark:text-paper/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
