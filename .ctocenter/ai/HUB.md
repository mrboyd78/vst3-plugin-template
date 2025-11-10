# AI Command Hub

**Version**: 1.0  
**Last Updated**: 2025-11-09  
**Status**: Active

---

## Overview

The **AI Command Hub** is a structured interface for leveraging AI agents to:
- Generate machine-actionable tasks
- Automate incident response
- Create operational runbooks
- Maintain documentation alignment
- Enforce architectural governance

This hub provides prompts, schemas, and examples that enable AI systems (like GitHub Copilot, ChatGPT, or custom agents) to produce consistent, high-quality outputs aligned with your operational standards.

---

## Purpose

**Primary Goals**:
1. **Task Generation**: Convert strategic objectives into actionable technical tasks
2. **Runbook Automation**: Generate step-by-step operational procedures
3. **Drift Detection**: Identify misalignment between code, docs, and architecture
4. **Compliance**: Ensure all outputs meet organizational standards

**Value Proposition**:
- Reduce time from idea to implementation
- Standardize operational procedures
- Maintain high documentation quality
- Enable rapid incident response

---

## How It Works

### 1. Choose Your Use Case

| Use Case | Prompt File | Output Schema | Example |
|----------|-------------|---------------|---------|
| Generate tasks from requirements | `TASK_WRITER.user.md` | `task.spec.json` | `example-task.json` |
| Create incident runbooks | `RUNBOOK_AUTOMATOR.user.md` | `automation.spec.json` | `example-automation.json` |
| Brief agents on project context | `AGENT_BRIEF.system.md` | N/A | N/A |

### 2. Load the Appropriate Prompt

**System Prompt** (for agent context):
```
Location: .ctocenter/ai/prompts/AGENT_BRIEF.system.md
Use: Set as system context for AI agent
Purpose: Provides repository structure and conventions
```

**User Prompts** (for specific tasks):
```
Location: .ctocenter/ai/prompts/[PROMPT_NAME].user.md
Use: Send as user message to AI agent
Purpose: Request specific output (task, runbook, etc.)
```

### 3. Validate Against Schema

All AI-generated outputs should conform to the JSON schemas:

```bash
# Validate task output
npm run ctocenter:validate-task output.json

# Validate automation output  
npm run ctocenter:validate-automation output.json
```

**Schema Locations**:
- Tasks: `.ctocenter/ai/schemas/task.spec.json`
- Automations: `.ctocenter/ai/schemas/automation.spec.json`

### 4. Execute or Store Output

**For tasks**:
```bash
# Save to task queue
cp generated-task.json .ctocenter/tasks/$(date +%Y%m%d-%H%M%S)-task.json

# Execute directly (if automation ready)
npm run ctocenter:execute-task generated-task.json
```

**For runbooks**:
```bash
# Save to runbooks directory
cp generated-runbook.md .ctocenter/runbooks/RUNBOOK-$(date +%Y%m%d).md

# Link from main docs
# (manual or automated via toc-sync.ts)
```

---

## Usage Patterns

### Pattern 1: Strategic to Tactical

**Scenario**: CTO provides high-level objective

**Workflow**:
1. Load `AGENT_BRIEF.system.md` as system context
2. Use `TASK_WRITER.user.md` with objective inserted
3. AI generates structured tasks in `task.spec.json` format
4. Review and approve tasks
5. Feed tasks back to developer agents or CI/CD

**Example**:
```
Input: "Improve build performance"
Output: 5 tasks with priorities, estimates, and acceptance criteria
Action: Tasks assigned to sprint backlog
```

---

### Pattern 2: Incident to Runbook

**Scenario**: Production incident occurs

**Workflow**:
1. Document incident details
2. Use `RUNBOOK_AUTOMATOR.user.md` with incident context
3. AI generates runbook with diagnosis and resolution steps
4. Team reviews and validates
5. Runbook saved for future incidents

**Example**:
```
Input: "Database connection pool exhaustion"
Output: Complete runbook with symptoms, diagnosis, resolution
Action: Saved as RUNBOOK-db-pool-exhaustion.md
```

---

### Pattern 3: Continuous Alignment

**Scenario**: Weekly drift check

**Workflow**:
1. Run `npm run ctocenter:scan`
2. Review drift report
3. Use AI to generate remediation tasks
4. Execute tasks to restore alignment
5. Update project-map.json

**Example**:
```
Input: Drift report shows 3 undocumented APIs
Output: 3 tasks to add documentation
Action: Documentation PRs created
```

---

## Prompt Library

### Available Prompts

| Prompt | Purpose | Input Required | Output Format |
|--------|---------|----------------|---------------|
| `AGENT_BRIEF.system.md` | Project context for any AI agent | None (system-level) | N/A |
| `TASK_WRITER.user.md` | Convert requirements to tasks | User objective/story | JSON (task.spec.json) |
| `RUNBOOK_AUTOMATOR.user.md` | Generate operational runbooks | Incident/scenario details | Markdown + JSON |

### Creating Custom Prompts

To add a new prompt:

1. **Create prompt file**: `.ctocenter/ai/prompts/YOUR_PROMPT.user.md`
2. **Define schema** (if structured output): `.ctocenter/ai/schemas/your-output.spec.json`
3. **Add example**: `.ctocenter/ai/examples/example-your-output.json`
4. **Document here**: Update this section

**Template**:
```markdown
# Prompt: [Name]

## Context
[What this prompt does]

## Input Format
[What user must provide]

## Output Format
[Expected structure]

## Example
[Sample input → output]
```

---

## Schema Reference

### Task Schema (`task.spec.json`)

Defines structure for actionable tasks:
```json
{
  "id": "string (unique)",
  "title": "string",
  "description": "string",
  "priority": "P0|P1|P2|P3",
  "estimate": "string (e.g., '2h', '3d')",
  "dependencies": ["task-id"],
  "acceptance_criteria": ["string"],
  "tags": ["string"]
}
```

### Automation Schema (`automation.spec.json`)

Defines structure for automated procedures:
```json
{
  "name": "string",
  "trigger": "string",
  "steps": [
    {
      "action": "string",
      "command": "string",
      "validation": "string"
    }
  ],
  "rollback": ["string"]
}
```

---

## Examples

### Example 1: Generate Sprint Tasks

**Input**:
```
Objective: Add parameter validation to plugin
Context: C++ VST3 plugin using JUCE
Requirements: Validate range, type, thread-safety
```

**Command**:
```bash
# Using GitHub Copilot CLI or ChatGPT with prompt
cat .ctocenter/ai/prompts/TASK_WRITER.user.md | \
  sed 's/{{OBJECTIVE}}/Add parameter validation/' | \
  copilot-agent
```

**Output**: `example-task.json` with 3-5 structured tasks

---

### Example 2: Create Runbook from Incident

**Input**:
```
Incident: Plugin crash on preset load
Symptoms: Segmentation fault, stack trace shows null pointer
Resolution: Added null check before dereferencing
```

**Command**:
```bash
cat .ctocenter/ai/prompts/RUNBOOK_AUTOMATOR.user.md | \
  sed 's/{{INCIDENT}}/Plugin crash on preset load/' | \
  copilot-agent
```

**Output**: Runbook markdown with detection, diagnosis, and fix steps

---

## Integration with CTO Command Center

The AI Hub is integrated with other Command Center components:

### Drift Detection → Task Generation
```bash
# Detect drift
npm run ctocenter:scan

# Generate tasks to fix drift (manual or via AI)
cat .ctocenter/state/signals.json | \
  jq '.signals.documentation.issues' | \
  # Feed to TASK_WRITER prompt
```

### ADR → Runbook Generation
```bash
# After ADR acceptance, generate implementation runbook
cat docs/adr/ADR-001.md | \
  # Feed to RUNBOOK_AUTOMATOR
  # Output: Implementation guide
```

### Release → Summary Generation
```bash
# Generate release notes from changelog
npm run ctocenter:release-notes
# Uses AI to enhance commit messages
```

---

## Best Practices

### ✅ Do

- **Always validate** AI outputs against schemas
- **Review before execution** - AI is augmentation, not replacement
- **Iterate prompts** - Refine based on output quality
- **Version control** - Keep prompts in git
- **Share learnings** - Update examples with good outputs

### ❌ Don't

- **Don't execute blindly** - Always review AI-generated commands
- **Don't skip validation** - Use schema checks
- **Don't ignore context** - Load AGENT_BRIEF.system.md
- **Don't over-automate** - Some tasks need human judgment
- **Don't commit secrets** - Sanitize AI outputs before storage

---

## Troubleshooting

### Issue: AI generates invalid JSON

**Cause**: Prompt doesn't specify schema clearly

**Solution**: 
```bash
# Include schema in prompt
cat .ctocenter/ai/schemas/task.spec.json | \
  jq -c '.' | \
  # Append to prompt
```

---

### Issue: Output doesn't match project conventions

**Cause**: Missing system context

**Solution**: Always load `AGENT_BRIEF.system.md` first

---

### Issue: Tasks too vague or too granular

**Cause**: Prompt lacks specificity on scope

**Solution**: Update `TASK_WRITER.user.md` with examples of desired granularity

---

## Extending the Hub

### Add New Schemas

1. Create schema file: `.ctocenter/ai/schemas/new-schema.spec.json`
2. Add JSON Schema definition
3. Create validator script: `.ctocenter/scripts/validate-new-schema.ts`
4. Update package.json: Add validation command
5. Document in this file

### Add New Prompts

1. Identify use case gap
2. Draft prompt in `.ctocenter/ai/prompts/`
3. Test with multiple AI models
4. Create examples
5. Add to prompt library above

### Integrate New AI Models

This hub is model-agnostic. To use with a new AI system:

1. Ensure it supports system + user prompt pattern
2. Implement output parser for your schema
3. Add model-specific tips to this section
4. Test with example inputs

---

## Metrics & Monitoring

Track AI Hub effectiveness:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Task generation time | <5 min | Manual tracking |
| AI output accuracy | >80% valid | Schema validation pass rate |
| Runbook quality | Human reviewed | Post-incident feedback |
| Adoption rate | Team usage | Git commit frequency in ai/ dir |

---

## Maintenance

### Weekly
- [ ] Review new examples submitted by team
- [ ] Update prompts based on output quality
- [ ] Check schema validation pass rates

### Monthly
- [ ] Archive outdated prompts
- [ ] Review and update best practices
- [ ] Analyze metrics and adjust

### Quarterly
- [ ] Major prompt library review
- [ ] Consider new use cases
- [ ] Update integration patterns

---

## Support & Feedback

**Questions**: Open issue with tag `ai-hub`

**Suggestions**: PR to `.ctocenter/ai/` with proposed changes

**Bug reports**: Include prompt, input, output, and expected behavior

---

## Related Documentation

- [USAGE.md](../../docs/cto/USAGE.md) - How to use the entire Command Center
- [QUICKSTART.md](../../docs/cto/QUICKSTART.md) - Quick start guide
- [ADR Templates](../templates/ADR.template.md) - Architecture Decision Records
- [Runbook Templates](../templates/RUNBOOK.template.md) - Operational runbooks

---

**Next Steps**:
1. Review example prompts in `prompts/`
2. Study example outputs in `examples/`
3. Try generating your first task with `TASK_WRITER.user.md`
4. Join the team channel for AI Hub discussions

---

**Tags**: #ai-hub #automation #prompts #operational-excellence
