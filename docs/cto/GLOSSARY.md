# CTO Command Center - Glossary

**Quick reference for key terms and concepts**

---

## Core Concepts

### CTO Command Center
The operational excellence system for this repository, providing tools, templates, and automation to maintain alignment between code, documentation, and architectural decisions.

**Location**: `.ctocenter/` directory  
**Purpose**: Governance, documentation, and operational quality

---

## Governance Documents

### ADR (Architecture Decision Record)
A document that captures an important architectural decision along with its context and consequences.

**When to create**: Making significant technical or architectural choices  
**Format**: Markdown following ADR template  
**Naming**: `ADR-XXXX-title.md` (4-digit zero-padded number)  
**Location**: `.ctocenter/adrs/`

**Example**: ADR-0001-use-juce-dsp-for-filters.md

**Status Lifecycle**:
- **Proposed**: Under discussion
- **Accepted**: Approved and active
- **Rejected**: Considered but not accepted
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by newer ADR

**See Also**: [ADR Template](../../.ctocenter/templates/ADR.template.md)

---

### Runbook
An operational document describing how to diagnose, respond to, and resolve specific incidents or perform maintenance procedures.

**When to create**: After incidents, for recurring operations  
**Format**: Markdown following Runbook template  
**Naming**: `RUNBOOK-descriptive-name.md`  
**Location**: `.ctocenter/runbooks/`

**Key Sections**:
- Symptoms & Detection
- Diagnosis steps
- Resolution procedures
- Verification
- Prevention

**Example**: RUNBOOK-plugin-crash-on-preset-load.md

**See Also**: [Runbook Template](../../.ctocenter/templates/RUNBOOK.template.md)

---

### Playbook
A process document describing repeatable procedures, workflows, or standard operating procedures.

**When to create**: Documenting team processes, onboarding procedures  
**Format**: Markdown following Playbook template  
**Naming**: `PLAYBOOK-process-name.md`  
**Location**: `.ctocenter/playbooks/`

**Key Sections**:
- Process overview
- Prerequisites
- Step-by-step procedures
- Validation checkpoints
- Troubleshooting

**Example**: PLAYBOOK-release-process.md

**See Also**: [Playbook Template](../../.ctocenter/templates/PLAYBOOK.template.md)

---

### Post-Mortem
A retrospective document analyzing an incident, its causes, impact, and lessons learned.

**When to create**: After P0/P1 incidents, significant outages, or valuable learning experiences  
**Format**: Markdown following Post-Mortem template  
**Naming**: `POSTMORTEM-YYYY-MM-DD-incident-name.md`  
**Location**: `.ctocenter/postmortems/`

**Key Sections**:
- Executive summary
- Timeline
- Root cause analysis (5 Whys)
- Action items
- Prevention measures

**Example**: POSTMORTEM-2025-11-09-preset-crash.md

**See Also**: [Post-Mortem Template](../../.ctocenter/templates/POSTMORTEM.template.md)

---

## Drift Detection

### Drift
Misalignment between code, documentation, and architectural decisions.

**Types of Drift**:

**Documentation Drift**:
- Code changed but docs didn't update
- Missing expected documentation
- Outdated content (code newer than docs)

**API Drift**:
- New public APIs not documented
- Documented APIs no longer exist
- Signature changes not reflected

**Dependency Drift**:
- Outdated dependency versions
- Hardcoded paths in configuration
- Untracked external dependencies

**Governance Drift**:
- Missing ADRs for major decisions
- Runbooks not created after incidents
- Processes changed without documentation

**How Detected**: Automated scanning via `npm run ctocenter:scan`

---

### Drift Detection
The automated process of identifying misalignment between code and documentation.

**Command**: `npm run ctocenter:scan`  
**Script**: `.ctocenter/scripts/docs-scan.ts`  
**Output**: `.ctocenter/state/signals.json`

**Scan Frequency**:
- Before committing (developer responsibility)
- On pull requests (CI)
- Weekly (automated GitHub Action)
- On-demand (manual)

**Exit Codes**:
- `0`: No drift detected
- `1`: Drift detected (fail CI)

---

### Signals
Machine-readable indicators of repository health and alignment.

**Location**: `.ctocenter/state/signals.json`  
**Updated By**: Drift detection scan  
**Contains**:
- Drift status (boolean)
- Documentation issues
- API changes
- Dependency status
- Governance status
- Recommendations

**Format**: JSON

**Example**:
```json
{
  "drift_detected": true,
  "signals": {
    "documentation": {
      "status": "drift-detected",
      "issues": ["Missing API docs for PluginProcessor"]
    }
  }
}
```

---

## Project Structure

### Project Map
A JSON snapshot of the repository structure, APIs, and documentation.

**Location**: `.ctocenter/state/project-map.json`  
**Purpose**: Baseline for drift detection  
**Updated**: Manually when structure changes significantly  
**Format**: JSON

**Contains**:
- Repository metadata
- Directory structure
- Public APIs and their locations
- Documentation inventory
- Build configuration
- Dependencies

---

### State Files
JSON files tracking repository status and health.

**Location**: `.ctocenter/state/`  
**Files**:
- `project-map.json` - Repository structure
- `signals.json` - Drift detection results
- `ci-summary.json` - CI/CD status (optional)

**Version Control**: Yes, committed to repository  
**Update Frequency**: On-demand or automated

---

## AI Hub

### AI Hub
A collection of prompts, schemas, and examples for AI-assisted operations.

**Location**: `.ctocenter/ai/`  
**Purpose**: Leverage AI to generate tasks, runbooks, and documentation  
**Documentation**: `.ctocenter/ai/HUB.md`

**Components**:
- **Prompts**: Structured instructions for AI systems
- **Schemas**: JSON schemas for validating AI output
- **Examples**: Sample inputs and outputs

---

### Agent Brief
A system-level prompt providing AI agents with repository context.

**File**: `.ctocenter/ai/prompts/AGENT_BRIEF.system.md`  
**Usage**: Load as system context before giving AI tasks  
**Contains**:
- Repository overview
- Technology stack
- Conventions and standards
- Common patterns

---

### Task Writer
A user prompt for generating structured, actionable tasks from high-level objectives.

**File**: `.ctocenter/ai/prompts/TASK_WRITER.user.md`  
**Input**: User objective or story  
**Output**: JSON conforming to `task.spec.json`  
**Use Case**: Sprint planning, feature breakdown

---

### Runbook Automator
A user prompt for generating operational runbooks from incident descriptions.

**File**: `.ctocenter/ai/prompts/RUNBOOK_AUTOMATOR.user.md`  
**Input**: Incident details  
**Output**: Markdown runbook  
**Use Case**: Post-incident documentation

---

### Task Schema
JSON Schema defining structure for actionable tasks.

**File**: `.ctocenter/ai/schemas/task.spec.json`  
**Validation**: `npm run ctocenter:validate-task <file>`  
**Format**: JSON Schema (draft-07)

**Key Fields**:
- `id`: Unique identifier
- `title`: Actionable title
- `description`: Detailed requirements
- `priority`: P0-P3
- `estimate`: XS, S, M, L, XL
- `acceptance_criteria`: Array of criteria
- `tags`: Categorization

---

### Automation Schema
JSON Schema defining structure for automated procedures.

**File**: `.ctocenter/ai/schemas/automation.spec.json`  
**Validation**: `npm run ctocenter:validate-automation <file>`  
**Format**: JSON Schema (draft-07)

**Key Fields**:
- `name`: Automation name
- `type`: incident-response, deployment, etc.
- `trigger`: How automation starts
- `steps`: Sequential actions
- `rollback`: Rollback procedures
- `verification`: Success checks

---

## Automation Scripts

### docs-scan.ts
TypeScript script that detects drift between code and documentation.

**Location**: `.ctocenter/scripts/docs-scan.ts`  
**Command**: `npm run ctocenter:scan`  
**Output**: `.ctocenter/state/signals.json`  
**Exit Code**: 0 (no drift) or 1 (drift detected)

**What it checks**:
- Documentation completeness
- API documentation alignment
- File structure consistency
- Governance artifact presence

---

### adr-validate.ts
TypeScript script that validates ADR formatting and consistency.

**Location**: `.ctocenter/scripts/adr-validate.ts`  
**Command**: `npm run ctocenter:adr-validate`  
**Exit Code**: 0 (valid) or 1 (errors)

**Validations**:
- Sequential numbering
- Valid status values
- Required fields present
- File naming conventions
- Status transitions

---

### changelog.ts
TypeScript script that generates CHANGELOG.md from git commits.

**Location**: `.ctocenter/scripts/changelog.ts`  
**Command**: `npm run ctocenter:changelog -- <version>`  
**Output**: Updated `CHANGELOG.md`

**Format**: Conventional commits categorized by type:
- ✨ Features
- 🐛 Bug Fixes
- 📚 Documentation
- ♻️ Refactoring

---

### release-notes.ts
TypeScript script that extracts release notes for a specific version.

**Location**: `.ctocenter/scripts/release-notes.ts`  
**Command**: `npm run ctocenter:release-notes <version>`  
**Input**: `CHANGELOG.md`  
**Output**: `RELEASE_NOTES.md`

**Use Case**: GitHub release creation

---

### toc-sync.ts
TypeScript script that synchronizes table of contents in markdown files.

**Location**: `.ctocenter/scripts/toc-sync.ts`  
**Command**: `npm run ctocenter:toc-sync`  
**Marker**: `<!-- TOC -->...<!-- /TOC -->`

**Process**:
1. Finds files with TOC markers
2. Generates TOC from headings
3. Updates content between markers

---

### ci-summary.ts
TypeScript script that generates CI/CD status summaries.

**Location**: `.ctocenter/scripts/ci-summary.ts`  
**Command**: `npm run ctocenter:ci-summary`  
**Output**: `.ctocenter/state/ci-summary.json`

**Use Case**: Build status reporting

---

## CI/CD

### Validation Workflow
GitHub Actions workflow that validates changes on pull requests.

**File**: `.github/workflows/ctocenter-validate.yml`  
**Triggers**: Pull requests, pushes to main  
**Checks**:
- Drift detection
- ADR validation
- Structure validation
- Comments on PRs with results

---

### Weekly Drift Workflow
GitHub Actions workflow that runs weekly drift detection.

**File**: `.github/workflows/ctocenter-weekly-drift.yml`  
**Schedule**: Every Monday at 9:00 AM UTC  
**Actions**:
- Run drift scan
- Create/update drift issue
- Provide actionable checklist

---

### Release Workflow
GitHub Actions workflow that automates release process.

**File**: `.github/workflows/ctocenter-release.yml`  
**Trigger**: Version tags (v*.*.*)  
**Steps**:
- Generate changelog
- Generate release notes
- Validate release
- Create GitHub release
- Update documentation

---

## Priority Levels

### P0 (Critical)
- Blockers preventing work
- Production crashes
- Security vulnerabilities
- Data loss risks

**Response Time**: Immediate  
**Example**: Plugin crashes DAW

---

### P1 (High)
- Important features
- Major bugs affecting core functionality
- Significant performance issues

**Response Time**: Within 1 business day  
**Example**: Audio glitches in processing

---

### P2 (Medium)
- Enhancements
- Minor bugs
- Usability improvements
- Documentation gaps

**Response Time**: Within 1 week  
**Example**: Missing parameter tooltips

---

### P3 (Low)
- Nice-to-have features
- Minor polish
- Code cleanup
- Future improvements

**Response Time**: As capacity allows  
**Example**: Add Easter egg

---

## Estimation Sizes

### XS (Extra Small)
**Time**: <2 hours  
**Examples**: Simple bug fixes, minor doc updates, small UI tweaks

---

### S (Small)
**Time**: 2-4 hours  
**Examples**: Small features, localized fixes, focused refactoring

---

### M (Medium)
**Time**: 1-2 days  
**Examples**: Moderate features, cross-component changes, test suites

---

### L (Large)
**Time**: 3-5 days  
**Examples**: Complex features, architectural changes, major refactoring

---

### XL (Extra Large)
**Time**: >5 days  
**Action**: Should be broken down into smaller tasks  
**Examples**: Major systems, new modules (break into M/L tasks)

---

## Common Abbreviations

| Abbreviation | Full Term | Meaning |
|--------------|-----------|---------|
| ADR | Architecture Decision Record | Documented architectural choice |
| API | Application Programming Interface | Public code interface |
| CI/CD | Continuous Integration/Deployment | Automated build and release |
| DAW | Digital Audio Workstation | Music production software |
| DSP | Digital Signal Processing | Audio processing algorithms |
| GUI | Graphical User Interface | Visual interface |
| PM | Post-Mortem | Incident analysis document |
| PR | Pull Request | Code review request |
| TOC | Table of Contents | Document navigation |
| VST | Virtual Studio Technology | Plugin standard |

---

## File Extensions

| Extension | Type | Purpose |
|-----------|------|---------|
| `.md` | Markdown | Documentation files |
| `.json` | JSON | Data, configuration, schemas |
| `.ts` | TypeScript | Automation scripts |
| `.yml`/`.yaml` | YAML | GitHub Actions workflows |
| `.h` | C++ Header | Public API declarations |
| `.cpp` | C++ Source | Implementation files |

---

## Related Terms

### Alignment
State where code, documentation, and architectural decisions are consistent and up-to-date. Opposite of drift.

### Governance
Structured approach to decision-making, documentation, and process management.

### Idempotency
Property where running an operation multiple times produces the same result. Important for automation scripts.

### Operational Excellence
Culture and practice of maintaining high-quality operations through documentation, automation, and continuous improvement.

### Technical Debt
Accumulated shortcuts, missing documentation, or suboptimal decisions that require future work to address.

---

## Quick Reference

**Documentation Types**:
- ADR: Architectural decisions
- Runbook: Operational procedures
- Playbook: Process documentation
- Post-Mortem: Incident analysis

**Commands**:
- Scan: `npm run ctocenter:scan`
- Validate ADRs: `npm run ctocenter:adr-validate`
- Changelog: `npm run ctocenter:changelog`
- Release Notes: `npm run ctocenter:release-notes`

**Priorities**: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

**Estimates**: XS (<2h) → S (2-4h) → M (1-2d) → L (3-5d) → XL (>5d)

---

**See Also**:
- [USAGE.md](./USAGE.md) - Complete usage guide
- [QUICKSTART.md](./QUICKSTART.md) - Fast-track guide
- [ROLES.md](./ROLES.md) - Team responsibilities
