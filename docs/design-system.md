# Digital Diego interface

The active homepage is a compact instrument panel: a rounded ivory case on an ink-blue workbench, blue inset displays, coral controls, and a dimensional D monogram. Keep the tactile details restrained and the content easy to read.

## Shared structure

- `src/index.css` owns semantic `--brand-*` colors, radius tokens, and type defaults. Existing `--paper`, `--ink`, `--muted`, `--accent`, and console aliases map to those tokens.
- `Layout/style.css` owns the backdrop, chassis, navigation, page headings, and shared controls. Its blue gradient overlays the original Qwen workbench texture at 96–98% opacity.
- Home contains the identity and sculpture, native Product/Cloud/Systems selectors, one project readout, direct homelab and resume links, and `SiteFooter`. The desktop console is vertically centered; small screens use normal document flow.
- `PageSurface` wraps inner pages. A `segmented-page` contains separate `page-panel` sections, with the blue backdrop visible between them. Contact uses one continuous chassis.
- `SiteFooter` and the main navigation remain consistent across routes. `NextChapter` adds a contextual onward link on inner pages.

Keep the first desktop panel a complete composition. Put secondary evidence, personal context, and longer explanations into subsequent panels. Allow natural scrolling on small screens; do not clip content or force viewport-height sections. `HomeStory` and `Home/HomeJourney.js` preserve the previous four-chapter experiment but are not mounted on the current homepage.

## Type, color, and shape

Use Manrope for major headings and the wordmark, system sans-serif for body copy, and monospace sparingly for short labels. Body copy stays at 16px or larger; active secondary labels use at least 14px. Lucide icons reinforce an action or subject without replacing its label.

| Role                               | Token                   | Color     |
| ---------------------------------- | ----------------------- | --------- |
| Ivory chassis                      | `--brand-paper`         | `#f5f0e7` |
| Primary ink                        | `--brand-ink`           | `#172b45` |
| Secondary text on ivory            | `--brand-muted`         | `#4d5b6e` |
| Workbench backdrop                 | `--brand-backdrop`      | `#0e1d32` |
| Inset display                      | `--brand-display`       | `#203753` |
| Display bezel and surface lines    | `--brand-edge`          | `#a5b4c4` |
| Coral controls and display accents | `--brand-accent`        | `#f49b82` |
| Accent text and focus on ivory     | `--brand-accent-ink`    | `#8d3d2d` |
| Display text                       | `--brand-display-ink`   | `#f7f2e9` |
| Secondary display text             | `--brand-display-muted` | `#c9d8e8` |

Use the supporting highlight, shade, hardware, diagram, and status tokens rather than adding isolated colors. Text contrast is 12.60:1 for ink on ivory, at least 5.21:1 for muted text on the chassis shades, and 8.35:1 for muted display text. Ink on coral is 6.72:1. Form boundaries use the darker hardware token; errors have their own surface and text tokens.

| Surface                 | Radius                           |
| ----------------------- | -------------------------------- |
| Main chassis            | 30px; 24px at widths up to 760px |
| Inset displays          | 20px                             |
| Cards                   | 22px                             |
| Controls                | 14px                             |
| Inputs and image frames | 12px                             |

Preserve inset shadows, the shallow chassis edge, screw details, and control depth. Labels and section dividers remain simple; rounding is for physical surfaces and controls. Keep native links, buttons, form labels, and visible focus indicators.

## Motion

Motion acknowledges input or introduces a surface, then settles. The React 17 interface uses `spring` from `motion` and `animate` from `motion/mini`, not Motion's React bindings. It does not hijack scrolling or continuously animate body text.

`Home/useConsoleMotion.js` supplies:

- Selector and bottom-link springs: stiffness 620, damping 32, mass 0.65. Hover/focus lifts 0.8px; press moves 2.5px and scales to 0.985. Native pointer and keyboard activation remain intact.
- A finite opening sequence: identity, role, intro, controls heading, and bottom strip rise 12px over 580ms with 40ms spacing.
- A selected readout entrance from 10px down and scale 0.98, with 280ms opacity and a 500ms transform spring. Results receive a small 550ms spring; seven workflow paths draw over 520ms with 35ms spacing, and six benchmark GPU bars enter over 460ms with 45ms spacing.

`PageSurface/usePageMotion.js` supplies:

- A 580ms panel entrance from 18px down and scale 0.985. The heading follows after 60ms; up to six evidence blocks rise 12px over 480ms with delays of 100–340ms.
- Once-only later-panel reveals when an IntersectionObserver reports at least 12% visibility. Content is never pre-hidden; animations start at opacity 0.86.
- Finite button and onward-arrow feedback: a 420ms hover pulse to scale 1.035, and a 340ms press sequence through 0.955 and 1.015. CSS adds small card lifts, directional arrows, and selected lab-diagram entrances.

Both hooks restore original inline styles when animations are cleared or disposed. Keyboard focus settles containing entrances and marks focused panels as revealed. Missing required APIs leave visible content and native navigation. Reduced motion suppresses effects initially and cancels active effects when enabled; inner-page effects then remain disabled for that mount. Cleanup removes listeners and observers and cancels animation controls.

The Three.js sculpture uses rounded extrusions, inset faces, metal rims, connecting rods, fasteners, and procedural studio lighting. Product is compact, Cloud expands the layers, and Systems fans them. A fine pointer adjusts tilt and lighting; touch retains normal vertical scrolling. Selection settles within a 780ms rendering window and pointer movement within 420ms. There is no idle animation loop. The pixel ratio is capped at 2; offscreen and hidden-tab states pause rendering. Reduced motion snaps to the selected pose without pointer response. Missing observers or WebGL leave the matching SVG visible; context loss restores the fallback. Disposal releases geometry, materials, textures, shadows, environment, and renderer resources.

## Content and evidence

The compact homepage leads with role, measured results, and direct routes to deeper work. Featured cases follow Product → Cloud → Systems; the confidential supporting case returns to the work gallery. Keep copy short and grounded in demonstrated work.

The About still life connects engineering and music. Project proof remains actual component captures, labeled architecture illustrations, and scoped benchmarks. Artwork must never imply a photograph of client systems or personal hardware. The current machine has seven RTX 3090s and 168 GiB combined memory; the reported 18% improvement retains its earlier six-GPU benchmark scope. The monogram's six layers are a design choice, not a hardware inventory.
