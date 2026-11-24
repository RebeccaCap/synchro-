import { inputClass } from "../../pages/shared";

// Text-like controls share the site's input styling; validation colour comes
// from `.field-control:user-invalid` in index.css.
export const controlClass = `field-control ${inputClass}`;
