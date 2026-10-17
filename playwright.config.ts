import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end and responsive tests against a running frontend + backend.
 *
 * Use a disposable database, never production. With the backend repo:
 *   1. Point MONGODB_URI at a local/test replica set, then `npm run migrate`.
 *   2. Seed one account per role with the same password, e.g.
 *      npm run seed:admin -- --name "Local Super" --email super@local.test --password "<pw>"
 *      npm run seed:admin -- --name "Local admin" --email admin@local.test --password "<pw>" --role admin
 *      (repeat for content_manager, author, viewer)
 *   3. Start backend and frontend, then:
 *      E2E_BASE_URL=http://localhost:3000 E2E_PASSWORD="<pw>" npm run test:e2e
 */
const baseURL = process.env.E2E_BASE_URL;
if (!baseURL)
  throw new Error('Set E2E_BASE_URL to the running frontend, e.g. http://localhost:3000');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
});
