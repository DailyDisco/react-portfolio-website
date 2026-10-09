# Diego Espino's portfolio

A personal portfolio for full-stack engineering, technical leadership, cloud migrations, and infrastructure. The public site is https://www.digitaldiego.xyz/.

## Run locally

```sh
npm ci
npm start
```

Node 22 is pinned for local and Vercel builds. This checkout retains React 17 and Create React App 5. `.npmrc` enables legacy peer resolution because the preserved React Leaflet dependency declares React 18 peers; the current interface does not import Leaflet. A framework migration is separate work.

## Edit content

All portfolio content and images live in the repository. There is no database, sign-in, or upload dashboard.

- `src/data/projects.json`: the eight earlier projects exported from Firestore. Each record has an `id`, `name`, `description`, `url`, and `image`. Use optional `linkLabel: "View source"` when a project's public repository is the destination.
- `src/data/caseStudies.js`: current engineering case studies, measured outcomes, and public source links.
- `src/components/Home`, `About`, and `Infrastructure`: introduction, experience, and technical background.
- `public/portfolio/`: project images. Set a record's `image` to a path such as `/portfolio/my-project/preview.jpg`, or `null` for a text-only entry.
- `public/resume/`: current one-page and detailed resumes. The primary download uses the one-page PDF.
- `public/index.html`, `og-image.png`, and `favicon.svg`: metadata and sharing assets.

Edit the relevant file, run checks, and deploy the new build. No runtime database request is needed to display projects. `/dashboard` redirects to `/portfolio` for old bookmarks; `/blog` remains an alias for the work page.

The Firestore migration preserved all eight record IDs, names, and descriptions. A subsequent link audit corrected the React/Go starter's destination and replaced two unavailable live sites with their public source repositories. Firebase Storage URLs were removed. One ecommerce thumbnail was recovered from an existing bundled image, and four screenshots were captured from the corresponding public project sites. The other three entries remain text-only. The old cloud project and its data were not deleted or changed.

The homepage's `SignatureMark` has three selectable SVG treatments inspired by lettering, hardware, and music. `LabExplorer` presents the actual hardware and conceptual software and homelab diagrams. Both support keyboard and touch, and respect reduced-motion preferences. Case-study figures live in `ProjectFigure`; measured results include their context, and conceptual illustrations are labeled.

Keep the mixed-reality client anonymous and avoid private repository links. Preserve scope notes that distinguish reporting implementation from completed production cutover, and development Terraform definitions from production deployment.

## Verify

```sh
CI=true npm test -- --watchAll=false --runInBand
CI=true npm run build
```

Tests cover navigation and old-route redirects, archive rendering, failed images, safe external links, infrastructure view selection, and contact submission behavior. Contact requests are mocked in automated checks; actual email delivery still needs an owner-controlled check. The existing EmailJS service and template remain separate from the removed Firebase integration.

## Deploy

Vercel serves the static CRA build. `vercel.json` pins the framework preset and `npm ci`; the preset handles browser route fallbacks while serving static assets normally.

Review the preview's direct case-study URLs, all eight archive entries, image loading, contact form, and resume downloads. Confirm the intended project and domain before promoting. For rollback, promote the previous known-good deployment. The Firebase source remains available until the replacement has been accepted and its retirement is explicitly approved.

## Preserved work

Checkpoint `7b51de7` preserves the previous day-vault workspace edits. Commit `736deff` preserves the first refresh before the personal design revision and Firebase removal. The original remote checkout remains untouched.
