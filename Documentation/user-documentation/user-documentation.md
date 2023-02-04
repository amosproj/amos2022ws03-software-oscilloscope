# SOSCI User Documentation

## Table of contents

- [Introduction](#introduction)
- [Getting started](#getting-started)
    - [How to access the frontend and backend?](#how-to-access-the-frontend-and-backend)
    - [How to send samples via UDP?](#how-to-send-samples-via-udp)
- [Using the frontend](#using-the-frontend)
    - [General](#general)
    - [Top control panel](#top-control-panel)
    - [Oscilloscope](#oscilloscope)
    - [Bottom control panel](#bottom-control-panel)
    - [Settings](#settings)
        - [Presets](#presets)

## Introduction

SOSCI ("Software Oscilloscope") is an open source software oscilloscope that aims to simulate a 10-channel analog
oscilloscope.

Its main features are:

- Receiving samples over UDP
- Flexible and dynamic visualization of samples using channel-based configuration:
    - Toggle channels
    - Amplitudes
    - Offsets
    - Sweep speeds
- Presets for saving settings for later use
- A generator for simulating various types of waveforms
- A docker image for portability

## Getting started

Assuming the frontend, backend and optionally the generator have been built and are running according to the Build
documentation, here's how to get started using the oscilloscope.

### How to access the frontend and backend?

The frontend is reachable under [http://localhost:5000](http://localhost:5000).

### How to send samples via UDP?

The backend is reachable via UDP under [udp://localhost:34255](udp://localhost:34255).

When not using the generator, samples can be sent to the UDP endpoint ([udp://localhost:34255](udp://localhost:34255))
as packages of ten voltage values, as described in the design documentation.

<div style="page-break-after: always;"></div>

## Using the frontend

#### General

- Initially, the oscilloscope is turned off. You need to turn it on like described below.
- There are 10 channels with different colors.
- The frontend is only to be used in landscape (width > height).
- When using it on small screens, the bottom control panel is hidden and can be opened by tapping the caret at the
  bottom.
- There's a light and a dark mode, based on your OS color settings.

![frontend-full.png](frontend-full.png)

<div style="page-break-after: always;"></div>

### Top control panel

In the top left corner, you'll find a control panel for general control of the oscilloscope.

![frontend-top-control-panel.png](frontend-top-control-panel.png)

#### Controls (from left to right)

- **Start/Stop:** Toggle processing all incoming samples.
- **Reset:** Reset the indicators and the oscilloscop to the initial state and stop processing incoming samples.
- **Ground:** While pressed, set all rendered lines to zero.
- **Distribute vertically:** Distribute all enabled lines vertically to take up the whole oscilloscope space.
- **Settings:** Open the settings modal for saving and loading presets.

<div style="page-break-after: always;"></div>

### Oscilloscope

![frontend-oscilloscope.png](frontend-oscilloscope.png)

#### Components:

- **Line indicators:** Show the min and max values of all enabled channels with respect to their indidividual offsets
  and amplitudes.
- **Plot:** Renders the lines of enabled channels with respect to their individual offsets, amplitudes, sweep.
  speeds and thickness
- **Text indicators:** Show a textual min max value representation of all enabled channels.

<div style="page-break-after: always;"></div>

### Bottom control panel

![frontend-bottom-control-panel.png](frontend-bottom-control-panel.png)

The bottom control panel provides channel-based settings that influence the representation of incoming samples.

#### Controls

- **Start/Stop:**
    - Toggle processing of a channel's samples.
    - Affects the plot and the indicators.
- **Thickness:**
    - Toggle thick rendering of a channel's plot line.
    - Affects the plot.
- **Offset:**
    - Set the vertical offset of a channel's plot line.
    - Values range from -1 to 1 and are related to the plot's vertical height. A value of 1 means that the zero line of
      a channel is located at the top end of the plot.
    - Affects the plot and the line indicators.
- **Time sweep:**
    - Set the speed in which a channel's line crosses one horizontal division of the plot.
    - Affects the plot.
- **Amplitude:**
    - Set the value that's been multiplied with a channel's plot line.
    - Values range from 0.2 to Infinity and represent the reciprocal value of the vertical scaling. A reciprocal value
      of 0.2 (0.2 = 1/5) means that the channel's values show as multiplied by 5.
    - Affects the plot and the line indicators.

<div style="page-break-after: always;"></div>

### Settings

![frontend-settings.png](frontend-settings.png)

#### Presets

A preset consists of all settings for each channel. These are:

- Amplitudes
- Offsets
- Thickness
- On/Off
- Sweep Speed

The settings modal provides a form to save and load the current settings.

- **Creating a new preset:** Enter a name for the preset and click the save icon on the right.
- **Loading a preset:** Select your preset from the dropdown and click the load icon on the right.