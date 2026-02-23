import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Override default lg breakpoint to 1200px (desktop threshold)
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1200px",
      xl: "1440px",
    },
    extend: {
      colors: {
        ios: {
          blue:   "#007AFF",
          indigo: "#5856D6",
          teal:   "#5AC8FA",
          mint:   "#00C7BE",
          green:  "#34C759",
          red:    "#FF3B30",
          orange: "#FF9500",
          gray: {
            50:  "#F2F2F7",
            100: "#E5E5EA",
            200: "#D1D1D6",
            300: "#C7C7CC",
            400: "#AEAEB2",
            500: "#8E8E93",
            600: "#636366",
            700: "#48484A",
            800: "#3A3A3C",
            900: "#2C2C2E",
            950: "#1C1C1E",
          },
        },
        map: {
          sand: "#E8E0D8",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      // HIG semantic typography scale
      fontSize: {
        display:  ["34px", { lineHeight: "41px", letterSpacing: "-0.4px", fontWeight: "700" }],
        title1:   ["28px", { lineHeight: "34px", letterSpacing: "-0.3px", fontWeight: "700" }],
        title2:   ["22px", { lineHeight: "28px", letterSpacing: "-0.2px", fontWeight: "700" }],
        title3:   ["20px", { lineHeight: "25px", letterSpacing: "-0.1px", fontWeight: "600" }],
        headline: ["17px", { lineHeight: "22px", letterSpacing: "-0.2px", fontWeight: "600" }],
        body:     ["17px", { lineHeight: "22px", letterSpacing: "-0.2px", fontWeight: "400" }],
        callout:  ["16px", { lineHeight: "21px", letterSpacing: "-0.2px", fontWeight: "400" }],
        subhead:  ["15px", { lineHeight: "20px", letterSpacing: "-0.1px", fontWeight: "400" }],
        footnote: ["13px", { lineHeight: "18px", letterSpacing: "-0.1px", fontWeight: "400" }],
        caption1: ["12px", { lineHeight: "16px", letterSpacing: "0px",    fontWeight: "400" }],
        caption2: ["11px", { lineHeight: "13px", letterSpacing: "0.06px", fontWeight: "400" }],
      },
      borderRadius: {
        xs:   "6px",
        "sm-md": "8px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "level-1": "0 1px 3px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.06)",
        "level-2": "0 2px 8px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.08)",
        "level-3": "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        "level-4": "0 16px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        enter:  "cubic-bezier(0, 0, 0.2, 1)",
        exit:   "cubic-bezier(0.4, 0, 1, 1)",
      },
      transitionDuration: {
        micro:    "100ms",
        standard: "300ms",
        sheet:    "350ms",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to:   { transform: "translateY(0)",     opacity: "1" },
        },
        slideLeft: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        slideRight: {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to:   { transform: "translateX(0)",     opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.92)", opacity: "0" },
          to:   { transform: "scale(1)",    opacity: "1" },
        },
        pinSelect: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.2)" },
          "100%": { transform: "scale(1.12)" },
        },
        dragPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scaleX(1)" },
          "50%":       { opacity: "0.7", transform: "scaleX(1.4)" },
        },
        countChange: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up":     "slideUp    0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-down":   "slideDown  0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-left":   "slideLeft  0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-right":  "slideRight 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in":      "fadeIn     0.2s ease",
        "scale-in":     "scaleIn    0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "pin-select":   "pinSelect  0.3s  cubic-bezier(0.34, 1.56, 0.64, 1)",
        "drag-pulse":   "dragPulse  2s ease infinite",
        "count-change": "countChange 0.2s cubic-bezier(0, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
