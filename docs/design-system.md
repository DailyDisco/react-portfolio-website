# Digital Diego interface

The active interface is a work-led engineering portfolio on an open chalk page. Cobalt actions, citron accents, generous type, hairline seams, static technology logos, and a friendly robot-head mark connect the pages. Project imagery and evidence lead Home; the small robot companion is an optional Easter egg.

## Shared structure

- `src/index.css` owns semantic `--brand-*` colors, radius tokens, and type defaults. Legacy aliases map to these tokens.
- `Layout/style.css` owns navigation, page headings, shared controls, and the footer. The robot head is the shared brand mark.
- Home contains an introduction beside a selected-project cover, native Product/Cloud/Systems controls, three permanent result links, a detailed selected-project readout, and direct homelab and resume links. The cover caption includes the small Psst companion opener.
- `study.cover` supplies the rounded wide Home/gallery image, with `study.visual` as its fallback. Detailed component captures, architecture diagrams, and benchmarks remain in the selected readout and case studies.
- `PageSurface` wraps inner pages. Main and supporting sections use open publication spacing and hairline seams. Dark technical diagrams provide occasional contrast.
- `NextChapter` provides contextual onward navigation; the main navigation and footer remain consistent across routes.

Allow natural document flow on small screens. Do not force content into viewport-height sections. Preserve the earlier `SignalSculpture`, `HomeStory`, `HomeJourney`, and `useConsoleMotion` sources as unmounted historical references.

## Type, color, and shape

Use Manrope for major headings and the wordmark, system sans-serif for body copy, and monospace sparingly for short technical labels. Body copy stays at 16px or larger. Lucide icons accompany visible text labels. `TechStack` and `TechIcon` use locally bundled technology SVGs, with Lucide fallbacks for unnamed or unavailable marks. Logos are decorative, and technology names remain readable. Icons stay static.

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

The React 17 app uses Motion's vanilla `animate` API from `motion/mini`. Native links, buttons, scrolling, focus, and form semantics remain intact.

`Home/useHomeMotion.js` supplies a single 300ms introduction entrance, once-only 6px section entrances, a 180ms project crossfade, and small 180–200ms control feedback. There are no separate title or metric effects, rotations, perspective tilts, or staggered cards.

`PageSurface/usePageMotion.js` uses the same 300ms, 6px panel entrance and restrained control feedback. Headings, evidence cards, and icons stay together with their containing section.
Both hooks cancel animations and restore original inline styles on cleanup. Keyboard focus settles containing entrances; the current pointer press retains its feedback. Initial reduced motion suppresses effects. Enabling reduced motion clears current effects and disables the DOM effects for the rest of that mount. Missing APIs leave visible, functional content.

## Robot companion

`RobotPocket` is closed initially. The small Psst opener beside the work-cover caption opens an anchored, nonmodal panel; it is an optional local Easter egg with no chat or customer-support behavior. The panel adjusts to available viewport space and stays associated with its opener. Close or Escape dismisses it and returns focus. It does not trap focus or block native page navigation.

`RobotCompanion` mounts only while the pocket is open and lazily loads its procedural Three.js scene when the stage becomes visible. The robot has an oversized softly beveled pale citron head, large dark oval eyes with highlights, a little smile, rosy cheeks, a star antenna, petite matte body, rounded limbs, and a small heart status panel. Its head supplies the matching SVG navigation mark and favicon. No downloaded model or image texture is needed.

Product shows small application windows, Cloud shows linked cloud nodes, and Systems shows a chip stack and circuit ring. The modes also change the robot's pose. A fine pointer guides the head and eyes. Say hello triggers a finite wave; ordinary optional motion includes breathing, blinking, and floating props.

The panel's Pause control stops the robot's animation and pointer response. Project selection remains functional while paused and immediately renders the selected static pose. Reduced motion also uses static poses. Offscreen and hidden-tab states stop rendering. Drawing is capped at 30fps while optional motion runs; pixel ratio is capped at 1.5 and shadow maps at 1024 pixels. Static paused/reduced scenes request a frame only when state or size changes.

The matching SVG appears before the scene loads, when observers or WebGL are unavailable, and during context loss. Context restoration renders the scene again. Closing the pocket or leaving the route releases listeners, geometry, materials, shadow texture, procedural environment, shadows, and renderer resources.

## Content and evidence

All three result links remain on Home independently of the selected project. Detailed case studies provide leadership, delivery, and implementation context. Keep the mixed-reality client anonymous.

Emmut's cover composes actual desktop/mobile components rendered with synthetic data. The migration and inference covers are labeled conceptual illustrations. Their decorative object counts are not architecture, inventory, or performance evidence. The original component captures, migration map, and scoped benchmark remain in detailed project views; keep their captions and provenance intact when changing a cover.

The current server has seven RTX 3090s and 168 GiB combined memory. The 18% improvement retains its earlier six-GPU benchmark scope. Neither the robot nor its props represent a hardware inventory. Earlier artwork and design iterations remain documented in `visual-provenance.md` and the preserved unmounted sources.
