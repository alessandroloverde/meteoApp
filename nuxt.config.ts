// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: [
    // Self-hosted Nunito Sans (Capacitor-friendly). Figma: medium→800.
    '@fontsource/nunito-sans/500.css',
    '@fontsource/nunito-sans/600.css',
    '@fontsource/nunito-sans/700.css',
    '@fontsource/nunito-sans/800.css',
    '~/assets/scss/base.scss',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [
      svgLoader({
        defaultImport: 'component',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // Keep viewBox for sizing; strip hardcoded colors via currentColor in source.
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
    ],
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
