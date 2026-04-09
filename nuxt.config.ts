// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/scss/base.scss'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData(source: string, filename: string) {
            if (filename.includes('assets/scss/')) return source
            
            return `@use "~/assets/scss/variables" as v;\n${source}`
          },
        },
      },
    },
  },
})
