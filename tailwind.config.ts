import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Thai", "sans-serif"],
      },
    },
  },
  plugins: [],
};
