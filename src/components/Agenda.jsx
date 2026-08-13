import asset from "../assets/Graphic1.svg";

export default function Agenda() {
  return (
    <section id="agenda" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div

        >
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
                Agenda · Roundtable Session Breakdown · Full programme and timings to follow
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
                The CHRO as Architect of Trust, Work and Transformation
              </h2>
            </div>
          </div>

          {/* Cards */}
          <div className="relative z-10 grid md:grid-cols-3 gap-5 mt-12">
            <div
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
                Roundtable Pt. I
              </p>

              <h3 className="mt-5 text-xl font-semibold leading-tight text-ink dark:text-paper">
                Building Trust and Confidence in Times of Transformation
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-paper/70 pt-7">
                Practical lessons from large-scale transformations shared among
                participants.
              </p>
            </div>

            <div
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
                Roundtable Pt. II
              </p>

              <h3 className="mt-5 text-xl font-semibold leading-tight text-ink dark:text-paper">
                The CHRO as Workforce Architect: Europe&apos;s Regulatory
                Environment and Social Contract
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                Unpacking Europe&apos;s evolving regulatory landscape with
                support from external legal experts.
              </p>
            </div>

            <div
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
                Roundtable Pt. III
              </p>

              <h3 className="mt-5 text-xl font-semibold leading-tight text-ink dark:text-paper">
                Reinventing Work: Skills, Productivity and Human-Machine
                Collaboration
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-paper/70 pt-7">
                Perspectives and priorities collected from participants.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}