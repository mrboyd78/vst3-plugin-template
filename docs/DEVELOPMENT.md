# Development Guide

## Architecture Overview

This plugin template follows JUCE best practices and modern C++ design patterns.

### Key Components

#### AudioPluginProcessor (`PluginProcessor.h/cpp`)
- Main audio processing engine
- Handles parameter management via `AudioProcessorValueTreeState`
- Implements DSP processing in `processBlock()`
- Manages state persistence (save/load presets)

#### AudioPluginEditor (`PluginEditor.h/cpp`)
- GUI implementation
- Automatic parameter binding via `SliderAttachment`
- Resizable interface
- Custom paint() for visual design

### Parameter Management

The template uses `AudioProcessorValueTreeState` (APVTS) for robust parameter management:

**Benefits:**
- Automatic undo/redo support
- Thread-safe parameter access
- Built-in automation support
- Easy GUI binding

**Adding Parameters:**

1. Define in `createParameterLayout()`:
```cpp
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "paramID",           // Unique identifier
    "Display Name",      // User-visible name
    juce::NormalisableRange<float>(min, max, step, skew),
    defaultValue
));
```

2. Get parameter pointer in constructor:
```cpp
paramPtr = apvts.getRawParameterValue("paramID");
```

3. Use in `processBlock()`:
```cpp
float value = paramPtr->load();
```

### DSP Processing

The template includes JUCE DSP module for efficient audio processing:

```cpp
// In prepareToPlay()
juce::dsp::ProcessSpec spec;
spec.sampleRate = sampleRate;
spec.maximumBlockSize = samplesPerBlock;
spec.numChannels = getTotalNumOutputChannels();

myProcessor.prepare(spec);

// In processBlock()
juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
myProcessor.process(context);
```

## Common Patterns

### Filter Example

**Header:**
```cpp
juce::dsp::ProcessorDuplicator<
    juce::dsp::IIR::Filter<float>,
    juce::dsp::IIR::Coefficients<float>> lowpassFilter;
```

**Implementation:**
```cpp
// prepareToPlay()
lowpassFilter.prepare(spec);

// processBlock()
auto cutoff = cutoffParam->load();
*lowpassFilter.state = *juce::dsp::IIR::Coefficients<float>::makeLowPass(
    sampleRate, cutoff, 0.707f);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
lowpassFilter.process(context);
```

### Delay/Reverb Example

```cpp
// Header
juce::dsp::DelayLine<float> delayLine;

// prepareToPlay()
delayLine.prepare(spec);
delayLine.setMaximumDelayInSamples(sampleRate * 2.0); // 2 second max

// processBlock()
float delayTime = delayTimeParam->load();
int delaySamples = static_cast<int>(delayTime * sampleRate);
delayLine.setDelay(delaySamples);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
delayLine.process(context);
```

### Oscillator (for Synths)

```cpp
// Header
juce::dsp::Oscillator<float> oscillator;

// Constructor
oscillator = juce::dsp::Oscillator<float>(
    [](float x) { return std::sin(x); } // Sine wave
);

// prepareToPlay()
oscillator.prepare(spec);
oscillator.setFrequency(440.0f);

// processBlock()
float frequency = frequencyParam->load();
oscillator.setFrequency(frequency);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
oscillator.process(context);
```

## GUI Development

### Custom Components

Create reusable GUI components:

```cpp
// CustomKnob.h
class CustomKnob : public juce::Component
{
public:
    CustomKnob();
    void paint(juce::Graphics& g) override;
    void resized() override;

    juce::Slider& getSlider() { return slider; }

private:
    juce::Slider slider;
    juce::Label label;
};
```

### Look and Feel

Customize appearance:

```cpp
// CustomLookAndFeel.h
class CustomLookAndFeel : public juce::LookAndFeel_V4
{
public:
    void drawRotarySlider(juce::Graphics& g,
                         int x, int y, int width, int height,
                         float sliderPos,
                         float rotaryStartAngle,
                         float rotaryEndAngle,
                         juce::Slider& slider) override
    {
        // Custom drawing code
    }
};

// In Editor constructor
setLookAndFeel(&customLookAndFeel);

// In Editor destructor
setLookAndFeel(nullptr);
```

## Performance Tips

### 1. Avoid Allocations in `processBlock()`
```cpp
// Bad
void processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer&)
{
    std::vector<float> tempBuffer(buffer.getNumSamples()); // Allocation!
}

// Good - allocate in prepareToPlay()
std::vector<float> tempBuffer;

void prepareToPlay(double sampleRate, int samplesPerBlock)
{
    tempBuffer.resize(samplesPerBlock);
}
```

### 2. Use References for Parameters
```cpp
// Store atomic pointers for fast access
std::atomic<float>* gainParam = apvts.getRawParameterValue("gain");

// Fast load in processBlock
float gain = gainParam->load();
```

### 3. Smooth Parameter Changes
```cpp
juce::SmoothedValue<float> smoothedGain;

// In prepareToPlay()
smoothedGain.reset(sampleRate, 0.05); // 50ms smoothing

// In processBlock()
smoothedGain.setTargetValue(gainParam->load());

for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
{
    float currentGain = smoothedGain.getNextValue();
    // Use currentGain
}
```

## Testing

### 1. Unit Tests
Use JUCE's `UnitTest` framework:

```cpp
class MyPluginTests : public juce::UnitTest
{
public:
    MyPluginTests() : juce::UnitTest("MyPlugin Tests") {}

    void runTest() override
    {
        beginTest("Parameter ranges");

        AudioPluginProcessor processor;
        auto& params = processor.getValueTreeState();

        expect(params.getParameter("gain") != nullptr);
    }
};

static MyPluginTests myPluginTests;
```

### 2. Manual Testing
- Test in multiple DAWs (Reaper, Ableton, FL Studio, etc.)
- Test automation
- Test preset saving/loading
- Test with various sample rates (44.1k, 48k, 96k)
- Test with different buffer sizes (64, 128, 256, 512, 1024)

### 3. Performance Testing
- Use DAW's performance monitor
- Profile with Visual Studio Profiler / Instruments / Valgrind
- Test with multiple instances loaded

## Debugging

### Windows (Visual Studio)
1. Set breakpoints in your code
2. In VS, Debug → Attach to Process
3. Find your DAW process
4. Trigger plugin to hit breakpoints

### macOS (Xcode)
1. Open Xcode
2. Debug → Attach to Process
3. Select your DAW
4. Use LLDB for debugging

### Print Debugging
```cpp
DBG("Value: " << someValue); // Use JUCE's DBG macro
juce::Logger::writeToLog("Message"); // Or Logger
```

## Deployment

### Code Signing (macOS)
```bash
codesign --force --sign "Developer ID Application" YourPlugin.vst3
```

### Notarization (macOS)
Required for macOS 10.15+:
```bash
xcrun notarytool submit YourPlugin.zip --keychain-profile "notary-profile"
```

### Windows Installer
Use InnoSetup or NSIS to create installers.

## Best Practices

1. **Always test at different sample rates and buffer sizes**
2. **Use `ScopedNoDenormals` in `processBlock()`**
3. **Validate user input in GUI**
4. **Provide meaningful default values**
5. **Document your parameters**
6. **Use version control (git)**
7. **Test with both Debug and Release builds**
8. **Profile before optimizing**
9. **Keep UI responsive (avoid blocking operations)**
10. **Follow JUCE coding standards**

## Resources

- [JUCE API Documentation](https://docs.juce.com/)
- [JUCE Forum](https://forum.juce.com/)
- [DSP Module Guide](https://docs.juce.com/master/group__juce__dsp.html)
- [The Audio Programmer](https://www.youtube.com/c/TheAudioProgrammer)
- [WolfSound Audio Programming](https://thewolfsound.com/)

## Troubleshooting

### Plugin not showing in DAW
1. Check plugin is in correct VST3 folder
2. Rescan plugins in DAW
3. Check DAW's plugin blacklist
4. Verify plugin format matches DAW (32/64-bit)

### Audio glitches
1. Increase buffer size in DAW
2. Check for allocations in `processBlock()`
3. Profile for performance bottlenecks
4. Ensure thread safety

### Build errors
1. Check JUCE path is correct
2. Verify all JUCE modules are included
3. Check C++ standard is set to C++17
4. Clean and rebuild

---

Happy coding! If you have questions, check the JUCE forum or open an issue.
