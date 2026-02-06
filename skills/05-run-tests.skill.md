---
name: run-tests
description: Execute and iterate on unit tests safely. Handles path issues, scoping, and fix cycles. Triggers on "run tests", "fix tests", "test iteration".
argument-hint: Test file or pattern (optional, defaults to changed files)
---

# Run Tests Skill

Safe test execution with proper scoping, path handling, and iteration support.

---

## ⚠️ Critical Rules

### 1. ALWAYS Run from Project Root

```bash
# ✅ CORRECT — run from project root
cd /path/to/project-root
npm test

# ❌ WRONG — running from subdirectory
cd /path/to/project-root/src/components
npm test  # Will fail or run wrong tests
```

**Before running ANY test command:**
1. Confirm current working directory
2. Navigate to project root if needed
3. Verify `package.json` exists in current directory

### 2. ALWAYS Scope Tests

```bash
# ✅ CORRECT — scoped to changed files only
npm test -- --testPathPattern="ComponentName"
npm test -- ComponentName.test.tsx

# ❌ WRONG — running entire test suite
npm test  # Runs ALL tests, slow, noisy
```

**Never run the full test suite unless explicitly requested.**

### 3. Use Project's Test Script

```bash
# Check package.json for test command
cat package.json | grep -A5 '"scripts"'

# Common variations:
npm test
npm run test
pnpm test
yarn test
```

**Do NOT assume `npm test` — verify first.**

### 4. Avoid Watch Mode

```bash
# ✅ CORRECT — single run
npm test -- --watchAll=false
npm test -- --no-watch

# ⚠️ AVOID — watch mode (unless explicitly helpful)
npm test -- --watch
```

Watch mode can cause confusion in agentic workflows. Use single runs.

---

## Execution Flow

### Step 1: Pre-flight Checks

```bash
# 1. Confirm project root
pwd
ls package.json  # Must exist

# 2. Identify test script
cat package.json | grep -A2 '"test"'

# 3. List changed test files
# (from context or git diff)
```

### Step 2: Run Scoped Tests

```bash
# Pattern: files that were modified
npm test -- --testPathPattern="ChangedComponent"

# Or specific file(s)
npm test -- src/components/Button.test.tsx

# Multiple files
npm test -- --testPathPattern="Button|Input|Form"
```

### Step 3: Analyze Results

**On Success:**
```
✅ Tests passed. Proceed to next phase.
```

**On Failure:**
```
❌ X tests failed.

Failures:
1. ComponentName.test.tsx — "should render correctly"
   - Expected: X
   - Received: Y

Analyzing cause...
```

---

## Iteration Protocol

### When Tests Fail

1. **Analyze** — Identify root cause (code bug vs test bug)
2. **Fix** — Make minimal change to fix
3. **Re-run** — Execute same scoped test
4. **Repeat** — Until pass or blocker identified

### ⏸️ PAUSE Conditions

Stop and report to user if:

| Condition | Action |
|-----------|--------|
| 3+ failed iterations on same test | PAUSE — may need user input |
| Test requires understanding of business logic | PAUSE — clarify expected behavior |
| Fixing test would change test intent | PAUSE — confirm this is desired |
| Unexpected errors (env, deps, config) | PAUSE — may be setup issue |
| Test depends on external service/API | PAUSE — may need mock guidance |

### Report Format (When Pausing)

```markdown
⏸️ TEST ITERATION PAUSED

**Attempts:** 3
**File:** ComponentName.test.tsx
**Test:** "should handle edge case"

**Issue:**
[Describe what's failing and why]

**Tried:**
1. [First fix attempt]
2. [Second fix attempt]
3. [Third fix attempt]

**Blocker:**
[Why further iteration won't help without input]

**Question:**
[Specific question for user]
```

---

## Snapshot Tests

### Updating Snapshots

```bash
# Only after tests pass and changes are intentional
npm test -- -u --testPathPattern="ComponentName"

# Verify snapshot changes make sense
git diff **/*.snap
```

### ⚠️ Never Blindly Update

1. Run tests first (without -u)
2. Review what changed
3. Confirm changes are expected
4. Then update with `-u`

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Wrong cwd | `cd` to project root |
| "No tests found" | Wrong pattern | Check file name/path |
| All tests running | Missing scope | Add `--testPathPattern` |
| Watch mode stuck | Interactive mode | Add `--watchAll=false` |
| Snapshot mismatch | Intentional change | Review, then `-u` |
| Timeout errors | Async not awaited | Check async/await |

---

## Integration with /demo

When invoked from `/demo` workflow:

1. **Receive** — List of changed files from implementation phase
2. **Scope** — Test only those files + direct dependents
3. **Iterate** — Fix cycles as needed
4. **Report** — Pass/fail status back to orchestrator
5. **Pause** — If blockers, surface to user via orchestrator

---

## Quick Reference

```bash
# Pre-flight
pwd && ls package.json

# Scoped run (most common)
npm test -- --testPathPattern="ComponentName" --watchAll=false

# Specific file
npm test -- path/to/file.test.tsx --watchAll=false

# Update snapshots (after review)
npm test -- -u --testPathPattern="ComponentName"

# Check what test command is
cat package.json | grep -A2 '"test"'
```
