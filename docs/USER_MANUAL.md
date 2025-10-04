# VST3 Plugin Template - User Manual

Complete guide for creating professional VST3 audio plugins using this template.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Your First Plugin](#creating-your-first-plugin)
3. [Customizing Your Plugin](#customizing-your-plugin)
4. [Adding Parameters](#adding-parameters)
5. [Implementing Audio Processing](#implementing-audio-processing)
6. [Designing the GUI](#designing-the-gui)
7. [Building and Testing](#building-and-testing)
8. [Advanced Topics](#advanced-topics)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- ✅ **Visual Studio 2022** with "Desktop development with C++" workload
- ✅ **CMake 3.22** or higher
- ✅ **JUCE 8.x** framework
- ✅ **Git** (for version control)

### Verify Your Setup

Run these commands to verify everything is installed:

```bash
cmake --version    # Should show 3.22+
cl                 # Should show MSVC compiler
```

---

## Creating Your First Plugin

### Step 1: Copy the Template

```bash
# Navigate to your projects folder
cd ~/projects

# Copy the template
cp -r ~/vst3-plugin-template my-awesome-reverb

# Navigate into your new plugin
cd my-awesome-reverb

# Initialize git
git init
git add .
git commit -m "Initial commit from VST3 template"
```

### Step 2: Configure Plugin Settings

Open `CMakeLists.txt` and update these settings at the top:

```cmake
# ============================================================================
# Project Configuration
# ============================================================================
set(PLUGIN_NAME "AwesomeReverb")           # Your plugin name
set(PLUGIN_VERSION "1.0.0")                # Version number
set(COMPANY_NAME "MyStudio")               # Your company/brand
set(COMPANY_WEBSITE "www.mystudio.com")    # Your website
set(COMPANY_EMAIL "info@mystudio.com")     # Contact email

# Plugin codes - Get unique ones at https://juce.com/admin/registration
set(PLUGIN_MANUFACTURER_CODE "Mstu")       # 4 chars, first uppercase
set(PLUGIN_CODE "Arev")                    # 4 chars, first uppercase

# Plugin type
set(PLUGIN_IS_SYNTH FALSE)                 # FALSE for effects
set(PLUGIN_NEEDS_MIDI_INPUT FALSE)         # TRUE if needs MIDI
set(PLUGIN_NEEDS_MIDI_OUTPUT FALSE)        # TRUE if produces MIDI
set(PLUGIN_IS_MIDI_EFFECT FALSE)           # TRUE for MIDI effects

# Build formats
set(PLUGIN_FORMATS VST3)                   # VST3, AU, Standalone, AAX
```

### Step 3: Build Your Plugin

```powershell
# Set up Visual Studio environment
. C:\Users\YourName\build_vst3.ps1

# Configure the project
cmake -G "Visual Studio 17 2022" -A x64 -B build

# Build in Release mode
cmake --build build --config Release
```

**Your plugin will be installed to:**
```
C:\Program Files\Common Files\VST3\AwesomeReverb.vst3
```

---

## Customizing Your Plugin

### Understanding the File Structure

```
my-awesome-reverb/
├── CMakeLists.txt              # Build configuration
├── include/
│   ├── PluginProcessor.h       # Audio processing header
│   └── PluginEditor.h          # GUI header
└── source/
    ├── PluginProcessor.cpp     # Audio processing implementation
    └── PluginEditor.cpp        # GUI implementation
```

### Renaming Your Plugin Class

By default, classes are named `AudioPluginProcessor` and `AudioPluginEditor`. You can rename them:

1. **Search and replace** across all files:
   - `AudioPluginProcessor` → `AwesomeReverbProcessor`
   - `AudioPluginEditor` → `AwesomeReverbEditor`

2. **Update includes** to match new names

---

## Adding Parameters

Parameters are controls like knobs, sliders, and switches that users can adjust.

### Step 1: Define Parameters in CMakeLists

Open `source/PluginProcessor.cpp` and find `createParameterLayout()`:

```cpp
juce::AudioProcessorValueTreeState::ParameterLayout
AudioPluginProcessor::createParameterLayout()
{
    juce::AudioProcessorValueTreeState::ParameterLayout layout;

    // Room Size parameter (0.0 to 1.0)
    layout.add(std::make_unique<juce::AudioParameterFloat>(
        "roomSize",                      // Parameter ID (use in code)
        "Room Size",                     // Display name (shown in DAW)
        juce::NormalisableRange<float>(
            0.0f,                        // Minimum value
            1.0f,                        // Maximum value
            0.01f                        // Step size
        ),
        0.5f                             // Default value
    ));

    // Damping parameter (0% to 100%)
    layout.add(std::make_unique<juce::AudioParameterFloat>(
        "damping",
        "Damping",
        juce::NormalisableRange<float>(0.0f, 100.0f, 0.1f),
        50.0f
    ));

    // Mix parameter (dry/wet)
    layout.add(std::make_unique<juce::AudioParameterFloat>(
        "mix",
        "Mix",
        juce::NormalisableRange<float>(0.0f, 100.0f, 1.0f),
        50.0f
    ));

    return layout;
}
```

### Step 2: Get Parameter Pointers

In `PluginProcessor.h`, add member variables:

```cpp
private:
    // Parameter pointers for efficient access
    std::atomic<float>* roomSizeParam = nullptr;
    std::atomic<float>* dampingParam = nullptr;
    std::atomic<float>* mixParam = nullptr;
```

In `PluginProcessor.cpp` constructor, get the pointers:

```cpp
AudioPluginProcessor::AudioPluginProcessor()
    : AudioProcessor(BusesProperties()
          .withInput("Input", juce::AudioChannelSet::stereo(), true)
          .withOutput("Output", juce::AudioChannelSet::stereo(), true)),
      apvts(*this, nullptr, "Parameters", createParameterLayout())
{
    // Get parameter pointers for fast access
    roomSizeParam = apvts.getRawParameterValue("roomSize");
    dampingParam = apvts.getRawParameterValue("damping");
    mixParam = apvts.getRawParameterValue("mix");
}
```

### Step 3: Use Parameters in Processing

In `processBlock()`:

```cpp
void AudioPluginProcessor::processBlock(
    juce::AudioBuffer<float>& buffer,
    juce::MidiBuffer& midiMessages)
{
    juce::ScopedNoDenormals noDenormals;

    // Get current parameter values
    float roomSize = roomSizeParam->load();
    float damping = dampingParam->load();
    float mix = mixParam->load() / 100.0f; // Convert 0-100 to 0-1

    // Use these values in your DSP processing
    // ...
}
```

### Parameter Types

**Float Parameter:**
```cpp
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "paramID", "Param Name",
    juce::NormalisableRange<float>(min, max, step, skew),
    defaultValue
));
```

**Choice Parameter (dropdown):**
```cpp
layout.add(std::make_unique<juce::AudioParameterChoice>(
    "filterType", "Filter Type",
    juce::StringArray{"Lowpass", "Highpass", "Bandpass"},
    0  // Default to first option
));
```

**Boolean Parameter (on/off):**
```cpp
layout.add(std::make_unique<juce::AudioParameterBool>(
    "bypass", "Bypass",
    false  // Default off
));
```

---

## Implementing Audio Processing

### Using JUCE DSP Modules

The template includes `juce_dsp` for professional audio processing.

### Example 1: Simple Gain

Already included in the template:

```cpp
#include <juce_dsp/juce_dsp.h>

// In PluginProcessor.h
private:
    juce::dsp::Gain<float> gain;

// In prepareToPlay()
void AudioPluginProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    juce::dsp::ProcessSpec spec;
    spec.sampleRate = sampleRate;
    spec.maximumBlockSize = samplesPerBlock;
    spec.numChannels = getTotalNumOutputChannels();

    gain.prepare(spec);
    gain.setRampDurationSeconds(0.05); // Smooth changes
}

// In processBlock()
void AudioPluginProcessor::processBlock(
    juce::AudioBuffer<float>& buffer,
    juce::MidiBuffer& midiMessages)
{
    float gainDb = gainParameter->load();
    gain.setGainDecibels(gainDb);

    juce::dsp::AudioBlock<float> block(buffer);
    juce::dsp::ProcessContextReplacing<float> context(block);
    gain.process(context);
}
```

### Example 2: Low-Pass Filter

```cpp
// In PluginProcessor.h
#include <juce_dsp/juce_dsp.h>

private:
    using Filter = juce::dsp::ProcessorDuplicator<
        juce::dsp::IIR::Filter<float>,
        juce::dsp::IIR::Coefficients<float>>;

    Filter lowpassFilter;
    std::atomic<float>* cutoffParam = nullptr;

// In createParameterLayout()
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "cutoff", "Cutoff",
    juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.25f),
    1000.0f
));

// In constructor
cutoffParam = apvts.getRawParameterValue("cutoff");

// In prepareToPlay()
lowpassFilter.prepare(spec);

// In processBlock()
float cutoff = cutoffParam->load();
*lowpassFilter.state = *juce::dsp::IIR::Coefficients<float>::makeLowPass(
    sampleRate, cutoff, 0.707f
);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);
lowpassFilter.process(context);
```

### Example 3: Delay Effect

```cpp
// In PluginProcessor.h
private:
    juce::dsp::DelayLine<float, juce::dsp::DelayLineInterpolationTypes::Linear> delay;
    std::atomic<float>* delayTimeParam = nullptr;
    std::atomic<float>* feedbackParam = nullptr;

// Add parameters
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "delayTime", "Delay Time",
    juce::NormalisableRange<float>(0.0f, 2000.0f, 1.0f),
    500.0f  // 500ms default
));

layout.add(std::make_unique<juce::AudioParameterFloat>(
    "feedback", "Feedback",
    juce::NormalisableRange<float>(0.0f, 0.95f, 0.01f),
    0.5f
));

// In prepareToPlay()
delay.prepare(spec);
delay.setMaximumDelayInSamples(sampleRate * 5.0); // 5 second max

// In processBlock()
float delayTimeMs = delayTimeParam->load();
float feedback = feedbackParam->load();

int delaySamples = static_cast<int>(delayTimeMs * sampleRate / 1000.0f);
delay.setDelay(delaySamples);

juce::dsp::AudioBlock<float> block(buffer);
juce::dsp::ProcessContextReplacing<float> context(block);

for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
{
    auto* channelData = buffer.getWritePointer(channel);

    for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
    {
        float input = channelData[sample];
        float delayedSample = delay.popSample(channel);

        delay.pushSample(channel, input + delayedSample * feedback);
        channelData[sample] = input + delayedSample;
    }
}
```

---

## Designing the GUI

### Basic GUI Layout

The template includes a simple GUI with a rotary knob. Let's expand it.

### Step 1: Add GUI Components in PluginEditor.h

```cpp
#include <juce_audio_processors/juce_audio_processors.h>
#include "PluginProcessor.h"

class AudioPluginEditor : public juce::AudioProcessorEditor
{
public:
    AudioPluginEditor(AudioPluginProcessor&);
    ~AudioPluginEditor() override;

    void paint(juce::Graphics&) override;
    void resized() override;

private:
    AudioPluginProcessor& audioProcessor;

    // Sliders
    juce::Slider roomSizeSlider;
    juce::Slider dampingSlider;
    juce::Slider mixSlider;

    // Labels
    juce::Label roomSizeLabel;
    juce::Label dampingLabel;
    juce::Label mixLabel;

    // Attachments (connect sliders to parameters)
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> roomSizeAttachment;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> dampingAttachment;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> mixAttachment;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioPluginEditor)
};
```

### Step 2: Set Up GUI in PluginEditor.cpp

```cpp
#include "PluginProcessor.h"
#include "PluginEditor.h"

AudioPluginEditor::AudioPluginEditor(AudioPluginProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    setSize(600, 400);

    // === Room Size Slider ===
    roomSizeSlider.setSliderStyle(juce::Slider::RotaryVerticalDrag);
    roomSizeSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    addAndMakeVisible(roomSizeSlider);

    roomSizeLabel.setText("Room Size", juce::dontSendNotification);
    roomSizeLabel.setJustificationType(juce::Justification::centred);
    roomSizeLabel.attachToComponent(&roomSizeSlider, false);
    addAndMakeVisible(roomSizeLabel);

    roomSizeAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getValueTreeState(), "roomSize", roomSizeSlider
    );

    // === Damping Slider ===
    dampingSlider.setSliderStyle(juce::Slider::RotaryVerticalDrag);
    dampingSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    dampingSlider.setTextValueSuffix(" %");
    addAndMakeVisible(dampingSlider);

    dampingLabel.setText("Damping", juce::dontSendNotification);
    dampingLabel.setJustificationType(juce::Justification::centred);
    dampingLabel.attachToComponent(&dampingSlider, false);
    addAndMakeVisible(dampingLabel);

    dampingAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getValueTreeState(), "damping", dampingSlider
    );

    // === Mix Slider ===
    mixSlider.setSliderStyle(juce::Slider::LinearHorizontal);
    mixSlider.setTextBoxStyle(juce::Slider::TextBoxRight, false, 60, 20);
    mixSlider.setTextValueSuffix(" %");
    addAndMakeVisible(mixSlider);

    mixLabel.setText("Mix", juce::dontSendNotification);
    mixLabel.setJustificationType(juce::Justification::centredLeft);
    addAndMakeVisible(mixLabel);

    mixAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getValueTreeState(), "mix", mixSlider
    );
}

AudioPluginEditor::~AudioPluginEditor()
{
}

void AudioPluginEditor::paint(juce::Graphics& g)
{
    // Background gradient
    g.fillAll(juce::Colour(0xff2a2a2a));

    // Title bar
    g.setGradientFill(juce::ColourGradient(
        juce::Colour(0xff4a4a4a), 0, 0,
        juce::Colour(0xff2a2a2a), 0, 60,
        false
    ));
    g.fillRect(0, 0, getWidth(), 60);

    // Plugin title
    g.setColour(juce::Colours::white);
    g.setFont(juce::Font(28.0f, juce::Font::bold));
    g.drawText("Awesome Reverb", 20, 10, getWidth() - 40, 40,
               juce::Justification::centredLeft);

    // Version
    g.setFont(juce::Font(12.0f));
    g.setColour(juce::Colours::lightgrey);
    g.drawText("v1.0.0", getWidth() - 80, 20, 60, 20,
               juce::Justification::centredRight);
}

void AudioPluginEditor::resized()
{
    auto bounds = getLocalBounds();
    bounds.removeFromTop(80); // Space for title

    auto knobArea = bounds.removeFromTop(200);
    int knobWidth = knobArea.getWidth() / 2;

    // Room Size knob (left)
    roomSizeSlider.setBounds(knobArea.removeFromLeft(knobWidth).reduced(20));

    // Damping knob (right)
    dampingSlider.setBounds(knobArea.reduced(20));

    // Mix slider at bottom
    bounds.removeFromTop(20); // Spacing
    auto mixArea = bounds.removeFromTop(60).reduced(40, 10);

    mixLabel.setBounds(mixArea.removeFromLeft(60));
    mixSlider.setBounds(mixArea);
}
```

### Custom Colors and Styling

Add custom look and feel:

```cpp
// In PluginEditor.h
private:
    class CustomLookAndFeel : public juce::LookAndFeel_V4
    {
    public:
        CustomLookAndFeel()
        {
            setColour(juce::Slider::thumbColourId, juce::Colour(0xff00ff00));
            setColour(juce::Slider::rotarySliderFillColourId, juce::Colour(0xff4CAF50));
            setColour(juce::Slider::rotarySliderOutlineColourId, juce::Colour(0xff2a2a2a));
        }
    };

    CustomLookAndFeel customLF;

// In constructor
setLookAndFeel(&customLF);

// In destructor
setLookAndFeel(nullptr);
```

---

## Building and Testing

### Debug vs Release Builds

**Debug Build** (for development):
```powershell
cmake --build build --config Debug
```
- Slower performance
- Includes debugging symbols
- Easier to find bugs

**Release Build** (for distribution):
```powershell
cmake --build build --config Release
```
- Optimized performance
- Smaller file size
- No debug info

### Clean Rebuild

If you encounter build issues:

```powershell
# Delete build folder
rm -rf build

# Reconfigure
cmake -G "Visual Studio 17 2022" -A x64 -B build

# Build
cmake --build build --config Release
```

### Testing in a DAW

1. **Install a free DAW:**
   - Reaper (60-day trial)
   - Cakewalk (free)
   - Tracktion Waveform (free)

2. **Load your plugin:**
   - Rescan plugins in DAW settings
   - Look for your plugin name in effects list
   - Load on an audio track

3. **Test automation:**
   - Move knobs while playing
   - Automate parameters in timeline
   - Check preset save/load

---

## Advanced Topics

### Adding Preset Management

Create a presets folder and save/load functionality:

```cpp
// In PluginProcessor.h
void savePreset(const juce::File& file);
void loadPreset(const juce::File& file);

// In PluginProcessor.cpp
void AudioPluginProcessor::savePreset(const juce::File& file)
{
    auto state = apvts.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    xml->writeTo(file);
}

void AudioPluginProcessor::loadPreset(const juce::File& file)
{
    if (file.existsAsFile())
    {
        std::unique_ptr<juce::XmlElement> xml(juce::XmlDocument::parse(file));
        if (xml != nullptr)
        {
            auto state = juce::ValueTree::fromXml(*xml);
            apvts.replaceState(state);
        }
    }
}
```

### Building for macOS

On macOS, the process is similar:

```bash
cmake -DJUCE_DIR=/path/to/JUCE -B build
cmake --build build --config Release
```

Plugin will be in:
```
~/Library/Audio/Plug-Ins/VST3/YourPlugin.vst3
```

### Creating an Installer

**Windows (InnoSetup):**

1. Download InnoSetup
2. Create installer script:

```inno
[Setup]
AppName=Awesome Reverb
AppVersion=1.0.0
DefaultDirName={commoncf}\VST3

[Files]
Source: "build\*_artefacts\Release\VST3\*.vst3"; DestDir: "{app}"; Flags: recursesubdirs
```

---

## Troubleshooting

### Plugin Not Showing in DAW

**Solution:**
1. Check plugin is in: `C:\Program Files\Common Files\VST3\`
2. Rescan plugins in DAW settings
3. Check DAW's plugin blacklist
4. Verify 64-bit VST3 is supported

### Build Errors

**CMake can't find JUCE:**
```cmake
# Set JUCE_DIR explicitly
cmake -DJUCE_DIR="C:/path/to/JUCE" -B build
```

**Compiler errors:**
- Clean and rebuild
- Check C++ standard is set to 17
- Verify all includes are correct

### Audio Glitches

**Solutions:**
1. Increase buffer size in DAW
2. Remove allocations from `processBlock()`
3. Use `ScopedNoDenormals`
4. Profile for performance bottlenecks

### Parameter Not Responding

**Check:**
1. Parameter ID matches in layout and attachment
2. Attachment is created correctly
3. Parameter pointer is not null
4. Parameter is used in `processBlock()`

---

## Next Steps

1. **Experiment** with different DSP algorithms
2. **Study** JUCE examples in `JUCE/examples/`
3. **Join** the JUCE forum: forum.juce.com
4. **Watch** The Audio Programmer on YouTube
5. **Read** JUCE documentation: docs.juce.com

## Support

- **GitHub Issues:** Report bugs at your repository
- **JUCE Forum:** forum.juce.com
- **Documentation:** See `docs/DEVELOPMENT.md` for advanced patterns

---

**Happy plugin development!** 🎵

Built with ❤️ using JUCE 8 and CMake
