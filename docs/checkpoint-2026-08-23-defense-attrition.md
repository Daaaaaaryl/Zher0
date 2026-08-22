# Z'her0 Protected Checkpoint — Physical Defense Attrition Design

Date: 2026-08-23

Purpose: preserve the current approved Physical-defense / Defense Attrition design state before numerical Attrition conversion work begins. This checkpoint is additive and does not replace the earlier protected monster/combat checkpoint.

## Development discipline authority

This checkpoint follows `docs/development-discipline.md`.

**Project Owner / Final Design Authority: Daryl.**

If this checkpoint, current Git authority, historical material, implementation artifacts, or future guidance appear to conflict, follow the repository development discipline: begin with read-only synchronization, preserve established authority, surface the conflict, and obtain Daryl's decision before changing an established rule.

## Checkpoint protection rule

- Established rules remain established unless Daryl explicitly approves a change.
- Experiments and candidate formulas do not become established automatically.
- If future work conflicts with this checkpoint or another established authority, stop and surface the conflict before changing anything.
- Historical formulas and prototype behavior must not be promoted to current canon merely because they exist in repository history.
- Resume future work with a read-only comparison against this checkpoint and current Git authority before making changes.

## Existing authority preserved

The canonical combat stats remain HP, PA, PD, MA, MD, and SP.

SP remains Speed. Its global role is speed/action ordering. A specific Move may explicitly use SP when logically appropriate to that Move, without redefining SP globally as a damage stat.

The established base Physical relationship remains:

PA resolves against PD → resulting damage reduces HP.

The exact numerical Physical damage equation remains unresolved. The temporary `max(0, PA - PD)` ruler used during monster experiments is not the permanent damage formula.

## Move design clarification

A Move defines how an action draws meaning from combat state. Z'her0 does not currently establish one universal Move equation.

Different Moves may use different existing combat variables when those variables logically fit the action being performed and the attacker/receiver interaction.

For example, a speed-sensitive Physical Move may explicitly consult SP in addition to Physical offensive information because speed is logically relevant to that Move. This does not make SP a universal damage stat.

Quick Slash / Heavy Slash examples used during discussion are explanatory examples only. They are not canonical Moves and no formulas, coefficients, or multipliers for them are established by this checkpoint.

## ZPD as the ordinary battle-facing Physical defense

Individual active equipment contributes Physical Defense to the player's aggregated Physical defensive state.

For ordinary Physical combat resolution, the battle-facing defensive variable is the actor's current aggregate ZPD rather than selecting an individual equipment item's PD to receive ordinary incoming Physical pressure.

Equipment remains the source of the underlying defensive contributions, but ordinary Physical resolution operates against current ZPD.

Defense Attrition therefore affects current ZPD during battle. It does not, by this rule alone, rewrite the equipment's canonical/base PD contributions.

## Ordinary Physical defense interaction

Current approved conceptual flow:

Physical Move
→ produces its approved incoming Physical attack/result
→ incoming Physical result encounters the receiver's current ZPD
→ current ZPD stops some or all of the incoming Physical result
→ the portion stopped by ZPD does not damage HP
→ the stopped portion becomes the basis/input for Defense Attrition for that interaction/turn
→ the Attrition conversion determines how much current ZPD is worn away
→ any portion not stopped by the applicable defense passes through to HP
→ later Physical interactions encounter the newly reduced current ZPD.

### Established clarification: Attrition basis

Defense Attrition is based on the portion of incoming Physical force/damage that current ZPD successfully stopped — the portion that did not go through to HP.

The stopped amount is an input to the Attrition calculation. It is NOT established as a 1:1 deduction from ZPD.

Conceptually:

Stopped Physical amount
→ [UNRESOLVED ATTRITION CONVERSION]
→ current ZPD loss

This Attrition occurs as a consequence of the defensive interaction in that battle turn, so subsequent interactions use the resulting current ZPD state.

## Pass-through / penetration terminology

At the current conceptual level, damage that is not stopped by the applicable defense can pass through and damage HP.

Repeated Defense Attrition can lower current ZPD, causing later attacks to encounter weaker Physical defense and allowing more incoming Physical damage to reach HP.

This checkpoint does NOT establish a dedicated Penetration stat, percentage, bypass rule, modifier, or conventional RPG armor-penetration mechanic. Any such dedicated mechanic remains unresolved unless separately approved later.

## Defend is separate from ordinary ZPD Attrition

The active Defend action / Defend Move is not merely ordinary passive ZPD resolution.

A successful Defend Move may provide complete protection — including zero HP damage and zero Defense Attrition — when that is the approved behavior of that Move.

Ordinary ZPD Defense Attrition must not automatically be imposed on every successful Defend Move merely because an incoming attack occurred.

If a particular Defend Move has Attrition, wear, a cost, partial protection, or another defensive consequence, that behavior must come from that Move's own approved rules rather than being silently inherited as universal Defend behavior.

## Explicitly unresolved

This checkpoint intentionally does NOT establish:

- Defense Attrition conversion formula
- Attrition percentage, coefficient, curve, or weighting
- exact amount of ZPD lost from a stopped amount
- exact Physical damage formula
- complete partial-pass-through / partial-penetration mathematics
- Defense Attrition recovery behavior
- any dedicated penetration stat/modifier/bypass mechanic
- exact Defend calculation or success/failure rules
- Critical Hit mathematics
- accuracy/evasion
- Clash mathematics
- status/passive execution
- cooldown/resource systems
- Move coefficients or universal Move multiplier
- whether combat values are generally read at commitment or resolution time
- Magical / ZMD Defense Attrition behavior; the current clarification is specifically for Physical / ZPD interaction
- final balance values

## Current project position

The recent Weak/Average/Tank/Offensive monster-stat experiments and isolated SP comparison are complete enough to remain paused.

Game Studio synchronization was completed as a read-only review. That review found the repository architecture further along than an earlier synchronization had recognized: Combat Actors, equipment-derived aggregate stats, Battle State, action categories, commitment, Move/Action Priority, SP Output, and ordered/simultaneous resolution groups already provide a substantial non-executing combat foundation.

The design path since the previous protected checkpoint is:

Monster experiments
→ SP comparison / SP authority
→ protected monster-combat checkpoint
→ Game Studio read-only synchronization
→ minimum Move architecture clarification
→ ordinary Physical damage / Defense Attrition clarification
→ THIS CHECKPOINT.

The current active design problem is therefore no longer monster balancing and no longer the general question of what a Move can possibly contain.

The immediate active problem is the numerical conversion from stopped Physical force/damage into current ZPD loss.

## Exact stopping point

Work is intentionally stopping BEFORE the Defense Attrition conversion rule is designed.

Established input:

The portion of incoming Physical force/damage that current ZPD successfully stopped.

Established battle-state target:

Current ZPD.

Unresolved transformation:

Stopped Physical amount
→ [UNRESOLVED ATTRITION CONVERSION]
→ current ZPD loss.

No candidate conversion formula is approved by this checkpoint.

## Next planned sequence

1. Design multiple candidate Defense Attrition conversion rules.
2. Do not establish the first candidate automatically.
3. Compute controlled examples for each candidate.
4. Test edge cases including weak attack vs strong ZPD, near-equal incoming force and ZPD, partial pass-through, repeated attacks, and heavily depleted ZPD.
5. Compare promising candidates using the existing Samurai, Knight, and Geisha reference builds and relevant preserved monster experiment profiles.
6. Check whether the behavior preserves meaningful defense without recreating the temporary subtraction ruler's defense cliff or causing defense to disappear too quickly.
7. Present experimental results to Daryl for review.
8. Only after explicit approval from Daryl should a chosen Attrition behavior move toward establishment.
9. Continue ordinary damage-resolution design from the approved Attrition baseline.
10. Keep monster balancing paused until enough of the real combat calculation exists to make those balance experiments meaningful.

## Resume guardrail

When resuming from this checkpoint, do NOT automatically:

- restart monster balancing;
- redesign SP;
- restore SP → Impact as a universal rule;
- promote `PA - PD` to the permanent damage formula;
- redesign the general Move architecture;
- jump directly to Clash;
- invent a dedicated Penetration stat;
- clone the Physical/ZPD Attrition rule onto Magical/ZMD without separate review.

The immediate continuation point is:

**Defense Attrition conversion-rule experimentation: how should the stopped Physical amount be converted into current ZPD loss?**
