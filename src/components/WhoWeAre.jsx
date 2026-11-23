import { Eyebrow } from "../pages/shared";

const LOGOS = [
  { name: "DNB", src: "/logos/logo-dnb.svg" },
  { name: "Crédit Agricole", src: "/logos/logo-creditagricole.svg" },
  { name: "Kongsberg", src: "/logos/logo-kongsberg.svg" },
  { name: "Shell", src: "/logos/logo-shell.svg" },
  { name: "Yara", src: "/logos/logo-yara.svg" },
  { name: "Equinor", src: "/logos/logo-equinor.svg" },
  { name: "Capgemini", src: "/logos/logo-cap.svg" },
];

export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <Eyebrow>Who we are</Eyebrow>

        <h2
          className="
            mt-[10px]
            text-[clamp(2.2rem,1.6rem+2vw,4.4rem)]
            leading-[0.92]
            tracking-[-0.065em]
            font-bold
            text-ink
            dark:text-paper
          "
        >
          The SynCHRO Community
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70 dark:text-paper/70">
          SynCHRO brings together CHROs from leading European organisations to
          discuss shared opportunities, assess priorities and develop clear
          actions that drive change.
        </p>

        <ul className="mt-14 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-10 items-center">
          {LOGOS.map(({ name, src }) => (
            <li key={name} className="flex items-center justify-center">
              <img
                src={src}
                alt={name}
                loading="lazy"
                className="h-12 md:h-14 w-full max-w-[110px] object-contain invert dark:invert-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
