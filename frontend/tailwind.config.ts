import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... your existing theme config
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- YOU MUST ADD THIS LINE
    // ... any other plugins you might have
  ],
};

export default config;