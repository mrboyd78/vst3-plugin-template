# System Brief: VST3 Plugin Template Project

**Role**: You are an AI agent working on the `vst3-plugin-template` repository.

**Repository Context**: This is a production-ready VST3 audio plugin template built with:
- **Language**: C++17
- **Framework**: JUCE 8.x
- **Build System**: CMake 3.22+
- **Target**: VST3 audio plugins (effects and synthesizers)
- **Platform**: Cross-platform (Windows, macOS, Linux)

---

## Project Structure

```
vst3-plugin-template/
├── CMakeLists.txt          # Build configuration
├── include/                # Public headers
│   ├── PluginProcessor.h   # Audio processing interface
│   └── PluginEditor.h      # GUI editor interface
├── source/                 # Implementation files
│   ├── PluginProcessor.cpp # Audio processing logic
│   └── PluginEditor.cpp    # GUI editor logic
├── docs/                   # Documentation
│   ├── DEVELOPMENT.md      # Developer guide
│   ├── REFERENCE.md        # API reference
│   └── USER_MANUAL.md      # User documentation
├── .ctocenter/             # CTO Command Center
│   ├── state/              # Project state tracking
│   ├── templates/          # Document templates
│   ├── ai/                 # AI prompts and schemas
│   └── scripts/            # Automation scripts
└── .github/                # CI/CD workflows
    └── workflows/
```

---

## Key Components

### PluginProcessor
- **Purpose**: Core audio processing logic
- **Responsibilities**: 
  - Parameter management (via AudioProcessorValueTreeState)
  - DSP processing in `processBlock()`
  - State save/load
  - Audio I/O configuration
- **Key Methods**:
  - `prepareToPlay()`: Initialize DSP
  - `processBlock()`: Process audio samples
  - `getStateInformation()`/`setStateInformation()`: Preset management

### PluginEditor
- **Purpose**: GUI interface
- **Responsibilities**:
  - User interface rendering
  - Control attachments to parameters
  - Resizable window handling
- **Framework**: JUCE Component system

---

## Build System

### Configuration Variables (CMakeLists.txt)
```cmake
PLUGIN_NAME              # Plugin identifier
PLUGIN_VERSION           # Semantic version
COMPANY_NAME             # Developer/company name
PLUGIN_MANUFACTURER_CODE # Unique 4-char code
PLUGIN_CODE              # Unique 4-char plugin code
PLUGIN_IS_SYNTH          # TRUE=synth, FALSE=effect
```

### Build Commands
```bash
# Configure
cmake -DJUCE_DIR=/path/to/JUCE -B build

# Build Release
cmake --build build --config Release

# Build Debug
cmake --build build --config Debug
```

### Output Locations
- **Windows**: `C:\Program Files\Common Files\VST3\`
- **macOS**: `~/Library/Audio/Plug-Ins/VST3/`
- **Linux**: `~/.vst3/`

---

## Conventions & Standards

### Code Style
- **Standard**: C++17
- **Naming**: PascalCase for classes, camelCase for methods/variables
- **JUCE patterns**: Follow JUCE coding conventions
- **Comments**: Use when necessary, prefer self-documenting code

### File Organization
- **Headers**: `include/` directory
- **Implementation**: `source/` directory
- **One class per file**: Match filename to class name

### Dependencies
- **JUCE modules**: Add to `target_link_libraries()` in CMakeLists.txt
- **External libraries**: Avoid unless absolutely necessary
- **Standard library**: Prefer STL over custom implementations

---

## Testing Strategy

### Current State
- Manual testing in DAW hosts (Reaper, Ableton, etc.)
- CI/CD builds on push/PR via GitHub Actions

### Testing Environments
- **Plugin Hosts**: AudioPluginHost (JUCE), Reaper, Cakewalk
- **Platforms**: Windows (VS2022), macOS (Xcode), Linux (GCC/Clang)

---

## Documentation Standards

### Required Documentation
1. **README.md**: Project overview, quick start
2. **DEVELOPMENT.md**: Developer setup and contribution guide
3. **REFERENCE.md**: API and architecture reference
4. **USER_MANUAL.md**: End-user documentation

### Template Usage
- **ADRs**: Use `.ctocenter/templates/ADR.template.md` for architectural decisions
- **Runbooks**: Use `.ctocenter/templates/RUNBOOK.template.md` for operational procedures
- **Playbooks**: Use `.ctocenter/templates/PLAYBOOK.template.md` for processes

---

## Common Tasks & Patterns

### Adding a Parameter
1. Define in `PluginProcessor::createParameterLayout()`
2. Access in `processBlock()` via `AudioProcessorValueTreeState`
3. Add GUI control in `PluginEditor` constructor
4. Create attachment: `SliderAttachment`, `ButtonAttachment`, etc.

### Adding DSP Processing
1. Include JUCE DSP module: `juce::dsp::*`
2. Declare processor in `PluginProcessor.h`
3. Initialize in `prepareToPlay()`
4. Process in `processBlock()`

### Debugging
- Build in Debug configuration
- Use IDE debugger (Visual Studio, Xcode, CLion)
- JUCE logging: `DBG()` macro
- AudioPluginHost for isolated testing

---

## Architectural Decisions

### Key Constraints
- **JUCE framework**: All audio/GUI code uses JUCE APIs
- **VST3 SDK**: Plugin format handled by JUCE
- **No external networking**: Standalone audio processing
- **Real-time safety**: No allocations in `processBlock()`

### Design Patterns
- **Value Tree State**: Parameter management pattern
- **Component hierarchy**: JUCE GUI pattern
- **Process chain**: JUCE DSP pattern for effect chains

---

## CI/CD Pipeline

### GitHub Actions Workflow
- **Trigger**: Push to main, pull requests
- **Platforms**: Ubuntu (Linux), Windows, macOS
- **Actions**: Build in Release configuration
- **Artifacts**: None (no artifact upload configured)

### Workflow File
`.github/workflows/build.yml`

---

## Governance & Operational Excellence

### CTO Command Center
- **Location**: `.ctocenter/`
- **Purpose**: Maintain operational excellence, documentation alignment, architectural governance
- **Components**:
  - State tracking: `state/project-map.json`, `state/signals.json`
  - Templates: Playbooks, Runbooks, ADRs, Postmortems
  - AI Hub: Prompts and schemas for AI-assisted operations
  - Scripts: Automation for drift detection, ADR validation, changelog generation

### Documentation Drift Detection
- **Script**: `.ctocenter/scripts/docs-scan.ts`
- **Trigger**: Weekly or on-demand
- **Output**: Signals file updated with drift status

### ADR Management
- **Location**: Plan to use `.ctocenter/templates/ADR.template.md`
- **Validation**: `.ctocenter/scripts/adr-validate.ts`
- **Numbering**: Sequential (ADR-0001, ADR-0002, etc.)

---

## When Generating Code

### Always Consider:
1. **JUCE compatibility**: Use JUCE types and patterns
2. **Real-time safety**: No allocations in audio thread
3. **Thread safety**: Parameter access from GUI and audio threads
4. **Resource management**: RAII, smart pointers
5. **Cross-platform**: Test considerations for Windows/Mac/Linux

### Code Quality Checklist:
- [ ] Compiles on all platforms (Windows/Mac/Linux)
- [ ] No allocations in `processBlock()`
- [ ] Parameters thread-safe (use AudioProcessorValueTreeState)
- [ ] GUI responsive and resizable
- [ ] State save/load works correctly
- [ ] Follows JUCE patterns and conventions

---

## When Generating Documentation

### Always Include:
1. **Purpose**: What problem does this solve?
2. **Usage**: How to use it (with examples)
3. **Prerequisites**: What's needed before using
4. **Troubleshooting**: Common issues and solutions

### Follow Template Structure:
- Use appropriate template from `.ctocenter/templates/`
- Maintain consistent formatting
- Include code examples where relevant
- Add tags for searchability

---

## When Generating Tasks

### Task Structure:
```json
{
  "id": "unique-id",
  "title": "Clear, actionable title",
  "description": "Detailed context and requirements",
  "priority": "P0|P1|P2|P3",
  "estimate": "2h, 1d, 3d, etc.",
  "dependencies": ["other-task-ids"],
  "acceptance_criteria": [
    "Specific, testable criteria"
  ],
  "tags": ["component", "type", "category"]
}
```

### Priority Levels:
- **P0**: Critical - blocks release or causes crashes
- **P1**: High - important features or major bugs
- **P2**: Medium - improvements or minor bugs
- **P3**: Low - nice-to-have or future enhancements

---

## When Generating Runbooks

### Runbook Requirements:
1. **Symptoms**: Clear description of when to use
2. **Detection**: How to identify the issue
3. **Diagnosis**: Step-by-step investigation
4. **Resolution**: Tested fix procedures
5. **Verification**: How to confirm resolution
6. **Prevention**: How to avoid recurrence

### Testing:
- All runbooks must be tested in a safe environment
- Commands must be validated before inclusion
- Include rollback procedures

---

## Technology Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | C++ | 17 |
| Framework | JUCE | 8.x |
| Build System | CMake | 3.22+ |
| Plugin Format | VST3 | (via JUCE) |
| DSP | JUCE DSP | (module) |
| GUI | JUCE Component | (module) |
| CI/CD | GitHub Actions | Latest |

---

## Current Project State

**Maturity**: Template/Starter Project  
**Status**: Active Development  
**Users**: Developers creating VST3 plugins  
**Deployment**: Local development only (no production releases)

---

## Context for AI Agents

You are assisting with:
- Building and maintaining a professional audio plugin template
- Ensuring code quality and JUCE best practices
- Generating operational documentation
- Maintaining architectural alignment
- Supporting developers who use this template

**Your outputs should**:
- Be technically accurate for JUCE and VST3 development
- Follow established conventions and patterns
- Be production-ready and well-tested
- Include appropriate error handling
- Consider real-time audio constraints

**Your outputs should NOT**:
- Introduce non-JUCE dependencies without strong justification
- Violate real-time safety principles
- Ignore cross-platform compatibility
- Bypass existing architectural patterns

---

## Additional Resources

- **JUCE Docs**: https://docs.juce.com/
- **JUCE Forum**: https://forum.juce.com/
- **VST3 SDK**: https://github.com/steinbergmedia/vst3sdk
- **This Project**: README.md, docs/DEVELOPMENT.md

---

**Last Updated**: 2025-11-09  
**Version**: 1.0

---

Use this context to inform all your outputs. When in doubt, refer to JUCE documentation and real-time audio best practices.
