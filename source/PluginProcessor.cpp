#include "../include/PluginProcessor.h"
#include "../include/PluginEditor.h"

//==============================================================================
AudioPluginProcessor::AudioPluginProcessor()
    : AudioProcessor(BusesProperties()
#if !JucePlugin_IsMidiEffect
#if !JucePlugin_IsSynth
                         .withInput("Input", juce::AudioChannelSet::stereo(), true)
#endif
                         .withOutput("Output", juce::AudioChannelSet::stereo(), true)
#endif
                         ),
      apvts(*this, nullptr, "Parameters", createParameterLayout())
{
    // Get parameter pointers for efficient access
    gainParameter = apvts.getRawParameterValue("gain");
}

AudioPluginProcessor::~AudioPluginProcessor()
{
}

//==============================================================================
juce::AudioProcessorValueTreeState::ParameterLayout AudioPluginProcessor::createParameterLayout()
{
    juce::AudioProcessorValueTreeState::ParameterLayout layout;

    // Example: Gain parameter (-60 dB to +12 dB)
    layout.add(std::make_unique<juce::AudioParameterFloat>(
        "gain",                          // Parameter ID
        "Gain",                          // Parameter name
        juce::NormalisableRange<float>(
            -60.0f,                      // Min value (dB)
            12.0f,                       // Max value (dB)
            0.1f,                        // Step size
            1.0f                         // Skew factor (1.0 = linear)
        ),
        0.0f                             // Default value (dB)
    ));

    // Add more parameters here as needed
    // Example:
    // layout.add(std::make_unique<juce::AudioParameterFloat>(
    //     "frequency", "Frequency",
    //     juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.25f),
    //     1000.0f
    // ));

    return layout;
}

//==============================================================================
const juce::String AudioPluginProcessor::getName() const
{
    return JucePlugin_Name;
}

bool AudioPluginProcessor::acceptsMidi() const
{
#if JucePlugin_WantsMidiInput
    return true;
#else
    return false;
#endif
}

bool AudioPluginProcessor::producesMidi() const
{
#if JucePlugin_ProducesMidiOutput
    return true;
#else
    return false;
#endif
}

bool AudioPluginProcessor::isMidiEffect() const
{
#if JucePlugin_IsMidiEffect
    return true;
#else
    return false;
#endif
}

double AudioPluginProcessor::getTailLengthSeconds() const
{
    return 0.0;
}

//==============================================================================
int AudioPluginProcessor::getNumPrograms()
{
    return 1; // Some hosts require at least 1 program
}

int AudioPluginProcessor::getCurrentProgram()
{
    return 0;
}

void AudioPluginProcessor::setCurrentProgram(int /*index*/)
{
}

const juce::String AudioPluginProcessor::getProgramName(int /*index*/)
{
    return {};
}

void AudioPluginProcessor::changeProgramName(int /*index*/, const juce::String& /*newName*/)
{
}

//==============================================================================
void AudioPluginProcessor::prepareToPlay(double sampleRate, int samplesPerBlock)
{
    // Initialize DSP processors
    juce::dsp::ProcessSpec spec;
    spec.sampleRate = sampleRate;
    spec.maximumBlockSize = static_cast<juce::uint32>(samplesPerBlock);
    spec.numChannels = static_cast<juce::uint32>(getTotalNumOutputChannels());

    gain.prepare(spec);
    gain.setRampDurationSeconds(0.05); // 50ms ramp for smooth parameter changes
}

void AudioPluginProcessor::releaseResources()
{
    // Release any resources here
}

bool AudioPluginProcessor::isBusesLayoutSupported(const BusesLayout& layouts) const
{
#if JucePlugin_IsMidiEffect
    juce::ignoreUnused(layouts);
    return true;
#else
    // Ensure stereo/mono I/O
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
        && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

#if !JucePlugin_IsSynth
    // For effects, input and output must match
    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;
#endif

    return true;
#endif
}

void AudioPluginProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer& /*midiMessages*/)
{
    juce::ScopedNoDenormals noDenormals;
    auto totalNumInputChannels = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    // Clear any output channels that don't have input
    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear(i, 0, buffer.getNumSamples());

    // Update DSP parameters
    float gainValue = juce::Decibels::decibelsToGain(gainParameter->load());
    gain.setGainLinear(gainValue);

    // Process audio
    juce::dsp::AudioBlock<float> block(buffer);
    juce::dsp::ProcessContextReplacing<float> context(block);
    gain.process(context);

    // Add your custom processing here
}

//==============================================================================
bool AudioPluginProcessor::hasEditor() const
{
    return true; // Set to false if you don't want a GUI
}

juce::AudioProcessorEditor* AudioPluginProcessor::createEditor()
{
    return new AudioPluginEditor(*this);

    // Alternative: Use generic editor for quick testing
    // return new juce::GenericAudioProcessorEditor(*this);
}

//==============================================================================
void AudioPluginProcessor::getStateInformation(juce::MemoryBlock& destData)
{
    // Save parameters to XML
    auto state = apvts.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void AudioPluginProcessor::setStateInformation(const void* data, int sizeInBytes)
{
    // Restore parameters from XML
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));

    if (xmlState != nullptr)
        if (xmlState->hasTagName(apvts.state.getType()))
            apvts.replaceState(juce::ValueTree::fromXml(*xmlState));
}

//==============================================================================
// This creates new instances of the plugin
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new AudioPluginProcessor();
}
