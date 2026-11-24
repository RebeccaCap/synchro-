import { useEffect, useState } from "react";
import { api } from "../api";

// Event definitions are served by the backend (/api/events.php) and are not
// part of the repo. Fetch once per page load and share between components.
let eventsPromise;

function loadEvents() {
  if (!eventsPromise) {
    eventsPromise = api("events.php")
      .then((data) => (Array.isArray(data.events) ? data.events : []))
      .catch(() => []);
  }
  return eventsPromise;
}

/** All public events, or [] while loading or when the API is unavailable. */
export function useEvents() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    let active = true;
    loadEvents().then((list) => active && setEvents(list));
    return () => {
      active = false;
    };
  }, []);
  return events;
}

/** The first event that has not finished yet, by start date. */
export function getUpcomingEvent(events, now = new Date()) {
  return (
    [...events]
      .filter((e) => !e.endDate || new Date(e.endDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null
  );
}

export function useUpcomingEvent() {
  return getUpcomingEvent(useEvents());
}

/** Registration is open from `opensAt` (inclusive) until `closesAt` (exclusive). */
export function isRegistrationOpen(event, now = new Date()) {
  if (!event) return false;
  if (event.opensAt && now < new Date(event.opensAt)) return false;
  if (event.closesAt && now >= new Date(event.closesAt)) return false;
  return true;
}
