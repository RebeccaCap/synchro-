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
       <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] via-[#4f94d9] to-[#cf6102]" />

        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-[14px] h-[14px]"
            style={{
              clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
              background: "linear-gradient(135deg, #cf6102, #036bcf)"
            }}
          />
          <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
            Highlight
          </span>
        </div>

        <h2 className="
          text-[clamp(2.2rem,1.6rem+2vw,4.4rem)]
          leading-[0.92]
          tracking-[-0.06em]
          font-bold
          max-w-[12ch]
          text-white/90
        ">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </h2>

        <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
          tempor incididunt ut labore et dolore magna aliqua.
        </p>

      </div>
    </section>
  );
}