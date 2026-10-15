import { useEffect } from "react";
import BackgroundMotifs from "../components/BackgroundMotifs";
import logo from "../assets/LOGOSPLIT.svg";
import logo1 from "../assets/LOGO1.svg";

export const cardClass =
  "relative border border-ink/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.06]";

export const inputClass = `
  h-12 w-full px-4
  bg-white dark:bg-black/20
  border border-ink/10 dark:border-white/10
  text-ink dark:text-paper
  placeholder:text-ink/40 dark:placeholder:text-paper/40
  focus:outline-none focus:border-orangeLight dark:focus:border-orangeDark
  transition-colors
`;

export const primaryButtonClass = `
  inline-flex items-center justify-center gap-2
  h-12 px-6
  rounded-md
  bg-orangeLight dark:bg-orangeDark
  text-white font-medium
  transition-all duration-300
  hover:brightness-105 hover:shadow-[0_12px_36px_rgba(225,103,49,0.3)]
  disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
`;

export const secondaryButtonClass = `
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-md
  border border-ink/15 dark:border-paper/15
  text-sm font-medium text-ink/80 dark:text-paper/80
  transition-colors
  hover:border-ink/40 dark:hover:border-paper/40 hover:text-ink dark:hover:text-paper
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export function GradientLine() {
  return (
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purpleLight dark:from-purpleDark via-orangeLight dark:via-orangeDark to-purpleLight dark:to-purpleDark" />
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span
        className="w-[14px] h-[14px] bg-orangeLight dark:bg-orangeDark"
        style={{ clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)" }}
      />
      <span className="uppercase text-xs tracking-[0.2em] text-ink/60 dark:text-paper/60 font-medium">
        {children}
      </span>
    </div>
  );
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm text-red-600 dark:text-red-400">
      {children}
    </p>
  );
}

export function PageShell({ actions, children }) {
  // Keep these pages out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <>
      <BackgroundMotifs />
      <header className="sticky top-0 z-50 backdrop-blur bg-gradient-to-b from-paper/90 to-paper/70 dark:from-ink/90 dark:to-ink/70 border-b border-ink/10 dark:border-paper/10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
          <a href="/" aria-label="SynCHRO home">
            <img src={logo} className="h-6 hidden dark:block" alt="SynCHRO" />
            <img src={logo1} className="h-6 block dark:hidden" alt="SynCHRO" />
          </a>
          <div className="flex items-center gap-3">{actions}</div>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16">{children}</main>
    </>
  );
}

export function formatDateTime(seconds) {
  return new Date(seconds * 1000).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function fileExtension(name) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toUpperCase().slice(0, 4) : "FILE";
}

export function FileBadge({ name }) {
  return (
    <span className="flex items-center justify-center shrink-0 w-12 h-12 border border-ink/10 dark:border-paper/15 bg-ink/[0.03] dark:bg-paper/[0.05] text-[0.65rem] font-semibold tracking-[0.08em] text-purpleLight dark:text-purpleDark">
      {fileExtension(name)}
    </span>
  );
}
