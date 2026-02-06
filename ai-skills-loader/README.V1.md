# AI Skills Loader

VSCode extension to load AI skills into Copilot Chat.

## Usage

1. **Ctrl+Alt+S** — Select skill, copy to clipboard
2. **Ctrl+Alt+A** — Select skill, copy to clipboard, open Copilot Chat
3. Paste into chat (Cmd+V / Ctrl+V)
4. Add your prompt after the skill content

## How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ ~/ai-skills/ │────▶│  Extension   │────▶│ Copilot Chat │
│   skills/    │     │  (QuickPick) │     │  (via paste) │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. Extension scans `~/ai-skills/skills/` for `*.skill.md` files
2. QuickPick shows available skills (name + description)
3. On select: prepends control skill + selected skill
4. Copies to clipboard, user pastes into Copilot Chat

## Configuration

| Setting                          | Default              | Description                   |
| -------------------------------- | -------------------- | ----------------------------- |
| `ai-skills.skillsPath`           | `~/ai-skills/skills` | Path to skills directory      |
| `ai-skills.alwaysIncludeControl` | `true`               | Auto-prepend 00-control skill |

## Install (Dev)

```bash
cd ai-skills-loader
npm install
npm run compile
# Press F5 in VSCode to launch Extension Development Host
```

## Install (VSIX)

```bash
npm run package
code --install-extension ai-skills-loader-0.1.0.vsix
```

## Skills Format

Skills must be `*.skill.md` files with YAML frontmatter:

```markdown
---
name: skill-name
description: What it does and when to use it
---

# Skill content here
```
