import logo from "../assets/LOGOSPLIT.svg";
import logo1 from "../assets/LOGO1.svg";
import EventCard from "./EventCard";
import { useUpcomingEvent } from "../hooks/useEvents";
import { CONTAINER, HERO_SPACING } from "../layout";
//import BNPParibas from "../assets/BNPParibaslogo.png";
//import CreditAgricole from "../assets/CreditAgricolelogo.png";
//import HSBC from "../assets/HSBClogo.png";
//import IKEA from "../assets/IKEAlogo.png";
//import INGGroup from "../assets/INGGrouplogo.png";
//import Klarna from "../assets/Klarnalogo.png";
//import LEGO from "../assets/LEGOlogo.png";
//import Loreal from "../assets/Loreallogo.png";
//import NovoNordisk from "../assets/NovoNordisklogo.png";
//import Roche from "../assets/Rochelogo.png";
//import Shell from "../assets/Shelllogo.png";
//import Spotify from "../assets/Spotifylogo.png";
//import Vodafone from "../assets/Vodafonelogo.png";
//import Yara from "../assets/Yaralogo.png";
//import Capgemini from "../assets/Capgeminilogo.png";
//import Equinor from "../assets/Equinorlogo.png";
//import Kongstad from "../assets/KONGSBERG_logo_horizontal.png";

const HEADING = "Accelerating European Competitiveness";
const INTRO =
  "The CHRO landscape is experiencing relentless disruption. Technology and AI, skills transformation, regulations, geopolitical uncertainty, and shifts in talent dynamics are reshaping the workforce. These disruptions are happening all while mounting cost pressures demand clearer business value.";
const INTRO_EMPHASIS =
  "As a consequence, the CHRO role is becoming more complex and more critical than ever.";

export default function Hero() {
  const event = useUpcomingEvent();
  //const logos = [BNPParibas, CreditAgricole, HSBC, IKEA, Klarna, LEGO, Loreal, NovoNordisk, Roche, Shell, Spotify, Vodafone, INGGroup, Yara];
  //const confirmedLogos = [Capgemini, Equinor, Yara, Kongstad];
  return (
    <section className={`${HERO_SPACING} overflow-hidden`}>
      <div className={`${CONTAINER} overflow-hidden grid md:grid-cols-2 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-10`}>
        <div className="text-center md:text-left">
          {!event && (
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span
              className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
              style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
              }}
            />

            <p className="uppercase md:text-xs text-[10px] tracking-[0.2em] text-ink/50 dark:text-paper/40 font-medium">
              New session to be announced soon
            </p>
          </div>
          )}

     <div>
        <img
            src={logo}
            className="mt-4 mx-auto md:mx-0 max-w-[260px] sm:max-w-sm md:max-w-[26rem] hidden dark:block"
            alt="Logo"
        />

        <img
            src={logo1}
            className="mt-4 mx-auto md:mx-0 max-w-[260px] sm:max-w-sm md:max-w-[26rem] block dark:hidden"
            alt="Logo"
        />
        </div>

          <h1
            className="
              mt-6
              text-[clamp(1.8rem,1.35rem+1.8vw,3rem)]
              leading-[1.02]
              tracking-[-0.05em]
              font-medium
              max-w-[18ch]
              text-ink
              dark:text-paper
              mx-auto md:mx-0
            "
          >
            {HEADING}
          </h1>

          <p className="mt-6 text-ink/80 dark:text-paper/80 max-w-xl lg:max-w-2xl leading-relaxed mx-auto md:mx-0">
          {INTRO} <strong className="font-semibold text-ink dark:text-paper">{INTRO_EMPHASIS}</strong>
          </p>

          {/* <div className="mt-36 ">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
                }}
              />
              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
                Our growing list of confirmed participants
              </span>
            </div>
          <div className="mt-4 border border-white/10 dark:bg-[#fefaf5] overflow-hidden">
            <div className="relative overflow-hidden">
              <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-10 px-4 py-3 shrink-0"
                  >
                    {confirmedLogos.map((logo, index) => (
                      <img
                        key={index}
                        src={logo}
                        className="h-8"
                        alt="Logo"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div> */}

        </div>

        {event && (
          <div className="md:pt-6">
            <EventCard event={event} />
          </div>
        )}
      </div>
    </section>
  );
}
