import logo from "../assets/LOGOSPLIT.svg";

export default function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-6xl mx-auto px-6 border-t border-white/10 pt-6 flex justify-between text-sm text-white/50">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-5" alt="Logo"/>
          <p>Accelerating European Competitiveness | SynCHRO Forum 2026</p>
        </div>

      </div>
    </footer>
  );
}