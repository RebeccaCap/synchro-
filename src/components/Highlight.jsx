export default function Highlight() {
  return (
    <section className="py-20">
      <div
        className="
          relative
          max-w-6xl mx-auto px-6 py-10
          border border-white/10
          bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="flex items-center gap-2 mb-4">
         <span
            className="w-[14px] h-[14px] bg-[#da410f]"
            style={{
                clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
            }}
            />
          <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
            Why this, why now?
          </span>
        </div>
        
        <h2 className="
            mt-[10px]
            text-[clamp(2.2rem,1.6rem+2vw,4.4rem)]
            leading-[0.92]
            tracking-[-0.065em]
            font-bold
            max-w-[12ch]
            text-[#fefaf5]
            ">
          The decisions European CHROs make in the next two years can define how their organisations compete for the next decade.
        </h2>

        <p className="mt-4 max-w-[58ch] leading-[1.8] text-[#fefaf5]/70">
         Geopolitical uncertainty, regulatory change, and structural shifts in the labour market are landing on HR functions simultaneously, and most forums aren't designed to handle that complexity honestly. SynCHRO is built for exactly this moment: peer leaders, in a trusted setting, working through what it actually means to lead, and act.
        </p>

      </div>
    </section>
  );
}