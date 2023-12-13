// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "nuxt-primevue"],
  devtools: { enabled: true },
  css: ["@unocss/reset/tailwind-compat.css"],
});
