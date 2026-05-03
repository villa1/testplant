# Payload BMJ

BMJ storefront and CMS built with Payload 3, Next.js App Router, and Postgres.

This codebase started from the official Payload ecommerce template, but the active project has been reshaped for PT Bumi Mekarsari Jaya:

- BMJ page-builder blocks and footer/header globals
- BMJ article collection and archive page
- BMJ product taxonomy (`categories`, `productAttributes`, `productUseCases`)
- hybrid product flows for direct purchase vs. RFQ / consultation
- legacy BMJ content restore scripts and curated import fixtures

## Stack

- Next.js 16
- React 19
- Payload CMS 3
- Postgres via `@payloadcms/db-postgres`
- Payload ecommerce, SEO, and form-builder plugins
- Tailwind CSS

## Key Paths

- Payload config: `src/payload.config.ts`
- Plugins and ecommerce overrides: `src/plugins/index.ts`
- Pages collection: `src/collections/Pages`
- Products override: `src/collections/Products`
- Posts and categories: `src/collections/Posts`, `src/collections/PostCategories.ts`
- App routes: `src/app/(app)`
- Legacy restore scripts: `scripts/`
- Legacy fixture data: `scripts/data/legacy-bmj/`

## Local Development

1. Copy `.env.example` to `.env`.
2. Point `DATABASE_URL` to a local Postgres instance.
3. Install dependencies with `pnpm install`.
4. Generate types with `pnpm run generate:types`.
5. Start the app with `pnpm dev`.

The app runs at [http://localhost:3000](http://localhost:3000) by default.

## Important Scripts

- `pnpm dev`: start local development server
- `pnpm build`: production build
- `pnpm start`: run the production build
- `pnpm run generate:types`: refresh `src/payload-types.ts`
- `pnpm run lint`: run ESLint
- `pnpm run test:int`: run integration tests
- `pnpm run test:e2e`: run Playwright tests

## Data Workflows

### Restore legacy BMJ content

`pnpm run restore:legacy-bmj`

This restores:

- pages
- header and footer globals
- article categories
- articles and related article archive page

The curated JSON fixtures live in `scripts/data/legacy-bmj/`.

The restore flow also expects legacy media files to exist in:

`../mekarsarijaya/public/media`

### Import individual legacy slices

- `pnpm run import:legacy-bmj-pages`
- `pnpm run import:legacy-bmj-globals`
- `pnpm run import:legacy-bmj-articles`

### Seed lightweight BMJ shop samples

`pnpm run seed:bmj-ecommerce-samples`

This is the preferred sample-data script for shop development. It upserts BMJ-specific categories, attributes, use cases, and product records without reintroducing old template demo content.

## Notes

- The old admin dashboard template seed was removed to keep BMJ content clean.
- If you change schemas, run `pnpm run generate:types` before committing.
- Checkout-related tests require valid Stripe test keys in `.env`.
- `README.md` and `.env.example` are intended to reflect the BMJ project, not the upstream Payload template.
