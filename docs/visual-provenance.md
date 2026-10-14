# Portfolio visuals

The public gallery contains three featured projects and one shorter supporting case. Gallery and hero covers are distinct from the detailed case-study evidence. The eight earlier projects remain in `src/data/projects.json` and their original assets remain in `public/portfolio`; the archive component is no longer mounted publicly.

## Emmut

`public/work/emmut-maintenance-desktop.png` and `emmut-maintenance-mobile.png` are captures of actual maintenance management components, rendered through their test harness and real application styling. The source fixtures explicitly mock the workers and use example.com email addresses and 555 phone numbers. These are component demonstrations with synthetic data, not production tenant records. Captions preserve that distinction. Original capture dimensions are 2560 × 1600 and 780 × 1688.

## Migration and inference

`migration-map.svg` is an architecture overview of the seven production lead-workflow migration from Kestra/AWS to n8n/Railway. It is not a screenshot of either application.

`inference-benchmark.svg` illustrates the six-GPU hardware and the reported ExLlamaV3 cold-prompt benchmark: 1,238 to 1,458 tokens/second, approximately 18%. Decode speed was unchanged. It is an illustration, not a photograph of the physical server.

Both public SVG illustrations were recolored to the current chalk, ink, cobalt, and citron palette. Their structure, evidence labels, and benchmark scope were preserved.

The current server expanded to seven RTX 3090s on October 10, 2026. A live `nvidia-smi` inventory verified seven cards with 24,576 MiB each (168 GiB combined). The Homelab explorer depicts the current seven-card machine. The ExLlamaV3 benchmark artwork and its 18% cold-prompt improvement retain their original six-card scope.

The local-inference case separately reports a Project Maya seven-RTX-3090 benchmark: a 2K-token agent tool turn fell from 6.04 seconds to 4.07 seconds with proposed prompt pipelining. Longer prompts did not show equivalent gains. A separate scheduling proposal reduced a short request's wait while increasing the long read's duration. Both proposals are labeled open as of October 13, 2026 in `src/data/caseStudies.js`; these measurements are distinct from the two merged ExLlamaV3 and TabbyAPI fixes.

## Interactive server schematic

`ServerExplorer` is an optional procedural Three.js schematic reached through Explore 3D in the Homelab machine view. Its seven GPU cards represent the current card count and 168 GiB combined memory. The chassis, component spacing, and airflow arrangement are conceptual, not a scale replica of the physical server. Rotation, an open-chassis view, and GPU, memory, and airflow notes let visitors examine the illustration. The original SVG remains the initial view and WebGL fallback. No server photograph is used; the owner chose to finish with the illustration for now.

## Portrait

`public/about/diego-espino.jpg` is the owner's 800 × 800 LinkedIn profile photograph, obtained from the profile he selected and authorized for the portfolio. It shows Diego outdoors at sunset and includes the LinkedIn frame in the source image. About uses a CSS crop for its portrait presentation. The image has not been AI-generated or retouched. The signed image-download URL is not stored in the repository.

## New cover compositions

`public/work/emmut-cover-desktop-mobile.webp` composes the audited desktop and mobile component captures with a quiet browser/device frame. Its UI is unchanged and its caption retains the synthetic-data label.

`public/work/migration-concept.webp` and `inference-concept.webp` are original generated editorial illustrations in the chalk, graphite, cobalt and citron palette. They are labeled conceptual illustrations; their object counts are not architecture, current inventory, or benchmark evidence. The original migration map and six-GPU benchmark remain in detailed project views. See `work-art-prompts.md` for prompts, generation mode and export details.

## Brand surface and mascot

The robot is original procedural Three.js geometry: a softly beveled pale citron head, large dark oval eyes, highlights, a smile, rosy cheeks, star antenna, petite matte body, rounded limbs, and a heart status panel. Product, Cloud, and Systems select application-window, cloud-node, and chip/circuit props. The matching SVG navigation mark and static fallback use the same silhouette and palette. Studio reflections come from Three.js’s procedural `RoomEnvironment`; the shadow texture is drawn in code. No downloaded model, external texture, or new image generation is used by the mascot.

The former six-layer D sculpture remains in the unmounted `SignalSculpture` source. Its six layers describe a monogram design, not hardware inventory.

The spruce workbench material in `src/assets/brand/workbench.webp` was generated on the owner’s Windows RX 9070 XT using Qwen-Image-2.1, 1024 pixels, 25 steps, seed 20261009, prompt enhancement off. It is preserved as historical decorative artwork, and is no longer mounted by the active interface. Its original PNG is retained in local review files and the owner’s image output directory.

## Preserved earlier artwork

`public/brand/code-hardware-music.webp` is an original editorial still life generated with the owner's Qwen-Image-2.1 service on the Windows RX 9070 XT. It joins a graphite heatsink, cream musical keys, a circuit board, and an ochre cable. It is preserved as historical artwork and is not mounted by the active interface. It is not a photograph of the owner's equipment, and its earlier caption identified it as an illustrated study. Its original colors are preserved.

The seven-card SVG in the preserved, unmounted `HomeStory` source is a schematic of the current GPU count, not a photograph or a new performance measurement. The active infrastructure explorer also depicts seven GPUs. The active homepage links current hardware separately from the explicitly six-GPU performance benchmark.

Generation: 1024 × 1024, 32 steps, seed 20261010, prompt enhancement off. Qwen returned HTTP 200. The full prompt is preserved in `docs/story-art-prompt.txt`. Original: `/home/day/Pictures/QwenImage/qwen-ab31990011ac4dad.png`; Windows filename: `Qwen_Agents_00014_.png`. The unmodified original is also retained in the local review workspace. The web asset is a quality-86 WebP conversion.

## Sharing artwork

`src/data/pageMetadata.json` and the HTML metadata reference `/og-image.png`. The current 1200 × 630 sharing graphic uses the chalk, ink, cobalt, and citron theme and a render of the actual procedural Three.js robot. Its text identifies Diego’s role and domain, two hours of daily admin time saved per employee, seven migrated workflows, and two upstream fixes. It is a brand graphic, not a client application capture.

`public/favicon.svg` uses the robot-head mark in the same colors. Browser theme and manifest backgrounds use chalk. These static assets are separate from the interactive scene and do not constitute new Qwen image generation.

## Technology logos

`public/brand/tech` contains 31 locally bundled SVG marks from pinned Devicon and Simple Icons revisions. The source manifest records source URLs, revisions, and SHA-256 hashes. MIT and CC0 license files are included. `TechStack` retains readable text next to each decorative logo and uses Lucide fallbacks for names without a vetted asset. No external icon service or runtime icon font is used.

## Agent environments and request-path diagram

The Homelab software explorer is a conceptual request path, not a live service-health display. It shows a coding agent, an OpenAI-compatible gateway, a model server, and local GPUs. The serving description reflects the October 12, 2026 configuration: Maya as the default, with TabbyAPI/ExLlamaV3 as an alternate. Historical ExLlamaV3 benchmark claims retain their six-GPU scope.

The request trace is a finite, visitor-triggered SVG/CSS animation. It can be replayed and resets when changing views. Reduced-motion users receive the completed static path. It performs no inference request.

The Hermes/MCP section describes configuration and integration work. The REA example is based on the October 11, 2026 verified CLI and Hermes MCP JavaScript analysis against a disposable fixture. It is a record of completed work, not a fresh service-health assertion. No private connector records, credentials, internal addresses, or client names are included.

The portrait is in use on About. Server photography is deferred; current conceptual covers and hardware illustrations retain their explicit labels.

## Recommendation excerpts

About includes verbatim excerpts from four received LinkedIn recommendations supplied by Diego on October 14, 2026: Jeremy Ashley (March 27, 2026, direct manager at DFW Software Consulting; his recommendation identifies his role as CTO), Hector Oropesa (March 29, 2026, teammate at DFW Consulting), Belle Duran (September 2, 2025, direct manager on the Smart Gym project), and Naomi Carrigan (August 19, 2025, mentor in the six-week Commit Your Code cohort). The text preserves the original wording, identifies the relationship and date, and links to the full recommendations. These are selected excerpts, not newly solicited testimonials or an endorsement inferred from a GitHub contribution.
