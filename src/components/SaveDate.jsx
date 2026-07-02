export default function SaveDate() {
  const handleSaveTheDate = () => {
    const link = document.createElement("a");
    link.href =
      "https://synchroforum.eu/synchro-october-2026.ics";
    link.download = "synchro-october-2026.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="register" className="py-17">
      <div
        className="
          relative
          max-w-6xl
          mx-auto
          px-6
          py-12
          border
          border-ink/10
          dark:border-white/10
          bg-white/60
          dark:bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.20),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.20),transparent_70%)]" />

        <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
                style={{
                  clipPath:
                    "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
                }}
              />

              <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60">
                Join the forum
              </span>
            </div>

            <h2
              className="
                text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
                leading-[0.93]
                tracking-[-0.065em]
                font-bold
                max-w-[10ch]
                text-ink
                dark:text-paper
              "
            >
              15 October, 2026
            </h2>

            <p className="mt-4 text-ink/70 dark:text-paper/70 max-w-md leading-relaxed">
              Join us in Paris, France. Full venue details will be announced
              closer to the event.
            </p>
                 
            <div className="mt-6 md:mt-8">
            <button
              onClick={handleSaveTheDate}
              className="
                h-[56px]
                px-8
                rounded-md
                bg-orangeLight
                dark:bg-orangeDark
                text-white
                font-medium
                text-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_16px_50px_rgba(225,103,49,0.35)]
              "
            >
              Save the Date
            </button>
            </div>

            <p className="mt-8 text-ink/70 dark:text-paper/70">
              Questions?{" "}
              <a
                href="mailto:info@synchroforum.eu"
                className="text-orangeLight dark:text-orangeDark hover:underline"
              >
                info@synchroforum.eu
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}