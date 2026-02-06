---
name: demo
description: Full development workflow with planning, execution, testing, and documentation. Triggers on "implement ticket", "jira task", "start development". Orchestrates PLAN→PAUSE→PROCEED with TODO/FIXES documentation.
argument-hint: JIRA ticket ID (e.g., PROJ-123)
---

# Development Workflow Skill

Complete workflow for implementing a Jira ticket with documentation, testing, and PR preparation.

## Arguments

- `{TICKET}` — Jira ticket ID (e.g., PROJ-123)
- `{REPO}` — Repository name (auto-detect from workspace if possible)

## Document Outputs

| Phase | Document | Purpose |
|-------|----------|---------|
| PLAN | `{TICKET}_{REPO}_00-TODO.md` | Planning, concerns, files affected |
| FINALIZE | `{TICKET}_{REPO}_01-FIXES.md` | Completed work summary for PR |

---

# PHASE 1: INIT

## BEFORE

Constraints for this session:
- Language short and concise. Sacrifice grammar for conciseness.
- Do not create new linter errors (existing warnings acceptable).

## PLAN

1. **Analyze** — Read requirements (Jira ticket, any linked docs/specs).
2. **Plan** — Create simple, numbered implementation plan.
3. **Concerns** — List any ambiguities, risks, or questions.
4. **Document** — Write `{TICKET}_{REPO}_00-TODO.md`:

```markdown
# {TICKET}: [Brief Title]

## Description
[1-2 sentence summary suitable for PR description]

## Problem
[What issue this solves]

## Plan
1. [Step one]
2. [Step two]
3. ...

## Files Affected
- `src/components/...`
- `src/utils/...`

## Concerns
- [ ] [Concern 1 — question or risk]
- [ ] [Concern 2]
```

### ⏸️ PAUSE

Present plan and concerns. Wait for user response:

| User Says | Action |
|-----------|--------|
| Provides feedback/context | Update plan with new info, then PROCEED |
| "proceed" / "go" / "looks good" | Acknowledge any open concerns briefly, then PROCEED |
| Asks questions | Answer, then wait for confirmation |

> If open concerns remain unaddressed: "Proceeding. Open concerns (X, Y) — will flag if they become blockers."

---

## PROCEED — Main Development

5. **Execute** — Implement the plan step by step.
   - No pause needed between steps for simple tasks.
   - For complex multi-file changes, brief status updates.

6. **Write Tests** — Create/update unit tests for changes.
   - DO NOT run tests yet.

### ⏸️ PAUSE

Report: "Implementation complete. Tests written but not yet run. Ready to execute tests?"

---

## TESTS

7. **Run Tests** — Execute tests for affected files only.
   - Use test script from project `package.json`
   - Avoid watch mode unless beneficial
   - Include tests for child components if relevant

8. **Iterate** — Fix failing tests.
   - ⚠️ Test iteration may take time
   - If stuck or uncertain, PAUSE and report concerns
   - Allow multiple fix→run cycles

### ⏸️ PAUSE (if needed)

Report any test issues requiring user input or decision.

---

## SNAPSHOTS

9. **Update Snapshots** — Run snapshot updates for altered test files.

---

## DEVELOPMENT DONE

10. **Commit Message** — Suggest conventional commit:

```
feat(component): implement [brief description]

- [Change 1]
- [Change 2]

Closes {TICKET}
```

### ⏸️ PAUSE

Wait for user feedback:
- "Looks good" → Proceed to FINALIZE
- "Concerns about X" → Address and iterate
- "Change Y" → Make adjustments

---

# PHASE 2: FINALIZE

Triggered when user confirms completion (e.g., "finalize", "done", "looks good").

## User Provides

- Answers to any open concerns
- Additional context if needed

## UPDATE TODO

Update `{TICKET}_{REPO}_00-TODO.md` with:
- Answers to concerns
- Any scope changes
- Additional context provided

## CREATE FIXES DOCUMENT

Write `{TICKET}_{REPO}_01-FIXES.md`:

```markdown
# {TICKET}: [Brief Title]

## Description
[PR-ready summary]

## Problem
[What issue this solved]

## Changes Made
1. [Completed step — what was done, where]
2. [Completed step]
3. ...

## Enhancements
[Any improvements beyond ticket scope]
- [Enhancement 1]
- [Enhancement 2]

## Files Changed
- `src/components/...` — [brief note]
- `src/utils/...` — [brief note]

## Concerns
| Concern | Status | Resolution |
|---------|--------|------------|
| [Concern 1] | ✅ Solved | [How/where] |
| [Concern 2] | ⚠️ Open | [Notes] |
| [Concern 3] | ❌ Not possible | [Why] |

## Tests
- Added: `ComponentName.test.tsx`
- Updated: `utils.test.ts`
- Snapshots: Updated

## Commit
```
[suggested commit message]
```
```

---

## FINALIZE COMPLETE

Deliverables ready:
- [ ] Code changes implemented
- [ ] Tests passing
- [ ] `{TICKET}_{REPO}_00-TODO.md` — planning record
- [ ] `{TICKET}_{REPO}_01-FIXES.md` — PR description source
- [ ] Commit message ready

---

## Rules

1. **Always create TODO doc before coding** — planning record is required.
2. **PAUSE at designated points** — don't skip user checkpoints.
3. **Test iteration is normal** — multiple fix cycles expected, communicate issues.
4. **FIXES doc mirrors TODO structure** — easy comparison of plan vs. outcome.
5. **Concise language** — bullet points over prose, abbreviate where clear.
