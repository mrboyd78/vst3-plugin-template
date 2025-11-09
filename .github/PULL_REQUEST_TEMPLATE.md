# Pull Request

## Description

<!-- Provide a clear and concise description of your changes -->

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] ♻️ Code refactoring
- [ ] 🎨 Style/UI changes
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test changes
- [ ] 🔧 Configuration changes
- [ ] 🏗️ Build system changes

## Related Issues

<!-- Link related issues using #issue_number -->

Closes #
Related to #

## Changes Made

<!-- Provide a detailed list of changes -->

-
-
-

## Testing

<!-- Describe the testing you've done -->

### Test Configuration
- **OS**: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **Compiler**: [e.g., MSVC 2022, Clang 15, GCC 11]
- **JUCE Version**: [e.g., 8.0.10]
- **DAW Tested**: [e.g., Reaper 7.0, Ableton Live 12]

### Test Cases
- [ ] Plugin loads without crashes
- [ ] GUI renders correctly
- [ ] Parameters work as expected
- [ ] Audio processing functions correctly
- [ ] Presets save and load properly
- [ ] Cross-platform compatibility verified

## Documentation

<!-- Check all that apply -->

- [ ] Code is self-documenting with clear variable/function names
- [ ] Added/updated code comments for complex logic
- [ ] Updated relevant documentation (README, DEVELOPMENT.md, etc.)
- [ ] Added/updated API documentation in REFERENCE.md
- [ ] Updated USER_MANUAL.md if user-facing changes

## CTO Command Center Checklist

<!-- Required for operational excellence -->

- [ ] **Documentation Alignment**: Changes reflected in docs
- [ ] **Drift Detection**: Ran `npm run ctocenter:scan` (no drift)
- [ ] **ADR Created**: If architectural decision, created ADR in `.ctocenter/adrs/`
- [ ] **Runbook Updated**: If operational change, updated relevant runbook
- [ ] **Project Map**: Updated `.ctocenter/state/project-map.json` if structure changed

### For Breaking Changes or Major Features:
- [ ] Created ADR documenting the decision
- [ ] Updated architectural documentation
- [ ] Migration guide provided (if applicable)
- [ ] Rollback plan documented

### For Bug Fixes:
- [ ] Root cause documented
- [ ] Added test to prevent regression
- [ ] Related runbook updated (if applicable)

## Breaking Changes

<!-- If this PR introduces breaking changes, describe them here -->

### What breaks:
-

### Migration path:
-

### Deprecation plan:
-

## Checklist

<!-- Verify these before submitting -->

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented complex or non-obvious code
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
- [ ] I have updated the documentation
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged
- [ ] I have checked my code for security vulnerabilities
- [ ] I have run `npm run ctocenter:scan` with no drift

## Screenshots/Recordings

<!-- If applicable, add screenshots or screen recordings of UI changes -->

### Before:
<!-- Add screenshot/recording -->

### After:
<!-- Add screenshot/recording -->

## Performance Impact

<!-- Describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improved (provide benchmarks)
- [ ] Performance degraded (explain why necessary and provide benchmarks)

**Benchmarks**:
```
<!-- Add benchmark results if applicable -->
```

## Additional Notes

<!-- Any additional information that reviewers should know -->

---

## Reviewer Notes

<!-- For reviewers - do not edit this section as PR author -->

### Review Checklist
- [ ] Code quality and style
- [ ] Logic and correctness
- [ ] Test coverage
- [ ] Documentation completeness
- [ ] Performance implications
- [ ] Security considerations
- [ ] Breaking changes justified
- [ ] CTO Command Center alignment

### Governance Review (if applicable)
- [ ] ADR reviewed and approved
- [ ] Architectural changes align with project direction
- [ ] Documentation drift addressed
- [ ] Runbooks/playbooks updated

---

**By submitting this PR, I confirm that:**
- My contribution is made under the same license as this project
- I have the right to submit this work
- I understand and agree to the project's contribution guidelines
