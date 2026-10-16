export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
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
      <div>
          <h2
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
          The decisions European CHROs make in the next two years can define
          how their organisations compete for the next decade.
        </h2>
          </div>

          <p className="text-ink/70 dark:text-paper/70 max-w-md leading-relaxed mt-8">
          In the Founders Edition of SynCHRO, we held a concise session focused on aligning SynCHRO's vision, goals and success factors, discussed strategic themes, defined the timing of the first edition, and identified additional organisations to join the community.
          </p>
          </div>
        </div>

      </div>
    </section>
  );
}