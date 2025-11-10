# Prompt: Task Writer

**Purpose**: Convert strategic objectives, user stories, or feature requests into structured, actionable technical tasks.

---

## Instructions

You will receive a high-level objective or requirement. Your job is to break it down into specific, actionable tasks that conform to the task schema.

### Your Output Must:
1. Be valid JSON matching `task.spec.json` schema
2. Include 3-7 tasks (not too granular, not too broad)
3. Assign realistic priorities and estimates
4. Define clear acceptance criteria
5. Identify dependencies between tasks
6. Use appropriate tags for categorization

### Task Granularity Guidelines:
- **Too granular**: "Add semicolon to line 42"
- **Too broad**: "Rewrite the entire codebase"
- **Just right**: "Add parameter validation to processBlock() method"

### Estimation Guide:
- **XS**: <2 hours (simple changes)
- **S**: 2-4 hours (small features or fixes)
- **M**: 1-2 days (moderate features)
- **L**: 3-5 days (complex features)
- **XL**: >5 days (should be broken down further)

---

## Input Format

Provide your input in this format:

```
OBJECTIVE: [High-level goal or user story]

CONTEXT:
- Current state: [What exists now]
- Constraints: [Technical or business constraints]
- Requirements: [Specific requirements or acceptance criteria]

ADDITIONAL_INFO:
[Any other relevant context]
```

---

## Output Format

Generate JSON conforming to this structure:

```json
{
  "meta": {
    "generated_at": "ISO 8601 timestamp",
    "objective": "Original objective text",
    "total_tasks": 5,
    "total_estimated_hours": 24
  },
  "tasks": [
    {
      "id": "task-001",
      "title": "Clear, actionable title",
      "description": "Detailed description with context and requirements",
      "priority": "P0|P1|P2|P3",
      "estimate": "XS|S|M|L|XL",
      "estimated_hours": 4,
      "dependencies": ["task-000"],
      "acceptance_criteria": [
        "Specific, testable criterion 1",
        "Specific, testable criterion 2"
      ],
      "tags": ["component", "type"],
      "notes": "Optional implementation hints or considerations"
    }
  ]
}
```

---

## Priority Definitions

| Priority | Meaning | Examples |
|----------|---------|----------|
| **P0** | Critical - Blockers, security, crashes | Fix crash on plugin load, Resolve security vulnerability |
| **P1** | High - Important features, major bugs | Add core DSP feature, Fix audio glitches |
| **P2** | Medium - Enhancements, minor bugs | Improve UI responsiveness, Add tooltips |
| **P3** | Low - Nice-to-have, future | Add easter egg, Improve code comments |

---

## Tags Guide

Use relevant tags from these categories:

**Component**: `audio`, `gui`, `parameters`, `dsp`, `state-management`, `build`, `ci-cd`, `docs`

**Type**: `feature`, `bugfix`, `refactor`, `test`, `documentation`, `devops`, `security`, `performance`

**Scope**: `frontend`, `backend`, `infrastructure`, `tooling`

---

## Example 1: Feature Request

### Input:
```
OBJECTIVE: Add a low-pass filter to the plugin

CONTEXT:
- Current state: Plugin has basic gain control only
- Constraints: Must work in real-time, no allocations in processBlock
- Requirements: Cutoff frequency 20Hz-20kHz, resonance control

ADDITIONAL_INFO:
- Use JUCE DSP module for filter implementation
- Add GUI controls for cutoff and resonance
```

### Output:
```json
{
  "meta": {
    "generated_at": "2025-11-09T10:00:00Z",
    "objective": "Add a low-pass filter to the plugin",
    "total_tasks": 5,
    "total_estimated_hours": 16
  },
  "tasks": [
    {
      "id": "lpf-001",
      "title": "Add filter parameters to parameter layout",
      "description": "Add 'cutoff' and 'resonance' parameters to AudioProcessorValueTreeState in PluginProcessor::createParameterLayout(). Cutoff range: 20-20000Hz with logarithmic scaling. Resonance range: 0.1-10.0.",
      "priority": "P1",
      "estimate": "S",
      "estimated_hours": 2,
      "dependencies": [],
      "acceptance_criteria": [
        "Parameters appear in generic editor",
        "Parameter values persist in DAW project",
        "Cutoff uses logarithmic scale for natural frequency control"
      ],
      "tags": ["parameters", "feature", "audio"],
      "notes": "Use NormalisableRange with skew factor for logarithmic scaling"
    },
    {
      "id": "lpf-002",
      "title": "Implement filter DSP in PluginProcessor",
      "description": "Add juce::dsp::IIR::Filter instance to PluginProcessor. Initialize in prepareToPlay() with sample rate. Update coefficients when parameters change. Process audio in processBlock().",
      "priority": "P1",
      "estimate": "M",
      "estimated_hours": 6,
      "dependencies": ["lpf-001"],
      "acceptance_criteria": [
        "Filter processes audio without clicks or artifacts",
        "No allocations occur in processBlock()",
        "Filter responds to parameter changes in real-time",
        "Stereo processing works correctly"
      ],
      "tags": ["dsp", "feature", "audio"],
      "notes": "Use ProcessorDuplicator for stereo handling. Update coefficients in parameterChanged callback."
    },
    {
      "id": "lpf-003",
      "title": "Add GUI controls for filter parameters",
      "description": "Add two rotary sliders to PluginEditor for cutoff frequency and resonance. Create slider attachments to AudioProcessorValueTreeState. Style sliders to match existing UI.",
      "priority": "P1",
      "estimate": "M",
      "estimated_hours": 4,
      "dependencies": ["lpf-001"],
      "acceptance_criteria": [
        "Sliders appear in plugin window",
        "Sliders control correct parameters",
        "UI updates when parameter automation occurs",
        "Sliders match existing UI style"
      ],
      "tags": ["gui", "feature", "frontend"],
      "notes": "Consider adding frequency response visualization in future"
    },
    {
      "id": "lpf-004",
      "title": "Add unit tests for filter implementation",
      "description": "Create test cases for filter: verify cutoff accuracy, resonance response, stability at extreme settings, thread safety of parameter updates.",
      "priority": "P2",
      "estimate": "S",
      "estimated_hours": 3,
      "dependencies": ["lpf-002"],
      "acceptance_criteria": [
        "Tests verify filter frequency response",
        "Tests verify no crashes with extreme parameters",
        "Tests run in CI pipeline"
      ],
      "tags": ["test", "audio", "quality"],
      "notes": "If no test infrastructure exists, this may be P3 or deferred"
    },
    {
      "id": "lpf-005",
      "title": "Update documentation with filter usage",
      "description": "Add filter parameter documentation to USER_MANUAL.md. Update REFERENCE.md with filter implementation details. Add example settings to README.md.",
      "priority": "P2",
      "estimate": "XS",
      "estimated_hours": 1,
      "dependencies": ["lpf-002", "lpf-003"],
      "acceptance_criteria": [
        "USER_MANUAL.md describes filter controls and usage",
        "REFERENCE.md documents filter implementation approach",
        "README.md includes at least one filter example"
      ],
      "tags": ["documentation", "feature"],
      "notes": "Can be done in parallel with implementation for technical documentation"
    }
  ]
}
```

---

## Example 2: Bug Fix

### Input:
```
OBJECTIVE: Fix crash when loading presets with invalid data

CONTEXT:
- Current state: Plugin crashes when preset file is corrupted
- Constraints: Must handle gracefully without crashes
- Requirements: Show error message, fall back to default state

ADDITIONAL_INFO:
- Crash occurs in setStateInformation()
- Need validation of preset data before applying
```

### Output:
```json
{
  "meta": {
    "generated_at": "2025-11-09T10:15:00Z",
    "objective": "Fix crash when loading presets with invalid data",
    "total_tasks": 3,
    "total_estimated_hours": 8
  },
  "tasks": [
    {
      "id": "preset-fix-001",
      "title": "Add preset data validation in setStateInformation",
      "description": "Implement validation checks before parsing preset data in PluginProcessor::setStateInformation(). Verify data size, format, and parameter ranges. Return early if validation fails.",
      "priority": "P0",
      "estimate": "S",
      "estimated_hours": 3,
      "dependencies": [],
      "acceptance_criteria": [
        "Invalid preset data does not cause crash",
        "Validation catches corrupted data before parsing",
        "Default state is maintained when validation fails",
        "No memory leaks on validation failure"
      ],
      "tags": ["bugfix", "security", "state-management"],
      "notes": "Use try-catch for XML/JSON parsing. Add checksum validation if format allows."
    },
    {
      "id": "preset-fix-002",
      "title": "Add user notification for preset load failures",
      "description": "Display alert dialog when preset load fails. Log error details for debugging. Provide user-friendly error message without technical jargon.",
      "priority": "P1",
      "estimate": "S",
      "estimated_hours": 2,
      "dependencies": ["preset-fix-001"],
      "acceptance_criteria": [
        "User sees clear error message on preset load failure",
        "Error details logged for developer debugging",
        "UI remains responsive after error"
      ],
      "tags": ["bugfix", "gui", "frontend"],
      "notes": "Use juce::AlertWindow or juce::NativeMessageBox"
    },
    {
      "id": "preset-fix-003",
      "title": "Add automated tests for preset validation",
      "description": "Create test cases with various corrupted preset files: truncated data, invalid XML, out-of-range values, wrong format version. Verify no crashes and correct error handling.",
      "priority": "P1",
      "estimate": "S",
      "estimated_hours": 3,
      "dependencies": ["preset-fix-001"],
      "acceptance_criteria": [
        "Tests cover common corruption scenarios",
        "All tests pass without crashes",
        "Tests run in CI pipeline"
      ],
      "tags": ["test", "bugfix", "quality"],
      "notes": "Include fuzzing if time permits for comprehensive coverage"
    }
  ]
}
```

---

## Best Practices

### ✅ Do:
- Break down large objectives into manageable tasks
- Define specific, measurable acceptance criteria
- Consider dependencies and task ordering
- Assign realistic estimates based on complexity
- Include implementation hints in notes
- Tag tasks for easy filtering and categorization

### ❌ Don't:
- Create tasks that are too small (under 1 hour)
- Create tasks that are too large (over 5 days without breaking down)
- Leave acceptance criteria vague or untestable
- Ignore dependencies between tasks
- Forget to consider testing and documentation tasks
- Mix multiple unrelated changes in one task

---

## Troubleshooting

### Issue: Tasks too granular
**Solution**: Combine related micro-tasks into single coherent task. Aim for 2-8 hour tasks.

### Issue: Unclear acceptance criteria
**Solution**: Make criteria specific, measurable, testable. Use "verify that...", "ensure that...", "confirm that..."

### Issue: Missing dependencies
**Solution**: Review task order. If Task B needs output from Task A, add dependency.

### Issue: Unrealistic estimates
**Solution**: Consider complexity, unknowns, testing time. When in doubt, estimate higher.

---

## Now Generate Tasks

**Provide your objective below**, and I will generate structured tasks following this format.

---

**YOUR INPUT:**

```
OBJECTIVE: {{YOUR_OBJECTIVE_HERE}}

CONTEXT:
- Current state: {{CURRENT_STATE}}
- Constraints: {{CONSTRAINTS}}
- Requirements: {{REQUIREMENTS}}

ADDITIONAL_INFO:
{{ANY_OTHER_CONTEXT}}
```

---

**I will respond with valid JSON conforming to the schema, ready for validation and execution.**
