import { CONTAINER, SECTION_SPACING } from "../layout";

const EYEBROW = "Format";

const TITLE_LINES = ["Shared challenges.", "Trusted perspectives."];

const COLUMNS = [
  {
    heading: "How SynCHRO works",
    paragraphs: [
      "SynCHRO creates a space where CHROs can connect, exchange perspectives and explore the future of HR together. In-person gatherings enable candid conversations, deeper peer learning and collective thinking around the challenges and opportunities ahead. Clear, prioritised action points are expected outcomes from the in-person peer dialogue, with the SynCHRO community having a collective responsibility for progressing these actions. Between gatherings, shorter virtual sessions sustain the dialogue and build a stronger, more connected community.",
    ],
  },
  {
    heading: "Building the SynCHRO community",
    paragraphs: [
      "The strength of SynCHRO comes from the people who shape it. Active participation, open exchange and diverse perspectives across the SynCHRO community are essential in driving progressive and impactful change.",
      "To broaden the community’s perspectives, geographical reach and industry representation, we are looking towards European headquartered multinationals spanning Aerospace & Defence, Automotive, Consumer Products & Retail, Life Sciences & Health, Manufacturing, Financial Services, Technology & Software, Telecommunications & Entertainment, and Transport & Logistics to engage with.",
    ],
  },
];

export default function Format() {
  return (
    <section id="format" className={SECTION_SPACING}>
      <div className={CONTAINER}>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
            style={{
              clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
            }}
          />
          <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
            {EYEBROW}
          </span>
        </div>

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
          {TITLE_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-10">
          {COLUMNS.map(({ heading, paragraphs }) => (
            <div key={heading}>
              <h3 className="text-2xl font-bold tracking-tight text-ink dark:text-paper">
                {heading}
              </h3>
              <div className="mt-4 max-w-xl space-y-5 leading-relaxed text-ink/70 dark:text-paper/70">
                {paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
