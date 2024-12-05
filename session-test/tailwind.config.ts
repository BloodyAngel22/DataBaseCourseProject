import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
			},
			animation: {
				gradient: "gradient-bg 8s infinite"
			},
			keyframes: {
				"gradient-bg": {
					"0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
				}
			}
    },
  },
	darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
