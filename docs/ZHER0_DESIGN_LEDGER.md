# Z’HER0 Design Ledger

**Purpose:** Durable, auditable record of Z’HER0 design decisions, recovered history, experiments, superseded ideas, and unresolved questions.

**Created:** 2026-08-21

> This ledger is additive. Do not delete an old idea merely because it is superseded. Change its status and preserve why it changed when known.

## Authority and status

Evidence priority:
1. Current explicit creator decisions.
2. Current Design Ledger / creator clarifications.
3. Later developed historical designs.
4. Master Record (important but known incomplete).
5. Early progress / Game Idea records.
6. Historical AI suggestions unless explicitly adopted.

Statuses:
- **CONFIRMED** — current explicit decision.
- **RECOVERED** — historically verified concept; not automatically current canon.
- **EXPERIMENTAL / PARKED** — considered but not decided.
- **SUPERSEDED** — replaced by newer design.
- **DROPPED** — explicitly abandoned.
- **CONFLICT** — sources/current decisions disagree; creator decision required.
- **UNRESOLVED** — current decision still needed.
- **AI SUGGESTION** — historical AI proposal not established as creator canon.

Absence from an older Master Record does **not** prove an idea never existed.

---

## 1. Core identity

### Zero-to-Hero foundation — CONFIRMED
Z’HER0 is an equipment-driven Zero-to-Hero RPG. The character begins with no inherent combat-stat contribution; practical identity and power are created primarily through equipment, equipment effects/moves, combinations, access, and mastery rather than automatic level-stat inflation.

### Base combat stats — CONFIRMED
- HP = 0
- PA = 0
- PD = 0
- MA = 0
- MD = 0
- SP = 0

### Equipment slots — CONFIRMED
1. Main Hand
2. Off Hand
3. Body
4. Head
5. Boots
6. Accessory

### Aggregate vs individual equipment stats — CONFIRMED / PARKED extension
Each equipped item contributes its own stats. Player totals aggregate applicable equipment contributions. Example: Sword PA 50 + another item PA 20 = player total PA 70. The creator informally used “ZPA” for total PA; terminology is not locked.

A future special move may explicitly use the performing item’s individual PA/MA rather than the player aggregate. This is PARKED, not the default attack rule.

### Free-build balance — UNRESOLVED CORE QUESTION
Z’HER0 should preserve equipment-mixing freedom without allowing an obvious combination of maximum PA + defense + SP to dominate everything. Do not prematurely solve this with hard classes, arbitrary bans, arbitrary caps, or automatic penalties. Existing equipment budget/stat-identity work may contribute to the eventual solution.

---

## 2. Current combat foundation

### Format — CONFIRMED
Initial combat development is turn-based. Hybrid/real-time remains future exploration only.

### Secret commitment — CONFIRMED
Both sides select/commit actions before resolution rather than allowing the slower side to see the faster side’s choice and react. This preserves prediction, surprise, and strategy. PvE may reveal actions in tutorials/special mechanics, but normal enemies should not simply expose their committed move beforehand.

### Action categories — PARTIALLY CONFIRMED
- ATTACK → choose equipment → choose an available attack move.
- DEFEND → choose equipment → choose an available defensive/protective move.
- BUFF/STATUS-type category exists conceptually; final terminology and scope unresolved.

**Terminology boundary:** PD is the Physical Defense stat. Defend is an action category.

### PD identity — CONFIRMED at conceptual layer
PD applies after a physical attack connects. Active Defend/protection determines whether an incoming attack is prevented/negated; PD is not itself the active blocking mechanic.

Conceptual flow:
Incoming physical attack → active protection interaction if applicable → connection? → if connected, PD mitigation → remaining HP damage.

A successful protective move may fully negate an attack. A purely defensive choice by both combatants can produce a no-damage/stalemate turn.

Exact PA/PD damage formula is UNRESOLVED. Historical/example subtraction must not be treated as final formula.

### Defensive secondary consequences — PARKED
Strong protection/block interactions may later cause slow, flinch, interruption, delay, stun/paralysis, or next-turn initiative advantage. Not confirmed.

### SP — CONFIRMED / UNRESOLVED extension
SP influences action order. Exact tie/recalculation algorithm unresolved.

Historical additional SP roles include Critical, Dodge, and Clash Impact; none are current unless reconfirmed. A separate Attack Speed stat was historically considered then dropped because it overlapped with SP.

### Move Priority — RECOVERED / UNRESOLVED
Historical/current recollection includes URGENT, HIGH, NORMAL, LOW move/action priority. Urgent was intended to be rare. Possible numeric interpretation was discussed but not confirmed. Relationship between Move Priority and SP is unresolved.

### Move schema — UNRESOLVED
Basic/shared moves and equipment-specific/special moves are emerging. Examples discussed historically/currently include Quick Slash, Heavy Slash, fan attacks, Wind Slash, fan protection/closing technique, shield protection, and special contact consequences. Minimum move-data schema is not yet locked.

---

## 3. Clash

### Status — SUBSTANTIALLY RECOVERED HISTORICAL DESIGN
Clash should no longer be labeled simply “lost.” A later Core Mechanics Draft and recovered historical conversation preserve substantial design DNA. Current adoption/reconciliation remains required.

### Strong recovered principles — RECOVERED
- Clash concerns compatible attacks/actions colliding.
- It is not “higher attack wins and deals full original damage.”
- Opposing force is neutralized. Historical physical example: 150 vs 100 leaves roughly 50 remaining force; equal force can neutralize to zero.
- Magical-vs-magical neutralization was explored.
- Physical-vs-magical interaction existed but needed another calculation and was unresolved.
- Clash moved away from a simple dedicated button.
- Historical architecture evolved toward **player combat intent + compatible moves + system probability**.
- Player may intentionally create a defensive Clash opportunity, while the system determines whether Clash manifests.
- Attack-capable moves could historically be selected under Defend to meet an incoming attack. Reduced output for deliberate defensive use was explored, but no percentage was locked.

### Anti-loop probability — RECOVERED principle / EXPERIMENTAL numbers
Repeated Clash needed diminishing probability so equal attacks would not collide forever. Successful Clash lowers immediate repeat probability; a non-Clash allows probability to recover. Historical working regions around 50% and ±30 percentage points changed during brainstorming and are not canon.

### Impact — RECOVERED / UNRESOLVED current adoption
Historical Clash design used PA/MA as available force and SP-derived “Impact” as delivery effectiveness before neutralization. Example multipliers such as 1.10/0.90 were illustrative only. Exact SP→Impact formula and whether Impact survives in current Z’HER0 are unresolved.

### Current-vs-historical boundary — UNRESOLVED
Current active protection: protection → connection → PD/MD → HP.
Historical Clash: attack collision → neutralization → remaining force → PD/MD → HP.
Do not merge these automatically; their relationship needs creator approval.

---

## 4. Equipment meaning, Bond, and evolution

### Equipment Bond / Core Memory — RECOVERED IMPORTANT DIRECTION
Equipment should not feel like disposable stat containers. A specific item can develop usage history/core memory. Repeated use and successful moves/actions can build **Bond**, intended to make a long-used Sword/Fan/Shield feel companion-like and personally meaningful.

Unresolved: gain rules, thresholds, benefits, persistence, transfer, UI, and relationship to evolution. Do not assume Bond grants stats.

### Equipment evolution/upgrading — RECOVERED / PARKED
Historical records explored equipment evolution/upgrading, visual/form changes, stat/effect changes, equipment level/EXP, use-based progression, infusion/reinforcement, materials, Blacksmith, and Alchemist/Enchanter mechanisms. Implementation is not current canon.

Current direction preserves the possibility that starter/long-used equipment remains meaningful and may evolve rather than becoming disposable.

Relationship among Bond, Equipment Level, Equipment EXP, Evolution, Upgrade, Infusion is unresolved.

### Equipment stress/degradation — RECOVERED / PARKED
Historical developed idea preferred temporary battle stat degradation over giving every equipment item its own HP/durability. Example: failed Boots Dodge → temporary Boots SP reduction → restored after battle. Newer brainstorming includes contact consequences such as a Sword striking a special/spiked Shield. Do not automatically create equipment HP; relationship to temporary degradation/contact effects/disarm is unresolved.

---

## 5. Opening and behavioral player passives

### Opening — RECOVERED / CURRENTLY DEVELOPED, exact canon unresolved
Player wakes weak/disoriented in an unknown/ruined-type place. Vision/senses may be blurry. The player finds simple clothing; because equipment supplies HP, equipping it gives HP and helps restore capability/senses. A large approaching threat is heard/seen, possibly with ground shaking. A bag contains equipment choices used to survive.

Exact location, clothing item, monster, dialogue, and presentation are unresolved.

### Three-item behavioral choice — RECOVERED
Historical records confirm an opening where the player is nudged—not hard-restricted—to take about three items. After three selections the game naturally suggests they are ready. Taking more was possible; a fourth-item warning and Greed consequence existed historically.

Newer recollection expands the behavioral choices to:
- **YES** — accept selected gear; associated with a Combo-related boost/passive based on the chosen three-item combination. Exact effect unresolved.
- **SWAP** — reconsider/swap before settling; associated with **Decision Maker**. Exact effect unresolved.
- **MORE** — insist on additional equipment; associated with **Greed**.

Historical Greed evolved: an older form was curse-like/removable; newer recollection frames it as a strategic more-power/HP-tradeoff idea. Remembered percentages are unreliable and not canon.

Deep design principle: the game observes player behavior rather than presenting a conventional “choose your starting passive” screen.

Whether these passives are permanent is unresolved; permanent opening traits may conflict with fluid equipment identity.

### Player vs equipment passives — RECOVERED distinction
Player passives and equipment passives are conceptually separate. Equipment passives fit current equipment-driven design. Historical player passives must not be automatically restored.

---

## 6. Monsters and enemy behavior

### Monster Instinct — VERIFIED RECOVERED HISTORICAL SYSTEM
A universal/DNA-like monster passive system called **Monster Instinct** existed historically. Monsters could also have classification-specific passives.

Historical branches/behaviors:
- **Survival Instinct:** Defend/damage reduction, Run/Flee, Dodge.
- **Killing Instinct:** Adrenaline, rare critical/damage amplification.
- **Fear:** extreme-danger state that could increase Monster Instinct/passive activation chances.

Historical values (flee/dodge/adrenaline/damage boosts/Fear multipliers) were experimental, sometimes ambiguous, and must not be restored as canon.

Historical passive rules included one-passive-per-turn concepts and next-turn passive suppression/cooldown ideas. Exact rules/values require reconfirmation.

A rare Disarm-like defensive idea also existed: sufficiently strong defense relative to attacking equipment might knock/drop/disrupt equipment. Exact mechanics unclear.

### Adaptive enemy AI — PARKED FUTURE DIRECTION
Future enemies may recognize player decision patterns/history. Difficulty could influence how effectively enemies predict/respond (e.g. Easy/Medium/Hard). This is distinct from Monster Instinct. Do not make enemies omniscient; implementation is not yet designed.

---

## 7. Historical status/combat vocabulary

### Status effects — RECOVERED HISTORICAL VOCABULARY
Bleed, Poisoned, Burned, Paralyzed, Slowed, Trapped, Stunned. Newer discussion independently returned to slow/flinch/interruption/stun/paralysis. Current status system remains unresolved.

### Historical SP→Crit — RECOVERED / EXPERIMENTAL
Old designs explored SP influencing critical chance using several formulas. No formula is current canon.

---

## 8. Guild

### Guild — PARTIALLY RECOVERED / SEPARATE FROM COMBAT STATS
Guild was remembered primarily as a way to track records/history and potentially provide additional Gold/rewards. It is separate from the six-stat system. Do not attach Guild rank/membership directly to HP/PA/PD/MA/MD/SP unless explicitly decided later.

Exact guild progression, ranks, activities, social systems, rewards, and record structure remain unresolved.

---

## 9. Historical equipment/class experiments

### Equipment-derived classifications — RECOVERED HISTORICAL ONLY
Historical equipment combinations were explored as creating passives/classifications such as Assassin, Support, Mage, Tank, Fighter. These are not current rigid classes. Current stronger philosophy favors fluid equipment-built identity.

### Historical category list — RECOVERED HISTORICAL ONLY
At one stage: Sword, Staff, Bow, Shield, Armor, Helmet, Dagger, Gloves, Boots. Cape, Catalyst, Spear and other ideas moved through future/design-vault stages; Guns/Bombs were removed from the immediate list. This does not replace the current six equipment slots.

---

## 10. Equipment Stat Distribution tool

### Role — CONFIRMED
The Equipment Stat Distribution application is a balancing/design tool, not automatically the game runtime. Established calculations should not be casually redesigned while implementing combat.

Known latest discussed/published line before this ledger: **v0.8.16.032 GSHEET TEST**, historically published to `main` in commit `db6be9d` according to the project record.

Key established concepts include Total Basis, Priority magnitude/intensity, direct Negative values returning budget, largest-remainder conservation, Equipment Weight, Set experiments, Advanced Equipment Weight, Final Balancing, and comparison/focus workflows. Exact Set 6 description remains recovery-needed unless verified directly from code/history.

---

## 11. Historical vault

Preserve without promoting to current requirements:
- “Ghad / Ghad Dar” humorous pity trait/passive; historical naked-player +5 HP idea.
- Rare monster evolution.
- Trading gated by level.
- Dungeon/gym-like progression.
- Equipment EXP and player EXP experiments.
- Base Stat/Library categorization.
- Godot/Aseprite exploration and early prototypes.
- Blacksmith/Alchemist/Enchanter/material infusion brainstorming.

---

## 12. Current high-priority unresolved questions

These are unresolved, not permission to answer them automatically:
- Minimum combat move data/schema.
- Ordinary physical attack resolution and exact PA↔PD formula.
- Magical MA↔MD formula.
- Exact SP turn-order/tie/recalculation behavior.
- Move Priority ↔ SP relationship.
- Current relationship among Defend, protective moves, defensive use of attacks, Counter/Intercept, and recovered Clash.
- Which recovered Clash principles survive current design; exact trigger/probability/Impact rules.
- Free equipment-mixing balance without undermining build freedom.
- Player-passive permanence and opening YES/SWAP/MORE design.
- Bond/equipment evolution relationship.
- Recovery/death/after-battle rules.
- Full Monster Instinct/current monster behavior rules.

---

## 13. Safekeeping rule

Z’HER0 design history is part of the project, not clutter. When a mechanic changes, preserve the old version and mark it SUPERSEDED/DROPPED/HISTORICAL rather than erasing it. When the creator recovers an old idea, add it with its evidence/status. Historical percentages and AI suggestions do not become current rules merely because they are documented.
