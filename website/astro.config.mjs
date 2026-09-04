// @ts-check
import { defineConfig } from 'astro/config';

// Codespaces needs the dev server to listen beyond localhost so port 4321 can be forwarded.
export default defineConfig({
  server: {
    host: true,
    port: 4321,
  },
});
