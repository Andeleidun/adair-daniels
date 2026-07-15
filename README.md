# adairdaniels.com

The source for Adair Daniels's portfolio and React demonstration site. The
application is a client-side React site built with Vite and TypeScript and
published as static files for the custom `adairdaniels.com` domain.

## Requirements

- Node.js 22.12 or newer
- npm 10.8 or newer

Install the locked dependency graph with `npm ci`.

## Development

Run `npm start` and open the local URL printed by Vite. Changes are updated in
the browser through Vite's development server.

## Verification

- `npm run test:run` runs the complete Vitest suite once.
- `npm test` starts Vitest in watch mode.
- `npm run typecheck` checks the TypeScript project without emitting files.
- `npm run lint` checks source and configuration with ESLint.
- `npm run format:check` verifies Prettier formatting.

## Production build

Set `VITE_REMOTE_API_ORIGIN` to the exact HTTPS `workers.dev` origin assigned to
the deployed `adairdaniels-api` Worker, then run `npm run build` to create the
production site in `dist/`. The URL is public configuration, not a credential.
The build rejects missing or invalid production Worker origins, creates an
identical `dist/404.html` route fallback, and copies `CNAME` for the static host.

The Worker is configured in `wrangler.jsonc`. `npm run worker:dev` runs the
locally installed, pinned Wrangler version at the client's default local
origin, `http://127.0.0.1:8787`. Worker deployment and changes to the published
site are separate release actions.

The application normally builds for the custom-domain root. Set
`VITE_BASE_PATH` when validating a subpath deployment, for example
`VITE_BASE_PATH=/adairdaniels/`.
