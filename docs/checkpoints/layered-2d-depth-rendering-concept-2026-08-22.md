# Z’her0 — Layered 2D Depth Rendering Design Concept

**Date:** 2026-08-22
**Classification:** Developing design concept / rendering strategy. Not yet locked production canon.

## Core concept
Z’her0 can remain fundamentally a **2D game** while presenting environments and movement with a convincing **3D-like sense of depth**.

The goal is NOT to build and continuously render a fully modeled real-time 3D world. Instead, use high-quality 2D/pre-rendered artwork and deliberately stack, move, hide, reveal, scale, animate, and transition image layers so the player perceives depth and dimensional movement.

In simple terms: **the world is mechanically 2D, but visual layering and motion cheat a 3D feeling.**

## Base map direction
- Maps may use high-quality game-rendered-looking artwork rather than pixel art.
- A map can fundamentally be a flat 2D image / 2D coordinate plane.
- Camera/art perspective should retain visible object volume, lighting, shadows, height, and perspective so the map does not FEEL like a flat illustration.
- A high-angle/top-down or similar gameplay-readable perspective can be used while retaining visible sides/thickness of trees, ruins, rocks, stairs, terrain, etc.
- The rendering itself can be produced/pre-rendered with 3D-like quality while runtime movement remains 2D.

## Layer stack / depth cheating
Possible runtime stack, depending on scene needs:
1. Background/distant environment imagery.
2. Main map/ground image.
3. Environmental objects behind the player.
4. Player, monsters, NPCs, battle objects.
5. Foreground/occlusion imagery such as tree canopies, arch tops, roofs, walls, branches, foliage, etc.
6. Lighting, particles, shadows, weather, atmospheric/effect layers.

Not every scene needs every layer. Layering should be used where it adds meaningful depth.

## Occlusion examples
- A tree trunk/base may belong to the map while its canopy renders above the player, making the player appear to walk underneath it.
- An arch can have lower/environment portions behind the player and an upper foreground portion above the player, making the character appear to pass underneath/through the structure.
- Buildings, caves, ruins, trees, walls, and other structures can use similar selective foreground occlusion.

## Map-depth transitions
The game does not need to stay visually locked to one flat-map presentation.

When a player approaches or passes through certain parts of a map, layers/camera/composition may change to increase the feeling of dimensional movement while still remaining mechanically 2D.

Example: entering a ruin
1. Player approaches an entrance on the main 2D map.
2. Foreground entrance/arch layer begins to cover the player as they pass underneath it.
3. Camera may subtly pan, zoom, or shift.
4. Exterior layers may move, fade, hide, or be replaced.
5. Interior map/layers appear.
6. Player experiences this as physically entering the ruin even though the implementation is primarily image/layer/state transitions.

This concept may also apply to caves, buildings, forests, bridges, elevation changes, tunnels, and other map sections.

## Layer animation / simulated volume
Stacked images do not have to remain static.

Separate 2D pieces can receive subtle independent animation so a flat asset appears volumetric.

Examples:
- tree trunk mostly stationary;
- rear branches sway slightly;
- canopy/leaves move at a different rate;
- foreground branches move subtly differently;
- shadows shift or change opacity;
- foreground/background pieces move by slightly different amounts during camera movement (parallax);
- environmental pieces may scale/translate subtly during transitions.

The movement should generally be subtle. Excessive independent movement risks revealing the illusion as flat pieces sliding over each other.

## Other depth tools
Potential tools for strengthening the illusion:
- parallax;
- character/object shadows;
- lighting overlays;
- animated environmental effects;
- camera pan/zoom;
- selective scaling;
- masks/occlusion;
- particles;
- animated water, waterfalls, torches, leaves, fog, cloud shadows, etc.;
- perspective exaggeration where visually useful.

Because the environment is not required to obey a full real-time 3D simulation, visual perspective/effects may be exaggerated when that produces a better-looking scene.

## Performance/production intention
A major reason for exploring this strategy is to obtain a high-quality dimensional appearance without requiring the runtime to continuously render a complete real-time 3D environment.

Much of the apparent geometry, material detail, lighting, and shadow can be baked into the artwork. Runtime then primarily handles 2D movement, animation, layering, effects, collision/walkable regions, camera behavior, and state transitions.

This is NOT assumed to be performance-free. Large textures, transparency, particles, animation, effects, and many layers still have runtime costs and must be tested.

## AI-assisted asset exploration findings
Gemini experiments showed that AI can produce promising stylized game-rendered environment master images, but repeated image-to-image revisions can reduce visual quality and introduce drift.

Current working lesson:
- Preserve a strong MASTER rendering-quality reference.
- Prefer fresh generations using the master as a style/quality reference rather than repeatedly editing an edited image.
- AI-generated attempts at transparent layer extraction may produce fake checkerboard transparency and redraw/misalign objects.
- Therefore, do not currently rely on Gemini to produce production-ready aligned transparent layers.
- A more reliable direction may be: generate/design a strong master map, then derive/cut required foreground/occlusion layers from that same master or deliberately author assets for layering.

## Art-direction observations from experiments
Developing visual preference:
- high-quality stylized/game-rendered appearance;
- dimensional 3D-like lighting/materials/volume;
- technically usable in a 2D game;
- avoid pixel art as the intended main direction;
- avoid heavy cartoon/storybook outlines;
- avoid overly gritty/edgy hyper-realistic RPG rendering;
- soft/polished appearance can still retain high detail and dimensional quality.

These art preferences remain exploratory and should not be treated as fully locked until tested with actual character/environment integration.

## Recommended proof-of-concept
Before building a full map or large art pipeline, create a very small technical-art prototype:
- one small map/screen;
- one temporary character;
- one tree or layered natural object;
- one ruin/arch;
- one path/walkable area;
- roughly 3–5 useful environmental depth layers;
- character shadow;
- one walk-behind/occlusion interaction;
- subtle parallax/layer animation;
- one entrance/transition that creates the feeling of moving into another part of the environment.

Success criterion: although the prototype is mechanically 2D, the combined artwork, occlusion, layer movement, camera behavior, shadows, and transitions should make the scene feel meaningfully dimensional/3D-like.

## Preservation rule
This checkpoint records the concept as a **developing design/rendering strategy**, not final canon. Do not silently convert exploratory implementation ideas, specific layer counts, camera angles, AI workflows, or example transitions into mandatory rules without later confirmation/testing.
