import asset from "../assets/ASSET.png";

export default function Agenda() {
  const items = [
    { time: "09:00", title: "Lorem ipsum dolor", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
    { time: "10:30", title: "Consectetur adipiscing", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
    { time: "12:00", title: "Sed do eiusmod tempor", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
    { time: "14:15", title: "Ut labore et dolore", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  ];

  return (
    <section id="agenda" className="py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <div>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-[14px] h-[14px]"
              style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                background: "linear-gradient(135deg, #cf6102, #036bcf)"
              }}
            />
            <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
              Agenda
            </span>
          </div>

          <h2 className="
            text-[clamp(2rem,1.5rem+2vw,3.8rem)]
            leading-[0.95]
            tracking-[-0.05em]
            font-bold
            max-w-[12ch]
            text-white/90
            mb-6
          ">
            Lorem ipsum agenda preview.
          </h2>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="
                  grid md:grid-cols-[100px_1fr] gap-4
                  p-4
                  border border-white/10
                  bg-white/[0.05]
                  hover:bg-white/[0.08]
                  transition-all duration-300
                "
              >
                <div className="font-medium text-white/90">
                  {item.time}
                </div>

                <div>
                  <h4 className="font-medium tracking-tight text-white">
                    {item.title}
                  </h4>
                  <p className="text-white/70 mt-1 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="
            relative
            border border-white/10
            bg-white/[0.06]
            min-h-[320px]
            flex flex-col
            overflow-hidden
          "
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] via-[#4f94d9] to-[#cf6102]" />

          <div className="p-6">
            <p className="uppercase text-xs tracking-[0.2em] text-white/60">
              Visual
            </p>

            <h3 className="mt-2 text-xl font-medium tracking-tight text-white/80 max-w-[16ch]">
              Lorem ipsum built from supplied assets.
            </h3>

            <p className="mt-2 text-white/70 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>


        <div className="relative mt-auto border-t border-white/10 min-h-[280px] overflow-hidden
        bg-[radial-gradient(circle_at_18%_18%,rgba(3,107,207,.18),transparent_24%),radial-gradient(circle_at_78%_20%,rgba(207,97,2,.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))]">

        <img
            src={asset}
            className="absolute w-[60%] left-[-4%] top-[20px] opacity-95"
            style={{ animation: "glideB 12s cubic-bezier(.22,1,.36,1) infinite" }}
            alt=""
        />

        <img
            src={asset}
            className="absolute w-[42%] right-[8%] top-[90px] opacity-95"
            style={{ animation: "glideC 11s cubic-bezier(.22,1,.36,1) infinite" }}
            alt=""
        />

        <img
            src={asset}
            className="absolute w-[30%] left-[24%] bottom-[30px] opacity-85"
            style={{ animation: "driftY 9s cubic-bezier(.22,1,.36,1) infinite" }}
            alt=""
        />

        </div>

        <style>
        {`
        @keyframes driftY {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes glideB {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(14px, -12px, 0); }
        }

        @keyframes glideC {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(-12px, -10px, 0); }
        }
        `}
        </style>
        </div>

      </div>
    </section>
  );
}