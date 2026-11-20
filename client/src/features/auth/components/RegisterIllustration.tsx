import React from "react";

export default function RegisterIllustration() {
  return (
    <div className="relative w-full max-w-[270px] h-[195px] mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="0 0 280 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain drop-shadow-[0_24px_38px_rgba(12,6,42,0.55)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="regCardBg"
            x1="74"
            y1="22"
            x2="206"
            y2="204"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6D50F2" stopOpacity="0.9" />
            <stop offset="0.52" stopColor="#4A2EC2" stopOpacity="0.88" />
            <stop offset="1" stopColor="#2A1778" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient
            id="regCardStroke"
            x1="74"
            y1="22"
            x2="206"
            y2="204"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B8A4FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6B4BE8" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient
            id="regAvatarCircle"
            x1="114"
            y1="46"
            x2="166"
            y2="98"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9D87FF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#6748EA" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient
            id="regPlusBadge"
            x1="152"
            y1="78"
            x2="178"
            y2="104"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8565FF" />
            <stop offset="1" stopColor="#5732DB" />
          </linearGradient>

          <linearGradient
            id="regLineLight"
            x1="92"
            y1="0"
            x2="188"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B5A1FF" stopOpacity="0.85" />
            <stop offset="1" stopColor="#866BF2" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* Floating decorative dots */}
        <circle cx="42" cy="48" r="4.5" fill="#9D85FF" fillOpacity="0.78" />
        <circle cx="28" cy="100" r="3.8" fill="#856AF5" fillOpacity="0.68" />
        <circle cx="235" cy="134" r="2.8" fill="#9C84FF" fillOpacity="0.6" />
        <circle cx="229" cy="176" r="5" fill="#A68EFF" fillOpacity="0.75" />

        {/* Main glassmorphic profile card */}
        <rect
          x="74"
          y="22"
          width="132"
          height="184"
          rx="18"
          fill="url(#regCardBg)"
          stroke="url(#regCardStroke)"
          strokeWidth="1.5"
        />

        {/* Top-right subtle plus accent */}
        <path
          d="M188 38V48M183 43H193"
          stroke="#D7CCFF"
          strokeOpacity="0.75"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Center user avatar circle */}
        <circle cx="140" cy="72" r="27" fill="url(#regAvatarCircle)" />

        {/* White user head & shoulders inside avatar */}
        <circle cx="140" cy="63" r="8.2" fill="#FFFFFF" />
        <path
          d="M124.5 85.5C126.2 78.2 132.3 74.2 140 74.2C147.7 74.2 153.8 78.2 155.5 85.5C151.3 89.2 145.9 91.5 140 91.5C134.1 91.5 128.7 89.2 124.5 85.5Z"
          fill="#FFFFFF"
        />

        {/* Overlapping plus badge on bottom-right of avatar */}
        <circle
          cx="165"
          cy="91"
          r="13"
          fill="url(#regPlusBadge)"
          stroke="#A78FFF"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <path
          d="M165 85.5V96.5M159.5 91H170.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Form / profile skeleton rows */}
        <rect
          x="94"
          y="116"
          width="92"
          height="10"
          rx="5"
          fill="url(#regLineLight)"
        />
        <rect
          x="94"
          y="135"
          width="92"
          height="10"
          rx="5"
          fill="url(#regLineLight)"
          fillOpacity="0.88"
        />
        <rect
          x="94"
          y="154"
          width="66"
          height="9.5"
          rx="4.75"
          fill="#7D62E8"
          fillOpacity="0.65"
        />

        {/* Bottom card button bar */}
        <rect
          x="94"
          y="177"
          width="92"
          height="13"
          rx="6.5"
          fill="#241368"
          fillOpacity="0.82"
        />
      </svg>
    </div>
  );
}
