import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://andyyy888.github.io',
  base: '/my-site',
  integrations: [tailwind()],
  build: {
    outDir: 'dist'
  }
});