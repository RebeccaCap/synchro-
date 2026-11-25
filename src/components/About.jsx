const TITLE_LINES = ["Driving the agenda.", "Leading the conversation."];

const COLUMNS = [
  {
    heading: "A forum created by CHROs, for CHROs",
    body: "SynCHRO is a trusted, action-oriented, non-commercial peer forum created by CHROs, for CHROs. The ambition is to bring CHROs together to openly discuss shared opportunities and exchange experiences and perspectives, with the aim of strengthening European competitiveness.",
  },
  {
    heading: "Why now",
    body: "As geopolitical, regulatory, economic and technological changes redefine the workplace, long-held assumptions need to be challenged. Organisations must rethink the purpose of HR and test whether our understanding and expectations for the role of the CHRO are fit for the future.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
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
          {COLUMNS.map(({ heading, body }) => (
            <div key={heading}>
              <h3 className="text-2xl font-bold tracking-tight text-ink dark:text-paper">
                {heading}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-ink/70 dark:text-paper/70">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
