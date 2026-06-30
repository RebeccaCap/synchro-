export default function CTA() {
    const handleAddToCalendar = (e) => {
    e.preventDefault();

    const name = "";
    const email = "";
    const company = "";

    const start = "20261015T070000Z";
    const end = "20261015T080000Z";

    const now = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const uid = `${Date.now()}@chroforum.com`;

    const event = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        "STATUS:CONFIRMED",
        "SUMMARY:CHRO Forum",
        `DESCRIPTION:Name: ${name}\\nEmail: ${email}\\nCompany: ${company}`,
        "LOCATION:Stockholm / Online",
        `DTSTART:${start}`,
        `DTEND:${end}`,
        "END:VEVENT",
        "END:VCALENDAR"
        ].join("\r\n");

    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "chro-forum.ics";
    link.click();

    URL.revokeObjectURL(url);
    };

  return (
    <section id="register" className="py-17">
      <div
        className="
          relative
          max-w-6xl mx-auto px-6 py-12
          grid md:grid-cols-[1fr_0.9fr] gap-10
          border border-white/10
          bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(207,97,2,.2),transparent_70%)] pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-4">
             <span
                className="w-[14px] h-[14px] bg-[#da410f]"
                style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
                }}
            />
            <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
              RSVP
            </span>
          </div>

          <h2 className="
            text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
            leading-[0.93]
            tracking-[-0.065em]
            font-bold
            max-w-[9ch]
            text-white/90
          ">
           15 October, 2026
          </h2>

          <p className="mt-4 text-white/70 max-w-md leading-relaxed">
          The forum will be held at Capgemini Offices in Paris, France. Full venue details to follow. Please hold the date and add it to your calendar now.
          </p>
        </div>

        <div className="flex flex-col justify-center h-full">
        <div className="flex">
        <button
            onClick={handleAddToCalendar}
            className="
            h-[56px]
            px-8
            rounded-md
            bg-orange-600
            text-white
            font-medium
            text-lg
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-[0_16px_50px_rgba(207,97,2,0.35)]
            "
        >
            Confirm your attendance
        </button>
      </div>
        <p className="mt-4 text-[#fefaf5]/70 leading-[1.8]">
        Questions? Reach us at{" "}
        <a
            href="mailto:info@synchroforum.eu"
            className="text-[#da410f] hover:underline"
        >
            info@synchroforum.eu
        </a>
        </p>
        </div>
      </div>
    </section>
  );
}