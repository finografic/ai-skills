# AI Skills Loader

VSCode extension to load AI skills into GitHub Copilot Chat with native sync support.

## Features

### 🎯 Skill Loading (Compose Mode)

| Keybinding  | Command                 | Description                                  |
| ----------- | ----------------------- | -------------------------------------------- |
| `Cmd+Alt+S` | Load Skill to Clipboard | Copy skill to clipboard                      |
| `Cmd+Alt+A` | Load & Open Copilot     | Pre-fill skill in chat, ready to add context |

### 🔄 Native Copilot Sync

Sync skills to Copilot's prompts directory for native `/slash-command` access:

| Command                                  | Description                           |
| ---------------------------------------- | ------------------------------------- |
| `AI Skills: Sync to Copilot (Native)`    | Symlink skills to Copilot prompts dir |
| `AI Skills: Remove from Copilot`         | Remove synced skills                  |
| `AI Skills: Show Sync Status`            | Check which skills are synced         |
| `AI Skills: Open Copilot Prompts Folder` | Open the native prompts directory     |

## Two Modes of Operation

### Mode 1: Compose (Recommended for Demo)

Best for showing skill value and adding custom context.

```
Cmd+Alt+A → Select skill → Chat opens with skill pre-filled → Add context → Send
```

**Clean output format:**

```markdown
**⚡ file-anatomy**

# File Anatomy Skill

Display file contents in clearly marked sections.
...

---

_Be concise. Simple tasks → act immediately. Complex tasks → PLAN → PAUSE → PROCEED._
```

### Mode 2: Native (Zero-Click Daily Use)

Best for frequently-used skills.

```
Run "Sync to Copilot" → Skills become /slash-commands → Use in any chat
```

After sync, type `/file-anatomy` directly in Copilot Chat!

## Copilot Prompts Directory

| OS          | Path                                               |
| ----------- | -------------------------------------------------- |
| **macOS**   | `~/Library/Application Support/Code/User/prompts/` |
| **Windows** | `%APPDATA%\Code\User\prompts`                      |
| **Linux**   | `~/.config/Code/User/prompts`                      |

## Configuration

```json
{
  "ai-skills.skillsPath": "~/ai-skills/skills",
  "ai-skills.alwaysIncludeControl": true
}
```

## Skill Format

Skills are `*.skill.md` files with YAML frontmatter:

```markdown
---
name: my-skill
description: What this skill does and when to trigger it
---

# Skill Content

Instructions for the AI...
```

## Installation

```bash
cd ai-skills-loader
npm install
npm run compile
npm run package
code --install-extension ai-skills-loader-0.2.0.vsix
```
