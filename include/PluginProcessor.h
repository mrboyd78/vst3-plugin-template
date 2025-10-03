#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

/**
 * @brief Main audio processor for the plugin
 *
 * This class handles all audio processing, parameter management,
 * and state persistence for the plugin.
 */
class AudioPluginProcessor : public juce::AudioProcessor
{
public:
    //==============================================================================
    AudioPluginProcessor();
    ~AudioPluginProcessor() override;

    //==============================================================================
    // Audio Processing
    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    bool isBusesLayoutSupported(const BusesLayout& layouts) const override;
    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    //==============================================================================
    // Editor
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    //==============================================================================
    // Plugin Properties
    const juce::String getName() const override;
    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    //==============================================================================
    // Programs/Presets
    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram(int index) override;
    const juce::String getProgramName(int index) override;
    void changeProgramName(int index, const juce::String& newName) override;

    //==============================================================================
    // State Persistence
    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

    //==============================================================================
    // Parameter Management
    juce::AudioProcessorValueTreeState& getValueTreeState() { return apvts; }

private:
    //==============================================================================
    // Parameter Layout
    static juce::AudioProcessorValueTreeState::ParameterLayout createParameterLayout();

    //==============================================================================
    // Member Variables
    juce::AudioProcessorValueTreeState apvts;

    // Example: Gain parameter
    std::atomic<float>* gainParameter = nullptr;

    // Example: DSP processors
    juce::dsp::Gain<float> gain;

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioPluginProcessor)
};
