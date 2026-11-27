import FormField from "./FormField";
import { controlClass } from "./controlClass";
import { useFieldId } from "./fieldId";

export default function TextField({
  name,
  label,
  type = "text",
  required,
  optional,
  hint,
  error,
  className,
  ...inputProps
}) {
  const id = useFieldId(name);
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder=" "
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={controlClass}
        {...inputProps}
      />
    </FormField>
  );
}
