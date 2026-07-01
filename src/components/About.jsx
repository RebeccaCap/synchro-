export default function About() {
  const items = [
    {
      number: "01",
      title: "Content",
      text: "Curated content and discussion based on specific reports and optional insight pulses that describe CHRO opportunities and challenges. Content is shared in advance so the room can spend its time on debate, not briefing."
    },
    {
      number: "02",
      title: "Cadence",
      text: "We are inviting you to our first session. This will mark the first of two in-person sessions per year. Each edition is built around a single high-impact theme, with material connecting sessions between events."
    },
    {
      number: "03",
      title: "Who's in the room",
      text: "CHROs from leading European organisations. Attendees are invited for the quality and diversity of perspective they bring, not sector representation alone."
    }
  ];

  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
                }}
              />
              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
                About
              </span>
            </div>

            <h2
              className="
                text-[clamp(2rem,1.5rem+2vw,3.8rem)]
                leading-[0.95]
                tracking-[-0.05em]
                font-bold
                max-w-[11ch]
                text-ink
                dark:text-paper
              "
            >
              A forum built for the moment Europe is in.
            </h2>
          </div>

          <p className="text-ink/70 dark:text-paper/70 max-w-xl leading-relaxed">
          SynCHRO brings together an exclusive, curated group of experienced CHROs from across industries and geographies, to initiate concrete actions on what European organisations need to do differently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.number}
              className="
                relative
                p-6
                border
                border-ink/10
                dark:border-paper/10
                bg-ink/[0.03]
                dark:bg-paper/[0.06]
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-purpleLight dark:to-purpleDark" />

              <p className="text-[0.74rem] tracking-[0.2em] text-ink/45 dark:text-paper/45 uppercase">
                {item.number}
              </p>

              <h3
                className="
                  mt-3
                  text-[1.28rem]
                  font-semibold
                  tracking-[-0.04em]
                  leading-[1.08]
                  max-w-[15ch]
                  text-ink
                  dark:text-paper
                "
              >
                {item.title}
              </h3>

              <p className="mt-3 text-ink/70 dark:text-paper/70 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}