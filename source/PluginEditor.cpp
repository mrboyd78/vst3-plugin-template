#include "../include/PluginProcessor.h"
#include "../include/PluginEditor.h"

//==============================================================================
AudioPluginEditor::AudioPluginEditor(AudioPluginProcessor& p)
    : AudioProcessorEditor(&p), audioProcessor(p)
{
    // Set editor size
    setSize(400, 300);

    // Setup gain slider
    gainSlider.setSliderStyle(juce::Slider::RotaryVerticalDrag);
    gainSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    gainSlider.setPopupDisplayEnabled(true, true, this);
    gainSlider.setTextValueSuffix(" dB");
    addAndMakeVisible(gainSlider);

    // Setup gain label
    gainLabel.setText("Gain", juce::dontSendNotification);
    gainLabel.setJustificationType(juce::Justification::centred);
    gainLabel.attachToComponent(&gainSlider, false);
    addAndMakeVisible(gainLabel);

    // Attach slider to parameter
    gainAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getValueTreeState(),
        "gain",
        gainSlider
    );

    // Make the UI resizable (optional)
    setResizable(true, true);
    setResizeLimits(300, 200, 800, 600);
}

AudioPluginEditor::~AudioPluginEditor()
{
}

//==============================================================================
void AudioPluginEditor::paint(juce::Graphics& g)
{
    // Background
    g.fillAll(getLookAndFeel().findColour(juce::ResizableWindow::backgroundColourId));

    // Title
    g.setColour(juce::Colours::white);
    g.setFont(juce::Font(24.0f, juce::Font::bold));
    g.drawFittedText("VST3 Plugin Template",
                     getLocalBounds().removeFromTop(60),
                     juce::Justification::centred,
                     1);

    // Plugin info
    g.setFont(12.0f);
    g.setColour(juce::Colours::lightgrey);
    auto bounds = getLocalBounds();
    g.drawFittedText("Built with JUCE",
                     bounds.removeFromBottom(20),
                     juce::Justification::centred,
                     1);
}

void AudioPluginEditor::resized()
{
    auto bounds = getLocalBounds();

    // Leave space for title
    bounds.removeFromTop(80);

    // Leave space for footer
    bounds.removeFromBottom(30);

    // Center the gain slider
    auto sliderBounds = bounds.withSizeKeepingCentre(150, 150);
    gainSlider.setBounds(sliderBounds);
}
