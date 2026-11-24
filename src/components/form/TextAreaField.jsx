import FormField from "./FormField";
import { controlClass } from "./controlClass";

export default function TextAreaField({
  name,
  label,
  required,
  optional,
  hint,
  error,
  className,
  rows = 2,
  ...textareaProps
}) {
  const id = `field-${name}`;
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${controlClass} field-auto !h-auto py-3 resize-none`}
        {...textareaProps}
      />
    </FormField>
  );
}
