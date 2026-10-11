# Portfolio visuals

The public gallery contains three featured projects and one shorter supporting case. The eight earlier projects remain in `src/data/projects.json` and their original assets remain in `public/portfolio`; the archive component is no longer mounted publicly.

## Emmut

`public/work/emmut-maintenance-desktop.png` and `emmut-maintenance-mobile.png` are captures of actual maintenance management components, rendered through their test harness and real application styling. The source fixtures explicitly mock the workers and use example.com email addresses and 555 phone numbers. These are component demonstrations with synthetic data, not production tenant records. Captions preserve that distinction. Original capture dimensions are 2560 × 1600 and 780 × 1688.

## Migration and inference

`migration-map.svg` is an architecture overview of the seven production lead-workflow migration from Kestra/AWS to n8n/Railway. It is not a screenshot of either application.

`inference-benchmark.svg` illustrates the six-GPU hardware and the reported ExLlamaV3 cold-prompt benchmark: 1,238 to 1,458 tokens/second, approximately 18%. Decode speed was unchanged. It is an illustration, not a photograph of the physical server.

Both public SVG illustrations were recolored to the current chalk, ink, cobalt, and citron palette. Their structure, evidence labels, and benchmark scope were preserved.

The current server expanded to seven RTX 3090s on October 10, 2026. A live `nvidia-smi` inventory verified seven cards with 24,576 MiB each (168 GiB combined). The Homelab explorer depicts the current seven-card machine; the benchmark artwork and performance claims retain their original six-card scope. No seven-card performance result is claimed.

## Brand surface and mascot

Disco is original procedural Three.js geometry: a citron robot head, charcoal visor, cobalt headphone pods and body, star antenna, speaker belly, and cable backpack. Product, Cloud, and Systems select application-window, cloud-node, and chip/circuit props. The matching SVG navigation mark and static fallback use the same silhouette and palette. Studio reflections come from Three.js’s procedural `RoomEnvironment`; the shadow texture is drawn in code. No downloaded model, external texture, or new image generation is used by the mascot.

The former six-layer D sculpture remains in the unmounted `SignalSculpture` source. Its six layers describe a monogram design, not hardware inventory.

The spruce workbench material in `src/assets/brand/workbench.webp` was generated on the owner’s Windows RX 9070 XT using Qwen-Image-2.1, 1024 pixels, 25 steps, seed 20261009, prompt enhancement off. It is preserved as historical decorative artwork, and is no longer mounted by the active interface. Its original PNG is retained in local review files and the owner’s image output directory.

## Code, hardware, and bass music

`public/brand/code-hardware-music.webp` is an original editorial still life generated with the owner's Qwen-Image-2.1 service on the Windows RX 9070 XT. It joins a graphite heatsink, cream musical keys, a circuit board, and an ochre cable. It appears on About; the compact homepage does not mount it. It is not a photograph of the owner's equipment, and the visible caption identifies it as an illustrated study. Its original colors are preserved.

The seven-card SVG in the preserved, unmounted `HomeStory` source is a schematic of the current GPU count, not a photograph or a new performance measurement. The active infrastructure explorer also depicts seven GPUs. The active homepage links current hardware separately from the explicitly six-GPU performance benchmark.

Generation: 1024 × 1024, 32 steps, seed 20261010, prompt enhancement off. Qwen returned HTTP 200. The full prompt is preserved in `docs/story-art-prompt.txt`. Original: `/home/day/Pictures/QwenImage/qwen-ab31990011ac4dad.png`; Windows filename: `Qwen_Agents_00014_.png`. The unmodified original is also retained in the local review workspace. The web asset is a quality-86 WebP conversion.

## Sharing artwork

`src/data/pageMetadata.json` and the HTML metadata reference `/og-image.png`. The current 1200 × 630 sharing graphic uses the chalk, ink, cobalt, and citron theme and a render of the actual procedural Three.js Disco robot. Its text identifies Diego’s role and domain, two hours of daily admin time saved per employee, seven migrated workflows, and two upstream fixes. It is a brand graphic, not a client application capture.

`public/favicon.svg` uses the robot-head mark in the same colors. Browser theme and manifest backgrounds use chalk. These static assets are separate from the interactive scene and do not constitute new Qwen image generation.
