import { useState } from "react";
import AnneLebel from "../assets/AnneLebel.jpg";
import AkselStenerud from "../assets/AkselStenerud.jpg";
import Capgeminilogo from "../assets/Capgeminilogo.png";
import Equinorlogo from "../assets/Equinorlogo.png";

export default function CoHost() {
    const [openCard, setOpenCard] = useState(null);
    const coHosts = [
        {
        name: "Anne Lebel",
        company: "Capgemini",
        title: "Chief Human Resources Officer & Ethics",
        image: AnneLebel,
        logo: Capgeminilogo,
        logoClass: "h-8",
        description: (
            <>
            <p className="mb-4">
                Group Head of Ethics<br />
                Member of the Group Executive Board
            </p>

            <p className="mb-4">
            Anne Lebel has been Capgemini’s Chief Human Resources Officer and a member of the Group Executive Board since July, 2020. She became Group Head of Ethics in January 2025.            </p>

            <p className="mb-4">
                Prior to joining Capgemini in 2020, Anne was appointed by Natixis in
                2016 as Chief Human Resources Officer and Corporate Culture Officer,
                and a member of the Senior Management Committee.
            </p>

            <p className="mb-4">
                From 2012, Anne was the Global Head of Human Resources of Allianz
                Global Corporate &amp; Specialty. She joined the company in 2008 as Head
                of Human Resources for France, Italy and Spain, and later for Europe
                and Asia, after being the Head of Human Resources for Serono France
                from 2004.
            </p>

            <p className="mb-4">
                Anne started her career in 1987 at Bossard Consultants as an
                organization and change management consultant. In 1997, Anne joined
                Schering Plough France as Human Resources and Training Manager for
                France before moving to head up HR Organization and Development in
                Europe.
            </p>

            <p>
                Anne is also Lead Independent Director of Nexans’ Board of Directors.
                She is a graduate of the Institut d’Etudes Politiques in Strasbourg
                (France) and the Institut d’administration des entreprises (IAE)
                Paris.
            </p>
            </>
        )
        },
        { name: "Aksel Stenerud", company: "Equinor", title: "Executive Vice President, People & Organisation", image: AkselStenerud, logo: Equinorlogo, logoClass: "h-10 mb-2", description: (
            <>
            <p className="mb-4">
               Stenerud joined Equinor in 2008 and has held various leadership roles across the company. His most recent position, which he held from November 2021, was Vice President Employee Relations in Corporate PO.
            </p>
              <p className="mb-4">
              From August 2018, he was Vice President for PO in Exploration and Production International. He has also served as Vice President for Exploration and Production Norway from 2014-2018. 
            </p>
              <p className="mb-4">

            Stenerud has had a long international career within HR and prior to this he served as an officer in the Norwegian Airforce.</p>
            </>
        ) },
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
          SynCHRO is co-chaired by Capgemini and Equinor for its inaugural edition. Co-chairs will be selected from within the CHRO forum in future sessions – ensuring the agenda is always shaped by the people in the room.
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
                <div className="flex items-center gap-3 mb-2">
                <p className="md:text-[1.28rem] sm:text-sm font-semibold tracking-[-0.025em] text-[#fefaf5]">
                    {host.name}
                </p>

                <img
                    src={host.logo}
                    alt={`${host.company} logo`}
                    className={`${host.logoClass} w-auto object-contain shrink-0`}
                />
                </div>

                <p className="text-[0.9rem] font-medium text-[#fefaf5] mb-1">
                {host.title}
                </p>

                <p className="text-[0.85rem] text-[#fefaf5]/60">
                {host.company}
                </p>

                </div>
              </div>

             <div className="border-t border-white/10 pt-5">
                <button
                    type="button"
                    onClick={() =>
                    setOpenCard(openCard === i ? null : i)
                    }
                    className="
                    flex
                    items-center
                    justify-between
                    w-full
                    text-left
                    text-sm
                    text-[#fefaf5]/80
                    hover:text-[#fefaf5]
                    transition-colors
                    "
                >
                    <span>
                    {openCard === i ? "Read less" : "Read more"}
                    </span>

                    <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                        openCard === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                    </svg>
                </button>

                <div
                    className={`
                    overflow-hidden
                    transition-all
                    duration-500
                    ${
                        openCard === i
                        ? "max-h-[1000px] opacity-100 mt-5"
                        : "max-h-0 opacity-0"
                    }
                    `}
                >
                    <div className="text-xs leading-[1.74] text-[#fefaf5]/70">
                    {host.description}
                    </div>
                </div>
                </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}