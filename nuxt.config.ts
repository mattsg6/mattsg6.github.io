// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  nitro: {
   preset: 'github-pages'
 },

  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap'
        }
      ]
    }
  },

  routeRules: {
    '/**': { prerender: true }
  },

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
  modules: ['@nuxtjs/device'],
})