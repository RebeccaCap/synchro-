import { useState } from "react";

export default function CTA() {
  return (
    <section id="register" className="py-24">
      <div
        className="
          relative
          max-w-6xl mx-auto px-6 py-12
          grid md:grid-cols-[1fr_0.9fr] gap-10
          border border-white/10
          bg-white/[0.06]
          overflow-hidden
        "
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#036bcf] via-[#4f94d9] to-[#cf6102]" />

        <div className="absolute right-[-10%] bottom-[-20%] w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(207,97,2,.2),transparent_70%)] pointer-events-none" />

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
              Register
            </span>
          </div>

          <h2 className="
            text-[clamp(2.2rem,1.7rem+2.8vw,4.8rem)]
            leading-[0.93]
            tracking-[-0.065em]
            font-bold
            max-w-[9ch]
            text-white/90
          ">
            Lorem ipsum dolor sit amet.
          </h2>

          <p className="mt-4 text-white/70 max-w-md leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

       <form className="flex flex-col gap-3 relative z-10">

        <input
            name="name"
            className="
            h-[52px]
            px-4
            rounded-md
            border border-white/10
            bg-[#283c4f]/40
            text-white
            placeholder:text-white/40
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/20
            "
            placeholder="Name"
        />

        <input
        name="email"
        type="email"
            className="
            h-[52px]
            px-4
            rounded-md
            border border-white/10
            bg-[#283c4f]/40
            text-white
            placeholder:text-white/40
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/20
            "
            placeholder="Email"
        />

        <input
        name="company"
            className="
            h-[52px]
            px-4
            rounded-md
            border border-white/10
            bg-[#283c4f]/40
            text-white
            placeholder:text-white/40
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/20
            "
            placeholder="Company"
        />

        <button
            className="
            mt-2
            h-[52px]
            rounded-md
            bg-orange-600
            text-white
            font-medium

            transition-all duration-300

            hover:-translate-y-1
            hover:shadow-[0_12px_40px_rgba(207,97,2,0.35)]
            hover:brightness-105
            "
        >
            Request Invite
        </button>
        </form>

      </div>

    </section>
  );
}