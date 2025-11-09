# Post-Mortem: [Incident Title]

**Incident ID**: INC-YYYY-XXXX  
**Date of Incident**: YYYY-MM-DD  
**Date of Review**: YYYY-MM-DD  
**Severity**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)  
**Duration**: [X hours/minutes]  
**Participants**: [List attendees]

---

## Executive Summary

**What happened**: One-paragraph summary of the incident and impact.

**Impact**: 
- Users affected: [Number/percentage]
- Systems affected: [List]
- Business impact: [Revenue, reputation, etc.]
- Downtime: [Duration]

**Root cause**: Brief statement of the underlying cause.

**Resolution**: How the incident was resolved.

---

## Timeline

All times in [Timezone]

| Time | Event | Who |
|------|-------|-----|
| HH:MM | Incident detected via [alert/report] | Team/Person |
| HH:MM | Initial investigation started | Team/Person |
| HH:MM | Root cause identified | Team/Person |
| HH:MM | Mitigation applied | Team/Person |
| HH:MM | Service restored | Team/Person |
| HH:MM | Incident closed | Team/Person |

---

## Detection

**How was it detected?**
- Alert from monitoring system
- User report
- Automated health check
- Other: [Specify]

**Time to detection**: [X minutes from when issue started]

**Could we have detected it sooner?**
- Yes/No
- If yes, how: [Explanation]

---

## Impact Analysis

### User Impact
- Number of users affected: [Count or percentage]
- User-facing symptoms: [What users experienced]
- Geographic/segment distribution: [If applicable]

### System Impact
- Services degraded/down: [List]
- Data loss: [Yes/No - details]
- Security implications: [Any concerns]

### Business Impact
- Revenue impact: [$Amount or estimate]
- SLA/SLO breach: [Yes/No - details]
- Customer complaints: [Count]
- Media/public attention: [Yes/No]

---

## Root Cause Analysis

### Contributing Factors

#### Primary Cause
**What**: Detailed description of the root cause

**Why it happened**:
- Underlying reason 1
- Underlying reason 2
- System/process gap

**Why it wasn't prevented**:
- Missing safeguard
- Monitoring gap
- Process gap

#### Contributing Factors
1. **Factor 1**: Description and relevance
2. **Factor 2**: Description and relevance
3. **Factor 3**: Description and relevance

### 5 Whys Analysis

1. **Why did the incident occur?** [Answer]
2. **Why did [answer 1] happen?** [Answer]
3. **Why did [answer 2] happen?** [Answer]
4. **Why did [answer 3] happen?** [Answer]
5. **Why did [answer 4] happen?** [Root cause]

---

## Response Analysis

### What Went Well
- ✅ Positive aspect 1 of incident response
- ✅ Positive aspect 2
- ✅ Effective action taken

### What Went Wrong
- ❌ Area where response was suboptimal
- ❌ Communication breakdown
- ❌ Delayed action

### Response Timeline Analysis
- Time to detect: [X minutes] - [Good/Needs improvement]
- Time to respond: [X minutes] - [Good/Needs improvement]
- Time to resolve: [X minutes] - [Good/Needs improvement]
- Total duration: [X minutes] - [Good/Needs improvement]

---

## Action Items

### Immediate (Complete within 1 week)

| Action | Owner | Due Date | Status | Priority |
|--------|-------|----------|--------|----------|
| [Action 1] | Name | YYYY-MM-DD | 🔴 Open | P0 |
| [Action 2] | Name | YYYY-MM-DD | 🟡 In Progress | P0 |
| [Action 3] | Name | YYYY-MM-DD | ✅ Complete | P1 |

### Short-term (Complete within 1 month)

| Action | Owner | Due Date | Status | Priority |
|--------|-------|----------|--------|----------|
| [Action 4] | Name | YYYY-MM-DD | 🔴 Open | P1 |
| [Action 5] | Name | YYYY-MM-DD | 🔴 Open | P2 |

### Long-term (Complete within 3 months)

| Action | Owner | Due Date | Status | Priority |
|--------|-------|----------|--------|----------|
| [Action 6] | Name | YYYY-MM-DD | 🔴 Open | P2 |
| [Action 7] | Name | YYYY-MM-DD | 🔴 Open | P3 |

---

## Prevention Measures

### Technical Improvements
1. **Monitoring Enhancement**: [Specific improvement]
   - Why: [Justification]
   - Impact: [Expected outcome]

2. **System Resilience**: [Specific improvement]
   - Why: [Justification]
   - Impact: [Expected outcome]

3. **Automated Response**: [Specific improvement]
   - Why: [Justification]
   - Impact: [Expected outcome]

### Process Improvements
1. **Updated Runbook**: [Link to updated runbook]
2. **New Playbook**: [Link if created]
3. **Documentation Update**: [What was updated]

### Training & Communication
1. **Team training**: [Topic and schedule]
2. **Knowledge sharing**: [How insights will be shared]
3. **Communication protocol**: [Updates to incident comms]

---

## Lessons Learned

### Key Takeaways
1. **Lesson 1**: [What we learned]
2. **Lesson 2**: [What we learned]
3. **Lesson 3**: [What we learned]

### Knowledge Sharing
- [ ] Share with engineering team
- [ ] Update documentation
- [ ] Add to onboarding materials
- [ ] Present at team meeting
- [ ] Update monitoring dashboard

---

## Related Documentation

**Created/Updated**:
- [Runbook: Title](link) - Created/Updated
- [ADR-XXX: Decision](link) - Created if architectural change
- [Monitoring Dashboard](link) - Updated

**References**:
- [Incident ticket](link)
- [Chat logs](link)
- [Related incidents](link)

---

## Appendices

### Appendix A: Technical Details
[Detailed technical information, stack traces, logs, etc.]

### Appendix B: Communication Log
[Key communications sent during incident]

### Appendix C: Metrics
[Relevant metrics, graphs, charts]

---

## Sign-off

**Reviewed by**:
- Engineering Lead: [Name] - [Date]
- Product Owner: [Name] - [Date]
- CTO: [Name] - [Date]

**Lessons Incorporated**: [Yes/No]

**Follow-up Review Scheduled**: [YYYY-MM-DD]

---

**Tags**: #postmortem #incident #[severity] #[system] #lessons-learned
