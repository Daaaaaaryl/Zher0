# Z’her0 — Weak Monster Roster Checkpoint

**Date:** 2026-08-22
**Status:** Design/test checkpoint. Preserve candidate history; do not treat all test values as final production canon.

## Working Weak-tier benchmark
A reasonably matched Weak monster currently targets roughly **8–9 successful basic attacks to defeat**. This is a testing reference, not a mandatory rule. Resistant matchups may intentionally take longer.

Current Combat Test Lab baseline remains simple subtraction for testing only:
- Physical damage = max(0, total Physical Attack - target Physical Defense)
- Magical damage = max(0, total Magic Attack - target Magic Defense)

This formula is not final combat canon.

## Weak Test Roster v1

### #1 — Balanced
Current candidate: **225 Health / 45 Physical Defense / 26 Magic Defense**.

Baseline results under current test formula:
- Samurai: 6 hits
- Knight: 9 hits
- Geisha magical route: 9 hits

This is currently one of the strongest-looking baseline distributions by raw stat shape.

### #2 — High Health / Low Defense
Candidate A: **320 Health / 30 Physical Defense / 15 Magic Defense**.

Results:
- Samurai: 6 hits
- Knight: 8 hits
- Geisha: 9 hits

Preserve as a test case. It overlaps somewhat with #7 conceptually but remains useful as a high-Health/low-defense reference.

### #3 — Low Health / High Physical Defense
Candidate A: **150 Health / 65 Physical Defense / 15 Magic Defense**.

Results:
- Samurai: 7 hits
- Knight: 19 hits
- Geisha: 5 hits

Preserve the extreme Knight result as evidence rather than automatically balancing it away.

### #4 — Low Health / High Magic Defense
Candidate A: **150 Health / 25 Physical Defense / 43 Magic Defense**.

Results:
- Samurai: 3 hits
- Knight: 4 hits
- Geisha: 19 hits

This raw distribution is currently considered promising. It intentionally creates a difficult magical matchup.

### #5 — Physical-resistant / Magic-weak
Historical Candidate A: **200 Health / 68 Physical Defense / 10 Magic Defense**.
- Samurai: 10 hits
- Knight: 40 hits
- Geisha: 5 hits

The 68 Physical Defense value was judged too extreme for the current Weak-tier experiment, especially because it creates a 40-hit Knight result.

**Current preferred Candidate B:** **200 Health / 60 Physical Defense / 10 Magic Defense**.
- Samurai: 8 hits
- Knight: 16 hits
- Geisha: 5 hits

A 55 Physical Defense candidate was also examined (approximately 7 / 12 / 5 hits) but was not preferred because it begins weakening the intended physical-resistant identity.

### #6 — Magic-resistant / Physical-weak
Historical Candidate A: **200 Health / 20 Physical Defense / 45 Magic Defense**.
- Samurai: 3 hits
- Knight: 4 hits
- Geisha: 34 hits

Candidate B tested Magic Defense 40:
- Samurai: 3 hits
- Knight: 4 hits
- Geisha: 19 hits

**Current leaning / preferred test candidate:** **200 Health / 20 Physical Defense / 35 Magic Defense**.
- Samurai: 3 hits
- Knight: 4 hits
- Geisha: 13 hits

Reason: 34 and 19 hits feel excessively *makunat* for a Weak monster when the normal reference is roughly 8–9. Thirteen hits still clearly communicates magical resistance while staying closer to the intended tier. Keep 40 and 45 as tougher historical experimental versions.

### #7 — Overall Weak Defense / Huge Squishy Monster
Historical Candidate A: **300 Health / 20 Physical Defense / 10 Magic Defense**.
- Samurai: 5 hits
- Knight: 6 hits
- Geisha: 8 hits

**Current preferred Candidate B:** **400 Health / 20 Physical Defense / 10 Magic Defense**.
- Samurai: 6 hits
- Knight: 8 hits
- Geisha: 10 hits

This candidate gained a possible gameplay/story role: a visually enormous early-game monster with an intimidating 400-Health bar but surprisingly weak defenses. The intended lesson is that size and Health-bar size do not automatically mean an enemy is unbeatable or strongly defended. A Level-1 player may initially want to flee, then discover by attacking that large chunks of the Health bar can be removed.

This possible opening/early encounter role is an idea, not yet confirmed final placement.

## Current roster observations
- #1, #4, #5, #6, and #7 received the most attention in the refinement pass.
- #1 currently serves as the strongest general baseline reference.
- Specialized monsters should not all be normalized to exactly 8–9 hits; their resistances need to matter.
- Extremely high hit counts such as 34 or 40 are useful evidence for later Defense Attrition / Break-through testing and should remain in history even when preferred candidate values are moderated.

## Future stress test — Overpowered monsters
Do not design overpowering/stat-stacking behavior as a player-only possibility. Monsters should eventually be stress-tested with similarly extreme/high-stat builds. This will help test whether free equipment/build systems create unhealthy metas and whether counters, passives, equipment interactions, monsters, or other mechanics can answer those builds without arbitrary restrictions.

## Next combat task after this checkpoint
Finish refinement/review of Weak Monsters **#1–#4**, then compare the complete Weak roster before deciding whether to proceed to Average monsters or use the roster to test Defense Attrition / Break-through behavior.

## Preservation rule
Do not overwrite historical candidates when values change. Preserve Candidate A/B/C history and mark the current preferred test value separately. These are design experiments, not automatically final monster canon.
