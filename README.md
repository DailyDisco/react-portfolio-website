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
- `src/data/caseStudies.js`: current engineering case studies, measured outcomes, cover images, detailed visuals, and public source links. `cover` supplies the Home/gallery image; `visual` preserves the component capture, architecture diagram, or benchmark used as evidence. `featuredCaseStudies` selects Emmut, the Craft Digital migration, and local inference. The confidential mixed-reality engagement is a shorter supporting case.
- `src/components/Home`: the work-led homepage and native project selector. `About` and `Infrastructure` provide personal and technical context; `Portfolio` and `CaseStudy` hold the project evidence.
- `public/work/`: current covers, component captures, and technical diagrams. Captions distinguish actual components with synthetic demo data from conceptual illustrations. Preserve the detailed evidence when editing a cover.
- `public/portfolio/`: images for the preserved earlier project archive. Historical records use local `image` paths or `null` for text-only entries.
- `public/resume/`: current one-page and detailed resumes. The primary download uses the one-page PDF.
- `public/about/diego-espino.jpg`: Diego's LinkedIn portrait, displayed with a CSS crop on About. The same page includes two attributed excerpts from his received LinkedIn recommendations, with a link to the full recommendations.
- `src/data/pageMetadata.json`: titles, descriptions, canonical URLs, and sharing metadata for the nine public pages. Keep its routes aligned with `public/sitemap.xml`.
- `public/index.html`: development HTML shell and homepage metadata; `public/og-image.png` and `public/favicon.svg`: sharing assets.

Edit the relevant file, run checks, and deploy the new build. No runtime database request is needed to display projects. `/dashboard` and `/blog` redirect to `/portfolio`; `/youtubeVideosAndTwitchStreams` redirects to `/about`. Vercel returns permanent redirects, and local client navigation replaces the old history entry.

The Firestore migration preserved all eight record IDs, names, and descriptions. A subsequent link audit corrected the React/Go starter's destination and replaced two unavailable live sites with their public source repositories. Firebase Storage URLs were removed. One ecommerce thumbnail was recovered from an existing bundled image, and four screenshots were captured from the corresponding public project sites. The other three entries remain text-only. The old cloud project and its data were not deleted or changed.

Body copy uses the native system sans-serif for legibility; Manrope is reserved for the wordmark and headings. Project summaries are concise, primary text is larger, and secondary captions use normal reading text rather than dense micro-labels.

The homepage introduces Diego beside a selected-work cover in a rounded wide image frame. The open chalk layout uses cobalt actions, citron accents, bold type, and hairline section seams. Native Product, Cloud, and Systems controls switch the cover, caption, project name, and case-study destination. Three permanent project summaries keep their results and case-study links visible independently of selection. Direct homelab, agent setup, resume, contact, and social links complete the page.

Emmut's cover combines actual desktop and mobile components rendered with synthetic data. Migration and inference covers are labeled conceptual illustrations. The original component captures, migration map, and scoped benchmark remain in the detailed cases. The cover is an introduction to the work; its decorative objects do not describe a hardware inventory or architecture.

Case studies include a sticky Overview, Contributions, and Results navigation row that accounts for the site header at narrow widths. Emmut's desktop and mobile captures open in `ProjectImageViewer`, with fit, actual-size, zoom, and scrolling controls. The modal supports keyboard navigation, Escape dismissal, and returned focus; its captions retain the synthetic-data label.

Technology names use locally bundled logos with readable text. Navigation and actions use Lucide icons. The SVG sources, licenses, and pinned hashes are in `public/brand/tech`.

The same palette, rounded controls, and publication spacing carry into Work, Homelab, About, Contact, and case studies. `PageSurface` provides finite entrances and once-only section reveals; `NextChapter` connects related pages. `LabExplorer` preserves the current seven-GPU server and 168 GiB combined memory separately from the earlier six-GPU performance benchmark.

The Homelab machine view starts with its SVG illustration. Explore 3D activates `ServerExplorer`, which loads a procedural Three.js schematic with rotation, an open-chassis view, and GPU, memory, and airflow notes. Rendering settles after interaction and pauses offscreen or in a hidden tab; reduced motion uses immediate pose changes. Return to illustration releases the scene. The illustration and notes remain available if WebGL is unavailable. The model represents seven cards and their combined memory, not the physical server's exact layout or cooling arrangement. Server photography is deferred.

`RobotPocket` puts a small optional Psst Easter egg beside the cover caption. It opens an anchored, nonmodal companion panel and mounts `RobotCompanion` only while open. It provides no chat or customer-support flow. Close or Escape dismisses the panel and returns focus to its opener; page navigation and project controls remain available.

`RobotCompanion` loads its procedural Three.js scene on visibility inside the open panel. Fine-pointer movement guides the robot’s head and eyes, Say hello triggers a wave, and the selected project introduces different tools. Pause stops optional breathing, blinking, floating motion, and pointer tracking while project selection keeps working. Reduced motion uses static poses. Hidden/offscreen states stop rendering; closing the pocket or leaving the route releases the mounted scene. The matching SVG mark and fallback remain available without WebGL, including context loss.

Motion’s vanilla JavaScript API supplies short, subtle fades with 6px section entrances, restrained control feedback, and a quick project crossfade without newer React bindings. Text, icons, headings, and metrics do not tilt or bounce. Both hooks restore inline styles and cancel effects on disposal; keyboard focus settles containing entrances. Missing APIs leave visible native navigation. See `docs/design-system.md` for behavior and `docs/visual-provenance.md` for artwork provenance.

Keep the mixed-reality client anonymous and avoid private repository links. Preserve scope notes that distinguish reporting implementation from completed production cutover, and development Terraform definitions from production deployment.

## Verify

```sh
CI=true npm test -- --watchAll=false --runInBand
CI=true npm run build
```

Tests cover homepage evidence and destinations, the initially closed companion, optional pause/resume, Escape and returned focus, keyboard project selection, navigation and old-route redirects, metadata updates, the preserved archive component, failed images, safe external links, infrastructure selection, the image viewer, server explorer activation and cleanup, and contact submission behavior. Browser review should also check first-viewport composition, cover loading and captions, the portrait crop, sticky case navigation and anchors, screenshot zoom and keyboard focus, the anchored pocket at narrow widths, live reduced-motion preferences, missing animation APIs, WebGL fallback and context loss, and close/route cleanup. Contact requests are mocked in automated checks; actual email delivery still needs an owner-controlled check. The existing EmailJS service and template remain separate from the removed Firebase integration.

## Deploy

Vercel serves the static CRA build. `npm run build` first compiles the app, then `scripts/build-page-metadata.cjs` writes a separate HTML head for every route in `pageMetadata.json`. For example, `/about` uses `build/about.html` and `/work/local-inference` uses `build/work/local-inference.html`. All pages load the same hashed CRA assets; page content still renders in React. `Layout` uses the same metadata manifest after client navigation. Unknown client routes receive a not-found title, `noindex, follow`, and no canonical link.

`vercel.json` pins `npm ci`, `npm run build`, and the CRA preset. Vercel's [clean URL mapping](https://vercel.com/docs/project-configuration/vercel-json#cleanurls) serves these HTML files at extensionless URLs. The official [CRA preset](https://github.com/vercel/vercel/blob/main/packages/frameworks/src/frameworks.ts) checks the filesystem before falling back to `index.html`; no catch-all rewrite is added. A local production preview must resolve existing `.html` files before its SPA fallback to exercise the per-page heads. Unknown direct URLs retain the CRA fallback response until React applies not-found metadata; this is not server-side rendering or an HTTP 404 implementation.

Review the preview's direct case-study URLs, the three featured projects, supporting case, image loading, contact form, and resume downloads. Confirm the intended project and domain before promoting. For rollback, promote the previous known-good deployment. The Firebase source remains available until the replacement has been accepted and its retirement is explicitly approved.

## Preserved work

This project began with Slobodan's [React portfolio tutorial on freeCodeCamp.org](https://www.youtube.com/watch?v=bmpI252DmiI), documented in freeCodeCamp's [course announcement](https://www.freecodecamp.org/news/create-a-portfolio-with-react-featuring-cool-animations/), and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The current branding, case studies, content, and interactive portfolio are subsequent work by Diego Espino. This credit preserves the original learning project's provenance.

Checkpoint `7b51de7` preserves the previous day-vault workspace edits. Commit `736deff` preserves the first refresh before the personal design revision and Firebase removal. The original remote checkout remains untouched.

The unmounted `SignalSculpture`, `useConsoleMotion`, `HomeStory`, and `HomeJourney` sources preserve earlier instrument and scrolling iterations. They are historical references outside the active interface and its verification scope. Commit `acfbd17` preserves the last rounded instrument iteration before the robot theme.
