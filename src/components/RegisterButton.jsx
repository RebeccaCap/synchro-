import { useRegistration } from "./RegistrationProvider";
import { isRegistrationOpen } from "../hooks/useEvents";

const LABEL = "Register";

/**
 * Register call to action for an event. Renders nothing outside the
 * registration window; clicking opens the shared registration dialog.
 */
export default function RegisterButton({ event, className = "" }) {
  const { openRegistration } = useRegistration();
  if (!isRegistrationOpen(event)) return null;

  return (
    <button
      type="button"
      onClick={() => openRegistration(event)}
      className={`
        inline-flex items-center gap-3 h-14 px-10 text-lg font-medium
        border border-purpleLight dark:border-purpleDark
        text-ink dark:text-paper
        transition-colors duration-300
        hover:bg-purpleLight/10 dark:hover:bg-purpleDark/20
        ${className}
      `}
    >
      {LABEL}
      <span aria-hidden="true">→</span>
    </button>
  );
}
