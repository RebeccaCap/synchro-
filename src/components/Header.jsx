import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import logo from "../assets/LOGOSPLIT.svg";
import logo1 from "../assets/LOGO1.svg";

// Anchors shown in the navbar, in page order. Edit this list as sections change.
const NAV_ITEMS = [
  { label: "Who We Are", id: "who-we-are" },
  { label: "About", id: "about" },
  { label: "Format", id: "format" },
  { label: "Co-Chairs", id: "co-chairs" },
];

// Same duration as the theme cross-fade (index.css) so the UI feels consistent.
const menuTransition = "duration-[400ms] ease-in-out motion-reduce:transition-none";
const barClass = `absolute left-0 h-[2px] w-6 rounded bg-current transition-all ${menuTransition}`;

const underlineClass =
  "absolute left-0 bottom-0 w-0 h-[1px] bg-ink/80 dark:bg-paper/80 transition-all duration-300 group-hover:w-full";

function NavLink({ href, label, active, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className="relative group pb-1 inline-flex flex-col items-center"
    >
      <span className={active ? "font-bold" : undefined}>{label}</span>
      {/* Invisible bold copy reserves the bold width so the nav doesn't shift. */}
      <span aria-hidden="true" className="h-0 overflow-hidden font-bold select-none">
        {label}
      </span>
      <span className={underlineClass}></span>
    </a>
  );
}

export default function Header() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const headerRef = useRef(null);

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)
        );
        const current = NAV_ITEMS.find((item) => visible.has(item.id));
        setActiveId(current ? current.id : null);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on Escape or a click outside the header.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  function handleLogoClick(e) {
    setMenuOpen(false);
    if (window.location.pathname.replace(/\/+$/, "") === "") {
      e.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      // Smoothness comes from `scroll-behavior` in index.css (off for reduced motion).
      window.scrollTo({ top: 0 });
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <header
      ref={headerRef}
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
        <a href="/" onClick={handleLogoClick} aria-label="SynCHRO home">
          <img src={logo} className="h-6 hidden dark:block" alt="" />
          <img src={logo1} className="h-6 block dark:hidden" alt="" />
        </a>

        <div className="flex items-center gap-4">
          <nav
            aria-label="Main"
            className="hidden md:flex items-center gap-6 text-[15.2px] text-ink/80 dark:text-paper/80"
          >
            {NAV_ITEMS.map(({ label, id }) => (
              <NavLink key={id} href={`#${id}`} label={label} active={activeId === id} />
            ))}
            <NavLink href="/presentation" label="Downloads" />
          </nav>

          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`
              relative w-14 h-8 rounded-full transition-all duration-300
              ${theme === "dark" ? "bg-purpleDark" : "bg-orangeLight"}
            `}
          >
            <span
              className={`
                absolute top-1 h-6 w-6 rounded-full bg-white shadow-md
                transition-all duration-300
                ${theme === "dark" ? "left-7" : "left-1"}
              `}
            />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex items-center justify-center w-10 h-10 text-ink dark:text-paper"
          >
            <span className="relative block w-6 h-5" aria-hidden="true">
              <span className={`${barClass} ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
              <span className={`${barClass} top-1/2 -translate-y-1/2 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`${barClass} ${menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : ""}
        className={`
          md:hidden absolute top-full left-0 right-0
          bg-paper dark:bg-ink
          border-b border-ink/10 dark:border-paper/10
          text-ink/80 dark:text-paper/80
          transition-[opacity,transform,visibility] ${menuTransition}
          ${
            menuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible pointer-events-none"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-start gap-4 text-base">
          {NAV_ITEMS.map(({ label, id }) => (
            <NavLink
              key={id}
              href={`#${id}`}
              label={label}
              active={activeId === id}
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <NavLink href="/presentation" label="Downloads" onClick={() => setMenuOpen(false)} />
        </div>
      </nav>
    </header>
  );
}
