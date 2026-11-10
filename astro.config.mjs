// @ts-check
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.rehabclinicclub.com.br',
});
