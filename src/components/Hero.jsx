import asset from "../assets/ASSET1.svg";
import logo from "../assets/LOGOLIGHT.svg";
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
              className="w-[14px] h-[14px]"
              style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                background: "linear-gradient(135deg, #cf6102, #036bcf)"
              }}
            />
            <p className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
              CHRO Forum
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
            text-white/80
            mx-auto md:mx-0
          ">
            Accelerating European Competitiveness
          </h1>

          <p className="mt-4 text-white/80 max-w-md mx-auto md:mx-0">
            Lorem ipsum dolor sit amet...
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
            Add to Calendar
            </a>

            <button className="
              border border-white/30 px-6 py-3 w-full sm:w-auto text-white rounded-md
              transition-all duration-300
              hover:-translate-y-1 hover:bg-white/5
            ">
              Lorem Ipsum
            </button>
          </div>
          <div className="mt-6 hidden md:block border border-white/10 bg-white/5 overflow-hidden">
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
                            h-8
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

        <div className="
          hidden md:block
          relative
          border border-white/10
          h-[500px]
          overflow-hidden
          bg-[radial-gradient(circle_at_16%_10%,rgba(3,107,207,.18),transparent_22%),radial-gradient(circle_at_78%_16%,rgba(207,97,2,.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))]
        ">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] via-[#cf6102] to-[#036bcf]" />
          <img alt="" src={asset} className="absolute w-[60%] right-[-30px] top-[80px] opacity-95 animate-[glideA_10s_ease-in-out_infinite]" />
          <img alt="" src={asset} className="absolute w-[45%] left-[30px] top-[180px] opacity-95 animate-[glideB_11s_ease-in-out_infinite]" />
          <img alt="" src={asset} className="absolute w-[28%] left-[-10px] top-[60px] opacity-80 animate-[driftY_9s_ease-in-out_infinite]" />
          <img alt="" src={asset} className="absolute w-[30%] right-[40px] bottom-[160px] opacity-80 animate-[glideC_12s_ease-in-out_infinite]" />
          <img alt="" src={asset} className="absolute w-[50%] left-[80px] bottom-[80px] opacity-90 animate-[glideD_13s_ease-in-out_infinite]" />
          <img alt="" src={asset} className="absolute w-[35%] right-[-10px] bottom-[60px] opacity-70 animate-[driftYSlow_14s_ease-in-out_infinite]" />
          </div>
        </div>

        <style>
            {`
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }

            @keyframes glideA {0%,100%{transform:translate(0,0);}50%{transform:translate(-18px,12px);}}
            @keyframes glideB {0%,100%{transform:translate(0,0);}50%{transform:translate(14px,-12px);}}
            @keyframes glideC {0%,100%{transform:translate(0,0);}50%{transform:translate(-12px,-10px);}}
            @keyframes glideD {0%,100%{transform:translate(0,0);}50%{transform:translate(16px,8px);}}
            @keyframes driftY {0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
            @keyframes driftYSlow {0%,100%{transform:translateY(0);}50%{transform:translateY(-16px);}}

            @keyframes scanL {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }

            @keyframes scanR {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
            }
            `}
        </style>
        </section>
  );
}