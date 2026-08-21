# Z'her0 Combat Design Checkpoint — Defense Attrition

Date: 2026-08-22
Parent checkpoint: Combat Test Lab v0.3 (`cfafdbd2b0a3585d9b1f636432dd869fe5f5aea0`)

This checkpoint preserves the combat-design discussion after the v0.3 physical/magical baseline. It records established direction, working terminology, and parked alternatives without changing the Combat Test Lab or Equipment Stat Distribution tool.

## Baseline preserved

- Basic physical damage currently tests total Physical Attack against Physical Defense, then Health.
- Basic magical damage currently tests total Magic Attack against Magic Defense, then Health.
- Direct subtraction remains a test baseline, not a finalized combat formula.
- An attack can currently be fully stopped when the relevant Defense equals or exceeds the incoming Attack.
- Clash remains a separate mechanic concerning attacks meeting attacks; this checkpoint does not redefine its existing working design.
- Defend remains a deliberate defensive action and is distinct from the Physical Defense / Magic Defense stats.

## Defense Attrition — working direction

Working term: **Defense Attrition**.

When an ordinary attack fails to penetrate the relevant defense, Health may take zero damage while repeated pressure can still wear down defensive capability over time.

- Physical attacks interact with Physical Defense.
- Magical attacks interact with Magic Defense.
- Attrition is intended to prevent a zero-damage matchup from necessarily remaining an infinite dead end.
- The exact attrition formula, percentage, randomness, and number of attacks required are NOT finalized.
- Incoming attack strength should matter to eventual attrition calculations, but no formula is locked.
- A very weak attack against overwhelmingly stronger defense should not automatically wear it down at the same rate as an attack that nearly penetrates.

## What receives Attrition

Attrition does NOT automatically mean permanent equipment durability loss.

Default working behavior:

- If an ordinary incoming attack is absorbed without a specific item deliberately intercepting it, attrition applies to the character/build's current total relevant Defense.
- If a specific defensive equipment piece is deliberately used to receive/intercept an attack (for example, a shield used through Defend), that equipment may become the direct recipient of the defensive consequence/attrition.
- If the player is using a Heal/Utility/supporting action that does not itself defend against the incoming attack, that item does not automatically receive the attrition. The incoming physical or magical attack still interacts with the character's total relevant Defense.
- Individual equipment stats versus total build stats remain important and must stay distinguishable for future rules.

Whether equipment-specific attrition changes the equipment's contribution temporarily, affects total Defense, or uses another representation remains unresolved.

## Penetration relationship

Penetration and Attrition are related but not identical.

- **Defense Attrition** is the gradual wearing-down process caused by repeated pressure.
- **Penetration** is the event/result where an attack successfully gets through the defense.
- Repeated Attrition may eventually make Penetration possible.

This does not establish a finalized Penetration stat or penetration formula.

## Critical interaction — candidate only

Critical attacks retain their own chance to occur.

Candidate future interaction:

- If an attack becomes Critical, it may have a separate chance to cause stronger Defense Attrition.
- Current candidate example: 2x normal Attrition.
- A Critical may therefore matter even when the attack still fails to penetrate and causes zero Health damage.
- The chance, multiplier, and final Critical behavior are NOT finalized.

## Heal versus Repair

Working vocabulary:

- **Heal** restores Health.
- **Repair** is the working concept for recovering defensive capability lost through Attrition.

Possible future sources of Repair include equipment moves, Utility actions, passives, or consumable items. None are confirmed here.

Whether Defense automatically recovers after battle, partially persists, or requires Repair is unresolved. Do not infer a permanent durability/maintenance system from this checkpoint.

## Break-through alternative — parked

A separate alternative mechanic was proposed and remains unresolved:

Instead of reducing Defense through per-attack Attrition, repeated attacks could build or receive a **chance to break through** an otherwise successful defense.

This differs from Attrition:

- Attrition model: repeated attacks gradually reduce current defensive capability until penetration becomes possible.
- Break-through chance model: Defense may remain numerically intact while repeated pressure creates/increases a chance that an attack gets through.

Do NOT choose between them yet. Do NOT merge them automatically. They may replace one another, coexist in some form, or one may be discarded after testing.

## Clash boundary

Clash remains separate from ordinary Defense Attrition.

When attacks meet attacks, use the existing Clash design/history rather than silently converting that interaction into ordinary Defense Attrition. Any future attrition consequence caused by Clash must be designed explicitly and must not be assumed by this checkpoint.

## Next design question

Before adding this layer to the Combat Test Lab, compare the gameplay behavior of:

1. Defense Attrition: Defense is gradually worn down.
2. Break-through chance: repeated pressure eventually gains a chance to get through while Defense may remain intact.

Only after deciding the intended behavior should the project design the attrition/break mathematics and add another Combat Test Lab version.

## Protection / non-changes

This checkpoint intentionally does NOT:

- modify `equipment-stats.html`;
- modify Combat Test Lab v0.1, v0.2, or v0.3;
- finalize Attrition math;
- finalize Break-through;
- finalize Critical percentages;
- finalize Repair;
- introduce equipment durability;
- rewrite Defend or Clash;
- implement new combat mechanics in HTML.

Evidence and design history are preserved first; implementation comes after the behavior is decided.
