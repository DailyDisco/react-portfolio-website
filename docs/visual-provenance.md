# Portfolio visuals

The public gallery contains three featured projects and one shorter supporting case. The eight earlier projects remain in `src/data/projects.json` and their original assets remain in `public/portfolio`; the archive component is no longer mounted publicly.

## Emmut

`public/work/emmut-maintenance-desktop.png` and `emmut-maintenance-mobile.png` are captures of actual maintenance management components, rendered through their test harness and real application styling. The source fixtures explicitly mock the workers and use example.com email addresses and 555 phone numbers. These are component demonstrations with synthetic data, not production tenant records. Captions preserve that distinction. Original capture dimensions are 2560 × 1600 and 780 × 1688.

## Migration and inference

`migration-map.svg` is an architecture overview of the seven production lead-workflow migration from Kestra/AWS to n8n/Railway. It is not a screenshot of either application.

`inference-benchmark.svg` illustrates the six-GPU hardware and the reported ExLlamaV3 cold-prompt benchmark: 1,238 to 1,458 tokens/second, approximately 18%. Decode speed was unchanged. It is an illustration, not a photograph of the physical server.

The current server expanded to seven RTX 3090s on October 10, 2026. A live `nvidia-smi` inventory verified seven cards with 24,576 MiB each (168 GiB combined). The Homelab explorer depicts the current seven-card machine; the benchmark artwork and performance claims retain their original six-card scope. No seven-card performance result is claimed.

## Brand surface and sculpture

The spruce workbench material in `src/assets/brand/workbench.webp` was generated on the owner's Windows RX 9070 XT using Qwen-Image-2.1, 1024 pixels, 25 steps, seed 20261009. Prompt enhancement was disabled. It is decorative artwork, never evidence of client work. The original PNG is retained in the task's local review files and the owner's image output directory. The web copy is compressed WebP.

The six-layer D sculpture is original Three.js geometry. Its three arrangements respond to the project buttons. The matching SVG mark and fallback share the same silhouette. No external 3D model or texture license is required for the geometry.

## Code, hardware, and bass music

`public/brand/code-hardware-music.webp` is an original editorial still life generated with the owner's Qwen-Image-2.1 service on the Windows RX 9070 XT. It joins a graphite heatsink, cream musical keys, a circuit board, and an ochre cable. It illustrates the About page's personal section; it is not a photograph of the owner's equipment. The visible caption identifies it as an illustrated study.

Generation: 1024 × 1024, 32 steps, seed 20261010, prompt enhancement off. Qwen returned HTTP 200. The full prompt is preserved in `docs/story-art-prompt.txt`. Original: `/home/day/Pictures/QwenImage/qwen-ab31990011ac4dad.png`; Windows filename: `Qwen_Agents_00014_.png`. The unmodified original is also retained in the local review workspace. The web asset is a quality-86 WebP conversion.
