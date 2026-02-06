# 🤖 AI Agent Skills — Demo

> **TL;DR**: Skills give you _controlled, task-specific_ AI behavior. Instructions give you _global
> coding preferences_. This demo shows why you need both.

---

## 🎯 What This Demo Shows

1. **Skills are visually obvious** — You'll _know_ when one activates
2. **Skills control execution flow** — PLAN → PAUSE → PROCEED for complex tasks
3. **Skills are portable** — Same skill works across Copilot, Claude, Cursor, CLI
4. **Skills ≠ Instructions** — Different problems, different solutions

---

## ⚡ Quick Demo (2 minutes)

### Demo 1: File Anatomy Skill

**Without skill** (normal Copilot):

```
You: "Show me the structure of utils/auth.ts"
Copilot: "Here's the file: [dumps entire file]"
```

**With skill**:

```
You: "Show me the anatomy of utils/auth.ts"
Copilot:
═══════════════════════════════════════════
📁 FILE ANATOMY: utils/auth.ts
═══════════════════════════════════════════
┌─────────────────────────────────────────┐
│ 📦 IMPORTS                              │
└─────────────────────────────────────────┘
...
```

**The difference**: Structured, scannable, consistent output every time.

---

### Demo 2: Commit Craft Skill

**Without skill**:

```
You: "Write a commit message for these changes"
Copilot: "Here's a commit message you could use:
         Added new validation to the user form
         - Updated validation logic
         - Added error messages
         - Fixed edge cases"
```

**With skill**:

```
You: "Craft a commit for these changes"
Copilot:
┌────────────────────────────────────────────┐
│ 📝 COMMIT MESSAGE                          │
├────────────────────────────────────────────┤
│                                            │
│  ✨ feat(forms): add user input validation │
│                                            │
└────────────────────────────────────────────┘
```

**The difference**: Copy-ready, conventional format, zero cleanup needed.

---

### Demo 3: Control Flow (PAUSE)

**Without control skill** (real scenario):

```
You: "Refactor the auth module to use the new API"
Copilot: [immediately starts changing 12 files]
         [stop button doesn't work]
         [now you're reviewing 400 lines of changes you didn't expect]
```

**With control skill**:

```
You: "Refactor the auth module to use the new API"
Copilot:
PLAN:
1. Update auth/client.ts - new endpoint signatures
2. Modify auth/tokens.ts - refresh logic
3. Update 3 consumers in src/api/*

⚠️ Doubts: New API returns different error format - handle?
❓ Questions: Keep backward compat or clean break?
✅ Ready: Confirm approach? (y/n)
```

**The difference**: You stay in control. AI asks before acting on ambiguity.

---

## 📌 Skills vs Instructions — The Key Difference

|                 | **Agent Skills**                      | **Copilot Instructions**             |
| --------------- | ------------------------------------- | ------------------------------------ |
| **Location**    | `~/ai-agent-skills/` (portable)             | `.github/instructions/` (repo-bound) |
| **Scope**       | Task-specific, loaded on demand       | Always on (or glob-filtered)         |
| **Content**     | Structure, examples, validation, flow | Preferences and rules only           |
| **Control**     | PLAN → PAUSE → PROCEED                | None                                 |
| **Portability** | Any AI tool                           | VS Code / GitHub only                |
| **Maintenance** | Central repo, distribute to projects  | Per-repo duplication                 |

### Mental Model

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR PROJECT                         │
├─────────────────────────────────────────────────────────┤
│  .github/instructions/     │  Skills (via extension)   │
│  ────────────────────────  │  ───────────────────────  │
│  "Use TypeScript strict"   │  "For PR review, output   │
│  "Prefer pnpm"             │   in THIS format, PAUSE   │
│  "Follow conventional      │   if > 5 files, flag      │
│   commits"                 │   security changes"       │
│                            │                           │
│  = HOW to code             │  = WHAT to do + WHEN      │
│  = Always applies          │  = On-demand, controlled  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Skills Included in This Demo

| Skill                 | Trigger Words                    | Purpose                               |
| --------------------- | -------------------------------- | ------------------------------------- |
| `00-control`          | _(always active)_                | Concise responses, PLAN→PAUSE→PROCEED |
| `01-file-anatomy`     | "anatomy", "structure breakdown" | Visual file section breakdown         |
| `02-pr-diff-analysis` | "analyze PR", "review diff"      | Risk-aware PR analysis                |
| `03-commit-craft`     | "commit message", "craft commit" | Conventional commit generator         |

---

## 🔧 How It Works (Architecture)

```
┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  ~/ai-agent-skills/    │────▶│  VSCode Extension   │────▶│  Copilot Chat    │
│  (source repo)   │     │  (delivery device)  │     │  (receives skill │
│                  │     │                     │     │   as context)    │
└──────────────────┘     └─────────────────────┘     └──────────────────┘
        │                         │
        │                         ├── User selects skill
        │                         ├── Extension prepends to chat
        │                         └── Copilot follows skill format
        │
        └── Skills maintained centrally
            Updated once, available everywhere
            No changes to .github/ required
```

---

## ❓ FAQ

**Q: Why not just add more `.github/instructions`?** A: Instructions are "always on" behavior
preferences. Skills are "when needed" task execution with control flow. Different tools for
different problems.

**Q: Can skills reference other skills?** A: The control skill (`00-control`) acts as a base layer.
Other skills inherit its principles (concise, PAUSE when complex).

**Q: What about `.github/` restrictions?** A: Skills live outside `.github/`. No PRs, no red tape.
Maintained in a central repo, delivered via extension.

**Q: Will this work with Claude / Cursor / CLI?** A: Yes. Skills are plain markdown. The YAML header
is for tooling; the content works anywhere you can paste context.

---

## 🚀 Next Steps

1. **Try the demos** — See skills in action
2. **Review skill format** — Check `skills/*.skill.md`
3. **Discuss adoption** — Central repo? Team-specific skills?
4. **Feedback** — What workflows need skills?

---

_Built to demonstrate controlled AI interaction patterns for [Org Name]._
