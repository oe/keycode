import { defineConfig, squooshImageService } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  image: {
    service: squooshImageService(),
  },
  site: 'https://app.evecalm.com/keycode/',
  build: {
    assetsPrefix: '/keycode'
  },
  integrations:[
    tailwind(),
    react(),
  ]
});
