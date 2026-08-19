# Battle State Rules

This document is the human-readable design authority for the Zher0 Battle State. It distinguishes accepted intent from directions still in progress, questions that require a decision, and behavior retained from older prototypes.

## Status labels

- **[ESTABLISHED]** A game-design rule explicitly decided and currently accepted.
- **[PROVISIONAL]** A direction exists, but details may still change.
- **[UNDECIDED]** No canonical rule exists yet. Implementation must not invent one.
- **[LEGACY]** Behavior from an older prototype that exists in the repository, but is not automatically part of the canonical Battle State design.

## Battle State

**[ESTABLISHED]** Battle State represents the mutable condition of an active battle. It may contain Combat Actors, current stats, current HP, committed actions, active statuses, cooldowns, temporary modifiers, teams, round/turn information, and event history. Canonical definitions remain separate from mutable battle instances.

## Combat Actors

**[ESTABLISHED]** Every battle participant is an independent Combat Actor instance. Multiple actors may originate from the same canonical monster; for example, `enemy_1` and `enemy_2` may both be Tikbalang. Mutating `enemy_1` must not mutate `enemy_2` or canonical Tikbalang data.

Combat Actor `baseStats`, `currentStats`, and `currentHP` have distinct meanings.

## Canonical stats and player stat model

**[ESTABLISHED]** The six canonical stats are HP, PA, PD, MA, MD, and SP.

**[ESTABLISHED]** Player combat statistics follow this path:

```text
Individual Active Equipment Stats
        ↓
Aggregated Zher0 Stats
        ↓
Player Combat Actor currentStats
        ↓
Battle mechanics
```

The selected equipment piece is not the authoritative source for the player's entire PA, PD, MA, MD, or SP.

## Equipment and move identity

**[ESTABLISHED]** Equipment and aggregated Zher0 Stats have different responsibilities. Future player attack selection is intended to follow:

```text
Choose Attack → Choose ACTIVE Equipment → View that Equipment's Move Set
→ Choose Move → Choose target if required → Commit Battle Action
```

Equipment supplies move/attack identity; aggregated Zher0 Stats supply combat statistics. Equipment Stats, Zher0 Stats, and Attack Properties are related but distinct concepts.

## Monster DNA and monster stats

**[PROVISIONAL]** The Monster DNA design framework ultimately considers:

- Monster Personality — behavioral/design identity.
- Monster Stats — combat-stat identity.
- Monster Equipment — a future monster-design concept.

**[UNDECIDED]** Monster Equipment's representation and behavior. It is not defined whether it contributes stats, supplies attacks or passives, changes appearance, represents anatomy/natural weapons, behaves like player equipment, or uses another model. Do not infer a rule from this framework.

**[ESTABLISHED]** Monster stats are generated independently from player equipment Sets 1–6:

```text
Monster Definition → Role → Monster Stat Profile → Explicit Stat Budget
→ Generated Monster Stats → Monster Combat Actor
```

Tikbalang's established test fixture at budget 400 is HP 60, PA 100, PD 40, MA 20, MD 40, SP 140. Budget 400 is not canonical monster progression.

## Actions, commitment, and order

**[ESTABLISHED]** The current Battle Action architecture recognizes Attack and Defend. They are action identities; their complete gameplay execution is not established.

**[ESTABLISHED]** Selecting an action creates committed battle intent. Commitment does not deal damage, mutate HP, apply statuses, trigger passives, consume resources, progress cooldowns, advance turns, or determine victory.

**[ESTABLISHED]** Priority is categorical action urgency with canonical tiers: Urgent, High, Normal, and Low, ordered Urgent > High > Normal > Low. Priority is not SP, SP Output, initiative, a character stat, or attack power.

**[ESTABLISHED]** SP Output is the numeric action-order value considered only between actions of equal Priority. Baseline player SP Output originates from `playerActor.currentStats.SP`; baseline monster SP Output originates from `monsterActor.currentStats.SP`. Under the current Phase 14 modifier contract:

```text
SP Output = max(0, base SP + additive integer modifiers)
```

Percentage and multiplicative SP mechanics remain **[UNDECIDED]**.

**[ESTABLISHED]** Committed actions are compared first by Priority, then by SP Output. Higher values resolve first. When both Priority and SP Output are equal, the runtime reports an explicit unresolved tie.

**[UNDECIDED]** No canonical tiebreaker exists. Random, actor-ID, action-ID, PA, total-stat, and insertion-order tiebreaking must not be defined as gameplay rules.

## Damage relationships and calculation

**[ESTABLISHED]** Physical damage relates Attacker PA → Physical Attack → Defender PD. PA is offensive; PD is its opposing defensive stat.

**[ESTABLISHED]** Magical damage relates Attacker MA → Magical Attack → Defender MD. MA is offensive; MD is its opposing defensive stat.

**[ESTABLISHED]** True is a canonical damage type with null offensive and defensive stat references.

**[ESTABLISHED]** Phase 13 defines calculation inputs and outputs only: Physical selects PA/PD, Magical selects MA/MD, and True selects null/null.

**[UNDECIDED]** The physical and magical formulas, including attack power, defense curve, minimum damage, penetration, criticals, accuracy, evasion, and True Damage execution. In particular, `PA - PD = final damage` is not a canonical rule, and True's bypass behavior is not defined.

**[ESTABLISHED]** SP primarily participates in SP Output and action ordering. It does not automatically increase Physical or Magical damage. An individual attack may eventually explicitly scale from SP; that scaling belongs to its attack definition, not a global assumption.

## Defend, statuses, and abilities

**[UNDECIDED]** Defend exists only as an action type. Its Priority, SP Output modifier, damage reduction, PD/MD increases, block, parry, dodge, guard, protection, ally interception, counterattack, and reaction behavior have no canonical definition.

**[ESTABLISHED] / [PROVISIONAL]** Canonical status identities are Bleed, Poison, Burn, Freeze, Stun, Blind, Confusion, and Silence. Their execution mechanics remain provisional or undecided.

**[ESTABLISHED]** Canonical ability examples include Wayward Gallop and Lost Path. Wayward Gallop is Physical, but its final numeric combat behavior is unresolved. Lost Path remains **[PROVISIONAL]**.

## Internal and player-visible information

**[ESTABLISHED]** Battle calculations may internally know exact opponent statistics.

**[UNDECIDED]** Which opponent statistics the player can see. Internal knowledge does not imply UI visibility; future Bestiary and knowledge systems are separate design work.

## Intended battle pipeline

```text
[ESTABLISHED] Combatants enter Battle State
        ↓
[ESTABLISHED] Combat Actor state exists
        ↓
[ESTABLISHED] Actions are selected
        ↓
[ESTABLISHED] Actions are committed
        ↓
[ESTABLISHED] Compare Priority
        ↓
[ESTABLISHED] If equal, compare SP Output
        ↓
[ESTABLISHED] Determine order OR unresolved tie
        ↓
[UNDECIDED] Future Action Resolution
        ↓
[UNDECIDED] Future Damage / Defense / Status / Passive Resolution
        ↓
[UNDECIDED] Future Battle State Mutation
        ↓
[UNDECIDED] Future Victory / Continuation Check
```

## Legacy `index.html` battle prototype

**[LEGACY]** The repository contains an older battle prototype in `index.html`. It includes direct damage calculation, immediate HP mutation, fixed player-then-monster sequencing, exact enemy-stat display, and direct victory/defeat handling. These behaviors predate the Phase 7–14 Battle State architecture.

Legacy prototype behavior is not canonical unless explicitly adopted by the Battle State design specification.

## Currently undecided design questions

**[UNDECIDED] Action order**

- Exact equal-Priority/equal-SP-Output tie behavior.
- Whether Priority or SP Output can change after commitment.

**[UNDECIDED] Defend**

- Actual mechanics, Priority and SP behavior, protection/interception, and counters/reactions.

**[UNDECIDED] Action resolution**

- Whether both sides commit before resolution.
- Whether defeated actors retain committed actions.
- Invalid/dead targets, cancellation, multi-actor sequencing, and reactions/intercepts.

**[UNDECIDED] Damage**

- Physical and Magical formulas, attack power, defense curve, minimum damage, True Damage, criticals, accuracy/evasion, and penetration.

**[UNDECIDED] Battle flow**

- Round structure, turn structure, action windows, and victory timing.

**[UNDECIDED] Statuses**

- Duration, application, resistance, ticking, stacking, and removal.

**[UNDECIDED] Monster DNA**

- Monster Personality representation and Monster Equipment representation and behavior.

**[UNDECIDED] Information**

- Enemy stat visibility and Bestiary/knowledge mechanics.

## Implementation and design authority

Existing runtime code describes what is currently implemented. This document describes approved game-design intent. If implementation and this design document conflict, do not silently change either one: report and resolve the conflict explicitly. Prototype code must not make an accidental game-design decision canonical.

## Player Battle Actions

**[ESTABLISHED]**

The player's top-level Battle Action choices are:

- Attack
- Defend
- Buffs
- Run

These are action categories. The specific behavior comes from the selected action and, where applicable, the selected active Equipment and Move.

## Defend

**[ESTABLISHED]**

Defend is an Equipment-based action path.

Player selects:

Defend
→ choose an ACTIVE Equipment
→ view the Defend-capable Moves available from that Equipment
→ choose a Defend Move
→ choose a target when the Move requires one
→ commit the Battle Action

Defend is not one universal defensive effect.

Different Equipment may provide different defensive Moves.

Equipment slot does not determine whether an Equipment can defend. For example, a Main Hand or Off Hand Equipment may provide Defend-capable Moves.

A Defend Move may have its own Priority, SP Output behavior, targeting rules, and defensive properties.

There is no universal Defend Priority.

**[UNDECIDED]**

The Defensive Calculation that determines how much incoming damage is minimized remains undecided.

After defensive resolution, any remaining incoming damage is deducted from the target's current HP.

## Buffs

**[ESTABLISHED]**

Buffs is an Equipment-based action path.

Player selects:

Buffs
→ choose an ACTIVE Equipment
→ view the Buff-capable Moves available from that Equipment
→ choose a Buff Move
→ choose a target when the Move requires one
→ commit the Battle Action

Buffs may include Moves that modify Battle State values such as:

- PA
- PD
- MA
- MD
- SP
- HP

Buff-capable Moves may include healing, temporary stat increases, regeneration, or other self-affecting effects defined by the Move.

A healing effect may restore HP directly or affect HP over time, depending on the Move.

Buffs are not assumed to affect allies. Their targeting behavior is defined by the individual Move.

**[UNDECIDED]**

Final Buff values, durations, stacking behavior, healing formulas, regeneration formulas, and interaction with Status Effects remain undecided.

## Run

**[ESTABLISHED]**

Run is a top-level Battle Action and does not require selecting Equipment.

Run checks these conditions in order:

1. If the target is 1 or more levels higher than the player, Run succeeds.
2. If the player's current HP is 50% or lower, Run succeeds.
3. If neither Condition 1 nor Condition 2 is met, check the player's aggregated Zher0 SP (Z'SP) against the target's SP.

For Condition 3:

Run Chance % = ((Z'SP - Target SP) / Target SP) × 100

If Run Chance is 0% or lower:

Run fails. There is no chance to Run through the SP condition.

If Run Chance is greater than 0%:

The resulting percentage is the player's chance to Run successfully.

Z'SP refers to the player's aggregated Zher0 SP from active Equipment, not the SP of an individual Equipment piece.

**[UNDECIDED]**

The exact random roll procedure used to resolve a positive Run Chance remains undecided.

The Battle State consequence of a failed Run attempt remains undecided.

Special encounters, Bosses, abilities, statuses, passives, or other mechanics may eventually modify or prevent Run, but no such exceptions are canonical yet.

## Clash

**[PROVISIONAL]**

Zher0 remains a turn-based battle system.

Clash is a special action-resolution mechanic that may occur when offensive Moves resolve simultaneously.

A tie in action ordering does not automatically require an arbitrary tiebreaker.

When two actions have:

- equal Priority
- equal SP Output

they enter a simultaneous resolution condition.

If both actions are compatible offensive Moves directed into conflict with each other, that condition may become a Clash.

A tie does NOT automatically mean Clash.

Attack vs Defend, Defend vs Defend, actions against different targets, Buffs, Run, and other simultaneous situations may require different resolution rules.

Clash is therefore a consequence of compatible simultaneous offensive actions, not simply a consequence of equal numbers.

**[PROVISIONAL] Attack DNA**

Offensive Moves may eventually identify their attack nature as:

- Physical DNA (P)
- Magical DNA (M)
- Hybrid DNA (P/M)

Potential Clash relationships include:

- P vs P
- M vs M
- P vs M
- Hybrid interactions

Physical and Magical attacks are allowed to oppose one another in a Clash. Neither Physical nor Magical is automatically superior.

A sufficiently strong Magical attack may overpower a Physical attack.

A sufficiently strong Physical attack may overpower a Magical attack.

**[UNDECIDED]**

The following Clash mechanics are not yet canonical:

- Clash calculation
- how PA contributes
- how MA contributes
- how SP or Move speed contributes
- Move strength or power contribution
- Hybrid attack calculation
- partial victories
- whether a losing Move can still reduce incoming damage
- damage received by the Clash winner
- damage received by the Clash loser
- exact tie outcomes inside the Clash calculation
- interactions between Clash and defensive Moves

Do not implement Clash mathematics until these rules are explicitly designed.
