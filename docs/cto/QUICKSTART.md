# CTO Command Center - Quick Start Guide

**Get up and running in 5 minutes**

---

## Prerequisites

- Node.js 18+ installed
- Git repository cloned
- Basic familiarity with command line

---

## Step 1: Install (30 seconds)

```bash
npm install
```

This installs the TypeScript tooling and dependencies for the Command Center scripts.

---

## Step 2: Run Your First Scan (1 minute)

```bash
npm run ctocenter:scan
```

**What you'll see**:
- ✅ No drift detected (if docs are aligned)
- ❌ Drift detected (if docs need updates)

**If drift detected**: Note the issues reported and proceed to Step 4.

---

## Step 3: Validate ADRs (30 seconds)

```bash
npm run ctocenter:adr-validate
```

**What it checks**:
- Sequential numbering
- Valid statuses
- Required fields

**Expected**: Either "No ADRs found" (warning) or "All ADRs valid"

---

## Step 4: Fix Drift (if needed)

If Step 2 detected drift:

1. **Review issues**:
   ```bash
   cat .ctocenter/state/signals.json
   ```

2. **Update documentation** to address issues

3. **Re-scan**:
   ```bash
   npm run ctocenter:scan
   ```

4. **Repeat until clean**

---

## Step 5: Create Your First ADR (Optional, 5 minutes)

```bash
# Copy template
cp .ctocenter/templates/ADR.template.md .ctocenter/adrs/ADR-0001-example-decision.md

# Edit the file
nano .ctocenter/adrs/ADR-0001-example-decision.md

# Validate
npm run ctocenter:adr-validate

# Commit
git add .ctocenter/adrs/ADR-0001-example-decision.md
git commit -m "docs: Add ADR-0001 Example decision"
```

---

## Daily Workflow

### Before Making Changes

```bash
npm run ctocenter:scan
```

### After Making Changes

```bash
# Update relevant docs (README, DEVELOPMENT.md, etc.)

# Verify alignment
npm run ctocenter:scan

# Commit both code and docs
git add .
git commit -m "feat: Your change with updated docs"
```

---

## Common Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run ctocenter:scan` | Detect drift | Before/after changes, daily |
| `npm run ctocenter:adr-validate` | Validate ADRs | Before committing ADRs |
| `npm run ctocenter:changelog` | Generate changelog | Before releases |
| `npm run ctocenter:release-notes <version>` | Extract release notes | During release process |
| `npm run ctocenter:toc-sync` | Sync table of contents | After doc changes |

---

## Release Quick Start

```bash
# 1. Update version in CMakeLists.txt
# Edit: set(PLUGIN_VERSION "1.2.0")

# 2. Generate changelog
npm run ctocenter:changelog -- v1.2.0

# 3. Review and commit
git add CHANGELOG.md CMakeLists.txt
git commit -m "chore: Bump version to 1.2.0"

# 4. Tag and push
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin main --tags

# GitHub Actions will handle the rest!
```

---

## AI Hub Quick Start

### Generate Tasks

1. **Open prompt**: `.ctocenter/ai/prompts/TASK_WRITER.user.md`
2. **Fill in objective** (replace placeholders)
3. **Send to AI** (Copilot, ChatGPT, etc.)
4. **Get structured JSON** with actionable tasks

### Generate Runbook

1. **Open prompt**: `.ctocenter/ai/prompts/RUNBOOK_AUTOMATOR.user.md`
2. **Fill in incident details**
3. **Send to AI**
4. **Get complete runbook** markdown

See [AI Hub Guide](../../.ctocenter/ai/HUB.md) for details.

---

## File Structure Quick Reference

```
.ctocenter/
├── state/
│   ├── project-map.json      # Repository structure snapshot
│   └── signals.json           # Drift detection results
├── templates/
│   ├── ADR.template.md        # Architecture Decision Record
│   ├── RUNBOOK.template.md    # Operational runbook
│   ├── PLAYBOOK.template.md   # Process playbook
│   └── POSTMORTEM.template.md # Incident post-mortem
├── ai/
│   ├── HUB.md                 # AI Hub documentation
│   ├── prompts/               # AI prompts for generation
│   ├── schemas/               # JSON schemas
│   └── examples/              # Example outputs
├── scripts/
│   ├── docs-scan.ts           # Drift detection
│   ├── adr-validate.ts        # ADR validation
│   ├── changelog.ts           # Changelog generation
│   └── ...                    # Other automation
├── adrs/                      # Your ADRs (create as needed)
├── runbooks/                  # Your runbooks (create as needed)
└── playbooks/                 # Your playbooks (create as needed)
```

---

## Integration with GitHub

### Automatic Checks on PRs

When you open a PR:
- ✅ Drift detection runs automatically
- ✅ ADR validation runs
- ✅ Structure validation runs
- 💬 Bot comments if drift detected

### Weekly Drift Check

Every Monday at 9 AM UTC:
- 🤖 Automated drift scan runs
- 📋 Issue created if drift found
- ✅ Checklist provided for fixes

### Release Automation

When you push a version tag:
- 📝 Changelog generated
- 📄 Release notes extracted
- ✅ Validations run
- 🚀 GitHub release created

---

## Troubleshooting Quick Fixes

### Scripts won't run
```bash
npm install
npm run build
```

### Drift detected but docs updated
```bash
# Check specific issues
cat .ctocenter/state/signals.json | jq '.signals'

# Update project map if structure changed
# Edit: .ctocenter/state/project-map.json
```

### ADR validation fails
```bash
# Check file names match: ADR-XXXX-title.md
# Ensure sequential numbering (no gaps)
# Verify status is valid
```

---

## Next Steps

1. **Read [USAGE.md](./USAGE.md)** - Comprehensive usage guide
2. **Review [ROLES.md](./ROLES.md)** - Team responsibilities
3. **Check [GLOSSARY.md](./GLOSSARY.md)** - Key terminology
4. **Explore templates** - `.ctocenter/templates/`
5. **Try AI Hub** - `.ctocenter/ai/HUB.md`

---

## Help & Support

- **Questions**: Open issue with `ctocenter` label
- **Bugs**: Include output from `npm run ctocenter:scan`
- **Docs**: Read [USAGE.md](./USAGE.md)

---

**Time to get started? Run**: `npm run ctocenter:scan`
