export default function RadioGroupField({
  name,
  label,
  options = [],
  required,
  hint,
  error,
  className = "",
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 text-[0.95rem] font-medium text-ink dark:text-paper">
        {label}
        {required && (
          <span className="ml-1 text-orangeLight dark:text-orangeDark" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="flex flex-col gap-3">
        {options.map((o, i) => (
          <label
            key={o.value}
            className="flex items-center gap-3 cursor-pointer text-ink dark:text-paper"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required && i === 0}
              className="w-5 h-5 accent-purpleLight dark:accent-purpleDark"
            />
            {o.label}
          </label>
        ))}
      </div>
      {hint && !error && (
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </fieldset>
  );
}
