# Quick Start Guide

## For Your First Plugin

1. **Copy this template:**
   ```bash
   cp -r vst3-plugin-template my-new-plugin
   cd my-new-plugin
   ```

2. **Configure your plugin** in `CMakeLists.txt`:
   ```cmake
   set(PLUGIN_NAME "MyAwesomePlugin")
   set(COMPANY_NAME "MyCompany")
   set(PLUGIN_MANUFACTURER_CODE "Manu")  # Get unique codes at juce.com
   set(PLUGIN_CODE "Mawp")
   ```

3. **Build:**
   ```powershell
   . C:\Users\mrchr\build_vst3.ps1
   cmake -G "Visual Studio 17 2022" -A x64 -DJUCE_DIR="C:/Users/mrchr/Downloads/juce-8.0.10-windows/JUCE" -B build
   cmake --build build --config Release
   ```

4. **Find your plugin:**
   ```
   C:\Program Files\Common Files\VST3\MyAwesomePlugin.vst3
   ```

## Customization Checklist

- [ ] Update `PLUGIN_NAME` in CMakeLists.txt
- [ ] Update `COMPANY_NAME` in CMakeLists.txt
- [ ] Get unique plugin codes from juce.com/admin/registration
- [ ] Set `PLUGIN_IS_SYNTH` to TRUE if making a synth
- [ ] Update LICENSE file with your name
- [ ] Update README.md with plugin description
- [ ] Add your parameters in `createParameterLayout()`
- [ ] Implement DSP in `processBlock()`
- [ ] Design GUI in `PluginEditor.cpp`

## Common Commands

### Clean rebuild:
```powershell
rm -rf build
cmake -G "Visual Studio 17 2022" -A x64 -DJUCE_DIR="C:/path/to/JUCE" -B build
cmake --build build --config Release
```

### Debug build:
```powershell
cmake --build build --config Debug
```

### Build with different JUCE version:
```powershell
cmake -DJUCE_DIR="C:/path/to/different/JUCE" -B build
```

## File Locations

**Template:** `C:/Users/mrchr/vst3-plugin-template/`

**Build script:** `C:/Users/mrchr/build_vst3.ps1`

**JUCE:** `C:/Users/mrchr/Downloads/juce-8.0.10-windows/JUCE`

**VST3 output:** `C:/Program Files/Common Files/VST3/`

## Adding New Features

### Add a parameter:
1. Edit `PluginProcessor.cpp` → `createParameterLayout()`
2. Add parameter pointer in header
3. Initialize in constructor
4. Use in `processBlock()`

### Add a GUI control:
1. Edit `PluginEditor.h` → add slider/button member
2. Edit `PluginEditor.cpp` → set up in constructor
3. Create attachment to link to parameter
4. Position in `resized()`

### Add DSP processing:
1. Include JUCE DSP headers in `PluginProcessor.h`
2. Add DSP objects as members
3. Initialize in `prepareToPlay()`
4. Process in `processBlock()`

## Troubleshooting

**Plugin not showing in DAW?**
- Rescan plugins in DAW settings
- Check plugin is in correct VST3 folder
- Verify plugin built successfully (check build output)

**Build errors?**
- Check JUCE_DIR path is correct
- Ensure Visual Studio C++ workload is installed
- Clean and rebuild

**Crashes?**
- Build in Debug mode
- Check for allocations in `processBlock()`
- Verify thread safety

## Next Steps

1. Read `README.md` for full documentation
2. Check `docs/DEVELOPMENT.md` for advanced patterns
3. Join JUCE forum for help: forum.juce.com
4. Explore JUCE examples in `JUCE/examples/`

---

**Ready to build amazing plugins!** 🎵
