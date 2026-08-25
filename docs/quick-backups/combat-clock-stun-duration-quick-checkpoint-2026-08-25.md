# Z'her0 Quick Checkpoint — Stun Duration Rule

Date: 2026-08-25

Status: **QUICK CHECKPOINT ONLY — NOT MAIN CHECKPOINT — NOT FULL Q4 LOCK — CURRENTLY LOCKED STUN FOUNDATION**

Purpose: Preserve the agreed Stun duration rule while keeping Stun application chance, Move-specific behavior, and broader effect-clock rules open for later testing.

## Locked Stun duration rule

**Stun lasts only for the current combat round in which it is successfully applied.**

- Stun becomes active immediately when it successfully lands.
- If the target still has a pending committed action in that round, Stun may prevent/cancel that action according to the applicable Move/effect rule.
- Stun does **not** automatically carry into the next round.
- Stun expires when the current round ends.
- At the start of the next round, the target is no longer Stunned unless a new Stun is successfully applied.

Simple form:

`Stun lands → affects remainder of current round → round ends → Stun removed`

## Design intent

The primary purpose of Stun is immediate interruption/control during the current round, such as stopping an incoming committed action when Stun lands before that action resolves.

A Stun that lands late in the round does not gain automatic next-round persistence merely because the target already acted.

This keeps Stun simple and reduces the risk of long or continuous Stun-lock behavior.

## Lingering effects are separate from Stun

A Move may later be designed with a secondary after-effect, for example:

`Stun this round → separate Slow / SP reduction / Delay next round`

Any such lingering effect is **not part of the universal Stun status**. It must be explicitly defined by the specific Move/effect package.

Examples of possible separate secondary effects remain design candidates only:

- Slow
- SP reduction
- Delay
- other temporary debuffs

No universal after-effect is established by this checkpoint.

## Stun source / Move behavior remains flexible

Different Stun sources may later have different application conditions or secondary behavior, for example:

- Physical attack that can cause Stun
- dedicated Stun Move
- spell/cast that can cause Stun
- knockback-style Stun Move
- Clash-related Stun result, if deliberately designed later

The shared Stun status meaning remains the same: **current-round only**.

## Clash interaction note

If a Stun attempt is attached to an attack/Move that is neutralized or cancelled by a Clash, the attached Stun effect does not automatically land.

This does not prevent a future Clash outcome itself from being designed to apply Stun. Clash outcome mathematics/effects remain a separate unresolved design area.

## Application chance remains experimental

**Stun application probability/chance is NOT locked.**

Current discussion direction includes the possibility that some Stun Moves may begin with very high or even 100% first-use reliability and become less reliable with repeated use, similar in spirit to other anti-spam/decay experiments.

However:

- no universal Stun chance is established;
- no probability ladder is locked;
- no repeated-use decay formula is locked;
- Move-specific Stun chances remain available for experimentation;
- dedicated Stun Moves, physical Stun effects, spells, and other sources may ultimately use different rules.

These probability questions must be tested separately later.

## Relation to Q4 — timed effects

This checkpoint does **not** settle the universal rule for when all timed effects begin counting.

It establishes only that Stun is a special current-round effect and therefore should not be used as evidence that every Buff, Debuff, Bleed, Regeneration, Slow, temporary SP change, or other duration-based effect must use the same timing model.

Q4 remains open for the broader effect-clock question.

## Current classification

LOCKED FOR CURRENT FOUNDATION:

**Stun is current-round only and expires at the round boundary.**

OPEN FOR LATER EXPERIMENTATION:

- Stun application chance
- repeated-use reliability/decay
- Move-specific Stun conditions
- secondary Slow/Delay/debuff effects
- Clash-produced Stun outcomes
- resistance or anti-Stun systems
- broader timed-effect duration rules

## Resume point

Return to **Q4 — When do timed effects begin counting?**

Do not force the Stun rule onto every other timed effect. Determine the broader clock behavior using effects that are actually intended to persist across rounds.
