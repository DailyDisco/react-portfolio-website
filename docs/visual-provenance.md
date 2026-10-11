# Portfolio visuals

The public gallery contains three featured projects and one shorter supporting case. The eight earlier projects remain in `src/data/projects.json` and their original assets remain in `public/portfolio`; the archive component is no longer mounted publicly.

## Emmut

`public/work/emmut-maintenance-desktop.png` and `emmut-maintenance-mobile.png` are captures of actual maintenance management components, rendered through their test harness and real application styling. The source fixtures explicitly mock the workers and use example.com email addresses and 555 phone numbers. These are component demonstrations with synthetic data, not production tenant records. Captions preserve that distinction. Original capture dimensions are 2560 × 1600 and 780 × 1688.

## Migration and inference

`migration-map.svg` is an architecture overview of the seven production lead-workflow migration from Kestra/AWS to n8n/Railway. It is not a screenshot of either application.

`inference-benchmark.svg` illustrates the six-GPU hardware and the reported ExLlamaV3 cold-prompt benchmark: 1,238 to 1,458 tokens/second, approximately 18%. Decode speed was unchanged. It is an illustration, not a photograph of the physical server.

Both public SVG illustrations were recolored to the current ivory, ink-blue, and coral palette. Their structure, evidence labels, and benchmark scope were preserved.

The current server expanded to seven RTX 3090s on October 10, 2026. A live `nvidia-smi` inventory verified seven cards with 24,576 MiB each (168 GiB combined). The Homelab explorer depicts the current seven-card machine; the benchmark artwork and performance claims retain their original six-card scope. No seven-card performance result is claimed.

## Brand surface and sculpture

The spruce workbench material in `src/assets/brand/workbench.webp` was generated on the owner's Windows RX 9070 XT using Qwen-Image-2.1, 1024 pixels, 25 steps, seed 20261009. Prompt enhancement was disabled. It is decorative artwork, never evidence of client work. The original PNG is retained in the task's local review files and the owner's image output directory. The web copy is compressed WebP. The current interface overlays this existing image with a 96–98% opaque ink-blue CSS gradient; the source artwork has not been recolored or regenerated for the ivory/blue/coral palette.

The six-layer D sculpture is original Three.js geometry with rounded inset faces, beveled metal rims, connecting rods, fasteners, and grooves. Its materials read the shared ivory, ink-blue, coral, and metal-edge CSS colors when the scene initializes. Product, Cloud, and Systems select compact, expanded, and fanned arrangements. The matching SVG fallback uses the same silhouette and palette, and updates its arrangement without WebGL. Six layers describe the monogram design, not the current server inventory. Studio reflections come from Three.js's procedural `RoomEnvironment`; the contact-shadow texture is drawn in code. No downloaded model or external image texture is used by the sculpture.

## Code, hardware, and bass music

`public/brand/code-hardware-music.webp` is an original editorial still life generated with the owner's Qwen-Image-2.1 service on the Windows RX 9070 XT. It joins a graphite heatsink, cream musical keys, a circuit board, and an ochre cable. It appears on About; the compact homepage does not mount it. It is not a photograph of the owner's equipment, and the visible caption identifies it as an illustrated study. Its original colors are preserved.

The seven-card SVG in the preserved, unmounted `HomeStory` source is a schematic of the current GPU count, not a photograph or a new performance measurement. The active infrastructure explorer also depicts seven GPUs. The compact homepage's six bars accompany the explicitly six-GPU benchmark rather than a current inventory label.

Generation: 1024 × 1024, 32 steps, seed 20261010, prompt enhancement off. Qwen returned HTTP 200. The full prompt is preserved in `docs/story-art-prompt.txt`. Original: `/home/day/Pictures/QwenImage/qwen-ab31990011ac4dad.png`; Windows filename: `Qwen_Agents_00014_.png`. The unmodified original is also retained in the local review workspace. The web asset is a quality-86 WebP conversion.

## Sharing artwork

`src/data/pageMetadata.json` and the HTML metadata reference `/og-image.png`. The current 1200 × 630 PNG is a static Digital Diego instrument composition in the rounded ivory, ink-blue, and coral design, including a render of the procedural Three.js sculpture. Its text identifies the engineering role, domain, current seven-GPU server, and two upstream fixes; it makes no new performance claim. It is a sharing graphic, not a capture of a client application.

`public/favicon.svg` uses the matching ivory, ink-blue, and coral colors with an 18px rounded background in its 64px view box. Browser theme and manifest background colors use the ink-blue backdrop. These static assets are separate from the interactive scene and do not constitute a new Qwen image generation.
