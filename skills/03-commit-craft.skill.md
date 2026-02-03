---
name: commit-craft
description: Generate conventional commit messages with scope detection and emoji prefixes. Triggers on "commit message", "craft commit", "what should I commit". Produces standardized, copy-ready output.
---

# Commit Craft Skill

Generate conventional commits with consistent format.

## Output Format

Always output in this exact, copy-ready block:

```
┌────────────────────────────────────────────┐
│ 📝 COMMIT MESSAGE                          │
├────────────────────────────────────────────┤
│                                            │
│  {emoji} {type}({scope}): {description}    │
│                                            │
│  {body - if needed, max 2 lines}           │
│                                            │
└────────────────────────────────────────────┘
```

## Type → Emoji Map

| Type     | Emoji | Use for                    |
|----------|-------|----------------------------|
| feat     | ✨    | New feature                |
| fix      | 🐛    | Bug fix                    |
| docs     | 📚    | Documentation              |
| style    | 💄    | Formatting, no code change |
| refactor | ♻️    | Code restructure           |
| test     | 🧪    | Adding tests               |
| chore    | 🔧    | Tooling, config            |
| perf     | ⚡    | Performance                |
| ci       | 🚀    | CI/CD changes              |

## Scope Detection

Infer scope from files changed:
- `src/components/*` → `ui`
- `src/api/*` → `api`
- `src/utils/*` → `utils`
- `*.config.*` → `config`
- `package.json` → `deps`
- Multiple areas → omit scope or use `core`

## Rules

1. Description: imperative, lowercase, no period, < 50 chars
2. Body: only if change needs context
3. Never include file lists in commit message
4. One logical change = one commit suggestion
