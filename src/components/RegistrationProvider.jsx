import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { RegistrationDialog } from "./form";

const RegistrationContext = createContext(null);

/**
 * Holds the one registration dialog for the page. Any Register button calls
 * `openRegistration(event)`; sharing a single dialog avoids duplicate form
 * ids when several buttons exist.
 */
export function RegistrationProvider({ children }) {
  const [event, setEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const openRegistration = useCallback((next) => {
    setEvent(next);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ openRegistration }), [openRegistration]);

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      {/* The event stays set after closing so the exit animation can finish. */}
      {event && <RegistrationDialog event={event} open={open} onClose={() => setOpen(false)} />}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used inside <RegistrationProvider>");
  return ctx;
}
