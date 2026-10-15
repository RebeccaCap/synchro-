import asset from "../assets/Graphic1.svg";

export default function Agenda() {
  const parts = [
    {
      label: "Part I",
      title: "Founders Connection: Building the Community",
      points: [
        "Participant introductions",
        "Leadership styles, culture, and expectations",
      ],
    },
    {
      label: "Part II",
      title: "Our Burning Platform: the Regulatory Landscape",
      points: [
        "Regulatory developments and external pressures",
        "Why a CHRO-led forum is needed now",
      ],
    },
    {
      label: "Part III",
      title: "Shaping SynCHRO's Vision & Strategic Priorities",
      points: [
        "Shared ambitions for SynCHRO",
        "Key themes, priorities, and challenges",
        "Discussion on where the community can create the most value",
      ],
    },
  ];

  return (
    <section id="agenda" className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          {/* Decorative asset */}
          <img
            src={asset}
            alt=""
            className="
              absolute
              right-[-120px]
              top-[-80px]
              w-[380px]
              opacity-[0.06]
              pointer-events-none
              select-none
            "
          />

          {/* Header */}
          <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
                }}
              />
              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
                Topics · Shaping a shared vision for SynCHRO
              </span>
            </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2
                className="
                  text-[clamp(2rem,1.5rem+2vw,3.8rem)]
                  leading-[0.95]
                  tracking-[-0.05em]
                  font-bold
                  text-ink
                  dark:text-paper
                "
              >
                The Founders Edition
              </h2>
            </div>
          </div>

          {/* Cards */}
          <div className="relative z-10 grid md:grid-cols-3 gap-5 mt-12">
            {parts.map((part) => (
              <div
                key={part.label}
                className="
                  relative
                  p-8
                  border
                  border-ink/10
                  dark:border-paper/10
                  bg-white/40
                  dark:bg-paper/[0.04]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/60
                  dark:hover:bg-paper/[0.08]
                "
              >
                <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-purpleLight via-orangeLight to-transparent" />

                <p className="text-purpleLight dark:text-purpleDark uppercase tracking-[0.15em] text-xs font-semibold">
                  {part.label}
                </p>

                <h3 className="mt-5 text-xl font-semibold leading-tight text-ink dark:text-paper">
                  {part.title}
                </h3>

                <ul className="mt-6 pl-5 list-disc space-y-2 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                  {part.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
