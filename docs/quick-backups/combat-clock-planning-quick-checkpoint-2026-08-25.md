# Z'her0 Quick Checkpoint — Combat Clock Planning Safeguard

Date: 2026-08-25

Status: **QUICK CHECKPOINT ONLY — NOT MAIN CHECKPOINT — NOT CANON**

Purpose: Safeguard the current planning state after the Clash probability pass and the subsequent read-only Game Studio review. This file preserves what the review got right, what it missed, what the current repository/checkpoint already contains, and the exact next-step workflow so work can resume safely if chat context is lost.

## Why this quick checkpoint exists

The Game Studio planning review was useful, but it was **not fully synchronized with the latest preserved checkpoint state**. It correctly identified the next major structural problem, but it also described some areas as completely unresolved even though the current synced checkpoint already carries developed candidates for them.

This checkpoint therefore stores both:

1. the useful planning conclusion from the review; and
2. the corrections/qualifications needed to keep it aligned with the latest preserved design state.

Nothing in this quick checkpoint silently promotes a candidate to permanent canon.

## Clash probability — current preserved selection

Current crown owner:

### Candidate #7R

`10–50% → 30–70% → 50–90%`

Current transition behavior:

- Each eligible Clash opportunity uses the currently active probability state/range.
- **No Clash** moves one state toward the higher-probability side.
- **Clash** moves one state toward the lower-probability side.
- Ranged states reroll within the active range on each eligible opportunity.
- Endpoint states remain capped when the result would otherwise move beyond the available states.

Design identity:

**Give ordinary opening exchanges room, then build Clash pressure if compatible attacks continue without a Clash.**

Runner-up:

### Candidate #5

`50–90% → 30–70% → 0–50%`

Design identity:

**Make Clash meaningfully available from the opening exchange, then cool probability down after Clash.**

All other tested candidates remain preserved as **Wildcards** for future balancing/player-feedback review.

## Clash comparison history / scale note

The prior design-session record carries an approximate cumulative tally of:

- **~44 million simulated battles**
- **~620 million turn-level Clash opportunities / probability checks**

These figures are preserved as previously recorded session totals. They are **not** a count of 620 million actual Clashes, and this quick checkpoint does not independently recompute or re-verify the cumulative simulation tally.

The comparison pass focused on battle-flow behavior, including opening behavior, buildup/cooldown, Clash streaks, No-Clash droughts, short 5-turn behavior, 10-turn behavior, 20-turn behavior, and whether candidates drift toward excessive Clash spam or excessive Clash absence.

## Game Studio planning review — useful conclusion

The strongest useful conclusion from the read-only Game Studio review is:

> **Round-boundary / effect-clock design should come before Defend decay/recovery.**

Reason:

Defend recovery is a temporal mechanic. Terms such as “recover after X,” “lasts one round,” “next turn,” “end of round,” “after a non-Defend action,” and similar timing language cannot be designed consistently until combat has a stable time/lifecycle model.

The same clock dependency applies more broadly to:

- temporary buffs/debuffs;
- Stun and other duration-based effects;
- regeneration;
- cooldown decrement timing;
- poison/bleed tick timing;
- temporary SP / Move Priority changes;
- future Defense recovery;
- state-lifetime questions for Clash probability.

The review also correctly concluded that no other unresolved mechanic clearly needs to be solved **before** the basic round/effect-clock structure itself.

## Important synchronization corrections to the Game Studio review

The review was **not fully synced** with the latest preserved checkpoint in the following areas.

### 1. Defense Attrition conversion is not completely blank anymore

The synced checkpoint already carries the current Natural Deceleration / Hit Resistance candidate:

`A_n = (P * Z_n) / [H_n * (P + Z_n)]`

with:

`H_n = 5 - 3(0.75)^(n-1)`

This candidate and its H lifecycle have already undergone design review and stress testing. It remains a **current candidate under continued validation**, not a permanently locked universal balance formula.

Therefore the next plan should **not automatically restart Defense Attrition conversion design from zero**. The safer next step is to carry the existing candidate into representative clock-based testing and reopen the conversion only if new evidence exposes a problem.

### 2. Ordinary Physical HP consequence also has a current candidate

The synced checkpoint already carries:

**Physical HP Damage = Physical Pass-Through (PT), 1:1**

This candidate survived an initial repeated-battle torture pass but remains **not locked**.

Therefore the next plan should not treat ordinary Physical HP resolution as if no candidate exists. It should be carried forward for representative testing unless the prototype exposes a reason to reopen it.

### 3. Defend is structurally understood but its execution/recovery remains unresolved

Preserved direction includes:

- Defend is separate from ordinary passive ZPD resolution.
- A successful Defend Move may be defined to provide complete protection, including zero HP damage and zero ordinary Defense Attrition.
- A gentler repeated-Defend decay candidate was previously explored.
- Gradual recovery after breaking consecutive Defend remains a leading direction.

Exact Defend execution, decay/recovery timing, and final values are still unresolved enough that they should wait until the combat clock gives “after X” a stable meaning.

## Current next-step plan

The immediate design target is now:

# **Define and test the smallest possible combat round / effect clock.**

Do **not** expand this into a full status engine, cooldown system, or balance pass.

Minimum conceptual lifecycle to examine:

`Action selection / commitment`

`↓`

`Resolution group(s) execute`

`↓`

`Round reaches boundary`

`↓`

`Time-based battle effects advance`

`↓`

`Next selection cycle`

The clock should first be tested with dummy/temporary markers rather than committing real balance mechanics. Example: a test marker that lasts “one round” can verify lifecycle behavior without finalizing Bleed, regeneration, Stun, Defend recovery, or other content.

## Questions to answer — one by one

These are the current structural questions to work through in order. Each resolved question should receive its own **Quick Checkpoint** before moving to the next question.

### Q1 — What exactly constitutes one combat round?

Need to determine the start and end boundary of a round within the existing simultaneous-choice / commitment / resolution model.

### Q2 — How do resolution groups fit inside one round?

Need to determine whether a round may contain one or multiple ordered/simultaneous resolution groups and how they compose into the round lifecycle.

### Q3 — How is simultaneous resolution represented in the clock?

Need to determine whether simultaneously resolved actions form one resolution group and when their consequences become authoritative relative to the round boundary.

### Q4 — When do timed effects begin counting?

Need a consistent rule for when a newly applied duration starts relative to the action/resolution group/round that created it.

### Q5 — When do durations decrement or expire?

Need to decide whether duration advancement occurs at a single round boundary or another clearly defined lifecycle point.

### Q6 — What happens to end-of-round processing if one actor dies or becomes unable to act?

Need to distinguish battle-state cleanup/effect processing from whether another committed action may still execute.

### Q7 — What does “next turn” mean in Z'her0 terminology?

Need to avoid ambiguous use of “turn” for actor action, resolution step, or complete round. Terminology should be explicit enough that future Move/status text is not internally inconsistent.

### Q8 — What is the lifecycle of Clash probability state?

Need to determine whether #7R state belongs to:

- the whole battle;
- the combatant pair;
- a continuing sequence of eligible/compatible offensive exchanges;
- or another explicitly defined scope.

Also need to decide what, if anything, a round boundary or interruption in eligible Clash opportunities does to the probability state.

This question should **not reopen #7R probability values** unless lifecycle testing exposes a genuine reason.

### Q9 — What clock language will Defend decay/recovery use?

Only after Q1–Q8 provide a stable temporal model should Defend recovery be expressed and tested against that clock.

## Current recommended ordered sequence after the clock is stable

1. Define/test round-boundary and effect-clock structure.
2. Carry the existing Hit Resistance / Natural Deceleration candidate into representative clock-based testing; reopen only if evidence requires it.
3. Carry the existing 1:1 PT → HP candidate into representative Physical testing; reopen only if evidence requires it.
4. Design/test minimum Defend execution plus decay/recovery using the established clock language.
5. Reconcile a minimum Clash outcome calculation with the already-selected #7R occurrence behavior. Do not reopen Clash probability without evidence.
6. Assemble the minimum representative combat prototype.
7. Playtest first for system behavior rather than final balance/content tuning.
8. Revisit monster profiles, wildcard Clash candidates, and wider balance only after representative combat evidence exists.

## Minimum representative prototype — later, not now

When the foundation is ready, the first representative prototype should remain small:

- 1 player Combat Actor;
- 1 enemy Combat Actor;
- one existing reference equipment build;
- one preserved experimental enemy profile;
- one representative Physical offensive Move;
- one deliberately simple representative Defend Move;
- one dummy temporary effect for clock testing;
- action commitment;
- Priority / SP Output ordering;
- ordered and simultaneous resolution;
- current ZPD / Hit Resistance interaction;
- Physical PT → HP candidate;
- HP mutation;
- #7R Clash occurrence path;
- minimal Clash outcome handling sufficient for representative testing;
- round boundary/effect clock;
- battle end.

The first prototype does **not** need full Magic, Hybrid Clash, Criticals, penetration, accuracy/evasion, a full status library, durability, advanced AI, Bond, progression, loot, world systems, PvP, or endgame.

## Working discipline from this point

For the current planning phase:

1. Work on **one structural question at a time**.
2. Do not silently answer later questions while solving the current one.
3. Separate established rules, current candidates, experiments, and new proposals.
4. After the owner approves the answer to one question, create a **Quick Checkpoint** preserving:
   - the question;
   - the approved answer;
   - reasoning/important consequences;
   - unresolved edge cases;
   - what was explicitly not changed;
   - the next question.
5. Then move to the next question.
6. Main checkpoints should only be updated when separately requested/approved.
7. No implementation/prototype repository changes occur without separate explicit owner approval.

## Immediate resume point

Start with:

# **Q1 — What exactly constitutes one combat round in Z'her0?**

Do not begin prototype implementation yet.
