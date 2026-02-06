# AI Skills System — Roadmap

> A cross-platform AI agenta skills system for GitHub Copilot, Claude Code CLI, Cursor IDE, etc..

---

## Current State (v0.2)

### ✅ Completed

| Feature                                                  | Status  | Notes                                 |
|----------------------------------------------------------|---------|---------------------------------------|
| Skills format (YAML frontmatter + markdown)              | ✅ Done | Portable across all AI tools          |
| Control skill (PLAN→PAUSE→PROCEED)                      | ✅ Done | Conditional complexity handling       |
| Demo agenta skills (file-anatomy, pr-diff, commit-craft) | ✅ Done | Clear visual output differentiation   |
| VSCode extension — Compose mode                          | ✅ Done | `Cmd+Alt+A` pre-fills Copilot chat    |
| VSCode extension — Native sync                           | ✅ Done | Symlinks to Copilot prompts dir       |
| `isPartialQuery: true` discovery                         | ✅ Done | Pre-fill without auto-send            |

### 📁 Project Structure

```
~/ai-agent-skills/
├── README.md
├── skills/
│   ├── 00-control.skill.md       # Base behavior (auto-included)
│   ├── 01-file-anatomy.skill.md  # Visual file breakdown
│   ├── 02-pr-diff-analysis.skill.md
│   ├── 03-commit-craft.skill.md
│   ├── 04-demo.skill.md          # Full workflow
│   └── TEMPLATE.skill.md
├── demo/
│   └── DEMO.md                   # Demo guide
├── docs/
│   └── ROADMAP.md                # This file
└── ai-agent-skills-loader/       # VSCode extension
    ├── src/extension.ts
    ├── package.json
    └── README.md
```

---

## Copilot Integration Deep Dive

### How `/slash-commands` Work

```
User types: /file-anatomy useAuth.ts
            └────┬──────┘ └────┬────┘
                 │             │
                 │             └── Argument (input to skill)
                 │
                 └── Command (looks up .prompt.md file)
```

**Prompt files location:**

| OS      | Path                                                |
|---------|-----------------------------------------------------|
| macOS   | `~/Library/Application Support/Code/User/prompts/` |
| Windows | `%APPDATA%\Code\User\prompts`                       |
| Linux   | `~/.config/Code/User/prompts`                       |

### `/command` vs `@participant`

| Aspect         | `/command`                     | `@participant`                  |
|----------------|--------------------------------|---------------------------------|
| What it is     | Prompt injected into context   | Agent that handles message      |
| Who responds   | Current participant (Copilot)  | Routes to different handler     |
| Can we create? | ✅ Yes — `.prompt.md` files    | ❌ Requires proposed APIs       |
| Our approach   | **Native sync**                | Future (when APIs stabilize)    |

---

## Short-Term Roadmap (Next 2-4 weeks)

### 🎯 Priority 1: Demo Polish

| Task                            | Purpose                             | Status      |
|---------------------------------|-------------------------------------|-------------|
| Test `isPartialQuery` behavior  | Confirm pre-fill works consistently | ⏳ Testing  |
| Refine skill output formats     | Ensure visual differentiation       | ⏳ Iterate  |
| Create demo script/flow         | Stakeholder presentation            | 📋 Planned |
| Document Skills vs Instructions | Clear comparison for org            | 📋 Planned |

### 🎯 Priority 2: Native Integration

| Task                           | Purpose                           | Status      |
|--------------------------------|-----------------------------------|-------------|
| Test `/skill-name` after sync  | Verify native slash-commands work | ⏳ Testing  |
| Add `argument-hint` to skills  | Better UX in Copilot              | 📋 Planned |
| Auto-sync on skill file change | File watcher in extension         | 📋 Planned |

---

## Medium-Term Roadmap (1-3 months)

### 🔧 Extension Enhancements

| Feature               | Description                          | Complexity |
|-----------------------|--------------------------------------|------------|
| Skill browser sidebar | TreeView showing all skills          | Medium     |
| Skill preview         | Webview panel with formatted preview | Medium     |
| Quick-create skill    | Template scaffolding command         | Low        |
| Sync status indicator | Status bar showing sync state        | Low        |

### 📦 Skills Library Expansion

| Skill           | Purpose                   | Priority |
|-----------------|---------------------------|----------|
| `code-review`   | PR review with checklist  | High     |
| `refactor-plan` | Safe refactoring steps    | High     |
| `test-cases`    | Generate test scenarios   | Medium   |
| `doc-gen`       | Documentation generation  | Medium   |
| `debug-assist`  | Systematic debugging flow | Medium   |

### 🔗 Cross-Platform Parity

| Platform         | Current                    | Target             |
|------------------|----------------------------|--------------------|
| GitHub Copilot   | ✅ Extension + native sync | Seamless           |
| Claude Code CLI  | 🟡 Manual copy             | Auto-detect & load |
| Cursor IDE       | 🟡 Manual copy             | Rules integration  |

---

## Long-Term Roadmap (3-6 months)

### 🚀 Advanced Features

| Feature               | Description                         | Dependencies                 |
|-----------------------|-------------------------------------|------------------------------|
| `@skills` participant | Native chat participant             | `chatAgents` API (proposed)  |
| Skill chaining        | `file-anatomy` → `commit-craft`     | `handoffs` support           |
| Tool integration      | Skills that use Copilot tools       | `languageModelToolsForAgent` |
| MCP integration       | Skills as MCP resources             | `mcpConfigurationProvider`   |

### 📡 API Watch List

Monitor these VSCode proposed APIs for graduation to stable:

| API                           | What It Enables                 | Status                    |
|-------------------------------|---------------------------------|---------------------------|
| `chatPromptFiles`             | Native prompt file registration | Internal (Microsoft only) |
| `chatAgents`                  | Register custom `@participant`  | Proposed                  |
| `defaultChatParticipant`      | Become default chat handler     | Proposed                  |
| `languageModelToolsForAgent`  | Provide tools to LLM agents     | Proposed                  |
| `mcpConfigurationProvider`    | MCP server configuration        | Proposed                  |

**Where to monitor:**
- [VSCode Release Notes](https://code.visualstudio.com/updates)
- [VSCode Proposed APIs](https://github.com/microsoft/vscode/tree/main/src/vscode-dts)

---

## Architecture Vision

### Current (v0.2)

```
┌─────────────────┐
│  ~/ai-skills/   │
│    skills/      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────────┐
│Compose │  │ Native Sync      │
│ Mode   │  │ (symlink)        │
└───┬────┘  └────────┬─────────┘
    │                │
    ▼                ▼
┌────────────────────────────────┐
│         Copilot Chat           │
│  (pre-fill)  OR  (/command)    │
└────────────────────────────────┘
```

### Future (v1.0+)

```
┌─────────────────┐
│  ~/ai-skills/   │
│    skills/      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│        AI Skills Extension          │
├─────────────────────────────────────┤
│ • @skills participant               │
│ • /slash-command registration       │
│ • Skill chaining & handoffs         │
│ • Tool integration                  │
│ • MCP bridge                        │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌────────┐  ┌──────────┐  ┌──────────┐
│Copilot │  │ Claude   │  │ Cursor   │
│ Chat   │  │ Code CLI │  │  IDE     │
└────────┘  └──────────┘  └──────────┘
```

---

## Key Discoveries (Reference)

### From Copilot Extension Analysis

| Discovery              | File/Location                            | Implication                      |
|------------------------|------------------------------------------|----------------------------------|
| `isPartialQuery: true` | `extension.js`                           | Pre-fill chat without auto-send  |
| `.agent.md` format     | `assets/agents/Plan.agent.md`            | YAML frontmatter + tools + handoffs |
| `.prompt.md` format    | `assets/prompts/savePrompt.prompt.md`    | Native prompt registration       |
| `argument-hint` field  | YAML frontmatter                         | Placeholder text for arguments   |

### From Promptitude Extension Analysis

| Discovery                | Implication                         |
|--------------------------|-------------------------------------|
| Syncs to `User/prompts/` | Native Copilot integration path     |
| Symlink approach         | Clean separation of source & deployed |
| YAML frontmatter parsing | Same format as our skills           |

---

## Success Metrics

### Demo Success

- [ ] Stakeholders understand Skills vs Instructions distinction
- [ ] Clear visual difference in skill outputs
- [ ] Smooth workflow demonstration

### Adoption Metrics

- [ ] Skills used daily by team members
- [ ] New skills contributed by others
- [ ] Reduced time on repetitive tasks

### Technical Metrics

- [ ] Native `/command` working reliably
- [ ] Cross-platform parity achieved
- [ ] Extension published internally

---

## Next Actions

1. **Immediate:** Test native sync (`AI Skills: Sync to Copilot`)
2. **This week:** Refine demo flow and stakeholder presentation
3. **Next sprint:** Add `argument-hint` to skill frontmatter
4. **Ongoing:** Monitor VSCode API proposals monthly

---

*Last updated: February 2026*
