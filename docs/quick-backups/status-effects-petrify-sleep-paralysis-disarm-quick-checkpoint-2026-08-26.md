# Z'Her0 — Status Effects Quick Checkpoint — 2026-08-26

**Status:** QUICK BACKUP ONLY — NOT MAIN CHECKPOINT — NOT CANON LOCK

This quick checkpoint safeguards the current working discussion for Petrify/Stone, Sleep, Paralysis, Disarmed, and the emergency coin-cleanse concept. It does not alter implementation or supersede protected combat foundations unless explicitly noted below.

## 1. Stone / Petrify — Current Working Model

### Source Move
- **Curse Beauty** is the current Petrify source under discussion.
- Petrify takes effect **immediately** when Curse Beauty successfully lands.
- Curse Beauty is being explored as an **equipment Signature Move / Ultimate-style move**, with a current direction of **once per battle**.
- Current application-chance candidate: **33–88%**, rerolled per use. This is still a balance candidate, not locked canon.

### Natural Recovery Curve
Current accepted recovery curve:
- Round 1: **8–80%** — “Lucky”
- Round 2: **20–80%** — “Nice”
- Round 3: **40–85%** — “You’re Dead Bro”
- Round 4: **40–90%** — “Yup”
- Round 5: **40–100%** — “Super Dead”
- Round 6: **49–100%** — “You Unlucky Bastard”
- Round 7: **100%** — “Poor thing”

Round 7 therefore guarantees natural recovery.

### Petrify Action / Recovery Sequence
This sequence currently applies **only to Petrify**, not automatically to other statuses:
1. Player chooses and commits a Move **without knowing whether Petrify will clear**.
2. Petrify recovery roll is checked.
3. If recovery succeeds, Petrify ends and the committed Move continues into normal combat resolution.
4. If recovery fails, Petrify remains and that committed Move is cancelled.
5. Normal combat resolution continues for other valid actions.
6. At end of round, if the player is still Petrified and has the emergency coin item available, they may attempt its coin flip.

### Petrify Defensive Buff Idea
Possible PD / MD / HP / stone-barrier buffs while Petrified are **parked**. No defensive bonus is currently established as part of Petrify.

### Petrify Antidote / Counter
- A dedicated Petrify/Curse antidote is being explored as the reliable counter.
- Exact naming remains under discussion between **Curse Antidote** / **Petrify Antidote** wording.
- A lingering Slow after antidote use was discussed, including a **50% SP Slow for the next round**, but this remains a balance candidate and is not locked in this quick checkpoint.

## 2. Emergency Coin Cleanse — Current Working Model

The exact item name is not locked in this checkpoint.

Current behavior:
- While affected by a removable status, a holder may call **Heads or Tails** and flip the coin.
- Each flip is a true **50/50** attempt.
- Correct call: the status is removed.
- Wrong call: the status remains.
- If the status remains, the player may attempt another flip on a later eligible round.
- Individual flip odds stay 50/50; only cumulative eventual-success probability rises across repeated attempts.

For Petrify specifically, the current timing is:
- natural Petrify recovery check occurs during the Petrify action sequence;
- if still Petrified, the coin may be flipped at **end of round** as a second-chance escape.

Whether all future statuses use this same coin timing is unresolved.

## 3. Sleep — Current Working Model

### Initial Application
- Sleep applies immediately if its source Move successfully lands.
- If Sleep resolves before the target’s still-pending committed Move, that pending Move is cancelled.
- If the target already resolved its Move before Sleep lands, there is nothing remaining to cancel that round; Sleep carries forward.

### Wake Sequence
Beginning from the next round:
- The sleeping player chooses and commits a Move **without knowing whether they will wake**.
- Wake roll is checked.
- Wake succeeds: committed Move proceeds into normal Priority / SP / Clash / resolution flow.
- Wake fails: committed Move is cancelled.

### Wake Curve
- Round 1: Sleep begins; no natural wake roll in the initial application round.
- Round 2: **30%** wake chance.
- If the still-sleeping target is **hit** during that round, add **+30%** to the next round’s wake chance.
- If the still-sleeping target is **not hit**, add **+20%** to the next round’s wake chance.
- Round 3 therefore becomes **50% or 60%**.
- Apply the same +20 / +30 rule again.
- Round 4 can therefore be **70%, 80%, or 90%**, depending on prior hit / no-hit history.
- At the **beginning of Round 5**, the target wakes automatically and chooses normally.

### Sleep Tactical Identity
- Hitting a sleeping target gives damage but helps them wake sooner on the **next** round.
- Not hitting preserves Sleep more strongly, allowing the opponent to spend the round on Buffs, setup, healing, or other actions.
- Damage does not retroactively wake the target inside the already-resolving round.

## 4. Paralysis — Current Working Model

### Immediate Effect
- Paralysis applies **immediately** when it lands.
- It is an explicit status-specific exception to the general next-round SP-modifier timing: while Paralyzed, the target’s SP is reduced to **50% immediately**.

### Action Reliability
- The player still chooses and commits a Move.
- Current selected action check: **70% chance the Move proceeds / 30% chance the body fails and the Move is cancelled**.
- Passive effects may continue unless a specific effect says otherwise.

### Recovery
- **No natural recovery.**
- Paralysis remains until one of the following occurs:
  - an Anti-Paralysis item/effect removes it;
  - an eligible emergency coin flip succeeds;
  - the battle ends.
- When Paralysis ends, its 50% SP penalty ends immediately.

## 5. Disarmed — Current Working Model

### Scope
- Disarmed affects **only the specific equipment that was disarmed**.
- That equipment becomes unavailable immediately.
- Other usable equipment remains available.

### Pickup / Recovery Timing
- At the **beginning of the next round**, before action selection, perform the pickup check.
- Success: the equipment is restored before the player chooses a Move, so its Moves are available normally.
- Failure: the equipment remains unavailable and the player must choose from other usable equipment.
- On later rounds, continue through the relevant recovery curve until recovery succeeds.

### Recovery Curves
If the disarmed player is **not faster** than the opponent:
- **30% → 60% → 90% → 100%**

If the disarmed player is **faster** than the opponent:
- **60% → 90% → 100%**

The exact rule for which SP snapshot is used for the “faster than opponent” comparison remains to be finalized if needed.

## 6. Status-Curve Inventory at This Checkpoint

Current distinct status models:
- **Petrify:** round-based natural recovery curve + optional end-of-round coin escape.
- **Sleep:** wake curve influenced by whether the sleeper is hit.
- **Paralysis:** persistent until cured, with 70/30 action reliability and immediate 50% SP.
- **Disarmed:** equipment-specific pickup curve, improved if faster than opponent.

These are intentionally different status identities and should not be automatically normalized into one universal status rule.

## 7. Protected Boundaries / Still Unresolved

This quick checkpoint does **not** establish or alter:
- implementation code;
- main/canon checkpoint status;
- exact Curse Beauty Signature Move naming or final availability rules;
- final Curse Beauty application probability;
- final antidote naming, availability, or lingering Slow behavior;
- final emergency coin item name or universal status eligibility;
- exact Sleep source Move landing chance;
- exact Paralysis source Move landing chance;
- exact Disarm source Move landing chance;
- global status-immunity / cleanse taxonomy;
- parked Petrify PD/MD/HP/barrier buffs;
- broader Q5 duration-decrement rules for all statuses.
