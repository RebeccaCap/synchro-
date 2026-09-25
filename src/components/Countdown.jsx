import { useEffect, useState } from "react";

// 15 October 2026, 11:00 CEST (UTC+2)
const EVENT_START = new Date("2026-10-15T11:00:00+02:00").getTime();

function getTimeLeft() {
  const diff = Math.max(0, EVENT_START - Date.now());

  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (timeLeft.done) return;
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [timeLeft.done]);

  const units = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Minutes", value: pad(timeLeft.minutes) },
    { label: "Seconds", value: pad(timeLeft.seconds) },
  ];

  return (
    <section id="countdown" className="py-16">
      <div
        className="
          relative
          max-w-6xl
          mx-auto
          px-6
          md:px-12
          py-12
          md:py-16
          border
          border-ink/10
          dark:border-white/10
          bg-white/60
          dark:bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-purpleLight dark:to-purpleDark" />
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.20),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.20),transparent_70%)] pointer-events-none" />
        <div className="absolute left-[-8%] top-[-30%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(92,90,179,.16),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(122,120,238,.18),transparent_70%)] pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                }}
              />
              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
                Online event
              </span>
            </div>

            <h2
              className="
                text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
                leading-[0.93]
                tracking-[-0.065em]
                font-bold
                max-w-[10ch]
                text-ink
                dark:text-paper
              "
            >
              15 October, 2026
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink/10 dark:border-paper/15 text-sm font-medium text-ink/80 dark:text-paper/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-orangeLight dark:bg-orangeDark opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orangeLight dark:bg-orangeDark" />
                </span>
                Online
              </span>
              <span className="inline-flex items-center px-3 py-1.5 border border-ink/10 dark:border-paper/15 text-sm font-medium text-ink/80 dark:text-paper/80">
                11:00 CEST
              </span>
            </div>

            <p className="mt-6 text-ink/70 dark:text-paper/70 max-w-md leading-relaxed">
              The forum will now take place online.
            </p>

            <p className="mt-6 text-ink/70 dark:text-paper/70">
              Questions?{" "}
              <a
                href="mailto:info@synchroforum.eu"
                className="text-orangeLight dark:text-orangeDark hover:underline"
              >
                info@synchroforum.eu
              </a>
            </p>
          </div>

          {timeLeft.done ? (
            <div className="text-center lg:text-left">
              <p className="text-purpleLight dark:text-purpleDark uppercase tracking-[0.15em] text-xs font-semibold">
                SynCHRO Forum
              </p>
              <p className="mt-3 text-[clamp(2rem,1.5rem+2vw,3.4rem)] font-bold tracking-[-0.05em] leading-none text-ink dark:text-paper">
                The forum has started.
              </p>
            </div>
          ) : (
            <div
              role="timer"
              aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes until the forum starts`}
              className="grid grid-cols-4 gap-2 sm:gap-3"
            >
              {units.map((unit) => (
                <div
                  key={unit.label}
                  aria-hidden="true"
                  className="
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    min-w-0
                    sm:w-[118px]
                    py-5
                    sm:py-7
                    border
                    border-ink/10
                    dark:border-paper/10
                    bg-white/70
                    dark:bg-ink/40
                    backdrop-blur
                  "
                >
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-transparent" />

                  <span
                    className="
                      text-[clamp(1.9rem,1.2rem+3vw,3.6rem)]
                      font-bold
                      leading-none
                      tracking-[-0.04em]
                      tabular-nums
                      text-ink
                      dark:text-paper
                    "
                  >
                    {unit.value}
                  </span>

                  <span className="mt-3 uppercase text-[10px] sm:text-[0.7rem] tracking-[0.2em] text-ink/50 dark:text-paper/50 font-medium">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
