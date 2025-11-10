# CTO Command Center

**Operational Excellence for VST3 Plugin Template**

Version: 1.0  
Status: Active  
Last Updated: 2025-11-09

---

## What is This?

The CTO Command Center is an **operational excellence system** that helps maintain alignment between code, documentation, and architectural decisions.

Think of it as your **quality control hub** that:
- 🔍 Detects when docs drift from code
- 📋 Provides templates for decisions and processes
- 🤖 Enables AI-assisted task and runbook generation
- ✅ Automates validation in CI/CD
- 📊 Tracks project health over time

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run your first scan
npm run ctocenter:scan

# 3. Read the guide
cat docs/cto/QUICKSTART.md
```

**Full guide**: [docs/cto/USAGE.md](../docs/cto/USAGE.md)

---

## Directory Structure

```
.ctocenter/
├── README.md                   # This file
│
├── state/                      # Current state tracking
│   ├── project-map.json       # Repository structure snapshot
│   └── signals.json           # Drift detection results
│
├── templates/                  # Document templates
│   ├── ADR.template.md        # Architecture Decision Record
│   ├── RUNBOOK.template.md    # Operational runbook
│   ├── PLAYBOOK.template.md   # Process playbook
│   └── POSTMORTEM.template.md # Incident post-mortem
│
├── ai/                         # AI Hub for assisted operations
│   ├── HUB.md                 # Complete AI Hub guide
│   ├── prompts/               # AI prompts
│   │   ├── AGENT_BRIEF.system.md
│   │   ├── TASK_WRITER.user.md
│   │   └── RUNBOOK_AUTOMATOR.user.md
│   ├── schemas/               # JSON schemas
│   │   ├── task.spec.json
│   │   └── automation.spec.json
│   └── examples/              # Example outputs
│       ├── example-task.json
│       └── example-automation.json
│
├── scripts/                    # Automation scripts
│   ├── docs-scan.ts           # Drift detection
│   ├── adr-validate.ts        # ADR validation
│   ├── changelog.ts           # Changelog generation
│   ├── release-notes.ts       # Release notes extraction
│   ├── toc-sync.ts            # Table of contents sync
│   └── ci-summary.ts          # CI summary generation
│
├── adrs/                       # Your ADRs (create as needed)
│   └── .gitkeep
│
├── runbooks/                   # Your runbooks (create as needed)
│   └── .gitkeep
│
├── playbooks/                  # Your playbooks (create as needed)
│   └── .gitkeep
│
└── postmortems/                # Your post-mortems (create as needed)
    └── .gitkeep
```

---

## Core Features

### 1. Drift Detection

**Automatically detect** when documentation falls out of sync with code.

```bash
npm run ctocenter:scan
```

**Detects**:
- Missing documentation for new code
- Outdated docs (code modified more recently)
- API changes not reflected in docs
- Missing governance artifacts

**Output**: `.ctocenter/state/signals.json`

---

### 2. ADR Management

**Document architectural decisions** using a structured template.

```bash
# Create new ADR
cp .ctocenter/templates/ADR.template.md \
   .ctocenter/adrs/ADR-0001-your-decision.md

# Validate ADRs
npm run ctocenter:adr-validate
```

**Features**:
- Sequential numbering validation
- Status transition checking
- Required field validation

---

### 3. Runbook Templates

**Capture operational procedures** for incidents and maintenance.

```bash
cp .ctocenter/templates/RUNBOOK.template.md \
   .ctocenter/runbooks/RUNBOOK-incident-name.md
```

**Use cases**:
- Incident response procedures
- Deployment checklists
- Debugging guides
- Maintenance tasks

---

### 4. AI Hub

**Leverage AI** to generate tasks, runbooks, and documentation.

**Prompts**:
- `TASK_WRITER.user.md` - Generate tasks from objectives
- `RUNBOOK_AUTOMATOR.user.md` - Create runbooks from incidents
- `AGENT_BRIEF.system.md` - Repository context for AI

**Schemas**:
- `task.spec.json` - Task structure validation
- `automation.spec.json` - Automation structure validation

**Full guide**: [ai/HUB.md](ai/HUB.md)

---

### 5. Release Automation

**Automate changelog and release notes** generation.

```bash
# Generate changelog for version
npm run ctocenter:changelog -- v1.2.0

# Extract release notes
npm run ctocenter:release-notes 1.2.0
```

**Integrates with**:
- Git commit history
- Conventional commits
- GitHub releases

---

### 6. CI/CD Integration

**Three GitHub Actions workflows** automate quality checks:

1. **Validation** (`.github/workflows/ctocenter-validate.yml`)
   - Runs on PRs and pushes
   - Detects drift
   - Validates ADRs
   - Comments on PRs

2. **Weekly Drift** (`.github/workflows/ctocenter-weekly-drift.yml`)
   - Runs every Monday
   - Creates drift issues
   - Provides checklists

3. **Release** (`.github/workflows/ctocenter-release.yml`)
   - Runs on version tags
   - Generates release notes
   - Creates GitHub releases

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run ctocenter:scan` | Detect documentation drift |
| `npm run ctocenter:adr-validate` | Validate ADRs |
| `npm run ctocenter:changelog [version]` | Generate changelog |
| `npm run ctocenter:release-notes <version>` | Extract release notes |
| `npm run ctocenter:toc-sync` | Sync table of contents |
| `npm run ctocenter:ci-summary` | Generate CI summary |
| `npm run build` | Build TypeScript scripts |
| `npm run watch` | Watch TypeScript changes |

---

## Daily Workflow

### Before Starting Work

```bash
npm run ctocenter:scan
```

Check for existing drift, address before making changes.

### After Making Changes

```bash
# 1. Update relevant documentation

# 2. Verify alignment
npm run ctocenter:scan

# 3. Commit code and docs together
git add source/ include/ docs/
git commit -m "feat: Add feature with docs"
```

### Before Committing ADRs

```bash
npm run ctocenter:adr-validate
```

Ensure ADRs are valid before pushing.

---

## When to Create Documents

### Create ADR When:
- Making significant architectural decisions
- Choosing between multiple technical approaches
- Establishing patterns or conventions
- Deprecating features or APIs

### Create Runbook When:
- Documenting incident response
- After resolving significant incidents
- For recurring maintenance tasks
- Establishing operational procedures

### Create Playbook When:
- Documenting team processes
- Standardizing workflows
- Creating onboarding procedures
- Defining development practices

### Create Post-Mortem When:
- After P0 or P1 incidents
- After failed deployments
- For near-misses with learning value
- When patterns emerge from multiple incidents

---

## Integration Points

### With Development
- Drift detection in CI
- Documentation updates with code changes
- ADRs for architectural changes

### With Operations
- Runbooks for incident response
- Post-mortems for learning
- Automation for repetitive tasks

### With Releases
- Automated changelog generation
- Release notes extraction
- Version consistency checking

### With AI Systems
- Task generation from objectives
- Runbook creation from incidents
- Documentation enhancement

---

## Documentation

### Quick Guides
- **[QUICKSTART.md](../docs/cto/QUICKSTART.md)** - Get running in 5 minutes
- **[USAGE.md](../docs/cto/USAGE.md)** - Complete usage guide
- **[ROLES.md](../docs/cto/ROLES.md)** - Team responsibilities
- **[GLOSSARY.md](../docs/cto/GLOSSARY.md)** - Key terminology

### AI Hub
- **[HUB.md](ai/HUB.md)** - AI Hub complete guide
- **[AGENT_BRIEF.system.md](ai/prompts/AGENT_BRIEF.system.md)** - Repository context
- **[TASK_WRITER.user.md](ai/prompts/TASK_WRITER.user.md)** - Task generation
- **[RUNBOOK_AUTOMATOR.user.md](ai/prompts/RUNBOOK_AUTOMATOR.user.md)** - Runbook generation

### Templates
- **[ADR.template.md](templates/ADR.template.md)** - Architecture decisions
- **[RUNBOOK.template.md](templates/RUNBOOK.template.md)** - Operations
- **[PLAYBOOK.template.md](templates/PLAYBOOK.template.md)** - Processes
- **[POSTMORTEM.template.md](templates/POSTMORTEM.template.md)** - Incident analysis

---

## Maintenance

### Daily
- Run drift scan before/after changes
- Update docs with code changes

### Weekly
- Review drift issue (if any)
- Update governance documents
- Check action item progress

### Monthly
- Review ADR statuses
- Update runbooks from incidents
- Archive completed items

### Quarterly
- Audit all governance docs
- Review template effectiveness
- Update based on learning
- Train new team members

---

## Best Practices

### ✅ Do

- Run `npm run ctocenter:scan` before committing
- Update docs immediately with code changes
- Create ADRs for significant decisions
- Test runbooks before committing
- Use templates consistently
- Commit docs and code together

### ❌ Don't

- Commit code without updating docs
- Ignore drift warnings
- Skip ADR validation
- Include untested commands in runbooks
- Leave ADRs in "Proposed" indefinitely
- Delete superseded ADRs (deprecate them)

---

## Troubleshooting

### Scripts won't run
```bash
npm install
npm run build
```

### Drift detected but docs updated
```bash
# Check specific issues
cat .ctocenter/state/signals.json | jq '.signals'

# Update project-map.json if structure changed
```

### ADR validation fails
```bash
# Check file naming: ADR-XXXX-title.md
# Ensure sequential numbering
# Verify status is valid
```

### Can't push to protected branch
- Command Center validation may be blocking
- Fix drift issues first
- Re-run validation

---

## Metrics

Track these to measure success:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Drift-free days | >80% | Days with no drift |
| Doc update lag | <1 day | Time from code to doc update |
| ADR coverage | >90% | % major decisions documented |
| Runbook usage | 100% P0/P1 | % incidents with runbook |
| Post-mortem completion | 100% P0/P1 | % incidents with PM |

---

## Support

### Getting Help
- **Questions**: Open issue with `ctocenter` label
- **Bug reports**: Include `npm run ctocenter:scan` output
- **Feature requests**: Describe use case

### Contributing
- See [DEVELOPMENT.md](../docs/DEVELOPMENT.md)
- Follow existing patterns
- Test changes thoroughly
- Update documentation

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-09 | Initial implementation |

---

## License

Same as repository (MIT License)

---

## Acknowledgments

Built for operational excellence in VST3 plugin development.

**Inspired by**:
- Architecture Decision Records (ADRs)
- SRE practices
- DevOps automation
- Documentation-as-Code principles

---

**Ready to start?** Run: `npm run ctocenter:scan`

**Need help?** Read: [docs/cto/QUICKSTART.md](../docs/cto/QUICKSTART.md)
