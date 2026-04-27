import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://andyyy888.github.io',
  integrations: [tailwind()],
  build: {
    outDir: 'dist'
  }
});