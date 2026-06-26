import AnneLebel from "../assets/AnneLebel.jpg";
import AkselStenerud from "../assets/AkselStenerud.jpg";

const coHosts = [
  { name: "Name", company: "Company", title: "Title", image: AnneLebel },
  { name: "Name", company: "Company", title: "Title", image: AkselStenerud },
];

export default function CoHost() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-[14px] h-[14px]"
            style={{
              clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
              background: "linear-gradient(135deg, #cf6102, #036bcf)",
            }}
          />
          <span className="uppercase text-xs tracking-[0.2em] text-white/60 font-medium">
            Co-hosts
          </span>
        </div>

        <h2 className="text-[clamp(2rem,1.5rem+2vw,3.5rem)] leading-[0.95] tracking-[-0.05em] font-bold text-white/90 mb-12 max-w-[14ch]">
          Meet our co-hosts.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coHosts.map((host, i) => (
            <div
              key={i}
              className="
                flex items-center gap-6
                p-7
                border border-white/10
                bg-white/[0.05]
                hover:bg-white/[0.08]
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              "
            >
              <div className="relative shrink-0">
                <img
                  src={host.image}
                  alt={host.name}
                  className="w-24 h-24 rounded-full object-cover"
                />

                <div className="absolute inset-0 rounded-full border border-white/10" />

                <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition duration-300"
                  style={{
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.05), 0 0 25px rgba(3,107,207,0.3), 0 0 20px rgba(207,97,2,0.3)"
                  }}
                />
              </div>

              <div>
                <p className="text-white text-lg font-medium tracking-tight">
                  {host.name}
                </p>
                <p className="text-orange-500 font-medium">{host.title}</p>
                <p className="text-white/60">
                  {host.company}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}