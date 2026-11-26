// Floating-label controls. The label sits inside the control (see FormField)
// and moves up when the control is focused or has a value; that relies on
// `peer` and on the control having `placeholder=" "` (hidden here).
// Validation colour comes from `.field-control` in index.css.
export const controlClass = `
  field-control peer
  w-full h-14 px-4 pt-5 pb-1
  bg-white dark:bg-black/20
  border border-ink/10 dark:border-white/10
  text-ink dark:text-paper
  placeholder:text-transparent
  focus:outline-none focus:border-orangeLight dark:focus:border-orangeDark
  transition-colors
`;
