import ThemeCard from "./ThemeCard";
import { CONTAINER, SECTION_SPACING } from "../layout";

const EYEBROW = "Themes";
const TITLE = "Shaping the CHRO agenda";
const INTRO = "Initial SynCHRO discussions highlighted several key themes to explore further.";

const THEMES = [
  {
    title: "AI and Workforce Transformation",
    description: "How AI is reshaping work, workforce needs and the role of organisations and CHROs.",
  },
  {
    title: "Skills, Learning and Employability",
    description: "Building the skills, mobility and employability needed as work continues to change.",
  },
  {
    title: "Competitiveness",
    description:
      "Strengthening competitiveness while balancing business performance, employee trust and broader societal responsibilities.",
  },
  {
    title: "Trust",
    description: "Building trust, engagement and organisational commitment through continuous change.",
  },
  {
    title: "The Regulatory Landscape",
    description:
      "Navigating an evolving European regulatory environment and its implications for organisations and the workforce.",
  },
];

export default function Themes() {
  return (
    <section id="themes" className={SECTION_SPACING}>
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
          {TITLE}
        </h2>

        <p className="mt-8 max-w-xl leading-relaxed text-ink/70 dark:text-paper/70">{INTRO}</p>

        <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {THEMES.map(({ title, description }) => (
            <li key={title}>
              <ThemeCard title={title} description={description} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
