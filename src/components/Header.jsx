import logo from "../assets/LOGOSPLIT.svg";

export default function Header() {
  return (
    <header className="
        sticky top-0 z-50 backdrop-blur
        bg-gradient-to-b
        from-[#17172d]/90
        to-[#17172d]/70
        border-b border-white/10
        ">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
         <img src={logo} className="h-6" alt="Logo" />
         <nav className="hidden md:flex items-center gap-6 text-[15.2px] text-white/80">

          <a href="#about" className="relative group pb-1">
            About
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </a>
 
          <a
            href="#register"
            className="
                ml-2
                px-4 py-2
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
            Save the date
            </a>
        </nav>
      </div>
    </header>
  );
}