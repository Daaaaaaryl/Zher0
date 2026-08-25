# Z'her0 Quick Checkpoint — Q4 Effect Timing + PA / MA

Date: 2026-08-26

Status: **QUICK CHECKPOINT ONLY — NOT MAIN CHECKPOINT — CURRENT SESSION SAFEGUARD**

Purpose: Preserve the owner-approved Q4 effect-start timing rule and the immediately-following PA / MA buff-debuff decisions before moving on to PD / MD.

## Q4 — Effect start timing

### Approved default

Effects resolve according to the sequence defined by the Move.

Unless a more specific Move rule says otherwise, non-SP stat buffs/debuffs become effective immediately when their effect resolves.

Examples:

- a PD or MD protection buff can protect against later unresolved attacks in the same round;
- a PA or MA self-buff that is explicitly sequenced before the attack inside the same Move may affect that attack's calculation;
- if the Move's sequence places the buff after its own attack, it does not retroactively modify the already-resolved attack.

### SP / turn-order exception

Any effect that modifies SP for action-order purposes becomes active at the **beginning of the next round**.

This applies to SP buffs and SP debuffs, including Slow when Slow is represented through an SP reduction.

The purpose of this exception is to avoid retroactively changing action order after the current round's action-order checks have already been established/resolved.

Current simple rule:

> **If an effect changes damage/defense-related stats, apply it according to the Move's immediate resolution sequence. If it modifies SP / turn order, its action-order effect begins at the start of the next round.**

A future Move may explicitly define a special timing exception, but no such universal exception is created by this checkpoint.

## Archived Slow timing history

An earlier candidate allowed Slow to affect a still-unresolved current-round action while beginning its counted duration on the following round. That candidate is retained as design history only.

Current approved direction is cleaner:

> **SP / Slow action-order changes begin at the start of the next round.**

No current-round pending action is reordered by a newly applied Slow under the default rule.

## PA — Physical Attack buff/debuff behavior

### Approved

- PA is used wherever a Move, attack, skill, effect, or formula explicitly references PA.
- A Move may apply a PA multiplier or otherwise use PA as a variable in its damage/effect formula.
- PA buffs/debuffs may stack additively.
- Example: `+10 PA` and `+20 PA` active together produce `+30 PA`.
- No universal/global PA stacking cap is established for now.
- PA has a floor of **0**; debuffs cannot reduce effective PA below 0 under the current rule.
- Each Move/effect defines its own sequence and duration.
- A Move that says, conceptually, `gain PA → attack` may use the increased PA for that attack because the Move's own sequence applies the buff first.

## MA — Magical Attack buff/debuff behavior

### Approved

MA mirrors PA unless a future Move explicitly defines different behavior.

- MA is used wherever a Move, attack, skill, effect, or formula explicitly references MA.
- MA buffs/debuffs may stack additively.
- No universal/global MA stacking cap is established for now.
- MA has a floor of **0**.
- Each Move/effect defines its own sequence and duration.
- A Move that applies an MA increase before its magical calculation may use that increased MA in the same Move.

## Important boundaries

This checkpoint does **not** establish:

- PD or MD stacking/floor behavior;
- HP buff/debuff behavior;
- Poison, Bleed, Burn, Freeze, Blind, Confusion, Silence, regeneration, or other status timing;
- Q5 duration decrement/expiration rules;
- exact SP modifier stacking, SP floor, or multiple-SP-effect interaction beyond the approved next-round activation timing;
- universal Move formulas;
- damage multipliers or coefficients;
- final buff/debuff balance values;
- status immunity/cleanse rules;
- Priority-based protective-spell interaction;
- any implementation/runtime changes.

## Parked concept preserved

Priority-based protective spell/status-protection interaction remains parked for later review. A protection effect that resolves before an incoming status may eventually block that status without necessarily blocking the Move's separate damage component. This checkpoint does not establish the exact mechanic.

## Current stopping point

PA and MA are sufficiently settled for the current pass.

Next local status/stat-effect topic:

**PD / MD buffs and debuffs.**

Original Combat Clock sequence still has:

**Q5 — When do durations decrement or expire?**

Q5 has not been answered by this checkpoint.

## Safeguard rule

Do not modify the main checkpoint from this Quick Checkpoint alone. Do not implement runtime/prototype changes from this record without separate explicit owner approval.
