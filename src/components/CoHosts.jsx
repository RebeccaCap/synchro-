import AnneLebel from "../assets/AnneLebel.jpg";
import AkselStenerud from "../assets/AkselStenerud.jpg";
import Capgeminilogo from "../assets/Capgeminilogo.png";
import Equinorlogo from "../assets/Equinorlogo.png";

export default function CoHost() {
    const coHosts = [
        { name: "Anne Lebel", company: "Capgemini", title: "Title", image: AnneLebel, logo: Capgeminilogo },
        { name: "Aksel Stenerud", company: "Equinor", title: "Title", image: AkselStenerud, logo: Equinorlogo },
    ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-[14px] h-[14px] bg-[#da410f]"
            style={{
              clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)"
            }}
          />
          <span className="uppercase text-[0.74rem] tracking-[0.2em] text-[#fefaf5]/45 font-medium">
            Co-Chairs
          </span>
        </div>

        <h2 className="
          text-[clamp(2.2rem,1.4rem+2.6vw,4.2rem)]
          leading-[0.94]
          tracking-[-0.055em]
          font-bold
          text-[#fefaf5]/90
          mb-4
          max-w-[16ch]
        ">
          Meet your co-chairs.
        </h2>

        <p className="mb-6 max-w-[66ch] leading-[1.76] text-[#fefaf5]/70">
          SynCHRO is co-chaired by Capgemini and Equinor for its inaugural edition. Co-chairs will be selected from within the CHRO community in future forums — ensuring the agenda is always shaped by the people in the room.
        </p>

        <div className="grid md:grid-cols-2 gap-5">

          {coHosts.map((host, i) => (
            <div
              key={i}
              className="
                relative
                p-[30px]
                border border-white/10
                rounded-[4px]
                bg-[linear-gradient(180deg,rgba(254,250,245,.07),rgba(254,250,245,.03))]
                overflow-hidden
              "
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7a78ee] to-[#da410f]" />

              <div className="flex items-center gap-[22px] mb-6">
                <div className="
                  w-[100px] h-[100px]
                  rounded-full
                  overflow-hidden
                  border-2 border-[rgba(254,250,245,.14)]
                  shrink-0
                ">
                  <img
                    src={host.image}
                    alt={host.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="md:text-[1.28rem] sm:text-sm font-semibold tracking-[-0.025em] mb-[5px] text-[#fefaf5]">
                    {host.name}
                  </p>
                  <p className="text-[0.9rem] font-medium text-[#da410f] mb-[4px]">
                    {host.title}
                  </p>
                    <img
                        src={host.logo}
                        alt={`${host.company} logo`}
                        className="mt-1 h-10 w-auto object-contain"
                    />
                </div>
              </div>

              <p className="
                text-[0.9rem]
                leading-[1.74]
                text-[#fefaf5]/70
                border-t border-white/10
                pt-5
                m-0
              ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl.
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}