import { Fragment } from "react";
import RegisterButton from "./RegisterButton";
import { useUpcomingEvent } from "../hooks/useEvents";
import { CONTAINER, SECTION_SPACING } from "../layout";

const EYEBROW = "Join SynCHRO";
const TITLE = "Upcoming session";
// Entries are separated by a blank line.
const INTRO_LINES = [
  "Be part of a trusted CHRO forum where peers exchange perspectives, share experiences and shape the agenda together.",
  "Join us for our first in-person session in April 2027.",
];
const QUESTIONS_LABEL = "Questions?";
const CONTACT_EMAIL = "info@synchroforum.eu";

/**
 * Upcoming session with the Register call to action. Dates, times, venue and
 * location come from the event (served by the API), not from the repo, so it
 * only renders once an event is published.
 */
export default function UpcomingSession() {
  const event = useUpcomingEvent();
  if (!event) return null;

  const sessions = Array.isArray(event.sessions) ? event.sessions : [];

  return (
    <section id="upcoming-session" aria-labelledby="upcoming-session-title" className={SECTION_SPACING}>
      <div className={`${CONTAINER} grid md:grid-cols-2 gap-x-16 gap-y-10`}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
              style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
              }}
            />
            <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
              {EYEBROW}
            </span>
          </div>

          <h2
            id="upcoming-session-title"
            className="
              mt-[10px]
              text-[clamp(2.2rem,1.6rem+2vw,4.4rem)]
              leading-[0.92]
              tracking-[-0.065em]
              font-bold
              max-w-full
              text-ink
              dark:text-paper
            "
          >
            {TITLE}
          </h2>

          <p className="mt-8 max-w-md leading-relaxed text-ink/70 dark:text-paper/70">
            {INTRO_LINES.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
                {line}
              </Fragment>
            ))}
          </p>
        </div>

        <div className="md:pt-16">
          {sessions.length > 0 && (
            <dl className="flex flex-wrap gap-x-12 gap-y-4">
              {sessions.map(({ date, time }) => (
                <div key={date}>
                  <dt className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
                    {date}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold tracking-tight text-ink dark:text-paper">
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {(event.venue || event.location) && (
            <p className="mt-8 text-lg font-medium leading-snug text-ink dark:text-paper">
              {event.venue && <span className="block">{event.venue}</span>}
              {event.location && <span className="block">{event.location}</span>}
            </p>
          )}

          {event.detailsNote && (
            <p className="mt-4 max-w-md leading-relaxed text-ink/60 dark:text-paper/60">
              {event.detailsNote}
            </p>
          )}

          <RegisterButton event={event} className="mt-8" />

          <p className="mt-6 text-ink/60 dark:text-paper/60">
            {QUESTIONS_LABEL}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-orangeLight dark:text-orangeDark hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
