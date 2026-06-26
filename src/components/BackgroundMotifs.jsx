import asset from "../assets/ASSET1.svg";

export default function BackgroundMotifs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

      <img
        src={asset}
        className="absolute w-[220px] top-[10%] left-[5%] opacity-[0.08] animate-[floatA_25s_ease-in-out_infinite]"
        alt=""
      />

      <img
        src={asset}
        className="absolute w-[180px] top-[25%] right-[10%] opacity-[0.07] animate-[floatB_28s_ease-in-out_infinite]"
        alt=""
      />

      <img
        src={asset}
        className="absolute w-[260px] bottom-[15%] left-[10%] opacity-[0.06] animate-[floatC_30s_ease-in-out_infinite]"
        alt=""
      />

      <img
        src={asset}
        className="absolute w-[200px] bottom-[20%] right-[5%] opacity-[0.05] animate-[floatD_35s_ease-in-out_infinite]"
        alt=""
      />

      <img
        src={asset}
        className="absolute w-[140px] top-[50%] left-[40%] opacity-[0.05] animate-[floatA_40s_ease-in-out_infinite]"
        alt=""
      />

      <style>
        {`
          @keyframes floatA {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(-20px, -30px, 0); }
          }

          @keyframes floatB {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(25px, -20px, 0); }
          }

          @keyframes floatC {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(-15px, 20px, 0); }
          }

          @keyframes floatD {
            0%,100% { transform: translate3d(0,0,0); }
            50% { transform: translate3d(20px, 15px, 0); }
          }
        `}
      </style>

    </div>
  );
}