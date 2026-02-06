# AI Skills Demo Guide

> How to demonstrate the AI Skills system to stakeholders.

---

## Prerequisites

1. **VSCode** with GitHub Copilot extension
2. **AI Skills Loader** extension installed
3. **Skills directory** at `~/ai-skills/skills/`
4. **Demo files** (any real project file works)

---

## Demo Flow (5-10 minutes)

### 1. Open — Set the Stage (1 min)

Open a code file (e.g., `useAuth.ts` or any component).

**Say:** "Today I'll show you AI Skills — reusable, task-specific workflows for Copilot that produce consistent, structured outputs."

---

### 2. Show the Problem (1 min)

Open Copilot Chat, type a generic request:
```
analyze this file
```

**Point out:** Output is helpful but unstructured. Different every time. No consistent format.

---

### 3. Invoke a Skill (2 min)

Press `Cmd+Alt+A` → Select **file-anatomy**

**Show:**
- Skill pre-fills in chat (compose mode)
- Add context: "analyze useAuth.ts"
- Send

**Point out the output:**
- Clear visual header (`⚡ file-anatomy`)
- Structured sections (Dependencies, State, Functions, etc.)
- Consistent format every time
- Control directives at bottom (concise behavior)

---

### 4. Skills vs Instructions (2 min)

**Explain the difference:**

| | Skills | Instructions |
|-|--------|--------------|
| **When** | Explicit invocation | Always active |
| **Output** | Structured, visual | Natural |
| **Use for** | Specific tasks | Global preferences |

**Example:**
- **Instruction:** "Use TypeScript" → Always applied
- **Skill:** `/commit-craft` → Only when crafting commits

---

### 5. Native Integration (Optional, 1 min)

Run: `AI Skills: Sync to Copilot (Native)`

Then type directly in chat:
```
/file-anatomy
```

**Show:** Skills become native slash-commands.

---

### 6. Show the Demo Skill (2 min)

If time permits, show `/demo` — the full workflow skill:

```
/demo PROJ-123
```

**Walk through:**
1. PLAN phase — Creates TODO.md
2. PAUSE — Waits for confirmation
3. PROCEED — Executes with test iteration
4. FINALIZE — Creates FIXES.md for PR

**Say:** "This is a real-world workflow. Planning, execution, testing, documentation — all in one skill."

---

## Key Talking Points

### Why Skills?

1. **Consistency** — Same output format every time
2. **Reusability** — Define once, use everywhere
3. **Visibility** — Clear when skill is active
4. **Control** — PLAN→PAUSE→PROCEED prevents runaway execution

### Why Not Just Instructions?

Instructions are great for preferences (style, conventions). But they:
- Don't produce structured output
- Can't be selectively invoked
- Don't have visual confirmation

Skills fill the gap for **task-specific workflows**.

### Cross-Platform

Skills work across:
- GitHub Copilot (native integration)
- Claude Code CLI (copy to project)
- Cursor IDE (rules integration)

Same format, portable everywhere.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Skill not appearing | Check `~/ai-skills/skills/` exists |
| `isPartialQuery` not working | Update VSCode to latest |
| Native sync not working | Check Copilot prompts directory permissions |

---

## Files Shown in Demo

```
~/ai-skills/skills/
├── 00-control.skill.md      # Auto-included, not shown directly
├── 01-file-anatomy.skill.md # Main demo skill
└── 04-demo.skill.md         # Full workflow (if time)
```

---

## Expected Output Examples

### /file-anatomy Output

```
⚡ file-anatomy

┌─────────────────────────────────────┐
│ FILE ANATOMY: useAuth.ts            │
├─────────────────────────────────────┤
│ 📦 Dependencies                     │
│ • react (useState, useEffect)       │
│ • @auth/client                      │
├─────────────────────────────────────┤
│ 🔧 State                            │
│ • user: User | null                 │
│ • loading: boolean                  │
├─────────────────────────────────────┤
│ ⚙️ Functions                        │
│ • login() — Authenticate user       │
│ • logout() — Clear session          │
├─────────────────────────────────────┤
│ 📤 Exports                          │
│ • useAuth (default)                 │
└─────────────────────────────────────┘
Summary: Auth hook with login/logout, manages user state.
```

### /demo Output (Plan Phase)

```
⚡ demo

# PROJ-123: Add aria-label to Button

## Plan
1. Update Button component props
2. Add aria-label to render
3. Update tests

## Concerns
- [ ] Should aria-label be required or optional?

## Files Affected
- `src/components/Button.tsx`
- `src/components/Button.test.tsx`

⏸️ PAUSE — Confirm to proceed or address concerns.
```

---

## Post-Demo Questions

**Q: Can we create our own skills?**
A: Yes! Copy `TEMPLATE.skill.md`, customize, drop in `~/ai-skills/skills/`.

**Q: Does this work with our codebase?**
A: Yes. Skills are prompts — they work with any code.

**Q: What about Instructions we already have?**
A: Keep them! Skills complement Instructions. Use both.
