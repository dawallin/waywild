import { defineConfig } from '@playwright/test';

const pages = process.env.GITHUB_PAGES === 'true';
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: `http://127.0.0.1:4173${pages ? '/waywild/' : '/'}`, browserName: 'chromium' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: `http://127.0.0.1:4173${pages ? '/waywild/' : '/'}`,
    reuseExistingServer: false,
  },
});
