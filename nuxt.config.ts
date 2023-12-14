// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@unocss/nuxt", "nuxt-primevue"],
  devtools: { enabled: true },
  css: [
    "@unocss/reset/tailwind-compat.css",
    "primevue/resources/themes/lara-dark-purple/theme.css",
  ],
  app: {
    head: {
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.png", color: "#ba5bd5" },
      ],
      meta: [
        { name: "msapplication-TileColor", content: "#c0c0c0" },
        { name: "theme-color", content: "#191919" },
      ],
    },
  },
});
