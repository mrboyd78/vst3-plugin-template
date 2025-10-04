# VST3 Plugin Template - Quick Reference Guide

Fast reference for common tasks and code snippets.

## Table of Contents

- [Project Configuration](#project-configuration)
- [Parameter Types](#parameter-types)
- [DSP Examples](#dsp-examples)
- [GUI Components](#gui-components)
- [Common Patterns](#common-patterns)
- [Build Commands](#build-commands)
- [File Locations](#file-locations)

---

## Project Configuration

### CMakeLists.txt Settings

```cmake
# Basic plugin info
set(PLUGIN_NAME "YourPlugin")
set(PLUGIN_VERSION "1.0.0")
set(COMPANY_NAME "YourCompany")

# Plugin codes (get from juce.com/admin/registration)
set(PLUGIN_MANUFACTURER_CODE "Abcd")  # 4 chars
set(PLUGIN_CODE "Efgh")               # 4 chars

# Plugin type
set(PLUGIN_IS_SYNTH FALSE)            # TRUE for synth
set(PLUGIN_NEEDS_MIDI_INPUT FALSE)    # TRUE for MIDI
set(PLUGIN_FORMATS VST3)              # VST3 AU Standalone AAX
```

---

## Parameter Types

### Float Parameter

```cpp
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "paramID",                    // ID for code
    "Param Name",                 // Display name
    juce::NormalisableRange<float>(
        0.0f,                     // Min
        100.0f,                   // Max
        0.1f,                     // Step
        1.0f                      // Skew (1.0 = linear)
    ),
    50.0f                         // Default
));
```

**Skew values:**
- `1.0` = Linear
- `0.5` = More precision at low end
- `2.0` = More precision at high end
- `0.25` = Logarithmic (good for frequency)

### Float with Units

```cpp
// Decibels
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "gain", "Gain",
    juce::NormalisableRange<float>(-60.0f, 12.0f, 0.1f),
    0.0f
));
// In GUI: slider.setTextValueSuffix(" dB");

// Hertz
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "frequency", "Frequency",
    juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.25f),
    1000.0f
));
// In GUI: slider.setTextValueSuffix(" Hz");

// Milliseconds
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "delay", "Delay",
    juce::NormalisableRange<float>(0.0f, 2000.0f, 1.0f),
    500.0f
));
// In GUI: slider.setTextValueSuffix(" ms");

// Percentage
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "mix", "Mix",
    juce::NormalisableRange<float>(0.0f, 100.0f, 1.0f),
    50.0f
));
// In GUI: slider.setTextValueSuffix(" %");
```

### Choice Parameter (Dropdown)

```cpp
layout.add(std::make_unique<juce::AudioParameterChoice>(
    "filterType",
    "Filter Type",
    juce::StringArray{"Lowpass", "Highpass", "Bandpass", "Notch"},
    0  // Default index
));

// Usage in processBlock()
int filterType = filterTypeParam->load();
switch (filterType) {
    case 0: /* Lowpass */ break;
    case 1: /* Highpass */ break;
    case 2: /* Bandpass */ break;
    case 3: /* Notch */ break;
}
```

### Boolean Parameter (Toggle)

```cpp
layout.add(std::make_unique<juce::AudioParameterBool>(
    "bypass",
    "Bypass",
    false  // Default off
));

// Usage
bool bypass = bypassParam->load();
if (bypass)
    return; // Skip processing
```

### Integer Parameter

```cpp
layout.add(std::make_unique<juce::AudioParameterInt>(
    "voices",
    "Voices",
    1,      // Min
    16,     // Max
    8       // Default
));
```

---

## DSP Examples

### Gain (Included in Template)

```cpp
// Header
juce::dsp::Gain<float> gain;
std::atomic<float>* gainParam = nullptr;

// Constructor
gainParam = apvts.getRawParameterValue("gain");

// prepareToPlay()
gain.prepare(spec);
gain.setRampDurationSeconds(0.05);

// processBlock()
float gainDb = gainParam->load();
gain.setGainDecibels(gainDb);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
gain.process(context);
```

### Low-Pass Filter

```cpp
// Header
using Filter = juce::dsp::ProcessorDuplicator<
    juce::dsp::IIR::Filter<float>,
    juce::dsp::IIR::Coefficients<float>>;
Filter lowpassFilter;

// prepareToPlay()
lowpassFilter.prepare(spec);

// processBlock()
float cutoff = cutoffParam->load();
*lowpassFilter.state = *juce::dsp::IIR::Coefficients<float>::makeLowPass(
    sampleRate, cutoff, 0.707f
);
lowpassFilter.process(context);
```

### High-Pass Filter

```cpp
*highpassFilter.state = *juce::dsp::IIR::Coefficients<float>::makeHighPass(
    sampleRate, cutoff, 0.707f
);
```

### Band-Pass Filter

```cpp
*bandpassFilter.state = *juce::dsp::IIR::Coefficients<float>::makeBandPass(
    sampleRate, centerFreq, Q
);
```

### Notch Filter

```cpp
*notchFilter.state = *juce::dsp::IIR::Coefficients<float>::makeNotch(
    sampleRate, centerFreq, Q
);
```

### Delay Line

```cpp
// Header
juce::dsp::DelayLine<float> delay;

// prepareToPlay()
delay.prepare(spec);
delay.setMaximumDelayInSamples(sampleRate * 5.0); // 5 sec max

// processBlock()
float delayMs = delayParam->load();
int delaySamples = delayMs * sampleRate / 1000.0f;
delay.setDelay(delaySamples);

for (int channel = 0; channel < buffer.getNumChannels(); ++channel) {
    auto* data = buffer.getWritePointer(channel);
    for (int i = 0; i < buffer.getNumSamples(); ++i) {
        float delayed = delay.popSample(channel);
        delay.pushSample(channel, data[i]);
        data[i] = delayed;
    }
}
```

### Reverb

```cpp
// Header
juce::dsp::Reverb reverb;

// prepareToPlay()
reverb.prepare(spec);

// processBlock()
juce::dsp::Reverb::Parameters params;
params.roomSize = roomSizeParam->load();
params.damping = dampingParam->load();
params.wetLevel = mixParam->load() / 100.0f;
params.dryLevel = 1.0f - params.wetLevel;
params.width = 1.0f;
reverb.setParameters(params);

reverb.process(context);
```

### Compressor

```cpp
// Header
juce::dsp::Compressor<float> compressor;

// prepareToPlay()
compressor.prepare(spec);

// processBlock()
compressor.setThreshold(thresholdParam->load());
compressor.setRatio(ratioParam->load());
compressor.setAttack(attackParam->load());
compressor.setRelease(releaseParam->load());

compressor.process(context);
```

### Limiter

```cpp
// Header
juce::dsp::Limiter<float> limiter;

// prepareToPlay()
limiter.prepare(spec);

// processBlock()
limiter.setThreshold(thresholdParam->load());
limiter.setRelease(releaseParam->load());

limiter.process(context);
```

### Oscillator (for Synths)

```cpp
// Header
juce::dsp::Oscillator<float> oscillator;

// Constructor
oscillator = juce::dsp::Oscillator<float>([](float x) {
    return std::sin(x);  // Sine wave
});
// Other waveforms:
// return x / juce::MathConstants<float>::pi;  // Saw
// return x < 0.0f ? -1.0f : 1.0f;             // Square
// return 2.0f * std::abs(x / juce::MathConstants<float>::pi) - 1.0f; // Triangle

// prepareToPlay()
oscillator.prepare(spec);

// processBlock()
float freq = frequencyParam->load();
oscillator.setFrequency(freq);
oscillator.process(context);
```

---

## GUI Components

### Rotary Knob

```cpp
// Header
juce::Slider knob;
juce::Label label;
std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> attachment;

// Constructor
knob.setSliderStyle(juce::Slider::RotaryVerticalDrag);
knob.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
knob.setTextValueSuffix(" dB");
addAndMakeVisible(knob);

label.setText("Gain", juce::dontSendNotification);
label.setJustificationType(juce::Justification::centred);
label.attachToComponent(&knob, false);
addAndMakeVisible(label);

attachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
    audioProcessor.getValueTreeState(), "gain", knob
);

// resized()
knob.setBounds(x, y, 100, 100);
```

### Linear Slider (Horizontal)

```cpp
slider.setSliderStyle(juce::Slider::LinearHorizontal);
slider.setTextBoxStyle(juce::Slider::TextBoxRight, false, 60, 20);
```

### Linear Slider (Vertical)

```cpp
slider.setSliderStyle(juce::Slider::LinearVertical);
slider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 60, 20);
```

### ComboBox (Dropdown)

```cpp
// Header
juce::ComboBox comboBox;
std::unique_ptr<juce::AudioProcessorValueTreeState::ComboBoxAttachment> attachment;

// Constructor
comboBox.addItem("Option 1", 1);
comboBox.addItem("Option 2", 2);
comboBox.addItem("Option 3", 3);
addAndMakeVisible(comboBox);

attachment = std::make_unique<juce::AudioProcessorValueTreeState::ComboBoxAttachment>(
    audioProcessor.getValueTreeState(), "choice", comboBox
);
```

### Toggle Button

```cpp
// Header
juce::ToggleButton button;
std::unique_ptr<juce::AudioProcessorValueTreeState::ButtonAttachment> attachment;

// Constructor
button.setButtonText("Bypass");
addAndMakeVisible(button);

attachment = std::make_unique<juce::AudioProcessorValueTreeState::ButtonAttachment>(
    audioProcessor.getValueTreeState(), "bypass", button
);
```

### Custom Colors

```cpp
// In paint()
g.fillAll(juce::Colour(0xff1a1a1a));           // Dark background
g.setColour(juce::Colours::white);
g.setColour(juce::Colour(0xff4CAF50));         // Custom green
g.setGradientFill(juce::ColourGradient(
    juce::Colour(0xff000000), 0, 0,
    juce::Colour(0xff333333), 0, getHeight(),
    false
));
```

---

## Common Patterns

### Smooth Parameter Changes

```cpp
// Header
juce::SmoothedValue<float> smoothedGain;

// prepareToPlay()
smoothedGain.reset(sampleRate, 0.05); // 50ms ramp

// processBlock()
smoothedGain.setTargetValue(gainParam->load());

for (int i = 0; i < buffer.getNumSamples(); ++i) {
    float gain = smoothedGain.getNextValue();
    // Use gain for this sample
}
```

### Dry/Wet Mix

```cpp
// processBlock()
juce::AudioBuffer<float> dryBuffer;
dryBuffer.makeCopyOf(buffer);

// Process effect
yourEffect.process(buffer);

// Mix
float mix = mixParam->load() / 100.0f; // 0-100 to 0-1
for (int ch = 0; ch < buffer.getNumChannels(); ++ch) {
    auto* wet = buffer.getWritePointer(ch);
    auto* dry = dryBuffer.getReadPointer(ch);
    for (int i = 0; i < buffer.getNumSamples(); ++i) {
        wet[i] = dry[i] * (1.0f - mix) + wet[i] * mix;
    }
}
```

### Level Metering

```cpp
// Header
std::atomic<float> currentLevel{0.0f};

// processBlock()
float levelSquared = 0.0f;
for (int ch = 0; ch < buffer.getNumChannels(); ++ch) {
    auto* data = buffer.getReadPointer(ch);
    for (int i = 0; i < buffer.getNumSamples(); ++i) {
        levelSquared += data[i] * data[i];
    }
}
float rms = std::sqrt(levelSquared / (buffer.getNumChannels() * buffer.getNumSamples()));
float db = juce::Decibels::gainToDecibels(rms, -60.0f);
currentLevel.store(db);

// In GUI paint()
float level = audioProcessor.getCurrentLevel();
g.fillRect(0, 0, (int)(level * getWidth()), 20);
```

### Input/Output Gain

```cpp
// Header
juce::dsp::Gain<float> inputGain, outputGain;

// processBlock()
inputGain.setGainDecibels(inputGainParam->load());
inputGain.process(context);

// Your processing here

outputGain.setGainDecibels(outputGainParam->load());
outputGain.process(context);
```

---

## Build Commands

### Configure Project

```powershell
# Windows
. C:\Users\YourName\build_vst3.ps1
cmake -G "Visual Studio 17 2022" -A x64 -B build

# macOS/Linux
cmake -DJUCE_DIR=/path/to/JUCE -B build
```

### Build Release

```powershell
cmake --build build --config Release
```

### Build Debug

```powershell
cmake --build build --config Debug
```

### Clean Build

```powershell
rm -rf build
cmake -G "Visual Studio 17 2022" -A x64 -B build
cmake --build build --config Release
```

### Build Specific Target

```powershell
cmake --build build --config Release --target YourPlugin_VST3
```

---

## File Locations

### Windows

**VST3 Plugins:**
```
C:\Program Files\Common Files\VST3\
```

**User Presets:**
```
C:\Users\YourName\AppData\Roaming\YourCompany\YourPlugin\
```

**Build Output:**
```
build\YourPlugin_artefacts\Release\VST3\YourPlugin.vst3
```

### macOS

**VST3 Plugins:**
```
/Library/Audio/Plug-Ins/VST3/
~/Library/Audio/Plug-Ins/VST3/
```

**AU Plugins:**
```
/Library/Audio/Plug-Ins/Components/
~/Library/Audio/Plug-Ins/Components/
```

**User Presets:**
```
~/Library/Application Support/YourCompany/YourPlugin/
```

### Linux

**VST3 Plugins:**
```
~/.vst3/
/usr/lib/vst3/
```

---

## Useful Conversions

```cpp
// Decibels to gain
float gain = juce::Decibels::decibelsToGain(db);

// Gain to decibels
float db = juce::Decibels::gainToDecibels(gain, -60.0f);

// MIDI note to frequency
float freq = juce::MidiMessage::getMidiNoteInHertz(midiNote);

// Frequency to MIDI note
float note = juce::MidiMessage::getFrequencyInHertz(freq);

// Milliseconds to samples
int samples = static_cast<int>(ms * sampleRate / 1000.0f);

// Samples to milliseconds
float ms = samples * 1000.0f / sampleRate;

// Normalize 0-100 to 0-1
float normalized = value / 100.0f;

// Percentage to 0-1
float ratio = percentage * 0.01f;
```

---

## Common JUCE Classes

### Audio
- `juce::AudioBuffer<float>` - Audio sample buffer
- `juce::MidiBuffer` - MIDI message buffer
- `juce::AudioProcessorValueTreeState` - Parameter management
- `juce::dsp::ProcessSpec` - DSP setup info

### DSP
- `juce::dsp::Gain<float>` - Gain/volume
- `juce::dsp::IIR::Filter<float>` - Filters
- `juce::dsp::DelayLine<float>` - Delay
- `juce::dsp::Reverb` - Reverb effect
- `juce::dsp::Compressor<float>` - Compressor
- `juce::dsp::Limiter<float>` - Limiter
- `juce::dsp::Oscillator<float>` - Oscillator

### GUI
- `juce::Slider` - Knobs and sliders
- `juce::Label` - Text labels
- `juce::Button` - Buttons
- `juce::ComboBox` - Dropdowns
- `juce::Graphics` - Drawing
- `juce::Colour` - Colors

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Plugin not in DAW | Rescan plugins, check VST3 folder |
| Build errors | Clean rebuild, check JUCE_DIR |
| Parameters not working | Check attachment IDs match |
| Audio glitches | Increase buffer, remove allocations |
| Crash on load | Check prepareToPlay() initialization |
| GUI not updating | Use Timer for repaints |

---

## Resources

- **JUCE Docs:** https://docs.juce.com/
- **JUCE Forum:** https://forum.juce.com/
- **JUCE Tutorials:** https://juce.com/learn/tutorials
- **DSP Module:** https://docs.juce.com/master/group__juce__dsp.html
- **The Audio Programmer:** https://www.youtube.com/c/TheAudioProgrammer

---

**Quick Reference v1.0** | Updated 2025
