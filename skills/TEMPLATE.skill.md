---
name: template
description: [REQUIRED] What this skill does. When to trigger it. Include specific trigger words/phrases that should activate this skill. Be comprehensive - this is the primary mechanism for skill selection.
---

# [Skill Name]

[One-line purpose statement]

## Output Format

[Define exact output structure if skill produces formatted output]

```
[Example output template]
```

## Rules

1. [Constraint or requirement]
2. [Constraint or requirement]
3. [Constraint or requirement]

## Flow Control (if applicable)

**Simple case**: [When to act immediately]

**Complex case**: [When to PLAN → PAUSE → PROCEED]

---

<!-- 
TEMPLATE NOTES (delete when creating real skill):

1. YAML Frontmatter:
   - Only `name` and `description` fields
   - Description should include trigger words/phrases
   - No other fields needed

2. Body Guidelines:
   - Be concise - AI is smart, don't over-explain
   - Use examples over explanations
   - Define output format if consistency matters
   - Include flow control only if needed

3. File Naming:
   - Format: NN-skill-name.skill.md
   - NN = load order (00 = always first, like control)
   
4. Testing:
   - Paste into AI chat and verify behavior
   - Check output format matches spec
   - Verify trigger words activate skill
-->
