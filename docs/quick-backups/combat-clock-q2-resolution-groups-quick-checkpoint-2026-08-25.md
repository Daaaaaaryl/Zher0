# Z'her0 Quick Checkpoint — Combat Clock Q2: Resolution Groups Within a Round

Date: 2026-08-25

Status: **QUICK CHECKPOINT ONLY — NOT MAIN CHECKPOINT — NOT CANON**

Purpose: Safeguard the approved answer to Combat Clock Question 2 before moving to the next timing question.

## Question 2

**How do resolution groups fit inside one combat round?**

## Approved answer

A combat round may contain **one or more resolution groups**.

A resolution group is a set of committed actions that resolve at the same timing point or as one shared special interaction.

The round is the larger shared action cycle. Resolution groups are the smaller resolution steps/events that occur inside that round.

## Current ordinary flow

When committed actions do not resolve as one shared special interaction, they may resolve in ordered groups.

Example:

- Player and enemy both commit actions.
- The earlier action resolves as **Resolution Group 1**.
- Its consequences immediately update the battle state.
- Any still-pending committed action is revalidated.
- If it is still valid, it may resolve as **Resolution Group 2**.
- Once no valid committed actions remain, the round proceeds toward its boundary.

The number of resolution groups does **not** determine the number of rounds.

Two resolution groups can still belong to one combat round.

## Clash as the current clearest single-group case

For two opposing committed attacks, the current clearest case where both actions are handled as one shared resolution group is a **Clash**.

Current conceptual flow:

- Both sides commit compatible offensive actions.
- Clash eligibility / occurrence is checked.
- If Clash triggers, the opposing actions enter one **Clash resolution group**.
- The Clash interaction resolves as one shared event.
- Its resulting consequences become authoritative.

Possible future Clash consequences may include remaining impact/damage or conditions such as interruption, Stun, knockback, stagger, flinch, or similar effects **only where the specific Clash/move rules eventually establish them**. These examples are not automatically universal Clash effects.

## Current round-end understanding after Clash

At present, there is **no established mechanic requiring another ordinary resolution after a completed Clash interaction between the committed opposing actions**.

Therefore the current working/locked clock interpretation is:

> **When the committed opposing actions are consumed/resolved through Clash and no other valid committed action remains, that shared Clash resolution completes the action-resolution portion of that round and the round proceeds toward its boundary.**

This does not permanently prohibit a future explicitly designed mechanic from creating an additional reaction, follow-up, counter, chained action, or other post-Clash resolution. If such a mechanic is later introduced, its relationship to resolution groups and the round must be reviewed explicitly rather than assumed.

## Revalidation after an earlier resolution group

After any non-final resolution group, its consequences become effective before a pending committed action resolves.

Examples of consequences that could potentially make a pending action invalid include:

- death;
- Stun/incapacitation where the effect specifically prevents execution;
- interruption;
- knockdown or forced displacement where the specific rule makes the committed action impossible;
- another explicit condition that prevents the action from executing.

Not every effect automatically cancels a pending action.

The rule is:

> **After a resolution group updates battle state, any pending committed action is revalidated against the new authoritative state before it may resolve.**

If still valid, it resolves in a later resolution group within the same round.

If invalid, it is cancelled/interrupted and no resolution group is created for that action.

## Locked Q2 wording

> **One combat round may contain one or more resolution groups. A resolution group contains committed actions that resolve at the same timing point or through one shared special interaction such as Clash. After each resolution group, its consequences become authoritative and all pending committed actions are revalidated before any later resolution group occurs. If Clash consumes/resolves the opposing committed actions and no other valid committed action remains, the action-resolution portion of that round is complete and the round proceeds toward its boundary.**

## What Q2 does NOT decide

This checkpoint does not establish:

- final Clash force / Clash Impact mathematics;
- universal Clash consequences;
- post-Clash reactions or follow-up mechanics;
- final Stun, knockback, stagger, flinch, interruption, or status rules;
- exact round-boundary processing;
- timed-effect advancement;
- duration decrement/expiration timing;
- battle-end cleanup behavior;
- Defend decay/recovery timing;
- Clash probability lifecycle across round boundaries.

## Revisit rule

This Q2 structure is locked for the current combat-clock foundation.

Revisit it only if a future explicitly designed mechanic creates a genuine need for additional resolution behavior that cannot fit this structure cleanly. Do not reopen it merely because future content adds more moves/effects that already fit within resolution groups.

## Next question

Proceed to **Q3 — How is simultaneous resolution represented in the clock?**

This next question should clarify whether simultaneous resolution exists only through explicit shared interactions such as Clash, whether any true timing tie can also create a simultaneous group, and how consequences become authoritative when multiple actions genuinely resolve together.
