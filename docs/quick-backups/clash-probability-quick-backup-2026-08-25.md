# Z'her0 Quick Backup Checkpoint — Clash Probability Experiment

Date: 2026-08-25

Status: **QUICK BACKUP ONLY — NOT MAIN CHECKPOINT — NOT CANON**

Purpose: Temporary safety snapshot of the current Clash probability experiment so testing can resume without treating these ideas as finalized combat rules.

Reason: ChatGPT acting up deleting chats randomly. Daryl is scared.

## Current A/B experiment

### A — Random ranges

`50–90% → 30–70% → 0–50%`

- Each turn rolls a random Clash probability from the currently active range.

### B — Fixed probabilities

`90% → 70% → 50%`

## Transition behavior currently being tested

- Clash → move one state toward the lower probability.
- No Clash → move one state toward the higher probability.
- If already at the highest state and No Clash occurs, remain at the highest state.
- For A, the probability is rerolled from the active range each turn.

Examples at the highest state:

- A: if there is No Clash while at `50–90%`, stay at `50–90%`.
- B: if there is No Clash while at `90%`, stay at `90%`.

## Test performed so far

An exploratory comparison of A and B was run using **100 battles × 10 turns**.

This small run is exploratory only and does **not** establish a final mechanic.

Working observation from the exploratory test:

- A provides more variable/random behavior because each active range is rerolled.
- B provides cleaner fixed-probability behavior.

These observations are not a final design decision.

## Next test

Run larger A-vs-B simulations and compare behavior such as:

- overall Clash occurrence;
- consecutive Clash streaks;
- consecutive No-Clash streaks;
- Clash count per battle;
- behavior caused by the overlapping probability ranges in A.

## Protection / scope

This file is only a quick backup checkpoint.

It does **not**:

- establish final Clash mathematics;
- promote A or B to canon;
- modify the main combat checkpoints;
- modify Combat Test Lab;
- modify Equipment Stat Distribution;
- supersede existing established combat rules.
