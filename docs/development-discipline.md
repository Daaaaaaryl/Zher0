# Z'her0 Development Discipline

Purpose: define the permanent working discipline for design, experimentation, implementation, synchronization, and checkpoint recovery across Z'her0.

## Project authority

**Project Owner / Final Design Authority: Daryl**

Daryl is the final authority for promoting, changing, superseding, or reopening established Z'her0 design rules.

AI assistants, Game Studio, coding agents, contributors, prototypes, repository artifacts, historical documents, and implementation convenience are advisory/evidentiary sources. They are not substitutes for Daryl's design approval.

A recommendation does not become canon merely because it is technically sound, appears in code, appears repeatedly in history, or was suggested by an AI/development tool.

## Authority verification rule

Do not infer Daryl's approval from an experiment, recommendation, prototype, implementation artifact, historical note, or another agent's summary.

A change requiring owner approval must be supported by an explicit current decision from Daryl or by an existing authoritative approval/checkpoint record whose scope clearly covers that decision.

If approval or authority is ambiguous:

**STOP → preserve the established state → report the ambiguity/conflict → ask Daryl.**

Do not silently choose the interpretation that is easiest to implement.

Repository provenance, signed commits/tags, branch protections, or other identity controls may be added later if stronger collaborator/authentication guarantees become necessary. No hidden password or secret word stored in the repository is treated as proof of owner identity or approval.

## Mandatory synchronization discipline

Before continuing substantial work from a checkpoint, after a long interruption, after a suspected context loss, or whenever current authority is uncertain:

1. Perform a **READ-ONLY synchronization** against the current repository authority, relevant protected checkpoints, and relevant history/context.
2. Make **no repository changes during the synchronization pass**.
3. Identify contradictions, misconceptions, stale assumptions, missing documentation, superseded ideas, and synchronization gaps.
4. Report those findings before correcting authoritative documentation or implementation.
5. Obtain Daryl's approval when the correction would establish, change, supersede, reopen, or materially reinterpret a design rule.
6. Only then perform the approved, scoped change.
7. Verify the resulting repository state after the write.

If Daryl explicitly requests a READ-ONLY review, that instruction is absolute for that pass: no edits, commits, pushes, branch changes, cleanup, or opportunistic fixes are authorized.

## Design-status discipline

Keep these categories distinct whenever applicable:

- **ESTABLISHED / LOCKED** — current authoritative rule.
- **APPROVED CLARIFICATION** — owner-approved interpretation that clarifies existing authority without silently expanding it.
- **EXPERIMENTAL** — intentionally being tested; not canon merely because results exist.
- **PROVISIONAL / PARKED** — retained for possible later development but not currently established.
- **HISTORICAL / RECOVERED** — evidence of previous design work; useful context but not automatically current.
- **SUPERSEDED / NON-CURRENT** — explicitly replaced or no longer authoritative.
- **UNRESOLVED** — requires further design, testing, or owner decision.

Never promote one status to another silently.

Implementation artifacts do not establish design authority by themselves. A field existing in JSON, a function existing in runtime code, or an old formula existing in Git history does not make that mechanic established.

## Core decision workflow

Preferred discipline for unresolved mechanics:

**Design → candidate/experiment → calculate/test → review evidence → Daryl verdict → establish if approved → checkpoint → continue.**

Do not use:

**idea → immediately code → implementation becomes canon.**

When practical, unresolved mechanics should be explored reversibly so that unsuccessful experiments can be discarded without contaminating established architecture.

## Conflict rule

If new evidence, Game Studio guidance, implementation needs, historical material, or experimental results conflict with an established rule:

1. Stop the conflicting adoption/change.
2. Preserve the established state.
3. Surface the conflict clearly to Daryl.
4. Explain what source/evidence conflicts and why it matters.
5. Wait for Daryl's decision before changing authority.

Experiments are allowed to challenge established rules, but they do not replace those rules automatically.

## Checkpoint discipline

Create or update a protected checkpoint when a meaningful design stage has been clarified, when work is about to enter a risky/unresolved numerical or implementation stage, or when a clean recovery point is valuable.

A useful checkpoint should record, as applicable:

1. What is currently established.
2. What was clarified or approved during the stage.
3. What remains experimental/provisional.
4. What remains unresolved.
5. What historical/superseded ideas must not be accidentally restored.
6. Known conflicts or synchronization risks.
7. The current project/design position.
8. The **exact stopping point**.
9. The **next planned sequence**.
10. Resume guardrails describing what should not be reopened accidentally.

A checkpoint must not merely record what happened. It should make it possible for Daryl, a future ChatGPT session, Game Studio, Codex, another agent, or a collaborator to answer:

- Where are we?
- What is authoritative?
- What is still unknown?
- What were we testing?
- What should we do next?
- What should we NOT accidentally redo or reinterpret?

## Resume discipline

When returning after context loss or a long gap:

**checkpoint → read-only synchronization → verify current authority → resume from recorded stopping point.**

Do not reconstruct current design from memory when authoritative repository evidence is available.

Do not restart completed-enough experiments merely because their history is visible.

If the checkpoint and current repository disagree, stop and surface the discrepancy before proceeding.

## Scope discipline

Make the narrowest change that satisfies an approved decision.

Do not use a documentation update as permission to refactor unrelated code, rename systems, clean files, rebalance unrelated mechanics, or settle adjacent unresolved questions.

If an adjacent question becomes relevant, record it as unresolved or ask Daryl rather than silently deciding it.

## AI / Game Studio discipline

AI and Game Studio may:

- analyze architecture;
- identify dependencies and risks;
- challenge assumptions;
- recommend experiments;
- recommend design or implementation order;
- identify when a decision is unnecessary for the current prototype;
- compare repository evidence and historical development.

They may not treat their own recommendation as Daryl's approval.

When an unresolved decision genuinely requires creator intent, ask Daryl rather than inventing canon.

When enough evidence exists to make a reversible experiment without establishing canon, clearly label it as experimental and preserve the ability to revert/reject it.

## Prototype discipline

A prototype is evidence, not automatic authority.

Prototype behavior may intentionally use temporary rulers, placeholder values, or reversible implementations to answer a specific design question. Such behavior must remain clearly separated from established final rules unless Daryl explicitly approves promotion.

Implementation convenience is not sufficient reason to overwrite the intended design.

## Permanent recovery principle

When uncertainty appears, prefer:

**READ ONLY → synchronize → report → Daryl decides → scoped change → verify → checkpoint when appropriate.**

The goal is to keep Z'her0 moving forward without losing established design work, silently rewriting creator intent, or mistaking experiments and implementation artifacts for canon.
