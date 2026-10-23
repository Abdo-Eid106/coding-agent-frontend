import type { SVGProps } from "react";
import { cn } from "../lib/cn";

export default function AntigravityPauseIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-3.5 inline-block shrink-0 select-none", className)}
      {...props}
    >
      <style>{`
        @keyframes ag-orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ag-orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes ag-glow-pulse {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        .ag-cw {
          transform-origin: 8px 8px;
          animation: ag-orbit-cw 1.8s linear infinite;
        }
        .ag-ccw {
          transform-origin: 8px 8px;
          animation: ag-orbit-ccw 2.6s linear infinite;
        }
        .ag-pulse {
          transform-origin: 8px 8px;
          animation: ag-glow-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Static track */}
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.22"
      />

      {/* Pulsing core glow */}
      <circle
        cx="8"
        cy="8"
        r="4"
        fill="currentColor"
        className="ag-pulse"
      />

      {/* Clockwise spinning orbital arc */}
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeDasharray="14 27"
        className="ag-cw"
      />

      {/* Counter-clockwise orbiting particle */}
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeDasharray="4 37"
        strokeOpacity="0.75"
        className="ag-ccw"
      />

      {/* Centered rounded stop square */}
      <rect
        x="5.5"
        y="5.5"
        width="5"
        height="5"
        rx="1.2"
        fill="currentColor"
      />
    </svg>
  );
}
