// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-icon",
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "dayjs-nuxt",
  ],
  googleFonts: {
    families: {
      "Noto Sans Thai": [300, 400, 700],
    },
  },
  veeValidate: {
    autoImports: true,
  },
});
