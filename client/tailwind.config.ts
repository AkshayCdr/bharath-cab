import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        ".5": ".5px",
        "1": "1px",
      },
    },
  },
  plugins: [],
} satisfies Config;
