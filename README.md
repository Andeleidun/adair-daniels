# adairdaniels.com

The source for Adair Daniels's professional portfolio and React demonstration site. The application is a client-side React site built with Vite and TypeScript and published as static files for the custom `adairdaniels.com` domain.

## Architecture

The portfolio is intentionally split between presentation, structured professional content, and external-service integration:

- `src/Components/Home/Home.json` owns public résumé content used by the home page.
- `src/Components/Home/SelectedWork.ts` owns the smaller recruiter-facing collection of current engineering examples. Public work can link to source; private work is described without exposing repository access.
- React components render semantic, responsive UI with Material UI primitives and project-specific CSS.
- `worker/` contains the Cloudflare Worker used for remote API behavior. Worker deployment is independent from static-site deployment.
- Tests use Vitest, Testing Library, and axe-backed accessibility helpers.

## Requirements

- Node.js 22.12 or newer
- npm 10.8 or newer

Install the locked dependency graph with `npm ci`.

## Development

Run `npm start` and open the local URL printed by Vite. Changes are updated in the browser through Vite's development server.

## Verification

Before merging a change, run the same checks enforced by GitHub Actions:

- `npm run format:check` verifies Prettier formatting.
- `npm run lint` checks source and configuration with ESLint.
- `npm run typecheck` checks the TypeScript project without emitting files.
- `npm run test:run` runs the complete Vitest suite once.
- `npm run build` validates the production bundle and static-output preparation.

`npm test` starts Vitest in watch mode. `npm run test:worker` runs Worker-focused tests.

The CI workflow runs formatting, linting, type checking, tests, and a production build for pull requests and for pushes to `master`. CI supplies a non-secret `workers.dev` placeholder origin so production configuration validation is exercised without deployment credentials.

## Selected engineering work

The home page includes a deliberately small selected-work section so current engineering evidence appears before broad skill lists. The collection should remain complementary rather than exhaustive:

- favor current work that demonstrates architecture, accessibility, reliability, cross-platform engineering, or another differentiating capability;
- use public repository links only when the source is intentionally public;
- describe private projects at the technical-outcome level without publishing private URLs, credentials, client information, or confidential implementation details;
- verify every career claim against the corresponding repository or current résumé before publishing it.

## Production build

Set `VITE_REMOTE_API_ORIGIN` to the exact HTTPS `workers.dev` origin assigned to the deployed `adairdaniels-api` Worker, then run `npm run build` to create the production site in `dist/`. The URL is public configuration, not a credential. The build rejects missing or invalid production Worker origins, creates an identical `dist/404.html` route fallback, and copies `CNAME` for the static host.

The Worker is configured in `wrangler.jsonc`. `npm run worker:dev` runs the locally installed, pinned Wrangler version at the client's default local origin, `http://127.0.0.1:8787`. Worker deployment and changes to the published site are separate release actions.

The application normally builds for the custom-domain root. Set `VITE_BASE_PATH` when validating a subpath deployment, for example `VITE_BASE_PATH=/adairdaniels/`.
