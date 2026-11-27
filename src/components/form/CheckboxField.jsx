import FieldMessage from "./FieldMessage";
import { useFieldId } from "./fieldId";

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
  const id = useFieldId(name);
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
          className={`mt-0.5 w-5 h-5 shrink-0 accent-purpleLight dark:accent-purpleDark ${error ? "outline outline-2 outline-red-400" : ""}`}
        />
        <label htmlFor={id} className="text-[0.95rem] leading-snug text-ink dark:text-paper">
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
      <FieldMessage id={id} error={error} />
    </div>
  );
}
