import logo from "../assets/LOGOLIGHT.svg";

export default function Header() {
  return (
    <header className="sticky top-0 backdrop-blur bg-[#283c4f]/80 border-b border-white/10 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
         <img src={logo} className="h-6" alt="Logo" />
         <nav className="hidden md:flex items-center gap-6 text-[15.2px] text-white/80">

          <a href="#about" className="relative group pb-1">
            About
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="#agenda" className="relative group pb-1">
            Agenda
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white/80 transition-all duration-300 group-hover:w-full"></span>
          </a>

          <a href="#register" className="relative group pb-1">
            Register
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
            Request Invite
            </a>
        </nav>
      </div>
    </header>
  );
}