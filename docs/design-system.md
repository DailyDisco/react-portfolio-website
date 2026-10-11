# Digital Diego interface

The homepage establishes the visual language: a cream instrument case on a forest-green workbench, green inset displays, ochre controls, and restrained hardware details.

## Shared structure

- `Layout/style.css` owns the backdrop, chassis, navigation, page headings, and shared controls.
- `SiteFooter` provides the same footer on every page.
- `PageSurface` wraps inner pages and owns their entrance and scroll motion.
- A `segmented-page` contains separate `page-panel` sections. Use the green gap between them as a clear content break.
- The homepage opens with the compact console and interactive Three.js mark, then tells the complete hiring story through four scrolling chapters.
- `HomeStory` presents Results → Delivery → Systems → About with proof, role context, and contact actions directly on Home. Detailed pages provide optional depth.
- `HomeJourney` is a sticky four-stop guide. Native fragment links focus each chapter and clear the guide; the active stop follows scrolling in either direction.

Keep the first desktop panel a complete composition. Put secondary evidence, personal context, and longer explanations into subsequent panels. Allow natural scrolling on small screens; do not clip content or force viewport-height sections.

## Type and color

Use Manrope for major headings and the wordmark, system sans-serif for body copy, and monospace sparingly for short labels. Body copy stays at 16px or larger. Avoid dense metadata and compressed headings.

| Use                       | Color     |
| ------------------------- | --------- |
| Workbench and primary ink | `#173633` |
| Cream chassis             | `#e3e0cf` |
| Inset display             | `#193e36` |
| Display bezel             | `#bdc4ac` |
| Ochre controls            | `#ebcc61` |
| Display text              | `#f2f5e6` |
| Secondary display text    | `#c3d4b7` |

Keep native links, buttons, form labels, focus indicators, and readable contrast. Lucide icons reinforce the action or subject; they do not replace labels.

## Motion

Motion should acknowledge an action or introduce content, then settle. Use short page entrances, once-only section reveals, small card lifts, and directional arrows. Lab diagrams animate when selected. Do not animate paragraphs continuously or add scroll hijacking.

Respect reduced motion both at initial load and when the preference changes. Content must stay available when animation APIs are missing, after route changes, and when a keyboard user focuses a link in a section awaiting reveal.

Homepage chapters use one short entrance when they first enter view. Their content starts visible and remains visible without IntersectionObserver or Web Animations. Focus, reduced-motion changes, and route disposal cancel the entrance and restore the original styles. Scroll progress uses observation rather than a continuous animation loop.

## Visitor journey

Lead with shipped outcomes, continue into the systems and infrastructure behind the work, introduce the engineer and collaborator, then offer a clear contact action. `NextChapter` supplies one contextual onward link without restricting the main navigation. Featured cases follow Product → Cloud → Systems; the confidential supporting case returns to the work gallery. Keep story copy short and grounded in demonstrated work.

The Home and About still life connects engineering and music. Project proof remains actual screenshots, architecture illustrations, and measured benchmarks. Artwork must never imply a photograph of client systems or personal hardware. The current machine has seven RTX 3090s and 168 GiB combined memory; the reported 18% improvement retains its earlier six-GPU benchmark scope.
