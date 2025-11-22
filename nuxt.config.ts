// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  css: [
    '~/assets/global.scss'
  ],
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
