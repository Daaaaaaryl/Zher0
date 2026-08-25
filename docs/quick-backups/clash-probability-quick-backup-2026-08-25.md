# Z'her0 Quick Backup Checkpoint — Clash Probability Experiment

Date: 2026-08-25

Status: **QUICK BACKUP ONLY — NOT MAIN CHECKPOINT — NOT CANON**

Purpose: Temporary safety snapshot of the current Clash probability experiment so testing can resume without treating these ideas as finalized combat rules.

Reason: ChatGPT acting up deleting chats randomly. Daryl is scared.

## Earlier A/B experiment

### A — Random ranges

`50–90% → 30–70% → 0–50%`

### B — Fixed probabilities

`90% → 70% → 50%`

The early A/B pass was exploratory and led into the broader candidate comparison below.

## Shared transition behavior used for the comparison

- Each compatible Clash opportunity uses the currently active probability state/range.
- Clash → move one state toward the lower probability.
- No Clash → move one state toward the higher probability.
- If already at an endpoint and the result would move beyond it, stay at that endpoint.
- Ranged states are rerolled within their active range each turn/opportunity.

## Current crown owner

### #7 revised — selected current Clash probability behavior

`10–50% → 30–70% → 50–90%`

Design intent: give the opening exchange room to proceed normally while allowing Clash pressure to build if compatible attacks continue without a Clash. The 10% floor keeps a real opening Clash possibility without near-zero opening rolls.

Status: **CURRENT CROWN / SELECTED FOR CONTINUED DESIGN AND PROTOTYPE TESTING.** Revisitable after representative gameplay and player feedback.

## Runner-up

### #5

`50–90% → 30–70% → 0–50%`

Observed identity: strong early Clash opportunity followed by cooldown/suppression. Keep as the primary fallback if later testing shows Clash should be more available from the opening exchange.

## Wildcard candidates and observed Clash battle-flow behavior

1. `90 → 70 → 50` — very Clash-heavy; strong opening and frequent Clash streaks.
2. `50 → 70 → 90` — also Clash-heavy; builds toward very high Clash pressure.
3. `0–50 → 70 → 90` — quieter opening, then rapidly becomes Clash-active.
4. `0–50 → 70 → 80` — low opening followed by a sharp rise; settles near the middle.
5. `50–90 → 30–70 → 0–50` — strong early Clash opportunity, then cools down; balanced overall; current runner-up.
6. `50–80 → 30–70 → 0–40` — calmer version of #5; suppresses repeated Clash more but permits more quiet stretches.
7. `0–50 → 30–70 → 50–90` — original buildup version; low early Clash pressure rises through the battle.
7R. `10–50 → 30–70 → 50–90` — revised buildup version; removes near-zero opening chances while preserving room before Clash pressure builds; current crown owner.
8. `0–90 → 30–70 → 0–50` — lower overall Clash activity and more noticeable No-Clash droughts.
9. `0–80 → 30–70 → 0–40` — quieter again, with substantial No-Clash streak behavior.
10. `0–70 → 30–60 → 0–30` — weakest Clash presence among the tested group; long No-Clash stretches became common.
11. `30–80 → 30–70 → 0–50` — middle-opening candidate, but produced more quiet stretches and a less distinct battle-flow identity than #5 or #7.

The wildcard pool is deliberately preserved. These are not treated as failed candidates; future gameplay experience or player feedback may justify reviving one of their known behavior profiles.

## Comparison scale

Approximate cumulative comparison volume recorded across the completed rounds in this design session:

- **~44 million simulated battles**
- **~620 million turn-level Clash opportunities / probability checks**

These figures are an approximate cumulative tally from the logged comparison rounds and are not a count of 620 million actual Clashes. Comparison rounds used 5-, 10-, and 20-turn battle windows.

The pass examined more than average Clash percentage. It compared opening behavior, buildup/cooldown, Clash streaks, No-Clash droughts, first-five-turn behavior, 10-turn behavior, 20-turn behavior, and whether candidates drift toward Clash spam or excessive Clash absence.

## Main design conclusion

The #5 vs #7 choice is primarily about **when Clash pressure should exist**:

- #5 = strong opening possibility, then cooldown.
- #7 = room for ordinary opening exchanges, then rising Clash pressure.

Current selection: **#7 revised `10–50 → 30–70 → 50–90`.**

## Next plan

The Clash probability comparison is complete enough to move forward with #7R as the current selection and #5 as runner-up.

Before representative prototype implementation, run a **read-only Game Studio planning review** against the current main checkpoint and repository state. The review should identify the safest next unresolved battle-foundation task and the minimum representative prototype scope. It should explicitly consider pending Defend decay/recovery and round-boundary/effect-clock work without automatically assuming which one comes first.

No implementation or repository change should follow from that review without explicit owner approval.

## Protection / scope

This quick backup does not by itself establish or change Clash force/Impact mathematics, SP-to-Clash-force behavior, Physical-vs-Magic or Magic-vs-Magic Clash compatibility, attack-to-attack weighing modifiers, ZPD/Hit Resistance math, PT-to-HP status, Defend decay/recovery, Move formulas, status/effect timing, or equipment stat allocations.
