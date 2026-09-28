export default function About() {
  const items = [
    {
      number: "01",
      title: "The Opportunity",
      text: "The Founders' Edition brings together an exclusive group of CHROs to shape the establishment and future of the SynCHRO forum. As founding members, participants will help define the forum's long-term vision, strategic priorities, and areas of influence, while building a trusted community focused on Europe's most pressing workforce and competitiveness challenges."
    },
    {
      number: "02",
      title: "The Ambition",
      text: "Stand up a CHRO community to convene on a biannual basis with the aim of discussing critical priorities, exchanging experiences and perspectives, and co-creating actionable insights aimed at addressing shared challenges such as for example initiating social dialogue and influencing regulations."
    },
    {
      number: "03",
      title: "Key Questions",
      text: "What is the vision and success ambition for SynCHRO? How can SynCHRO create distinctive value and meaningful outcomes for Europe's leading CHROs? What priorities should define the future agenda, and how can the founders amplify the long-term impact of the series?"
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
          In the Founders Edition of SynCHRO, we will hold a concise session focused on aligning SynCHRO's vision, goals and success factors, discussing strategic themes, defining the timing of the first edition, and identifying additional organisations to join the community.
          </p>
          </div>
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