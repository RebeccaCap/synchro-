import asset from "../assets/ASSET.png";

export default function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-6xl mx-auto px-6 border-t border-white/10 pt-6 flex justify-between text-sm text-white/50">
        <div className="flex items-center gap-3">
          <img src={asset} className="h-5" />
          <p>Lorem ipsum dolor sit amet</p>
        </div>

        <p>#036bcf / #cf6102 / #283c4f</p>
      </div>
    </footer>
  );
}