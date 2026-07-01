import { useEffect, useState } from "react";
import logo from "../assets/LOGOSPLIT.svg";
import logo1 from "../assets/LOGO1.svg";

export default function Header() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return (
    <header
      className="
        sticky top-0 z-50 backdrop-blur
        bg-gradient-to-b
        from-paper/90
        to-paper/70
        dark:from-ink/90
        dark:to-ink/70
        border-b
        border-ink/10
        dark:border-paper/10
      "
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <div>
        <img
            src={logo}
            className="h-6 hidden dark:block"
            alt="Logo"
        />

        <img
            src={logo1}
            className="h-6 block dark:hidden"
            alt="Logo"
        />
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-[15.2px] text-ink/80 dark:text-paper/80">
            <a href="#about" className="relative group pb-1">
              About
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-ink/80 dark:bg-paper/80 transition-all duration-300 group-hover:w-full"></span>
            </a>

            <a
              href="#register"
              className="
                ml-2
                px-4 py-2
                rounded-md
                bg-orangeLight
                dark:bg-orangeDark
                text-white
                font-medium
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-lg
                hover:brightness-105
                active:translate-y-0
                active:shadow-none
              "
            >
              Join the forum
            </a>
          </nav>

            <button
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
            title={
                theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`
                relative
                w-14
                h-8
                rounded-full
                transition-all
                duration-300
                ${
                theme === "dark"
                    ? "bg-purpleDark"
                    : "bg-orangeLight"
                }
            `}
            >
            <span
                className={`
                absolute
                top-1
                h-6
                w-6
                rounded-full
                bg-white
                shadow-md
                transition-all
                duration-300
                ${
                    theme === "dark"
                    ? "left-7"
                    : "left-1"
                }
                `}
            />
            </button>
        </div>
      </div>
    </header>
  );
}