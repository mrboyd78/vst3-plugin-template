# Prompt: Runbook Automator

**Purpose**: Generate operational runbooks from incident descriptions, system scenarios, or maintenance procedures.

---

## Instructions

You will receive details about an incident, operational scenario, or system procedure. Your job is to create a comprehensive runbook that can be followed during future occurrences.

### Your Output Must:
1. Follow the RUNBOOK template structure
2. Include specific, executable commands
3. Provide clear symptoms and detection methods
4. Offer multiple resolution paths when applicable
5. Include validation steps
6. Specify escalation criteria
7. Be tested and validated (mark as draft until tested)

---

## Input Format

Provide your input in this format:

```
SCENARIO: [Brief title of incident or procedure]

TYPE: Incident | Maintenance | Deployment | Debug

SEVERITY: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)

DESCRIPTION:
[Detailed description of what happens/happened]

SYMPTOMS:
- Observable symptom 1
- Observable symptom 2

ROOT_CAUSE (if known):
[Underlying cause]

RESOLUTION (if known):
[How it was resolved]

CONTEXT:
- System: [Which systems affected]
- Environment: [Dev/Test/Prod]
- Frequency: [How often this occurs]
- Impact: [User/business impact]
```

---

## Output Format

Generate a markdown runbook following this structure:

```markdown
# Runbook: [Title]

**Status**: Draft (until tested)
**Severity**: [P0-P3]
**Owner**: [Team name]
**Last Updated**: [Date]
**Last Tested**: [Date or "Not yet tested"]

---

## Quick Reference
[One-line trigger + expected time to resolve]

---

## Symptoms & Detection
[How to recognize this issue]

---

## Impact Assessment
[Who/what is affected]

---

## Immediate Response (First 5 minutes)
[Critical first steps]

---

## Detailed Diagnosis
[Investigation steps]

---

## Resolution Procedures
[Step-by-step fixes]

---

## Verification & Testing
[How to confirm resolution]

---

## Escalation
[When and how to escalate]

---

## Post-Incident
[Follow-up actions]

---

## Prevention
[How to avoid recurrence]
```

---

## Example 1: Production Incident

### Input:
```
SCENARIO: Plugin crashes DAW on project load

TYPE: Incident

SEVERITY: P0 (Critical)

DESCRIPTION:
Users report that when opening projects containing our plugin, their DAW crashes immediately. Crash occurs during plugin initialization phase.

SYMPTOMS:
- DAW crashes within 2 seconds of project load
- Crash report shows segmentation fault in PluginProcessor constructor
- Only affects projects created with plugin version 1.2.0+
- Does not occur with new plugin instances

ROOT_CAUSE:
Preset data from v1.2.0 contains new parameters that aren't validated when loaded by v1.2.1. Null pointer dereference when accessing uninitialized parameter.

RESOLUTION:
Added parameter existence check before dereferencing in setStateInformation(). Released hotfix v1.2.2.

CONTEXT:
- System: VST3 plugin (all DAWs affected)
- Environment: User production systems
- Frequency: 100% with affected project files
- Impact: Cannot open projects, work loss, customer churn risk
```

### Output:
````markdown
# Runbook: Plugin Crash on Project Load (Preset Incompatibility)

**Status**: Active  
**Severity**: P0 (Critical)  
**Owner**: Audio Plugin Team  
**Last Updated**: 2025-11-09  
**Last Tested**: 2025-11-09 ✅

---

## Quick Reference

**When to use**: DAW crashes immediately when loading project with plugin

**Expected time to resolve**: 15 minutes (user workaround) or 2 hours (hotfix)

**Required access**: None for workaround, Git + build tools for hotfix

---

## Symptoms & Detection

### What you'll see:
- User reports DAW crash on project load
- Crash occurs within 2 seconds of opening project
- Crash report indicates segmentation fault
- Crash location: `PluginProcessor::setStateInformation()`
- Only affects projects with plugin version 1.2.0+

### How to detect:
```bash
# Check crash logs (macOS example)
grep -r "PluginProcessor" ~/Library/Logs/DiagnosticReports/

# Look for null pointer dereference in setStateInformation
```

**Expected output**: Stack trace showing crash in preset loading code

---

## Impact Assessment

**User impact**: 
- Cannot open affected projects
- Potential work loss if no recent backup
- Complete workflow blockage

**Business impact**: 
- Critical customer satisfaction issue
- High support ticket volume
- Potential refund requests
- Social media complaints likely

**Affected systems**: 
- All DAW hosts (Ableton, Logic, Reaper, etc.)
- All platforms (Windows, macOS, Linux)
- Plugin versions 1.2.1 loading presets from 1.2.0

---

## Immediate Response (First 5 minutes)

### Step 1: Acknowledge & Communicate
- [ ] Acknowledge support ticket/report
- [ ] Post to #incidents channel
- [ ] Update status page: "Investigating crash on project load"
- [ ] Notify CTO/Engineering Lead

### Step 2: Verify Scope
```bash
# Check plugin version distribution
# (from analytics or support tickets)
echo "How many users on v1.2.1?"
echo "How many projects created with v1.2.0?"
```

### Step 3: Provide Immediate Workaround
**Email template to affected users:**
```
Subject: Urgent: Workaround for project load crash

We've identified an issue causing crashes when loading projects.

IMMEDIATE WORKAROUND:
1. Open your DAW without the project
2. Create a blank project
3. Load our plugin (v1.2.1)
4. Go to File > Import > Import Tracks from [your project]
5. Your tracks will load without the plugin instances
6. Re-add plugin instances (they'll use default preset)

Hotfix release in progress. We apologize for the inconvenience.
```

---

## Detailed Diagnosis

### Investigation checklist:
- [ ] Confirm crash location: `setStateInformation()` method
- [ ] Check plugin version in project file: `strings project.xml | grep "version"`
- [ ] Examine preset data structure differences between versions
- [ ] Test crash reproducibility with sample project

### Reproduce crash:
```bash
# 1. Build Debug version
cmake --build build --config Debug

# 2. Launch DAW with debugger attached
# (varies by platform)

# 3. Load affected project

# 4. Examine stack trace at crash point
```

### Common root causes:
1. **Parameter mismatch**: v1.2.0 preset has parameters not in v1.2.1
   - Verify: Compare parameter layout between versions
   - Fix: Add parameter existence check

2. **Data format change**: Preset serialization format changed
   - Verify: Examine XML/binary preset structure
   - Fix: Add format version check and migration

3. **Memory corruption**: Buffer overflow in preset parsing
   - Verify: Run with AddressSanitizer
   - Fix: Bounds checking on preset data

---

## Resolution Procedures

### Option 1: Hotfix Release (Permanent Fix)

**When to use**: After identifying root cause

**Steps**:
```bash
# 1. Add parameter existence check
# In PluginProcessor.cpp::setStateInformation()

void PluginProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    auto tree = juce::ValueTree::readFromData(data, sizeInBytes);
    
    // NEW: Validate parameter existence before access
    if (tree.isValid() && tree.hasProperty("parameterID"))
    {
        // Safe to access parameter
        auto* param = apvts.getParameter("parameterID");
        if (param != nullptr)  // Additional null check
        {
            // Process parameter
        }
    }
    else
    {
        // Fall back to default state
        DBG("Invalid preset data, using defaults");
    }
}

# 2. Add unit test for invalid presets
# 3. Build and test
cmake --build build --config Release

# 4. Test with affected project files
# 5. Bump version to 1.2.2
# 6. Create release branch and tag
git checkout -b release/1.2.2
# Update CMakeLists.txt version
git commit -am "Fix preset loading crash, bump to v1.2.2"
git tag v1.2.2

# 7. Build release artifacts
# 8. Deploy to distribution channels
```

**Expected outcome**: Plugin loads old presets without crashing

**Time estimate**: 2 hours (dev + test + release)

---

### Option 2: Preset Migration Tool (If Hotfix Delayed)

**When to use**: If hotfix takes longer than 4 hours

**Steps**:
```bash
# Create standalone tool to update preset files
# Tool updates v1.2.0 presets to v1.2.1 format

# Run on affected project files
./preset-migrator --input project.xml --output project_fixed.xml
```

**Time estimate**: 4-6 hours (tool development)

---

## Verification & Testing

**How to confirm resolution**:
```bash
# 1. Load previously crashing project
# Expected: Project loads without crash

# 2. Verify plugin functionality
# Expected: All parameters work correctly

# 3. Test preset save/load
# Expected: Presets save and load without errors

# 4. Test in multiple DAWs
# Expected: Works in Reaper, Ableton, Logic, etc.
```

**Monitoring**: Watch support tickets and crash reports for 48 hours

---

## Escalation

**When to escalate**:
- Cannot reproduce crash in-house (need user project file)
- Root cause not identified within 1 hour
- Hotfix doesn't resolve issue
- Affects >100 users

**Who to contact**:
- Primary: CTO - [Email/Slack]
- Secondary: Senior Audio Engineer - [Email/Slack]
- Emergency: CEO (if media coverage)

**What to provide**:
- Crash reports (sanitized)
- Sample project file (if available)
- Steps taken so far
- Number of affected users

---

## Post-Incident

**Immediate follow-up** (within 1 hour of resolution):
- [ ] Email affected users with hotfix link
- [ ] Update status page: "Resolved - Hotfix released"
- [ ] Close support tickets with resolution
- [ ] Post mortem scheduled for next business day

**Documentation**:
- [ ] Update this runbook with actual timings
- [ ] Create ADR for preset versioning strategy
- [ ] Update USER_MANUAL with preset compatibility notes

---

## Prevention

**How to prevent recurrence**:

1. **Add Preset Version Checking**:
```cpp
// In setStateInformation()
const int presetVersion = tree.getProperty("version", 0);
if (presetVersion > CURRENT_PLUGIN_VERSION)
{
    // Show warning, use defaults
    return;
}
```

2. **Automated Compatibility Testing**:
```bash
# CI test that loads presets from all previous versions
npm run test:preset-compatibility
```

3. **Parameter Migration System**:
- Add `migrateParameter()` method
- Maintain parameter ID registry
- Never reuse parameter IDs

4. **Better Error Handling**:
```cpp
// Wrap all preset operations in try-catch
try {
    // Load preset
} catch (const std::exception& e) {
    DBG("Preset load failed: " << e.what());
    // Use default state
}
```

**Related ADRs**: 
- Create ADR-001: Preset Versioning Strategy
- Create ADR-002: Parameter Lifecycle Management

---

## Reference Information

### Key file locations:
- Preset code: `source/PluginProcessor.cpp::setStateInformation()`
- Parameter layout: `source/PluginProcessor.cpp::createParameterLayout()`
- Test presets: `tests/fixtures/presets/`

### Useful commands:
```bash
# Build debug version
cmake --build build --config Debug

# Run with sanitizer (Linux/Mac)
ASAN_OPTIONS=detect_leaks=1 ./AudioPluginHost

# Examine crash logs (macOS)
console ~/Library/Logs/DiagnosticReports/

# Examine crash dumps (Windows)
"C:\Program Files\Debugging Tools for Windows\windbg.exe" crash.dmp
```

### Dashboard links:
- [Crash Reports Dashboard](url)
- [Support Tickets](url)

---

## Changelog

| Version | Date | Author | Changes | Tested |
|---------|------|--------|---------|--------|
| 1.0 | 2025-11-09 | Audio Team | Initial runbook from incident | ✅ |

---

## Testing & Validation

**Last drill date**: 2025-11-09

**Drill results**: Pass - Reproduced issue, applied fix, verified resolution

**Next drill**: 2026-02-09 (quarterly)

---

**Tags**: #runbook #incident-response #p0 #plugin #crash #presets
````

---

## Example 2: Maintenance Procedure

### Input:
```
SCENARIO: Release new plugin version

TYPE: Deployment

SEVERITY: P2 (Medium)

DESCRIPTION:
Standard procedure for releasing a new version of the plugin to users. Includes building, testing, packaging, and distribution.

SYMPTOMS:
- N/A (proactive procedure)

CONTEXT:
- System: Build pipeline, distribution channels
- Environment: Production release
- Frequency: Every 2-4 weeks
- Impact: Users receive updates
```

### Output:
(Runbook would be generated following similar structure but focused on deployment steps)

---

## Best Practices

### ✅ Do:
- Include specific, copy-pasteable commands
- Provide multiple resolution options
- Add verification steps for each action
- Include rollback procedures
- Specify when to escalate
- Add prevention measures
- Test the runbook in safe environment

### ❌ Don't:
- Leave steps vague or ambiguous
- Omit verification commands
- Forget escalation criteria
- Skip rollback procedures
- Use untested commands
- Ignore security implications
- Assume prior knowledge

---

## Runbook Quality Checklist

Before finalizing, verify:

- [ ] Title clearly describes scenario
- [ ] Severity accurately reflects impact
- [ ] Quick reference provides time estimate
- [ ] Symptoms are specific and observable
- [ ] All commands are tested and verified
- [ ] Multiple resolution paths provided (if applicable)
- [ ] Verification steps are comprehensive
- [ ] Escalation criteria are clear
- [ ] Prevention measures address root cause
- [ ] Related documentation is linked
- [ ] Changelog is started

---

## Now Generate Runbook

**Provide your scenario below**, and I will generate a comprehensive runbook.

---

**YOUR INPUT:**

```
SCENARIO: {{SCENARIO_TITLE}}

TYPE: Incident | Maintenance | Deployment | Debug

SEVERITY: P0 | P1 | P2 | P3

DESCRIPTION:
{{DETAILED_DESCRIPTION}}

SYMPTOMS:
- {{SYMPTOM_1}}
- {{SYMPTOM_2}}

ROOT_CAUSE (if known):
{{ROOT_CAUSE}}

RESOLUTION (if known):
{{RESOLUTION_STEPS}}

CONTEXT:
- System: {{AFFECTED_SYSTEMS}}
- Environment: {{ENVIRONMENT}}
- Frequency: {{HOW_OFTEN}}
- Impact: {{USER_BUSINESS_IMPACT}}
```

---

**I will respond with a complete, production-ready runbook.**
