# Surprise — anime.js × React

A tiny interactive gift-box reveal built with [anime.js v4](https://animejs.com) and React 19.

Drag the wrapped present around the stage. The bow unties with an SVG stroke-draw, the lid pops off with spring physics, confetti bursts outward in staggered waves, and a hidden message floats up from inside. After the burst, every confetti piece becomes draggable — fling them around.

## What's inside

- **`createTimeline`** chains the unwrap sequence (bow → ribbons → lid → glow → confetti → message).
- **`svg.createDrawable`** animates the bow's stroke off.
- **`createSpring`** gives the lid and confetti satisfying bounce.
- **`createDraggable`** wires up the gift and every confetti piece.
- **`stagger`** spaces out the bow strokes, confetti burst (from center), and the letters of "Surprise!".
- **`createScope`** keeps everything scoped to the React root so `revert()` cleans up on unmount.

## Run it

```bash
bun install
bun run dev
```

Open the printed URL. Watch the reveal play once on mount, then use:

- **Wrap it up** — restart the whole sequence from the wrapped state.
- **Burst again** — re-fan the confetti without rewinding the box.
