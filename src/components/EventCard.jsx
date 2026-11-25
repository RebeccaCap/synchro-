import RegisterButton from "./RegisterButton";

/**
 * Event summary with a Register call to action. The button only appears while
 * registration is open; clicking it opens the registration dialog.
 */
export default function EventCard({ event }) {
  return (
    <div
      className="
        relative overflow-hidden text-left
        p-8 md:p-10
        border border-ink/10 dark:border-white/10
        bg-white/60 dark:bg-white/[0.06]
      "
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-orangeLight dark:to-orangeDark" />
      <div className="absolute right-[-10%] bottom-[-20%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.20),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.20),transparent_70%)] pointer-events-none" />

      <div className="relative">
        <p className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
          {event.name}
        </p>
        <p className="mt-3 text-[clamp(1.8rem,1.4rem+1.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.05em] text-ink dark:text-paper">
          {event.dateLabel}
        </p>
        {event.location && (
          <p className="mt-3 text-lg font-medium text-ink dark:text-paper">{event.location}</p>
        )}

        <RegisterButton event={event} className="mt-8" />
      </div>
    </div>
  );
}
