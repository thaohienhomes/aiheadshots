# AI Headshot Platform Landing Page Redesign

This is a code bundle for AI Headshot Platform Landing Page Redesign. The original project is available at https://www.figma.com/design/tCfSsqWRRS88EQKnbZzQfX/AI-Headshot-Platform-Landing-Page-Redesign.

## Running the code (local)

- npm ci
- npm run dev

## Build

- npm run build
- Output directory: build/

## Deploy to Vercel

This repository is configured for Vercel (vite outDir = build, SPA rewrites via vercel.json).

1) Create project on Vercel and link GitHub repo
2) Project settings → Build & Output:
   - Install Command: npm ci
   - Build Command: npm run build
   - Output Directory: build
   - Node version: 20.x
3) Environment Variables (Production + Preview):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   (Add any additional VITE_* variables used by the app.)
4) Deploy and verify the site loads

## CI (GitHub Actions)

- e2e workflow builds the app and runs a smoke test against vite preview
- Heavy Cypress specs are temporarily skipped to keep CI fast during deployment prep

To re-enable full E2E later:
- Remove the spec filter in .github/workflows/e2e.yml
- Unskip specs under cypress/e2e
