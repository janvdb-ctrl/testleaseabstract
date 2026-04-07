import type { Config } from "tailwindcss";

/**
 * KARMA Dashboard — tokens from Figma file `7wK0rmXRFvWhZE6xuSKra9`,
 * frame "Design Guidelines" (261:158). Collection: **KAD**.
 * Colour hex values match Figma variables; text styles from layer "Text Styles" (751:751).
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colour/* — exact paths from Figma variables (KAD)
        colour: {
          neutral: {
            100: "#ffffff",
            80: "#c7c7c7",
            60: "#afafaf",
            30: "#3b3d3f",
            25: "#303235",
            15: "#1c1c1c",
            10: "#121212",
            5: "#080808",
            0: "#000000",
          },
          highlight: {
            purple: {
              50: "#311b2c",
              100: "#b89bff",
            },
            blue: {
              50: "#19212e",
              100: "#13bcff",
            },
            green: {
              50: "#192d21",
              100: "#54d97e",
            },
          },
          status: {
            success: {
              50: "#112a1c",
              100: "#3cc0a6",
            },
            "on-hold": {
              50: "#392a19",
              100: "#ff9c39",
            },
          },
        },
      },
      spacing: {
        // Layout Size/ls-* (KAD)
        "ls-2": "2px",
        "ls-4": "4px",
        "ls-8": "8px",
        "ls-12": "12px",
        "ls-16": "16px",
        "ls-24": "24px",
        "ls-32": "32px",
        "ls-40": "40px",
        "ls-48": "48px",
        "ls-64": "64px",
        "ls-80": "80px",
        "ls-96": "96px",
        "ls-128": "128px",
      },
      fontFamily: {
        // Font/Family/Neue Plak Text
        "neue-plak-text": ['"Neue Plak Text"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontWeight: {
        // Font/Weight/* (string tokens in Figma: Regular, SemiBold)
        regular: "400",
        semibold: "600",
      },
      fontSize: {
        // Font/Size/fs-* (px) — pair with Font/Line Height/lh-* as needed
        "fs-12": "12px",
        "fs-14": "14px",
        "fs-16": "16px",
        "fs-20": "20px",
        "fs-24": "24px",
        "fs-32": "32px",
        "fs-40": "40px",
        "fs-48": "48px",
        "fs-64": "64px",
        // Named text styles from frame "Text Styles"
        display: ["40px", { lineHeight: "48px", fontWeight: "600" }],
        "section-heading-primary": ["24px", { lineHeight: "32px", fontWeight: "400" }],
        "section-heading-secondary": ["24px", { lineHeight: "32px", fontWeight: "400" }],
        "body-primary": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-secondary": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-button": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "caption-primary": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "caption-secondary": ["16px", { lineHeight: "24px", fontWeight: "400" }],
      },
      lineHeight: {
        // Font/Line Height/lh-* (px)
        "lh-16": "16px",
        "lh-20": "20px",
        "lh-24": "24px",
        "lh-28": "28px",
        "lh-32": "32px",
        "lh-40": "40px",
        "lh-48": "48px",
        "lh-56": "56px",
        "lh-72": "72px",
      },
      borderRadius: {
        // Component radii sampled from Design Guidelines (no KAD FLOAT vars for radius)
        card: "5px",
        control: "5px",
        badge: "8px",
        "treasury-stack-item": "10px",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      boxShadow: {
        // No DROP_SHADOW effects on this frame in Figma; keep a neutral token for overrides
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
