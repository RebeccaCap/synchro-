import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";
import RadioGroupField from "./RadioGroupField";
import CheckboxField from "./CheckboxField";

const COMPONENTS = {
  text: TextField,
  email: TextField,
  tel: TextField,
  textarea: TextAreaField,
  select: SelectField,
  radio: RadioGroupField,
  checkbox: CheckboxField,
};

/**
 * Renders one field definition (see fields.js) with the matching component.
 * `width: "half"` fields sit two to a row on wider screens.
 */
export default function FieldRenderer({ field, error }) {
  const { type = "text", width = "full", ...props } = field;
  const Component = COMPONENTS[type];
  if (!Component) return null;

  const layout = width === "half" ? "" : "md:col-span-2";
  const extra = ["email", "tel"].includes(type) ? { type } : {};
  return <Component {...props} {...extra} error={error} className={layout} />;
}
