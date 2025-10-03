cmake_minimum_required(VERSION 3.22)

# ============================================================================
# Project Configuration
# ============================================================================
# Customize these values for your plugin
set(PLUGIN_NAME "MyVST3Plugin")
set(PLUGIN_VERSION "1.0.0")
set(COMPANY_NAME "YourCompany")
set(COMPANY_WEBSITE "www.yourcompany.com")
set(COMPANY_EMAIL "contact@yourcompany.com")

# Plugin codes (must be unique for each plugin)
# Get your own codes at: https://www.juce.com/admin/registration
set(PLUGIN_MANUFACTURER_CODE "Manu")  # 4 characters, first must be uppercase
set(PLUGIN_CODE "Plug")                # 4 characters, first must be uppercase

# Plugin type configuration
set(PLUGIN_IS_SYNTH FALSE)             # TRUE for synth, FALSE for effect
set(PLUGIN_NEEDS_MIDI_INPUT FALSE)     # TRUE if plugin needs MIDI input
set(PLUGIN_NEEDS_MIDI_OUTPUT FALSE)    # TRUE if plugin produces MIDI
set(PLUGIN_IS_MIDI_EFFECT FALSE)       # TRUE if plugin is a MIDI effect

# Build formats
set(PLUGIN_FORMATS VST3)               # Options: VST3, AU, Standalone, AAX

# ============================================================================
# JUCE Path Configuration
# ============================================================================
# Set this to your JUCE installation path
if(NOT DEFINED JUCE_DIR)
    set(JUCE_DIR "C:/Users/mrchr/Downloads/juce-8.0.10-windows/JUCE"
        CACHE PATH "Path to JUCE framework")
endif()

if(NOT EXISTS "${JUCE_DIR}/CMakeLists.txt")
    message(FATAL_ERROR
        "JUCE not found at ${JUCE_DIR}\n"
        "Please set JUCE_DIR to your JUCE installation path:\n"
        "  cmake -DJUCE_DIR=/path/to/JUCE ..")
endif()

# ============================================================================
# Project Setup
# ============================================================================
project(${PLUGIN_NAME} VERSION ${PLUGIN_VERSION})

# C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Export compile commands for IDEs
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Add JUCE
add_subdirectory(${JUCE_DIR} JUCE)

# ============================================================================
# Plugin Target
# ============================================================================
juce_add_plugin(${PLUGIN_NAME}
    COMPANY_NAME "${COMPANY_NAME}"
    COMPANY_WEBSITE "${COMPANY_WEBSITE}"
    COMPANY_EMAIL "${COMPANY_EMAIL}"

    IS_SYNTH ${PLUGIN_IS_SYNTH}
    NEEDS_MIDI_INPUT ${PLUGIN_NEEDS_MIDI_INPUT}
    NEEDS_MIDI_OUTPUT ${PLUGIN_NEEDS_MIDI_OUTPUT}
    IS_MIDI_EFFECT ${PLUGIN_IS_MIDI_EFFECT}

    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD TRUE

    PLUGIN_MANUFACTURER_CODE ${PLUGIN_MANUFACTURER_CODE}
    PLUGIN_CODE ${PLUGIN_CODE}

    FORMATS ${PLUGIN_FORMATS}
    PRODUCT_NAME "${PLUGIN_NAME}"

    # Bundle identifier for macOS (reverse domain notation)
    BUNDLE_ID "com.${COMPANY_NAME}.${PLUGIN_NAME}"

    # AAX identifiers (required if building AAX)
    # AAX_IDENTIFIER "com.${COMPANY_NAME}.${PLUGIN_NAME}"
)

# ============================================================================
# Source Files
# ============================================================================
target_sources(${PLUGIN_NAME}
    PRIVATE
        source/PluginProcessor.cpp
        source/PluginEditor.cpp
)

target_include_directories(${PLUGIN_NAME}
    PRIVATE
        include
)

# ============================================================================
# Compile Definitions
# ============================================================================
target_compile_definitions(${PLUGIN_NAME}
    PUBLIC
        # JUCE configuration
        JUCE_WEB_BROWSER=0
        JUCE_USE_CURL=0
        JUCE_VST3_CAN_REPLACE_VST2=0

        # Display splash screen (set to 0 if you have a JUCE license)
        JUCE_DISPLAY_SPLASH_SCREEN=1

        # Disable warnings
        JUCE_SILENCE_XCODE_15_LINKER_WARNING=1
)

# ============================================================================
# Link Libraries
# ============================================================================
target_link_libraries(${PLUGIN_NAME}
    PRIVATE
        # JUCE modules - add more as needed
        juce::juce_audio_utils
        juce::juce_dsp

    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
)

# ============================================================================
# Compiler-specific settings
# ============================================================================
if(MSVC)
    # Suppress specific MSVC warnings
    target_compile_options(${PLUGIN_NAME} PRIVATE
        /W4           # Warning level 4
        /wd4100       # Unreferenced formal parameter
        /wd4127       # Conditional expression is constant
    )
endif()

if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(${PLUGIN_NAME} PRIVATE
        -Wall
        -Wextra
        -Wpedantic
    )
endif()

# ============================================================================
# Installation
# ============================================================================
# VST3 plugins are automatically copied to the system VST3 folder
# when COPY_PLUGIN_AFTER_BUILD is TRUE

message(STATUS "=========================================")
message(STATUS "Plugin: ${PLUGIN_NAME} v${PLUGIN_VERSION}")
message(STATUS "Company: ${COMPANY_NAME}")
message(STATUS "Formats: ${PLUGIN_FORMATS}")
message(STATUS "JUCE: ${JUCE_DIR}")
message(STATUS "=========================================")
