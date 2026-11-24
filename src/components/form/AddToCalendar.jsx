import { secondaryButtonClass } from "../../pages/shared";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from "./calendar";

/** "Add to calendar" options for a registered attendee. Built in the browser. */
export default function AddToCalendar({ event }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-sm text-ink/60 dark:text-paper/60">Add it to your calendar</p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryButtonClass}
        >
          Google Calendar
        </a>
        <a
          href={outlookCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryButtonClass}
        >
          Outlook
        </a>
        <button type="button" onClick={() => downloadIcs(event)} className={secondaryButtonClass}>
          Download .ics
        </button>
      </div>
    </div>
  );
}
