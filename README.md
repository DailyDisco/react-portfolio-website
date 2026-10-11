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

- `src/data/projects.json`: the eight earlier projects exported from Firestore, retained as a source archive. They are no longer shown in the public gallery.
- `src/data/caseStudies.js`: current engineering case studies, measured outcomes, visuals, and public source links. `featuredCaseStudies` selects Emmut, the Craft Digital migration, and local inference. The confidential mixed-reality engagement is a shorter supporting case.
- `src/components/Home`: the personal studio homepage and project selector. `About` and `Infrastructure` provide personal and technical context; `Portfolio` and `CaseStudy` hold the project evidence.
- `public/portfolio/`: project images. Set a record's `image` to a path such as `/portfolio/my-project/preview.jpg`, or `null` for a text-only entry.
- `public/resume/`: current one-page and detailed resumes. The primary download uses the one-page PDF.
- `src/data/pageMetadata.json`: titles, descriptions, canonical URLs, and sharing metadata for the nine public pages. Keep its routes aligned with `public/sitemap.xml`.
- `public/index.html`: development HTML shell and homepage metadata; `public/og-image.png` and `public/favicon.svg`: sharing assets.

Edit the relevant file, run checks, and deploy the new build. No runtime database request is needed to display projects. `/dashboard` and `/blog` redirect to `/portfolio`; `/youtubeVideosAndTwitchStreams` redirects to `/about`. Vercel returns permanent redirects, and local client navigation replaces the old history entry.

The Firestore migration preserved all eight record IDs, names, and descriptions. A subsequent link audit corrected the React/Go starter's destination and replaced two unavailable live sites with their public source repositories. Firebase Storage URLs were removed. One ecommerce thumbnail was recovered from an existing bundled image, and four screenshots were captured from the corresponding public project sites. The other three entries remain text-only. The old cloud project and its data were not deleted or changed.

Body copy uses the native system sans-serif for legibility; Manrope is reserved for the wordmark and headings. Project summaries are concise, primary text is larger, and secondary captions use normal reading text rather than dense micro-labels.

The homepage introduces Diego beside Disco, an original expressive robot built in Three.js. The open chalk layout uses cobalt actions, citron accents, bold type, and hairline section seams. Three permanent result links remain visible; native Product, Cloud, and Systems controls switch the robot’s tools, selected project summary, real or labeled conceptual visual, and case-study destination. Direct homelab, resume, contact, and social links complete the page.

The same palette, rounded controls, and publication spacing carry into Work, Homelab, About, Contact, and case studies. `PageSurface` provides finite entrances and once-only section reveals; `NextChapter` connects related pages. `LabExplorer` preserves the current seven-GPU server and 168 GiB combined memory separately from the earlier six-GPU performance benchmark.

`DiscoCompanion` loads its procedural Three.js scene on visibility. Fine-pointer movement guides Disco’s head and eyes, Say hello triggers a wave, and the three project modes introduce different tools. A visible pause control stops optional breathing, blinking, and floating motion. Reduced motion uses static poses. Hidden/offscreen states stop rendering; route cleanup disposes GPU resources. The matching SVG mark and fallback remain available without WebGL, including context loss.

Motion’s vanilla JavaScript API supplies staged hero entrances, spring control feedback, title and metric changes, restrained card turns, and directional arrows without newer React bindings. Both hooks restore inline styles and cancel effects on disposal; keyboard focus settles containing entrances. Missing APIs leave visible native navigation. See `docs/design-system.md` for behavior and `docs/visual-provenance.md` for artwork provenance.

Keep the mixed-reality client anonymous and avoid private repository links. Preserve scope notes that distinguish reporting implementation from completed production cutover, and development Terraform definitions from production deployment.

## Verify

```sh
CI=true npm test -- --watchAll=false --runInBand
CI=true npm run build
```

Tests cover homepage evidence and destinations, the mascot pause control, keyboard project selection, navigation and old-route redirects, metadata updates, the preserved archive component, failed images, safe external links, infrastructure selection, and contact submission behavior. Browser review should also check first-viewport composition, panel reveals, keyboard focus, live reduced-motion preferences, missing animation APIs, WebGL fallback and context loss, and route cleanup. Contact requests are mocked in automated checks; actual email delivery still needs an owner-controlled check. The existing EmailJS service and template remain separate from the removed Firebase integration.

## Deploy

Vercel serves the static CRA build. `npm run build` first compiles the app, then `scripts/build-page-metadata.cjs` writes a separate HTML head for every route in `pageMetadata.json`. For example, `/about` uses `build/about.html` and `/work/local-inference` uses `build/work/local-inference.html`. All pages load the same hashed CRA assets; page content still renders in React. `Layout` uses the same metadata manifest after client navigation. Unknown client routes receive a not-found title, `noindex, follow`, and no canonical link.

`vercel.json` pins `npm ci`, `npm run build`, and the CRA preset. Vercel's [clean URL mapping](https://vercel.com/docs/project-configuration/vercel-json#cleanurls) serves these HTML files at extensionless URLs. The official [CRA preset](https://github.com/vercel/vercel/blob/main/packages/frameworks/src/frameworks.ts) checks the filesystem before falling back to `index.html`; no catch-all rewrite is added. A local production preview must resolve existing `.html` files before its SPA fallback to exercise the per-page heads. Unknown direct URLs retain the CRA fallback response until React applies not-found metadata; this is not server-side rendering or an HTTP 404 implementation.

Review the preview's direct case-study URLs, the three featured projects, supporting case, image loading, contact form, and resume downloads. Confirm the intended project and domain before promoting. For rollback, promote the previous known-good deployment. The Firebase source remains available until the replacement has been accepted and its retirement is explicitly approved.

## Preserved work

Checkpoint `7b51de7` preserves the previous day-vault workspace edits. Commit `736deff` preserves the first refresh before the personal design revision and Firebase removal. The original remote checkout remains untouched.

The unmounted `SignalSculpture`, `useConsoleMotion`, `HomeStory`, and `HomeJourney` sources preserve earlier instrument and scrolling iterations. They are historical references outside the active interface and its verification scope. Commit `acfbd17` preserves the last rounded instrument iteration before Disco.
