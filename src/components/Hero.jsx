import asset from "../assets/ASSET.png";

export default function Hero() {
  return (
    <section className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
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
            src={asset}
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
            <button className="
              bg-orange-600 px-6 py-3 w-full sm:w-auto text-white rounded-md
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(207,97,2,0.35)]
            ">
              Request Invite
            </button>

            <button className="
              border border-white/30 px-6 py-3 w-full sm:w-auto text-white rounded-md
              transition-all duration-300
              hover:-translate-y-1 hover:bg-white/5
            ">
              Lorem Ipsum
            </button>
          </div>

          <div className="mt-6 overflow-hidden border border-white/10 bg-white/5">
            <div className="whitespace-nowrap flex gap-8 animate-[marquee_20s_linear_infinite] py-3 px-4 text-xs tracking-[0.2em] uppercase text-white/60">
              <span>
                <strong className="text-white">Accelerating European Competitiveness</strong> / Lorem Ipsum /
              </span>
              <span>
                <strong className="text-white">Accelerating European Competitiveness</strong> / Lorem Ipsum /
              </span>
            </div>
          </div>
        </div>

        <div className="
          relative
          border border-white/10
          h-[300px] sm:h-[380px] md:h-[500px]
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

         <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            {[1,2,3,4,5,6].map((i) => (
                <div
                key={i}
                className="relative overflow-hidden border border-white/[0.05] bg-white/[0.03]"
                style={{ height: `${18 + (i % 3) * 4}px` }}
                >
                <div
                    className={`
                    absolute inset-0 w-[220%]
                    ${i % 2 === 0
                        ? "animate-[scanR_28s_linear_infinite]"
                        : "animate-[scanL_24s_linear_infinite]"
                    }
                    `}
                    style={{
                    backgroundImage: `
                        linear-gradient(
                        90deg,
                        transparent 0%,
                        transparent 6%,

                        #036bcf 6% 14%,
                        #cf6102 14% 22%,

                        transparent 22% 28%,

                        #cf6102 28% 36%,
                        #036bcf 36% 48%,

                        transparent 48% 55%,

                        #036bcf 55% 62%,
                        #cf6102 62% 72%,

                        transparent 72% 80%,

                        #cf6102 80% 90%,
                        #036bcf 90% 100%
                        )
                    `
                    }}
                />
                </div>
            ))}
            </div>
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