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
        "DTSTART:20261015T090000",
        "DTEND:20261015T100000",
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
    <section id="register" className="py-24">
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
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] via-[#4f94d9] to-[#cf6102]" />

        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(207,97,2,.2),transparent_70%)] pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-[14px] h-[14px]"
              style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                background: "linear-gradient(135deg, #cf6102, #036bcf)"
              }}
            />
            <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
              Register
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
            Lorem ipsum dolor sit amet.
          </h2>

          <p className="mt-4 text-white/70 max-w-md leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
            Add to Calendar
        </button>
      </div>
      <p className="mt-4 flex text-white/80">
        Join us on October 15, 2026 to accelerate European competitiveness  </p>
        </div>
      </div>
    </section>
  );
}