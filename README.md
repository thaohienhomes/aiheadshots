
  # AI Headshot Platform Landing Page Redesign

  This is a code bundle for AI Headshot Platform Landing Page Redesign. The original project is available at https://www.figma.com/design/tCfSsqWRRS88EQKnbZzQfX/AI-Headshot-Platform-Landing-Page-Redesign.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.


## Ports

- The app runs on http://localhost:3200 (Vite strictPort enabled)
- If the port is in use, free it or change the port consistently in:
  - vite.config.ts (server.port)
  - cypress.config.ts (baseUrl)
  - package.json scripts (preview/test:e2e:* URLs)

## E2E Testing

Recommended (stable CI-like):

1. npm run build
2. npm run test:e2e:preview

Local debugging options:

- Terminal 1: npm run dev (serves at http://localhost:3200)
- Terminal 2: npm run cypress:run
- Or: npm run test:e2e:dev to orchestrate dev server + Cypress

## Notable test IDs

- Navigation: nav-generate, nav-login, user-menu
- Pricing: pricing-<tier>, upgrade-<tier>
- Upload flow: start-upload, #file-upload
- StyleSelection: style-selector
- Models Showcase: model-tab-<id>, try-now, sample-zoom-dialog

## Accessibility and UX

- Model tabs use WAI-ARIA roles and support ArrowLeft/Right navigation
- Sample image zoom dialog is accessible (ESC to close; focus managed by Radix)
- Try Now persists selected model into the upload flow (StyleSelection preselects, then clears)

## Performance

- Sample images use lazy loading and async decoding
- Explicit dimensions reduce layout shift

