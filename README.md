# 🤖 AI Agent Skills

Portable, task-specific AI behavior controls.

> **Demo?** See [DEMO.README.md](./docs/DEMO.README.md)

---

## Quick Start

```bash
# Clone
git clone [repo-url] ~/ai-agent-skills

# Skills live in /skills
ls skills/
# 00-control.skill.md
# 01-file-anatomy.skill.md
# 02-pr-diff-analysis.skill.md
# 03-commit-craft.skill.md
```

---

## Skill Format

```markdown
---
name: skill-name
description: What it does. When to use it. Trigger words.
---

# Skill Title

[Instructions for AI]
```

- **YAML header**: Required. `name` and `description` only.
- **Body**: Markdown instructions, examples, output formats.
- **File naming**: `NN-skill-name.skill.md` (numbered for load order)

---

## Skills Index

| #  | Skill            | Purpose                                        |
| -- | ---------------- | ---------------------------------------------- |
| 00 | control          | Base layer: concise output, PLAN→PAUSE→PROCEED |
| 01 | file-anatomy     | Visual file structure breakdown                |
| 02 | pr-diff-analysis | Risk-aware PR review                           |
| 03 | commit-craft     | Conventional commit generator                  |

---

## Adding a Skill

1. Create `skills/NN-skill-name.skill.md`
2. Add YAML frontmatter (`name`, `description`)
3. Write instructions in markdown body
4. Test via extension or direct paste

---

## Architecture

```
~/ai-agent-skills/           ← This repo (central, portable)
├── skills/            ← Skill definitions
├── README.md          ← You are here
└── DEMO.README.md     ← Stakeholder demo

VSCode Extension       ← Delivery mechanism (separate repo)
└── Reads ~/ai-agent-skills/
└── Injects into Copilot Chat
```

---

## License

Internal use. [Org Name].
