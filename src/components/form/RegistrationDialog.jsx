import { useEffect, useState } from "react";
import { GradientLine } from "../../pages/shared";
import Dialog from "./Dialog";
import RegistrationForm from "./RegistrationForm";
import AddToCalendar from "./AddToCalendar";

/** Modal wrapper around RegistrationForm. Each opening starts a fresh form. */
export default function RegistrationDialog({ event, open, onClose, ...formProps }) {
  const [session, setSession] = useState(0);
  useEffect(() => {
    if (open) setSession((s) => s + 1);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={`registration-title-${event.id}`}
      className="
        relative m-auto w-[min(94vw,880px)] max-h-[90dvh] overflow-y-auto p-0
        border border-ink/10 dark:border-white/10
        bg-paper dark:bg-[#1f1f3a] text-ink dark:text-paper
      "
    >
      <GradientLine />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close registration"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-ink/70 hover:text-ink dark:text-paper/70 dark:hover:text-paper"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div className="p-6 md:p-8">
        <RegistrationForm
          key={session}
          event={event}
          onClose={onClose}
          successActions={<AddToCalendar event={event} />}
          {...formProps}
        />
      </div>
    </Dialog>
  );
}
