# AI Skills

> Cross-platform AI skills system for Claude Code CLI, Cursor IDE, and GitHub Copilot.

---

## Quick Start

```bash
# 1. Copy skills to home directory
mkdir -p ~/ai-skills
cp -r skills ~/ai-skills/

# 2. Install VSCode extension
cd ai-skills-loader
npm install && npm run compile && npm run package
code --install-extension ai-skills-loader-0.2.0.vsix

# 3. Use
# Option A: Cmd+Alt+A → Select skill → Add context → Send
# Option B: Command Palette → "AI Skills: Sync to Copilot" → Use /skill-name
```

---

## Skills vs Instructions

| Aspect | **Skills** | **Instructions** |
|--------|-----------|------------------|
| **Purpose** | Task-specific workflows with defined outputs | Global coding preferences |
| **Activation** | Explicit — user invokes `/skill-name` | Implicit — always active |
| **Scope** | Single task | All conversations |
| **Output** | Structured, visually distinct | Natural, contextual |
| **Examples** | `/file-anatomy`, `/demo`, `/commit-craft` | "Use TypeScript", "Prefer functional" |
| **Location** | `~/ai-skills/skills/*.skill.md` | `.github/copilot-instructions.md` |

### When to Use Each

**Use Skills when:**
- Task has a repeatable structure
- Output format should be consistent
- Workflow has defined phases/steps
- You want visual confirmation skill is active

**Use Instructions when:**
- Preference applies to ALL coding tasks
- No specific output format needed
- Style/convention guidance
- Project-wide context

### Example Comparison

**Instruction:** "Follow conventional commits format"
→ Applied to every commit message, quietly

**Skill:** `/commit-craft`
→ Explicitly invoked, guides through type/scope/description, shows structured output

---

## Project Structure

```
~/ai-skills/
├── README.md                 # This file
├── skills/
│   ├── 00-control.skill.md   # Base behavior (auto-included)
│   ├── 01-file-anatomy.skill.md
│   ├── 02-pr-diff-analysis.skill.md
│   ├── 03-commit-craft.skill.md
│   ├── 04-demo.skill.md      # Full dev workflow
│   └── TEMPLATE.skill.md
├── demo/
│   └── DEMO.md               # Demo guide
├── docs/
│   └── ROADMAP.md            # Project roadmap
└── ai-skills-loader/         # VSCode extension
    ├── src/extension.ts
    ├── package.json
    └── README.md
```

---

## Skill Format

```markdown
---
name: skill-name
description: What it does. Triggers on "keyword", "phrase".
argument-hint: Expected input (shown as placeholder)
---

# Skill Title

Instructions for the AI...

## Output Format
Expected structure...

## Rules
1. Rule one
2. Rule two
```

---

## Available Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Control | (auto) | Base behavior, PLAN→PAUSE→PROCEED |
| File Anatomy | `/file-anatomy` | Visual file structure breakdown |
| PR Diff Analysis | `/pr-diff-analysis` | Structured PR review |
| Commit Craft | `/commit-craft` | Conventional commit guidance |
| Demo | `/demo` | Full dev workflow with docs |

---

## Documentation

- [Extension README](./ai-skills-loader/README.md) — Installation, commands, config
- [Demo Guide](./demo/DEMO.md) — How to run the demo
- [Roadmap](./docs/ROADMAP.md) — Project plans and discoveries

---

## Platform Support

| Platform | Status | Method |
|----------|--------|--------|
| GitHub Copilot | ✅ Ready | Extension + native sync |
| Claude Code CLI | 🟡 Manual | Copy to project |
| Cursor IDE | 🟡 Manual | Copy to rules |
