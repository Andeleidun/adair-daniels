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

Run `npm run build` to create the production site in `dist/`. The build also
creates an identical `dist/404.html` route fallback and copies `CNAME` for the
static host.

The application normally builds for the custom-domain root. Set
`VITE_BASE_PATH` when validating a subpath deployment, for example
`VITE_BASE_PATH=/adairdaniels/`.
