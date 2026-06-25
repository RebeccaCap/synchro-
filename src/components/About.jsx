export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          
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
                About
              </span>
            </div>

            <h2 className="
              text-[clamp(2rem,1.5rem+2vw,3.8rem)]
              leading-[0.95]
              tracking-[-0.05em]
              font-bold
              max-w-[11ch]
              text-white/90
            ">
              Lorem ipsum dolor sit amet.
            </h2>
          </div>

          <p className="text-white/70 max-w-xl leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="
                relative
                p-6
                border border-white/10
                bg-white/[0.06]
                overflow-hidden
              "
            >
              
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] to-[#cf6102]" />

              <p className="text-xs text-white/50">
                0{n}
              </p>

              <h3 className="mt-3 text-xl font-medium tracking-tight text-white/80">
                Lorem ipsum dolor sit amet
              </h3>

              <p className="mt-3 text-white/70 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Non pulvinar neque laoreet suspendisse interdum.
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}