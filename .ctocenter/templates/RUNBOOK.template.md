# Runbook: [System/Service Name] - [Operation]

**Status**: Draft | Active | Deprecated  
**Severity**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)  
**Owner**: [Team/Person]  
**Last Updated**: [YYYY-MM-DD]  
**Last Tested**: [YYYY-MM-DD]

---

## Quick Reference

**When to use this runbook**: One-line description of the trigger condition

**Expected time to resolve**: [X minutes/hours]

**Required access**: [Permissions/systems needed]

---

## Symptoms & Detection

### What you'll see:
- Symptom 1: Description
- Symptom 2: Description
- Alert/monitoring signal

### How to detect:
```bash
# Commands to verify the issue
command --to-check-status
```

**Expected output when issue is present**: [Description]

---

## Impact Assessment

**User impact**: Who/what is affected and how

**Business impact**: Revenue, reputation, compliance concerns

**Affected systems**: List of dependent systems/services

---

## Immediate Response (First 5 minutes)

### Step 1: Acknowledge & Communicate
- [ ] Acknowledge alert
- [ ] Post to incident channel: #incidents
- [ ] Update status page (if applicable)

### Step 2: Initial Assessment
```bash
# Quick diagnostic commands
command1
command2
```

### Step 3: Apply Quick Fix (if available)
```bash
# Safe, tested recovery command
quick-fix-command
```

---

## Detailed Diagnosis

### Investigation checklist:
- [ ] Check logs: `tail -f /path/to/logs`
- [ ] Check resource usage: `top / htop / ps`
- [ ] Check network connectivity
- [ ] Check recent deployments/changes

### Common root causes:
1. **Cause A**: How to verify | How to fix
2. **Cause B**: How to verify | How to fix
3. **Cause C**: How to verify | How to fix

---

## Resolution Procedures

### Option 1: [Solution Name] (Recommended)

**When to use**: Condition for this approach

**Steps**:
```bash
# Step-by-step commands
command1 --with-flags
command2
# Verify
verify-command
```

**Expected outcome**: What success looks like

**Risks**: Known risks or side effects

---

### Option 2: [Alternative Solution]

**When to use**: Different condition

**Steps**:
```bash
# Alternative approach
alternative-command
```

---

## Verification & Testing

**How to confirm resolution**:
```bash
# Verification commands
test-command
health-check-command
```

**Expected results**: What indicates full recovery

**Monitoring**: Which metrics/dashboards to watch for 30 minutes

---

## Escalation

**When to escalate**: Conditions that require escalation

**Who to contact**:
- Primary: [Name/Team] - [Contact method]
- Secondary: [Name/Team] - [Contact method]
- Emergency: [Name/Team] - [Contact method]

**What to provide**:
- Incident timeline
- Diagnostics output
- Actions taken so far

---

## Post-Incident

**Immediate follow-up** (within 1 hour):
- [ ] Update incident log
- [ ] Communicate resolution
- [ ] Schedule post-mortem (for P0/P1)

**Documentation**:
- [ ] Update this runbook if new insights gained
- [ ] Create ADR if architectural change needed
- [ ] Update monitoring/alerting

---

## Prevention

**How to prevent recurrence**:
- Action item 1
- Action item 2
- Monitoring improvement

**Related ADRs**: Links to relevant architectural decisions

---

## Reference Information

### Key file locations:
- Config: `/path/to/config`
- Logs: `/path/to/logs`
- Data: `/path/to/data`

### Useful commands:
```bash
# Status check
status-command

# Restart
restart-command

# Emergency stop
emergency-stop
```

### Dashboard links:
- [Monitoring Dashboard](url)
- [Logs Dashboard](url)

---

## Changelog

| Version | Date | Author | Changes | Tested |
|---------|------|--------|---------|--------|
| 1.0 | YYYY-MM-DD | Name | Initial version | ✅ |

---

## Testing & Validation

**Last drill date**: [YYYY-MM-DD]

**Drill results**: [Pass/Fail with notes]

**Next drill**: [YYYY-MM-DD]

---

**Tags**: #runbook #operations #incident-response #[system] #[severity]
