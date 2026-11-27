import FormField from "./FormField";
import { controlClass } from "./controlClass";
import { useFieldId } from "./fieldId";

export default function TextAreaField({
  name,
  label,
  required,
  optional,
  hint,
  error,
  className,
  rows = 1,
  ...textareaProps
}) {
  const id = useFieldId(name);
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder=" "
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${controlClass} field-auto !h-auto pt-6 pb-2 resize-none`}
        {...textareaProps}
      />
    </FormField>
  );
}
