import { createContext, useContext } from "react";

// Each form instance gets its own prefix, so two forms on one page (the inline
// form and the registration dialog) never share element ids.
export const FormIdContext = createContext("");

/** DOM id for a field, unique to the form it sits in. */
export function useFieldId(name) {
  return `${useContext(FormIdContext)}field-${name}`;
}
