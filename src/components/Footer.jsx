import logo from "../assets/LOGOSPLIT.svg";
import logo1 from "../assets/LOGO1.svg";

export default function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-6xl mx-auto px-6 border-t border-ink/10 dark:border-white/10 pt-6 flex justify-between items-center text-sm text-ink/50 dark:text-paper/50">
        <div className="flex items-center gap-3">
          <div>
            <img
              src={logo}
              className="h-5 hidden dark:block"
              alt="Logo"
            />

            <img
              src={logo1}
              className="h-5 block dark:hidden"
              alt="Logo"
            />
          </div>

          <p>
            Accelerating European Competitiveness | SynCHRO Forum 2026
          </p>
        </div>

        <a
        href="/privacy-policy.html"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-ink dark:hover:text-paper transition-colors"
        >
        Privacy Notice
        </a>

      </div>
    </footer>
  );
}