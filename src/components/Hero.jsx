import asset from "../assets/Graphic1.svg";
import logo from "../assets/LOGOSPLIT.svg";
import BNPParibas from "../assets/BNPParibaslogo.png";
import CreditAgricole from "../assets/CreditAgricolelogo.png";
import HSBC from "../assets/HSBClogo.png";
import IKEA from "../assets/IKEAlogo.png";
import INGGroup from "../assets/INGGrouplogo.png";
import Klarna from "../assets/Klarnalogo.png";
import LEGO from "../assets/LEGOlogo.png";
import Loreal from "../assets/Loreallogo.png";
import NovoNordisk from "../assets/NovoNordisklogo.png";
import Roche from "../assets/Rochelogo.png";
import Shell from "../assets/Shelllogo.png";
import Spotify from "../assets/Spotifylogo.png";
import Vodafone from "../assets/Vodafonelogo.png";
import Yara from "../assets/Yaralogo.png";

export default function Hero() {
const logos = [BNPParibas, CreditAgricole, HSBC, IKEA, Klarna, LEGO, Loreal, NovoNordisk, Roche, Shell, Spotify, Vodafone, INGGroup, Yara];
  return (
    <section className="py-10 md:py-16 overflow-hidden">
      <div className="max-w-md md:max-w-6xl mx-auto px-4 overflow-hidden grid md:grid-cols-2 gap-10">
        <div className="text-center md:text-left"> 
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span
                className="w-[14px] h-[14px] bg-[#da410f]"
                style={{
                    clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
                }}
                />
            <p className="uppercase md:text-xs text-[10px]  tracking-[0.2em] text-white/40 font-medium">
              CHRO Forum · October 15, 2026
            </p>
          </div>

          <img
            src={logo}
            className="mt-6 mx-auto md:mx-0 max-w-[220px] sm:max-w-xs"
            alt="Logo"
          />

          <h1 className="
            mt-4
            text-[clamp(1.8rem,1.35rem+1.8vw,3rem)]
            leading-[1.02]
            tracking-[-0.05em]
            font-medium
            max-w-[18ch]
            text-white/70
            mx-auto md:mx-0
          ">
            Accelerating European Competitiveness
          </h1>

          <p className="mt-4 text-white/80 max-w-md mx-auto md:mx-0">
          You have been invited to join a small, senior group of European CHROs for a day of candid peer exchange on the talent and organisational challenges shaping Europe's competitive future. We look forward to welcoming you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href="#register"
            className="
                inline-flex items-center justify-center
                px-6 py-3
                rounded-md
                bg-orange-600
                text-white
                font-medium

                transition-all duration-300

                hover:-translate-y-1
                hover:shadow-[0_12px_40px_rgba(207,97,2,0.35)]
                hover:brightness-105

                active:translate-y-0 active:shadow-none
            "
            >
            RSVP
            </a>

          </div>
          <div className="mt-6 hidden border border-white/10 bg-white/5 overflow-hidden">
            <div className="relative overflow-hidden">
                <div className="flex whitespace-nowrap animate-[marquee_18s_linear_infinite]">

                {[...Array(2)].map((_, i) => (
                    <div
                    key={i}
                    className="flex items-center gap-10 px-4 py-3 shrink-0"
                    >
                    {logos.map((logo, index) => (
                        <img
                        key={index}
                        src={logo}
                        alt="partner logo"
                        className="
                            h-10
                            w-auto
                            object-contain
                            opacity-90
                            hover:opacity-100
                            hover:grayscale-0
                            transition duration-300
                        "
                        />
                    ))}
                    </div>
                ))}

                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}