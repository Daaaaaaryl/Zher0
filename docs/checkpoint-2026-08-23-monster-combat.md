# Z'her0 Protected Checkpoint — Monster & Combat Experiments

Date: 2026-08-23

Purpose: preserve the current state without overwriting established rules, while clearly separating established rules, approved clarifications, active experiments, historical experiments, and unresolved mechanics.

## Checkpoint protection rule

- Established rules remain established unless the game owner explicitly approves a change.
- Experiments may challenge an established rule, but they do not replace it automatically.
- If future work conflicts with an established rule, stop and surface the conflict before changing anything.
- Historical formulas, prototypes, and recovered ideas must not be promoted to current canon merely because they exist in repository history or prior conversation.
- Future checkpoint work should begin with a read-only comparison against the previous checkpoint and current Git authority.

## Current established stat foundation

The six canonical combat stats remain:

- HP — Health
- PA — Physical Attack
- PD — Physical Defense
- MA — Magical Attack
- MD — Magical Defense
- SP — Speed

### SP — established and locked

SP is Speed.

Its global role is speed/action ordering. It does not globally increase Physical damage, Magical damage, defense, or Clash power.

If future design work gives a concrete reason to expand SP beyond Speed, that change must be explicitly reopened, experimented with, computed/tested, reviewed, and approved before becoming established.

An individual Move may eventually define a specific interaction with SP, but that belongs to that Move's own rules and does not redefine SP globally.

## Established base damage relationships

The normal unmodified damage relationship is established as:

Physical:

PA resolves against PD → resulting damage reduces HP.

Magical:

MA resolves against MD → resulting damage reduces HP.

This establishes which offensive and defensive stats interact and where the result goes.

The exact numerical equation is not locked by this checkpoint. In particular, this checkpoint does not establish `PA - PD` or `MA - MD` as the permanent final numerical formula.

Future mechanics such as Critical Hits, Clash, Move properties, passives, statuses, penetration, protection, defense attrition, and other modifiers may enter the complete calculation wherever their own approved rules require. This checkpoint does not force all modifiers to occur before, during, or after one fixed stage.

## Ordinary descriptive terminology

Physical / Magical / Hybrid terminology is established as normal descriptive language only. It is not an archetype, class, role, passive system, bonus system, or separate mechanic.

Offensive descriptions:

- Physical Attacker — meaningful/high Physical offensive capability, primarily represented by PA.
- Magical Attacker — meaningful/high Magical offensive capability, primarily represented by MA.
- Hybrid Attacker — both Physical and Magical offensive capability are meaningfully represented.

Defensive descriptions:

- Physical Defender — meaningful/high Physical defensive capability, primarily represented by PD.
- Magical Defender — meaningful/high Magical defensive capability, primarily represented by MD.
- Hybrid Defender — both Physical and Magical defensive capability are meaningfully represented.

Hybrid does not mean PA and MA are automatically added together, and it does not mean PD and MD are automatically added together.

No universal numerical threshold for these descriptive terms is established yet. They are contextual labels used to describe a stat profile.

A set or monster may have separate offensive and defensive descriptions, for example Physical Attacker + Hybrid Defender.

## Archetypes / beginning passives

The archetype/passive concept discussed for early player choices is not established yet. More research and design work are required before defining or locking it.

Do not infer player archetypes from the ordinary Physical / Magical / Hybrid descriptive terminology above.

## Reference player builds used in experiments

Samurai:

- HP 130
- PA 88
- PD 76
- MA 0
- MD 32
- SP 37

Knight:

- HP 133
- PA 73
- PD 70
- MA 0
- MD 3
- SP 26

Geisha:

- HP 147
- PA 38
- PD 13
- MA 51
- MD 56
- SP 90

Geisha is treated descriptively as having Hybrid Offense because both PA and MA are meaningful routes. This is not an archetype designation.

## Monster experiment status

### Historical monster profiles

Older monster profiles and old prototype monsters remain historical experiments/ideas. They are preserved for reference but are not the active candidates currently moving toward establishment.

### Current monster experiments

The recent Weak and Average monster work is the active experiment set. These profiles are not established final monster balance yet, but they are intentionally being developed toward possible later establishment once additional combat variables are tested.

Current monster results must remain experimental until enough of the real combat system exists to judge them in context.

## Weak Monster experiment

Status: completed enough for the current stage.

Weak Monster testing established useful baseline observations and exposed behavior of the temporary subtraction test ruler. Existing Weak test profiles are preserved for later retesting when the fuller combat system exists.

The current experiment set includes the recent approximately-200-HP adjusted Weak Monster work and the 400-HP high-HP / low-defense test monster. Exact final Weak Monster balance is not established by this checkpoint.

## Average Monster durability / resistance experiments

A1 — Balanced
- HP 330
- PD 45
- MD 25
- Temporary-test hits: Samurai 8 / Knight 12 / Geisha 13 using MA route

A2 — HP-Leaning
- HP 420
- PD 35
- MD 20
- Temporary-test hits: Samurai 8 / Knight 12 / Geisha 14 using MA route

A3 — Defense-Leaning
- HP 240
- PD 55
- MD 32
- Temporary-test hits: Samurai 8 / Knight 14 / Geisha 13 using MA route

A4 — Physical-Resistant
- HP 260
- PD 60
- MD 20
- Temporary-test hits: Samurai 10 / Knight 20 / Geisha 9 using MA route

A5 — Magic-Resistant
- HP 260
- PD 30
- MD 40
- Temporary-test hits: Samurai 5 / Knight 7 / Geisha 24 using MA route; Geisha PA route 33

A6 — Uneven / Hybrid test
- HP 300
- PD 40
- MD 30
- Temporary-test hits: Samurai 7 / Knight 10 / Geisha 15 using MA route

A7 — Hybrid-choice test
- HP 290
- PD 32
- MD 28
- Temporary-test hits: Samurai 6 / Knight 8 / Geisha 13 using MA route; Geisha PA route 49

## Average Tank experiments

T1 — Defense Tank
- HP 300
- PD 55
- MD 38
- Temporary-test hits: Samurai 10 / Knight 17 / Geisha 24 using MA route

T2 — High-HP / Low-Defense Tank
- HP 500
- PD 25
- MD 15
- Temporary-test hits: Samurai 8 / Knight 11 / Geisha 14 using MA route

T3 — Extreme HP Sponge
- HP 750
- PD 25
- MD 15
- Temporary-test hits: Samurai 12 / Knight 16 / Geisha 21 using MA route

## Average Offensive Monster experiments

O1 — Moderate Physical
- HP 280
- PA 55
- MA 0
- PD 35
- MD 20
- Temporary outgoing result: 0 against Samurai / 0 against Knight / Geisha defeated in 4 hits

O2 — Heavy Physical
- HP 280
- PA 85
- MA 0
- PD 35
- MD 20
- Temporary outgoing result: Samurai defeated in 15 hits / Knight 9 / Geisha 3

O3 — Magical
- HP 280
- PA 0
- MA 65
- PD 35
- MD 20
- Temporary outgoing result: Samurai defeated in 4 hits / Knight 3 / Geisha 17

O4 — Hybrid Offensive
- HP 280
- PA 60
- MA 55
- PD 35
- MD 20
- Temporary outgoing result when choosing the more effective route: Samurai defeated in 6 hits / Knight 3 / Geisha 4

The O4 result does not establish that monster AI always knows or chooses the mathematically optimal attack type. AI behavior remains separate design work.

## SP comparison experiment

For an isolated SP comparison, the same non-SP test body is used:

- HP 280
- PA 50
- MA 35
- PD 30
- MD 20

Only SP changes:

- Slow sample: SP 15
- Normal sample: SP 35
- Fast sample: SP 80

These are experimental comparison samples only. They do not establish universal Slow / Normal / Fast thresholds for the game.

With equal action Priority under the current action-order model:

- SP 15 is slower than Knight 26, Samurai 37, and Geisha 90.
- SP 35 is faster than Knight 26, slightly slower than Samurai 37, and slower than Geisha 90.
- SP 80 is faster than Knight 26 and Samurai 37, while Geisha 90 remains faster.

## Temporary test calculation used during monster experiments

For the recent stat-only experiments, a simple subtraction ruler was used to expose matchup behavior:

Physical test ruler: max(0, PA - PD)

Magical test ruler: max(0, MA - MD)

This ruler is an experimental measuring tool, not the established complete damage equation.

Its purpose was to compare stat profiles consistently before full combat variables are available.

## Experimental findings to preserve

### Defense cliff

As Attack approaches the matching Defense under the temporary subtraction ruler, damage falls sharply, hit counts can become extremely large, and damage can reach zero.

This is an observed experimental problem, not a newly established rule.

### HP vs Defense

The experiments showed that under the temporary ruler, high Defense can provide much more effective survivability than simply increasing HP.

T1 versus T3 is the clearest example: a 300-HP high-defense monster produced survivability broadly comparable to a 750-HP low-defense monster for the reference builds.

This is an experimental finding and must be retested once the fuller combat calculation exists.

### Build identity observations

- Samurai currently presents strong Physical offense and strong Physical defense in the reference build.
- Knight is not primarily a damage-focused reference build; its strong PD and very low MD produce pronounced matchup differences.
- Geisha presents mixed Physical/Magical offensive capability, strong MD, and low PD in the reference build.

These are observations from the current reference stats, not permanent archetypes.

## Still unresolved / not promoted by this checkpoint

The following remain unresolved, provisional, or separately experimental unless already established in another authoritative design document:

- exact numerical Physical damage formula
- exact numerical Magical damage formula
- Critical Hit calculation and placement
- Clash mathematics and carry-through calculation
- PA-vs-MA Clash interaction
- Defend/protection calculation
- Defense Attrition formula and recovery behavior
- penetration
- accuracy/evasion
- status-effect execution
- passive calculations
- Move-specific formulas
- monster AI / attack-choice behavior
- final monster roster
- final Weak/Average/Strong monster balance
- universal SP category thresholds
- player archetype / beginning passive system

## Superseded or non-current experimental interpretation

Historical SP → Impact / universal SP-to-Clash-power ideas are not current established rules.

SP is currently locked as Speed with a global role in speed/action ordering. Any future proposal to expand SP must follow the explicit reopen → experiment → computation/testing → owner verdict → relock process.

Historical damage calculators and old prototype equations remain historical/experimental unless separately re-approved.

## Next development stage

The current monster experiment stage is complete enough to pause.

Next planned sequence:

1. Use this checkpoint as the protected current-state reference.
2. Ask Game Studio for practical development guidance toward a playable prototype.
3. Treat Game Studio recommendations as guidance, not automatic authority.
4. If Game Studio guidance conflicts with an established rule, stop and surface the conflict to the game owner before adopting anything.
5. Prototype unresolved mechanics in reversible/testable form rather than silently making them canonical.

This checkpoint is intended to protect current decisions while allowing aggressive future experimentation.