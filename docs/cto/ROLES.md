# CTO Command Center - Roles & Responsibilities

**Version**: 1.0  
**Purpose**: Define who does what in maintaining operational excellence

---

## Overview

The CTO Command Center succeeds when everyone understands their role in maintaining documentation, governance, and operational quality.

**Key Principle**: Everyone is responsible for documentation quality, but specific roles have specific duties.

---

## Role Definitions

### All Team Members

**Responsibilities**:
- ✅ Update documentation when changing code
- ✅ Run `npm run ctocenter:scan` before committing
- ✅ Follow templates for ADRs, runbooks, playbooks
- ✅ Report drift when discovered
- ✅ Participate in post-mortems

**Daily Tasks**:
- Check for drift before starting work
- Update docs alongside code changes
- Create/update runbooks for operational procedures

**When to Escalate**:
- Uncertain whether ADR is needed
- Drift too complex to fix alone
- Architectural decision requires broader input

---

### Developers

**Primary Focus**: Code quality and documentation alignment

**Responsibilities**:
- ✅ Update technical documentation (REFERENCE.md, DEVELOPMENT.md)
- ✅ Create ADRs for architectural decisions
- ✅ Write/update runbooks after incidents
- ✅ Keep API documentation current
- ✅ Add code examples to docs

**Workflows**:

**Before Coding**:
```bash
# Check current state
npm run ctocenter:scan

# Read relevant ADRs
cat .ctocenter/adrs/ADR-*.md
```

**During Development**:
- Add inline code comments for complex logic
- Update header documentation
- Draft ADR if significant decision

**After Coding**:
```bash
# Update relevant docs
nano docs/REFERENCE.md
nano docs/DEVELOPMENT.md

# Verify alignment
npm run ctocenter:scan

# Commit together
git add source/ include/ docs/
git commit -m "feat: Add feature with docs"
```

**After Incidents**:
```bash
# Create runbook from incident
cp .ctocenter/templates/RUNBOOK.template.md \
   .ctocenter/runbooks/RUNBOOK-incident-name.md

# Fill in details from incident
# Test procedures in safe environment
# Mark as tested

git add .ctocenter/runbooks/
git commit -m "docs: Add runbook for incident X"
```

---

### Tech Leads / Senior Engineers

**Primary Focus**: Architectural governance and quality oversight

**Responsibilities**:
- ✅ Review and approve ADRs
- ✅ Ensure architectural consistency
- ✅ Guide ADR creation for complex decisions
- ✅ Maintain high-level documentation
- ✅ Conduct post-mortem meetings
- ✅ Review drift reports and prioritize fixes

**Weekly Tasks**:
- Review open ADRs, update statuses
- Check weekly drift report
- Audit documentation quality
- Update architectural diagrams (if any)

**ADR Review Process**:
1. Developer proposes ADR (status: Proposed)
2. Tech Lead reviews for completeness
3. Team discusses alternatives
4. Tech Lead approves → status: Accepted
5. Tech Lead ensures implementation follows ADR

**Drift Management**:
```bash
# Review drift report
cat .ctocenter/state/signals.json | jq '.signals'

# Prioritize issues (high → low)
# Assign to team members
# Track resolution in weekly sync
```

---

### Product Owners / Managers

**Primary Focus**: User-facing documentation and process

**Responsibilities**:
- ✅ Maintain USER_MANUAL.md
- ✅ Update README.md for user-facing changes
- ✅ Create/maintain playbooks for processes
- ✅ Ensure user docs are current
- ✅ Prioritize documentation improvements

**Workflows**:

**Feature Release**:
1. Review user-facing changes
2. Update USER_MANUAL.md with new features
3. Update README.md examples
4. Verify QUICKSTART.md is accurate
5. Test documentation with fresh eyes

**Process Documentation**:
```bash
# Document new process
cp .ctocenter/templates/PLAYBOOK.template.md \
   .ctocenter/playbooks/PLAYBOOK-process-name.md

# Fill in step-by-step
# Review with team
# Socialize and get feedback
```

---

### Release Manager

**Primary Focus**: Release coordination and automation

**Responsibilities**:
- ✅ Coordinate release process
- ✅ Generate and review changelogs
- ✅ Create release notes
- ✅ Verify release readiness
- ✅ Post-release documentation updates

**Release Workflow**:

**Pre-Release** (1-2 days before):
```bash
# 1. Check alignment
npm run ctocenter:scan
npm run ctocenter:adr-validate

# 2. Update version
# Edit CMakeLists.txt

# 3. Generate changelog
npm run ctocenter:changelog -- v1.2.0

# 4. Review changelog
nano CHANGELOG.md

# 5. Commit
git add CMakeLists.txt CHANGELOG.md
git commit -m "chore: Prepare release v1.2.0"
```

**Release Day**:
```bash
# Tag and push
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin main --tags

# Monitor GitHub Actions
# Verify release artifacts
# Test downloads
```

**Post-Release**:
- Update documentation site (if applicable)
- Notify stakeholders
- Monitor for issues
- Archive release notes

---

### CTO / Engineering Manager

**Primary Focus**: Strategic governance and oversight

**Responsibilities**:
- ✅ Define governance standards
- ✅ Review high-impact ADRs
- ✅ Approve architectural direction
- ✅ Audit operational excellence
- ✅ Allocate resources for documentation
- ✅ Champion documentation culture

**Monthly Review**:
- Review all ADRs accepted this month
- Check drift trends (improving or degrading?)
- Audit post-mortem action items
- Assess documentation quality metrics
- Adjust processes as needed

**Quarterly Planning**:
- Set documentation improvement goals
- Review Command Center effectiveness
- Update templates based on learning
- Plan training for new team members

**Strategic Decisions**:
- Require ADR for high-impact decisions
- Approve status changes for critical ADRs
- Define what constitutes "drift"
- Set acceptable drift thresholds

---

## Responsibility Matrix

| Task | All | Dev | Tech Lead | PM | Release Mgr | CTO |
|------|-----|-----|-----------|----|-----------|----|
| Update docs with code changes | ✅ | ✅ | | | | |
| Run drift scan | ✅ | ✅ | ✅ | | | |
| Create ADRs | | ✅ | | | | |
| Review ADRs | | | ✅ | | | ✅ |
| Approve ADRs | | | ✅ | | | ✅ |
| Update USER_MANUAL | | | | ✅ | | |
| Create runbooks | ✅ | ✅ | | | | |
| Create playbooks | | | | ✅ | | |
| Conduct post-mortems | ✅ | ✅ | ✅ | ✅ | | |
| Generate changelog | | | | | ✅ | |
| Release coordination | | | | | ✅ | |
| Fix drift | ✅ | ✅ | | | | |
| Prioritize drift fixes | | | ✅ | | | |
| Audit governance | | | | | | ✅ |
| Update templates | | | ✅ | | | ✅ |

---

## Decision Authority

### ADR Status Changes

| Transition | Authority | Notes |
|------------|-----------|-------|
| Proposed → Accepted | Tech Lead | Requires team consensus |
| Proposed → Rejected | Tech Lead | Document reason |
| Accepted → Deprecated | Tech Lead + CTO | High-impact only |
| Accepted → Superseded | Tech Lead | Link to new ADR |
| Any → Accepted (High Impact) | CTO | Strategic decisions |

### Documentation Changes

| Change Type | Authority | Review Required |
|-------------|-----------|----------------|
| Code examples | Developer | Peer review |
| API reference | Developer | Tech Lead review |
| Architecture docs | Tech Lead | CTO review |
| User manual | PM | No technical review needed |
| Process playbooks | PM | Team review |
| Runbooks | Developer | Tech Lead review |
| Templates | CTO | Team feedback |

---

## Onboarding New Team Members

**Week 1**: Read and understand
- README.md
- docs/cto/QUICKSTART.md (this is you!)
- docs/cto/USAGE.md
- docs/DEVELOPMENT.md

**Week 2**: Practice
```bash
# Install and run tools
npm install
npm run ctocenter:scan
npm run ctocenter:adr-validate

# Create practice ADR
cp .ctocenter/templates/ADR.template.md /tmp/practice-adr.md
# Fill it out

# Create practice runbook
cp .ctocenter/templates/RUNBOOK.template.md /tmp/practice-runbook.md
# Fill it out
```

**Week 3**: Contribute
- Make first code change with doc update
- Review existing ADRs
- Participate in post-mortem (if applicable)

**Week 4**: Integrate
- Own first documentation improvement
- Create first real ADR (if applicable)
- Contribute to drift fixes

---

## Escalation Paths

### Documentation Issues
1. Try to fix yourself
2. Ask team member for help
3. Escalate to Tech Lead
4. Escalate to CTO if blocking

### Architectural Decisions
1. Draft ADR with options
2. Discuss with Tech Lead
3. Present to team
4. Tech Lead approves or escalates to CTO

### Governance Process
1. Suggest improvement
2. Discuss with Tech Lead
3. Propose to CTO
4. Update templates/processes

### Tool Issues
1. Check USAGE.md troubleshooting
2. Ask team member
3. Open issue with `ctocenter` label
4. Escalate to CTO if blocking work

---

## Cultural Expectations

### Documentation is Code
- Docs and code committed together
- Docs reviewed like code
- Docs have owners like code

### No Broken Windows
- Fix drift when you see it
- Don't ignore scan warnings
- Keep quality bar high

### Collective Ownership
- Anyone can update any doc
- Anyone can propose ADRs
- Anyone can improve processes

### Continuous Improvement
- Learn from incidents
- Update runbooks after use
- Evolve templates based on needs

---

## Metrics by Role

### Developers
- Code changes with doc updates: >95%
- Drift introduced: <5%
- Runbooks created post-incident: 100% (P0/P1)

### Tech Leads
- ADR review time: <2 business days
- Drift resolution time: <1 week
- Post-mortem completion: 100% (P0/P1)

### Release Managers
- Release process adherence: 100%
- Changelog accuracy: 100%
- Release time: <30 min (automated)

### CTO
- Strategic ADR participation: 100%
- Governance audits: Quarterly
- Template updates: As needed

---

## Questions & Clarifications

**Q: Who creates ADRs?**  
A: Anyone can draft. Tech Lead reviews/approves. CTO approves high-impact.

**Q: Who fixes drift?**  
A: Person who introduced it (if recent) or anyone (if old). Tech Lead prioritizes.

**Q: Who updates templates?**  
A: Tech Lead proposes, CTO approves, anyone suggests.

**Q: Who runs drift scans?**  
A: Everyone, daily. CI runs automatically on PRs.

**Q: Who decides what needs ADR?**  
A: Developer judgment, Tech Lead guidance. Rule: if in doubt, create ADR.

---

**See Also**:
- [USAGE.md](./USAGE.md) - How to use the tools
- [GLOSSARY.md](./GLOSSARY.md) - Key terminology
- [QUICKSTART.md](./QUICKSTART.md) - Fast-track guide
