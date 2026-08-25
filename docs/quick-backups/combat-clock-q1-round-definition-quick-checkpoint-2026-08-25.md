# Z'her0 Quick Checkpoint — Combat Clock Q1: Round Definition

Date: 2026-08-25

Status: **QUICK CHECKPOINT ONLY — NOT MAIN CHECKPOINT — NOT CANON**

Purpose: Safeguard the approved answer to Combat Clock Question 1 before moving to Question 2.

## Question 1

**What exactly constitutes one combat round?**

## Approved answer

A combat round is one complete shared action cycle in which active combatants select and commit actions, those actions pass through applicable special-interaction checks and ordered/simultaneous resolution groups, all still-valid committed actions finish resolving, and end-of-round processing completes. The next action-selection phase begins a new round.

Working flow:

`Round Start`

`→ Action selection`

`→ Actions committed`

`→ Applicable special-interaction checks (including Clash eligibility/occurrence where relevant)`

`→ Priority / SP determines ordered or simultaneous resolution grouping`

`→ Resolution group(s) execute`

`→ Resulting battle state becomes authoritative as resolution occurs`

`→ Pending actors/actions are revalidated`

`→ Remaining still-valid committed actions resolve`

`→ End-of-round processing`

`→ Next round begins with the next action-selection phase`

## Core clarification

A **round is not the same as one actor taking one action**.

Both combatants' committed choices belong to the same shared round even when:

- one action resolves before the other;
- one action becomes invalid before its resolution point;
- one actor dies, becomes stunned, interrupted, or otherwise unable to execute the committed action;
- one committed action is cancelled before execution;
- both actions resolve simultaneously.

A round does **not** require every committed action to execute successfully. If a pending actor becomes unable to act, that action can be cancelled while the current round continues toward its normal boundary.

## Terminology direction

For formal combat timing language:

- **Round** = the full shared combat cycle described above.
- Avoid using **turn** as an undefined formal duration/timing unit until the project explicitly defines what “turn” means.

Casual language such as “the player takes their turn” may still be understandable, but future system rules should prefer explicit timing language such as “this round,” “next round,” “end of round,” or a separately defined action/resolution term rather than relying on an ambiguous “turn.”

## Design rationale / classification

The owner considers this flow effectively a **common-sense structural consequence of the already established commitment and resolution architecture** rather than a newly invented combat gimmick.

This definition is therefore **LOCKED FOR THE CURRENT COMBAT CLOCK FOUNDATION**.

It remains technically revisitable only if a genuinely unforeseen future mechanic/event exposes a real conflict or edge case. That openness is not permission to casually reopen the definition.

## Explicitly not decided by Q1

This checkpoint does **not** decide:

- how many resolution groups may exist within one round;
- exact simultaneous-resolution semantics beyond belonging to the same round;
- when newly applied timed effects begin counting;
- when durations decrement or expire;
- whether specific effects process before/after other end-of-round effects;
- death/end-of-battle interaction with end-of-round processing;
- the formal meaning of “next turn”;
- Clash probability state lifetime across rounds or interruptions;
- Defend decay/recovery timing;
- status, cooldown, regeneration, poison, bleed, or other duration formulas.

Those remain later Combat Clock questions.

## Next question

### Q2 — How do resolution groups fit inside one round?

Determine whether a round may contain one or multiple ordered/simultaneous resolution groups and how those groups compose into the shared round lifecycle.

## Safeguard rule

Do not modify the main checkpoint from this Quick Checkpoint alone. Do not implement prototype/runtime changes from this record without separate explicit owner approval.
