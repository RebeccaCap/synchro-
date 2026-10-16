export default function NextSession() {
  return (
    <section id="next-session" className="py-16">
      <div
        className="
          relative
          max-w-6xl
          mx-auto
          px-6
          md:px-12
          py-12
          md:py-16
          border
          border-ink/10
          dark:border-white/10
          bg-white/60
          dark:bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-purpleLight dark:to-purpleDark" />
        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(218,65,15,.20),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(225,103,49,.20),transparent_70%)] pointer-events-none" />
        <div className="absolute left-[-8%] top-[-30%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,rgba(92,90,179,.16),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(122,120,238,.18),transparent_70%)] pointer-events-none" />

        <div className="relative">
          <h2
            className="
              text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
              leading-[0.93]
              tracking-[-0.065em]
              font-bold
              max-w-[16ch]
              text-ink
              dark:text-paper
            "
          >
            New Session to be announced soon
          </h2>

          <p className="mt-6 text-ink/70 dark:text-paper/70">
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
    </section>
  );
}
