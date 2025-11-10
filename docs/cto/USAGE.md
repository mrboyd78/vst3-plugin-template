# CTO Command Center - Usage Guide

**Version**: 1.0  
**Last Updated**: 2025-11-09  
**Status**: Active

---

## Overview

The **CTO Command Center** is an operational excellence system for this repository. It provides tools, templates, and automation to maintain alignment between code, documentation, and architectural decisions.

**Core Principles**:
- **Documentation as Code**: Documentation lives with code and evolves together
- **Drift Detection**: Automated detection of misalignment
- **Governance**: Structured decision-making through ADRs
- **Operational Excellence**: Runbooks and playbooks for repeatable processes

---

## Quick Start

### Install Dependencies

```bash
# Install Node.js dependencies for automation scripts
npm install
```

### Run Your First Scan

```bash
# Detect documentation drift
npm run ctocenter:scan
```

This will analyze your repository and report any drift between code and documentation.

---

## Daily Operations

### 1. Check for Drift

**When**: Before starting work, after making changes

```bash
npm run ctocenter:scan
```

**What it does**:
- Scans code structure vs documentation
- Detects API changes not reflected in docs
- Checks for outdated documentation
- Validates governance artifacts

**If drift detected**:
1. Review the issues reported in `.ctocenter/state/signals.json`
2. Update documentation to address issues
3. Re-run scan to verify fixes

### 2. Validate ADRs

**When**: Before committing ADRs, in CI

```bash
npm run ctocenter:adr-validate
```

**What it does**:
- Checks ADR sequential numbering
- Validates status transitions
- Verifies required fields
- Ensures file naming conventions

### 3. Update Documentation

**When**: After code changes

1. **Update relevant docs**: README, DEVELOPMENT.md, REFERENCE.md, USER_MANUAL.md
2. **Sync TOC** (if using TOC markers):
   ```bash
   npm run ctocenter:toc-sync
   ```
3. **Verify alignment**:
   ```bash
   npm run ctocenter:scan
   ```

---

## Weekly Operations

### 1. Review Drift Report

**Automated**: GitHub Actions runs weekly drift check every Monday

**Manual check**:
```bash
npm run ctocenter:scan
```

**Review**:
- Check `.ctocenter/state/signals.json`
- Address any recommendations
- Update project map if structure changed

### 2. Update Governance Artifacts

**Review**:
- Active ADRs - any need status updates?
- Runbooks - any need updating based on incidents?
- Playbooks - any process improvements?

### 3. Maintenance

```bash
# Update dependencies (if needed)
npm update

# Clean up old state files
# (optional - signals.json is overwritten on each scan)
```

---

## Release Operations

### 1. Prepare Release

**Before creating release tag**:

1. **Update version** in `CMakeLists.txt`:
   ```cmake
   set(PLUGIN_VERSION "1.2.0")
   ```

2. **Generate changelog**:
   ```bash
   npm run ctocenter:changelog -- v1.2.0
   ```

3. **Review generated CHANGELOG.md**:
   - Verify all changes are captured
   - Edit for clarity if needed
   - Commit changes

4. **Validate everything**:
   ```bash
   npm run ctocenter:scan
   npm run ctocenter:adr-validate
   ```

### 2. Create Release

```bash
# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

**Automated**: GitHub Actions workflow `.github/workflows/ctocenter-release.yml` will:
- Generate release notes
- Validate release readiness
- Create GitHub release
- Update changelog

### 3. Post-Release

1. **Verify release** on GitHub Releases page
2. **Update documentation** if needed
3. **Notify stakeholders**
4. **Archive release artifacts** (if applicable)

---

## Creating Governance Documents

### Architecture Decision Record (ADR)

**When to create**:
- Making significant architectural changes
- Choosing between multiple technical approaches
- Establishing patterns or conventions
- Deprecating features or APIs

**How to create**:

1. **Copy template**:
   ```bash
   cp .ctocenter/templates/ADR.template.md .ctocenter/adrs/ADR-0001-your-decision.md
   ```

2. **Fill in the template**:
   - Context and problem statement
   - Options considered
   - Decision outcome
   - Consequences

3. **Set status**: Start with "Proposed"

4. **Review process**:
   - Discuss with team
   - Update status to "Accepted" or "Rejected"
   - Commit to repository

5. **Validate**:
   ```bash
   npm run ctocenter:adr-validate
   ```

**Numbering**: ADRs are numbered sequentially (ADR-0001, ADR-0002, etc.)

**Status lifecycle**:
- Proposed → Accepted | Rejected
- Accepted → Deprecated | Superseded
- Rejected (terminal state)
- Superseded (terminal state)

### Runbook

**When to create**:
- Documenting incident response procedures
- Capturing operational procedures
- After resolving significant incidents
- For recurring maintenance tasks

**How to create**:

1. **Copy template**:
   ```bash
   cp .ctocenter/templates/RUNBOOK.template.md .ctocenter/runbooks/RUNBOOK-incident-name.md
   ```

2. **Fill in**:
   - Symptoms and detection
   - Diagnosis steps
   - Resolution procedures
   - Verification steps
   - Prevention measures

3. **Test the runbook** in a safe environment

4. **Update "Last Tested" field**

5. **Commit and link from docs**

### Playbook

**When to create**:
- Documenting repeatable processes
- Standardizing workflows
- Onboarding procedures
- Development processes

**How to create**:

1. **Copy template**:
   ```bash
   cp .ctocenter/templates/PLAYBOOK.template.md .ctocenter/playbooks/PLAYBOOK-process-name.md
   ```

2. **Fill in**:
   - Process overview
   - Prerequisites
   - Step-by-step procedures
   - Validation checkpoints

3. **Review with team**

4. **Commit and socialize**

### Post-Mortem

**When to create**:
- After any P0 or P1 incident
- Optional for P2/P3 incidents with learning value
- After failed deployments
- For near-misses with valuable lessons

**How to create**:

1. **Copy template**:
   ```bash
   cp .ctocenter/templates/POSTMORTEM.template.md .ctocenter/postmortems/POSTMORTEM-YYYY-MM-DD-incident.md
   ```

2. **Conduct post-mortem meeting** (within 48 hours of incident)

3. **Fill in collaboratively**:
   - Timeline of events
   - Root cause analysis
   - Impact assessment
   - Action items

4. **Assign action items** with owners and due dates

5. **Follow up** on action items weekly

---

## Using the AI Hub

The AI Hub provides prompts and schemas for AI-assisted operations.

### Generate Tasks from Requirements

**Use case**: Convert high-level objective into actionable tasks

1. **Load system prompt**:
   - Use `.ctocenter/ai/prompts/AGENT_BRIEF.system.md` as context

2. **Use task writer prompt**:
   - Open `.ctocenter/ai/prompts/TASK_WRITER.user.md`
   - Fill in your objective
   - Send to AI (GitHub Copilot, ChatGPT, etc.)

3. **Validate output**:
   ```bash
   npm run ctocenter:validate-task your-output.json
   ```

4. **Use generated tasks**:
   - Add to issue tracker
   - Create pull requests
   - Track progress

### Generate Runbooks from Incidents

**Use case**: Document incident response

1. **Document incident details**

2. **Use runbook automator prompt**:
   - Open `.ctocenter/ai/prompts/RUNBOOK_AUTOMATOR.user.md`
   - Fill in incident information
   - Send to AI

3. **Review generated runbook**:
   - Verify commands are safe
   - Test in safe environment
   - Add to `.ctocenter/runbooks/`

### Example Workflow

```bash
# 1. Generate tasks
cat .ctocenter/ai/prompts/TASK_WRITER.user.md | \
  sed 's/{{OBJECTIVE}}/Add MIDI support to plugin/' > /tmp/prompt.txt
# Send prompt to AI, receive output.json

# 2. Validate
npm run ctocenter:validate-task output.json

# 3. Use tasks (manual or automated)
```

See [AI Hub Documentation](.ctocenter/ai/HUB.md) for complete guide.

---

## Drift Detection Details

### What Drift Means

**Drift** occurs when:
- Code changes but docs don't update
- New APIs added without documentation
- Files moved/renamed without updating references
- Dependencies updated without noting changes

### Types of Drift Detected

1. **Documentation Drift**:
   - Missing expected docs
   - Outdated documentation (code modified more recently)
   
2. **API Drift**:
   - New header files not documented
   - Documented APIs no longer exist
   
3. **Dependency Drift**:
   - Hardcoded paths in build files
   - Outdated dependency references

4. **Governance Drift**:
   - Missing ADRs for major decisions
   - No runbooks for recurring incidents
   - Process changes not documented

### Fixing Drift

**Priority order**:
1. **High priority**: API changes, missing critical docs
2. **Medium priority**: Outdated docs, configuration issues
3. **Low priority**: Governance recommendations

**Process**:
1. Review drift report: `.ctocenter/state/signals.json`
2. Address high-priority items first
3. Update relevant documentation
4. Re-run scan: `npm run ctocenter:scan`
5. Commit fixes with descriptive message

---

## CI/CD Integration

### GitHub Actions Workflows

1. **Validation** (`.github/workflows/ctocenter-validate.yml`):
   - Runs on PRs and pushes
   - Detects drift
   - Validates ADRs
   - Comments on PRs with drift report

2. **Weekly Drift** (`.github/workflows/ctocenter-weekly-drift.yml`):
   - Runs every Monday
   - Creates/updates drift issue if drift detected
   - Provides actionable checklist

3. **Release** (`.github/workflows/ctocenter-release.yml`):
   - Runs on version tags
   - Generates changelog and release notes
   - Validates release readiness
   - Creates GitHub release

### PR Workflow

When you open a PR:

1. **Validation workflow runs** automatically
2. **If drift detected**: Bot comments on PR with details
3. **Fix drift**: Update docs, push changes
4. **Re-run checks**: Workflow runs again
5. **Green checks**: Ready for review

---

## Troubleshooting

### Issue: "Drift detected but I updated docs"

**Solution**:
- Ensure you updated the right files
- Check `.ctocenter/state/signals.json` for specific issues
- Verify file paths match those in project-map.json
- Re-run: `npm run ctocenter:scan`

### Issue: "ADR validation fails with numbering error"

**Solution**:
- Check ADR files match pattern: `ADR-XXXX-title.md`
- Ensure no gaps in numbering (ADR-0001, ADR-0002, not ADR-0001, ADR-0003)
- Use zero-padded 4-digit numbers

### Issue: "Scripts won't run"

**Solution**:
```bash
# Install/update dependencies
npm install

# Check Node.js version (requires >= 18)
node --version

# Rebuild TypeScript
npm run build
```

### Issue: "Weekly drift workflow not creating issues"

**Solution**:
- Check workflow has necessary permissions
- Verify `drift-alert` label exists in repository
- Check workflow run logs in Actions tab

---

## Best Practices

### Documentation

✅ **Do**:
- Update docs immediately after code changes
- Run `npm run ctocenter:scan` before committing
- Keep docs concise and actionable
- Use code examples liberally
- Add screenshots for UI changes

❌ **Don't**:
- Commit code without updating docs
- Leave TODO comments without filing issues
- Copy-paste outdated info
- Ignore drift warnings

### ADRs

✅ **Do**:
- Create ADRs for significant decisions
- Include context and alternatives
- Update status as decisions evolve
- Link from relevant docs

❌ **Don't**:
- Create ADRs for trivial decisions
- Skip the "why" explanation
- Leave status as "Proposed" indefinitely
- Delete superseded ADRs (deprecate them)

### Runbooks

✅ **Do**:
- Test runbooks in safe environment
- Include verification steps
- Update "Last Tested" date
- Add prevention measures

❌ **Don't**:
- Include untested commands
- Assume prior knowledge
- Skip rollback procedures
- Forget escalation paths

---

## Getting Help

### Resources

- **AI Hub Guide**: `.ctocenter/ai/HUB.md`
- **Templates**: `.ctocenter/templates/`
- **Examples**: `.ctocenter/ai/examples/`
- **Project Docs**: `docs/`

### Support

- **Questions**: Open issue with tag `ctocenter`
- **Bug reports**: Include output from `npm run ctocenter:scan`
- **Feature requests**: Describe use case and desired outcome

### Contributing

See [DEVELOPMENT.md](../DEVELOPMENT.md) for contribution guidelines.

---

## Maintenance Schedule

### Daily
- [ ] Check for drift before/after changes
- [ ] Update docs with code changes
- [ ] Run validation before committing

### Weekly
- [ ] Review drift issue (if any)
- [ ] Update governance documents
- [ ] Check action item progress

### Monthly
- [ ] Review ADR statuses
- [ ] Update runbooks from incidents
- [ ] Archive old post-mortems
- [ ] Update project map if structure changed

### Quarterly
- [ ] Review all governance docs
- [ ] Update templates if needed
- [ ] Audit Command Center effectiveness
- [ ] Train new team members

---

## Metrics & Success

Track these to measure effectiveness:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Drift-free days | >80% | Count days with no drift detected |
| Doc update lag | <1 day | Time between code change and doc update |
| ADR coverage | >90% | % of major decisions documented |
| Runbook usage | All P0/P1 | % of incidents with runbook |
| Post-mortem completion | 100% P0/P1 | % of incidents with completed PM |

---

**Next**: Read [QUICKSTART.md](./QUICKSTART.md) for a fast-track guide or [ROLES.md](./ROLES.md) to understand team responsibilities.
