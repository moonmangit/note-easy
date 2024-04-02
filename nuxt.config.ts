// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      firebaseEnpoint: process.env.FIREBASE_FUNCTION_ENDPOINT,
    },
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
