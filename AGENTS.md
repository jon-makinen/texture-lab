# Texture Lab

Client-side procedural texture generator built with Next.js 16 (App Router) under `src/`.

## Structure

- `src/app/` — single-page app, no routing
- `src/components/` — canvas, control bar, color picker, sliders
- `src/lib/generators/` — blur, noise, patterns, lines, mesh renderers
- `src/lib/types.ts` — all shared types and defaults
- `src/lib/export.ts` — PNG export utility
- `src/lib/extract-colors.ts` — color extraction from dropped images
