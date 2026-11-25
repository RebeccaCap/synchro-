import FormField from "./FormField";
import { controlClass } from "./controlClass";

export default function SelectField({
  name,
  label,
  options = [],
  required,
  optional,
  hint,
  error,
  className,
  ...selectProps
}) {
  const id = `field-${name}`;
  return (
    <FormField id={id} label={label} required={required} optional={optional} hint={hint} error={error} floated className={className}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={controlClass}
        {...selectProps}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
