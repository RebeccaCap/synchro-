/**
 * Single checkbox. The label is `label`, then an optional inline link, then
 * an optional `suffix`, e.g. "I confirm that I have read the" + link + ".".
 */
export default function CheckboxField({
  name,
  label,
  link,
  suffix = "",
  required,
  error,
  className = "",
}) {
  const id = `field-${name}`;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          value="yes"
          required={required}
          aria-invalid={error ? true : undefined}
          className="mt-1 w-5 h-5 shrink-0 accent-purpleLight dark:accent-purpleDark"
        />
        <label htmlFor={id} className="text-ink dark:text-paper">
          {label}{" "}
          {link && (
            <a
              href={link.href}
              {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="underline underline-offset-2 hover:text-orangeLight dark:hover:text-orangeDark"
            >
              {link.text}
            </a>
          )}
          {suffix}
          {required && (
            <span className="ml-1 text-orangeLight dark:text-orangeDark" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
