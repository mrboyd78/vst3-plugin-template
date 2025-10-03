#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include "PluginProcessor.h"

/**
 * @brief GUI Editor for the plugin
 *
 * This class provides the user interface for the plugin,
 * displaying controls and visualizations.
 */
class AudioPluginEditor : public juce::AudioProcessorEditor
{
public:
    AudioPluginEditor(AudioPluginProcessor&);
    ~AudioPluginEditor() override;

    //==============================================================================
    void paint(juce::Graphics&) override;
    void resized() override;

private:
    // Reference to the processor
    AudioPluginProcessor& audioProcessor;

    // Example: Gain slider
    juce::Slider gainSlider;
    juce::Label gainLabel;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> gainAttachment;

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(AudioPluginEditor)
};
