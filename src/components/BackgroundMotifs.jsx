import assetdark from "../assets/A2DarkMode.svg";
import assetlight from "../assets/A2LightMode.svg";

export default function BackgroundMotifs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top right */}
      <img
        src={assetdark}
        alt=""
        className="
          hidden dark:block
          absolute
          w-[850px]
          right-[-220px]
          top-[120px]
          opacity-[0.11]
          animate-[driftYSlow_20s_ease-in-out_infinite]
        "
      />

      <img
        src={assetlight}
        alt=""
        className="
          block dark:hidden
          absolute
          w-[850px]
          right-[-220px]
          top-[120px]
          opacity-[0.08]
          animate-[driftYSlow_20s_ease-in-out_infinite]
        "
      />

      {/* Bottom left */}
      <img
        src={assetdark}
        alt=""
        className="
          hidden dark:block
          absolute
          w-[720px]
          left-[-200px]
          bottom-[120px]
          opacity-[0.11]
          animate-[glideB_17s_ease-in-out_infinite]
        "
      />

      <img
        src={assetlight}
        alt=""
        className="
          block dark:hidden
          absolute
          w-[720px]
          left-[-200px]
          bottom-[120px]
          opacity-[0.08]
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
              transform  0%,100% {
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