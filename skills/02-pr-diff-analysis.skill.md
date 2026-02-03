---
name: pr-diff-analysis
description: Analyze pull request diffs for risks, patterns, and review focus areas. Triggers on "analyze PR", "review diff", "PR review", "what changed". Uses PAUSE flow for larger PRs.
---

# PR Diff Analysis Skill

Analyze PR changes systematically.

## Output Format

```
══════════════════════════════════════════════
🔍 PR ANALYSIS: {branch or PR title}
══════════════════════════════════════════════

📊 CHANGE SUMMARY
├── Files changed: {N}
├── Additions: +{X}
├── Deletions: -{Y}
└── Net change: {±Z}

⚠️ RISK AREAS
{List files/changes that need careful review}

🎯 REVIEW FOCUS
{Ordered list of what to review first and why}

💡 PATTERNS DETECTED
{Any notable patterns: refactors, new dependencies, etc.}

══════════════════════════════════════════════
```

## Flow Control

**Small PR** (< 5 files, < 100 lines): Output analysis directly

**Large PR** (5+ files OR 100+ lines):
1. Output CHANGE SUMMARY only
2. PAUSE: "Large PR detected. Focus on specific area? Or full analysis?"
3. PROCEED based on response

## Rules

1. Flag any changes to: auth, payments, security, DB schemas
2. Note new dependencies added
3. Identify breaking changes
4. Keep risk assessments factual, not alarmist
