# Diego Espino's portfolio

A React portfolio focused on full-stack engineering, technical leadership, cloud migrations, and infrastructure. The public site is https://www.digitaldiego.xyz/.

## Run locally

```sh
npm ci
npm start
```

The checked-in lockfile retains the existing React 17 / Create React App 5 stack. `.npmrc` enables legacy peer resolution because the preserved React Leaflet dependency declares React 18 peers. The refreshed interface does not import Leaflet. A framework or dependency migration is separate work.

## Verify

```sh
CI=true npm test -- --watchAll=false --runInBand
CI=true npm run build
```

Tests cover navigation, archive loading and failure states, safe project links, contact submission states, authentication state, and project uploads. Contact and write operations use mocks in tests. Public Firestore reads can be checked on `/portfolio` without signing in.

## Content and data

- `src/data/caseStudies.js`: curated engineering case studies, outcomes, and public source links.
- `src/components/Home`, `About`, and `Infrastructure`: positioning, experience, and technical background.
- `public/resume/`: current one-page and detailed resumes. The main navigation uses the one-page PDF.
- `public/og-image.png`, `favicon.svg`, and `index.html`: sharing image, icon, and metadata.
- `/portfolio`: curated case studies followed by the existing Firebase project archive.
- `/dashboard`: existing Google sign-in and project creation flow.

The Firebase project and existing `portfolio` collection are retained. Documents use `{ name, description, url, image }`. Images remain in the `portfolio/` Storage prefix with unique filenames for new uploads. No migration is required. Curated case studies are versioned in source; dashboard submissions go into the archive.

Firestore and Storage rules are managed outside this checkout. Server-side authorization must remain the authority for dashboard writes. The Google login UI is not an authorization boundary. No security-rule changes are included.

The contact form retains the existing EmailJS service and template. Automated verification intercepts requests rather than sending real messages. End-to-end email delivery and signed-in production writes require an owner check.

Client case studies distinguish shipped results from implementation work. Keep the mixed-reality client anonymous and avoid private repository links. Preserve the reporting and Terraform scope notes when editing.

## Deploy

Vercel serves the CRA production build. `vercel.json` pins the existing framework preset and lockfile-based installation. The CRA preset handles browser route fallbacks while serving static assets normally.

Before release, review a Vercel preview for direct case-study URLs, Firebase archive loading, the contact form, and resume downloads. Confirm the intended Vercel project and production domain before promoting. For rollback, promote the previous known-good deployment; this update does not migrate data.

## Preserved work

The local branch includes checkpoint `7b51de7`, which preserves the previous day-vault workspace edits before this refresh. Legacy components and the video route remain in the repository.
