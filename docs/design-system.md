# Digital Diego interface

The active interface is a personal engineering studio on an open chalk page. Cobalt actions, citron accents, generous type, hairline seams, and Disco, an original robot mascot, connect the pages. Keep the work and its evidence easy to read.

## Shared structure

- `src/index.css` owns semantic `--brand-*` colors, radius tokens, and type defaults. Legacy aliases map to these tokens.
- `Layout/style.css` owns navigation, page headings, shared controls, and the footer. The robot head is the shared brand mark.
- Home contains an introduction, the robot stage, native Product/Cloud/Systems controls, three permanent result links, one selected project with a real or labeled conceptual visual, and direct homelab and resume links.
- `PageSurface` wraps inner pages. Main and supporting sections use open publication spacing and hairline seams. Dark technical diagrams provide occasional contrast.
- `NextChapter` provides contextual onward navigation; the main navigation and footer remain consistent across routes.

Allow natural document flow on small screens. Do not force content into viewport-height sections. Preserve the earlier `SignalSculpture`, `HomeStory`, `HomeJourney`, and `useConsoleMotion` sources as unmounted historical references.

## Type, color, and shape

Use Manrope for major headings and the wordmark, system sans-serif for body copy, and monospace sparingly for short technical labels. Body copy stays at 16px or larger. Lucide icons accompany visible text labels.

| Role                    | Token                 | Color     |
| ----------------------- | --------------------- | --------- |
| Chalk page              | `--brand-paper`       | `#f3f2ed` |
| Primary ink             | `--brand-ink`         | `#171a19` |
| Secondary text          | `--brand-muted`       | `#535b52` |
| Cobalt action and focus | `--brand-accent`      | `#364bff` |
| Citron accent           | `--brand-signal`      | `#d8f36a` |
| Quiet surface           | `--brand-surface`     | `#e6e7df` |
| Surface lines           | `--brand-edge`        | `#c5c9bd` |
| Dark data panel         | `--brand-display`     | `#171a19` |
| Data-panel text         | `--brand-display-ink` | `#f3f2ed` |

Muted body text has at least 5.65:1 contrast on the active chalk shades; cobalt on chalk is 5.19:1 and white on cobalt is 5.82:1. Citron carries dark text. Form boundaries and focus indicators use stronger colors than decorative hairlines.

Radius tokens are 32px for a supporting surface, 24px for cards and data panels, 20px for image frames, 12px for inputs, and pill-shaped for controls. The overall page is open rather than contained in a physical case.

## Motion

The React 17 app uses `spring` from `motion` and `animate` from `motion/mini`. Native links, buttons, scrolling, focus, and form semantics remain intact.

`Home/useHomeMotion.js` supplies staged hero entrances, finite spring feedback on project/mascot controls, separate title and metric transitions on project selection, and once-only workbench and lower-link reveals. Transform entrances last roughly 540–640ms; control pulses last 420–480ms. Small rotations and perspective give the surfaces character. Content is visible before observers or animation APIs run.

`PageSurface/usePageMotion.js` supplies finite panel and heading entrances, staggered evidence cards with subtle alternating rotation, once-only later-section reveals, button feedback, and directional onward-arrow feedback.

Both hooks cancel animations and restore original inline styles on cleanup. Keyboard focus settles containing entrances; the current pointer press retains its feedback. Initial reduced motion suppresses effects. Enabling reduced motion clears current effects and disables the DOM effects for the rest of that mount. Missing APIs leave visible, functional content.

## Disco

`DiscoCompanion` lazily loads a procedural Three.js scene when its stage becomes visible. Disco has a citron head, charcoal visor, cobalt headphone pods and body, a star antenna, speaker belly, and cable backpack. Its head supplies the matching SVG navigation mark and favicon. No downloaded model or image texture is needed.

Product shows small application windows, Cloud shows linked cloud nodes, and Systems shows a chip stack and circuit ring. The modes also change Disco's pose. A fine pointer guides the head and eyes. Say hello triggers a finite wave; ordinary optional motion includes breathing, blinking, and floating props.

A visible pause control stops the robot's animation and pointer response. Project selection remains functional while paused and immediately renders the selected static pose. Reduced motion also uses static poses. Offscreen and hidden-tab states stop rendering. Drawing is capped at 30fps while optional motion runs; pixel ratio is capped at 1.5 and shadow maps at 1024 pixels. Static paused/reduced scenes request a frame only when state or size changes.

The matching SVG appears before the scene loads, when observers or WebGL are unavailable, and during context loss. Context restoration renders the scene again. Route cleanup releases listeners, geometry, materials, shadow texture, procedural environment, shadows, and renderer resources.

## Content and evidence

All three result links remain on Home independently of the selected project. Detailed case studies provide leadership, delivery, and implementation context. Keep the mixed-reality client anonymous.

Project visuals are actual component captures with synthetic data, labeled architecture illustrations, and scoped benchmarks. The current server has seven RTX 3090s and 168 GiB combined memory. The 18% improvement retains its earlier six-GPU benchmark scope. Neither Disco nor its props represent a hardware inventory.
