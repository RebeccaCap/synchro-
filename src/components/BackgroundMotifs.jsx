import asset from "../assets/Graphic2.svg";

export default function BackgroundMotifs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* Top right */}
      <img
        src={asset}
        alt=""
        className="
          absolute
          w-[850px]
          right-[-220px]
          top-[120px]
          opacity-[0.11]
          animate-[driftYSlow_20s_ease-in-out_infinite]
        "
      />

      {/* Bottom left */}
      <img
        src={asset}
        alt=""
        className="
          absolute
          w-[720px]
          left-[-200px]
          bottom-[120px]
          opacity-[0.11]
          animate-[glideB_17s_ease-in-out_infinite]
        "
      />

      <style>
        {`
          @keyframes driftYSlow {
            0%,100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes glideB {
            0%,100% {
              transform: translateX(0);
            }
            40% {
              transform: translateX(18px);
            }
            80% {
              transform: translateX(-8px);
            }
          }
        `}
      </style>
    </div>
  );
}