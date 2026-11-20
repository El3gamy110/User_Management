import React from "react";

export default function LoginIllustration() {
  return (
    <div className="relative w-full max-w-[270px] h-[195px] mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="0 0 320 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain drop-shadow-[0_22px_36px_rgba(12,6,42,0.55)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="laptopBody"
            x1="50"
            y1="52"
            x2="245"
            y2="188"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F38B8" stopOpacity="0.82" />
            <stop offset="1" stopColor="#2A1B70" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient
            id="laptopScreen"
            x1="64"
            y1="62"
            x2="232"
            y2="178"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#261766" />
            <stop offset="1" stopColor="#1A0F4B" />
          </linearGradient>

          <linearGradient
            id="laptopBase"
            x1="34"
            y1="192"
            x2="256"
            y2="192"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5D43CC" />
            <stop offset="0.5" stopColor="#7C5DF2" />
            <stop offset="1" stopColor="#4F36B5" />
          </linearGradient>

          <linearGradient
            id="shieldOuter"
            x1="205"
            y1="72"
            x2="262"
            y2="160"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B8A4FF" />
            <stop offset="0.45" stopColor="#7A5AF8" />
            <stop offset="1" stopColor="#5232C9" />
          </linearGradient>

          <linearGradient
            id="shieldInner"
            x1="208"
            y1="78"
            x2="258"
            y2="152"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C7B6FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6A48E8" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient
            id="badgeBg"
            x1="168"
            y1="14"
            x2="210"
            y2="52"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5C44C9" stopOpacity="0.7" />
            <stop offset="1" stopColor="#322082" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Floating decorative dots */}
        <circle cx="34" cy="70" r="5" fill="#9D85FF" fillOpacity="0.75" />
        <circle cx="29" cy="158" r="4.5" fill="#8B72F8" fillOpacity="0.65" />
        <circle cx="242" cy="48" r="3" fill="#B6A3FF" fillOpacity="0.6" />
        <circle cx="268" cy="164" r="5" fill="#A58EFF" fillOpacity="0.75" />

        {/* Floating top user badge */}
        <rect
          x="166"
          y="16"
          width="42"
          height="34"
          rx="8"
          fill="url(#badgeBg)"
          stroke="#9B84FF"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <circle cx="187" cy="29" r="4.2" fill="#EEF0FF" />
        <path
          d="M179.5 41C180.5 37.5 183.5 35.8 187 35.8C190.5 35.8 193.5 37.5 194.5 41"
          fill="#EEF0FF"
        />

        {/* Laptop outer bezel */}
        <rect
          x="52"
          y="58"
          width="186"
          height="128"
          rx="12"
          fill="url(#laptopBody)"
          stroke="#8D75F5"
          strokeOpacity="0.32"
          strokeWidth="1.4"
        />

        {/* Laptop inner display */}
        <rect
          x="62"
          y="68"
          width="166"
          height="108"
          rx="7"
          fill="url(#laptopScreen)"
        />

        {/* Screen top bar */}
        <circle cx="76" cy="82" r="2.8" fill="#8E79F7" />
        <circle cx="85" cy="82" r="2.8" fill="#7058D6" />
        <rect x="96" y="79.5" width="24" height="5" rx="2.5" fill="#5D48C0" />

        {/* Screen UI rows */}
        <rect x="73" y="96" width="16" height="10" rx="3" fill="#4E3AA8" />
        <rect x="98" y="96" width="84" height="6" rx="3" fill="#5A46BE" />
        <rect x="98" y="106" width="56" height="4.5" rx="2.25" fill="#3D2C8E" />

        <rect x="73" y="118" width="16" height="10" rx="3" fill="#5C47BC" />
        <rect x="98" y="118" width="96" height="6" rx="3" fill="#6D58D6" />
        <rect x="98" y="128" width="64" height="4.5" rx="2.25" fill="#433199" />

        <rect x="73" y="140" width="16" height="10" rx="3" fill="#4A36A2" />
        <rect x="98" y="140" width="76" height="6" rx="3" fill="#5441B3" />
        <rect x="98" y="150" width="48" height="4.5" rx="2.25" fill="#392885" />

        {/* Laptop base */}
        <path
          d="M36 186H254C256.8 186 259 188.2 259 191C259 195.4 255.4 199 251 199H39C34.6 199 31 195.4 31 191C31 188.2 33.2 186 36 186Z"
          fill="url(#laptopBase)"
        />
        <rect
          x="122"
          y="186"
          width="46"
          height="4.5"
          rx="2.25"
          fill="#2F1E7A"
          fillOpacity="0.65"
        />

        {/* Shield overlapping right side */}
        <g>
          <path
            d="M234 72L273 87V117.5C273 142.8 256.4 162.8 234 170C211.6 162.8 195 142.8 195 117.5V87L234 72Z"
            fill="url(#shieldOuter)"
            stroke="#D6C9FF"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <path
            d="M234 79L266 91.5V117C266 138 252.2 154.6 234 160.8C215.8 154.6 202 138 202 117V91.5L234 79Z"
            fill="url(#shieldInner)"
          />

          {/* White Padlock inside shield */}
          <path
            d="M225.5 114V108.5C225.5 103.8 229.3 100 234 100C238.7 100 242.5 103.8 242.5 108.5V114"
            stroke="#FFFFFF"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <rect
            x="220"
            y="113"
            width="28"
            height="23"
            rx="5.5"
            fill="#FFFFFF"
          />
          <circle cx="234" cy="122.5" r="2.7" fill="#6946E8" />
          <path
            d="M234 124.5V129.5"
            stroke="#6946E8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
