# Katana art reference

- Equipment: Katana
- Slot: Main Hand
- Status: Approved master
- Canonical artwork: `katana_master.png`
- Tuner artwork: `katana_tuner.png` (approved vertical/standing Tuner presentation)
- Icon: `katana_icon.png` (pending; derive from the approved master artwork)
- The supplied PNG is the visual source of truth.
- Art direction: combination of styles 1 + 11 + 18 + 20

## Presentation and design requirements

- Clean RPG inventory presentation
- Modern AAA-quality material/detail treatment
- Minimal premium readability
- Zero-to-Hero progression-compatible design
- Traditional recognizable Katana proportions
- Clean design with restrained decoration
- Katana and saya must visibly belong to the same matched set
- Black/dark neutral base with restrained gold accents
- Avoid excessive ornamentation or visual clutter
- Preserve a strong readable silhouette at smaller UI sizes

## Asset handling

`katana_master.png` is the canonical approved Katana artwork and visual source of truth. Do not modify, optimize, resize, recompress, or overwrite it without explicit approval. Any future `katana_icon.png` must be derived from this approved master so the icon and full artwork represent the same weapon.

`katana_tuner.png` is the approved vertical/standing composition used only for the Equipment Tuner presentation. It does not replace `katana_master.png`. Both artwork files represent the same approved Katana design. Equipment without a dedicated Tuner composition must use `null` for `tunerArtwork`; do not rotate, crop, or otherwise transform `masterArtwork` to fabricate one.
