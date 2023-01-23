<script>
  import { beforeUpdate, onMount } from "svelte";
  import App from "../App.svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
    LINE_COLORS,
    WAVE_CURSOR_SIZE,
    LINE_THICKNESS_SMALL,
    LINE_THICKNESS_BIG,
  } from "../const";
  import {
    amplitudeAdjustment,
    channelActivated,
    offsetAdjustment,
    thicknessAdjustment,
    timeSweep,
  } from "../stores";
  import {
    OscilloscopeWebGl
  } from "../OscilloscopeWebGl"
  import { computeDisplayDeltaFromTimeSweep } from "../helper";

  export let scalesY;

  let canvasElement;
  let oscilloscopeWebGl;
  /**
   * @type {Number[][]}
   */
  let channelSamples = Array.from(Array(NUM_CHANNELS), () =>
    new Array(CANVAS_WIDTH).fill(undefined)
  );
  let lines = [];
  let heads = [];
  let xArr;
  let xLast;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    initializeWebGl();
    resetPlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  // ----- business logic -----

  const initChannelSamples = () => {
    channelSamples = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(undefined)
    );
  };

  export const resetPlot = () => {
    xArr = new Array(NUM_CHANNELS).fill(0.0);
    xLast = new Array(NUM_CHANNELS).fill(undefined);
    initChannelSamples();
    oscilloscopeWebGl.clear();
  };

  export const updateBuffer = (samples, startIndex, endIndex) => {
    console.log("updateBuffer()");
    for (
      let channelIndex = startIndex;
      channelIndex < endIndex;
      channelIndex++
    ) {
      if (!$channelActivated[channelIndex]) {
        continue;
      }
      let xCurr = xArr[channelIndex];
      let xNew = Math.round(xCurr);
      for (let x = xLast[channelIndex] + 1; x < xNew + 1; x++) {
        channelSamples[channelIndex][x] = samples[channelIndex];
        channelSamples[channelIndex][
          (x + WAVE_CURSOR_SIZE) % canvasElement.width
        ] = undefined;
      }
      xLast[channelIndex] = xNew;
      let delta = computeDisplayDeltaFromTimeSweep($timeSweep[channelIndex]);
      xArr[channelIndex] = xCurr + delta;
      while (xArr[channelIndex] >= CANVAS_WIDTH) {
        xArr[channelIndex] -= CANVAS_WIDTH;
      }
    }
  };

  // Subscribe to the offsetAdjustment store
  offsetAdjustment.subscribe((newOffsets) => {
    // for (let i = 0; i < NUM_CHANNELS; i++) {
    //   let line = lines[i];
    //   if (line !== undefined) line.offsetY = newOffsets[i];
    //   let head = heads[i];
    //   if (head !== undefined) head.offsetY = newOffsets[i];
    // }
  });

  // Subscribe to the channelActivation store
  channelActivated.subscribe((isActive) => {
    // for (let i = 0; i < NUM_CHANNELS; i++) {
    //   if (lines[i] !== undefined) lines[i].visible = isActive[i];
    // }
  });

  thicknessAdjustment.subscribe((isThick) => {
    // for (let i = 0; i < NUM_CHANNELS; i++) {
    //   if (lines[i] !== undefined) {
    //     const thickness = isThick[i]
    //       ? LINE_THICKNESS_BIG
    //       : LINE_THICKNESS_SMALL;
    //     lines[i].setThickness(thickness);
    //   }
    // }
  });

  amplitudeAdjustment.subscribe((amplitudes) => {
    // for (let i = 0; i < NUM_CHANNELS; i++) {
    //   if (lines[i] !== undefined)
    //     lines[i].scaleY = computeScaling(amplitudes[i]);
    // }
  });

  // computes the Scaling of a wave according to the voltage intervals
  const computeScaling = (amplitude) => {
    return (1 / (NUM_INTERVALS_HORIZONTAL / 2)) * amplitude;
  };

  const update = () => {
    console.log("update()");
    oscilloscopeWebGl.drawChannels(channelSamples);
    //draw heads
    //draw grid?
  };

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  };

  const initializeWebGl = () => {
    let webgl = canvasElement.getContext("webgl2");

    if (webgl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
      }

    oscilloscopeWebGl = new OscilloscopeWebGl(webgl);
  };

  const newFrame = () => {
    update();
    window.requestAnimationFrame(newFrame);
  };
</script>

<canvas bind:this={canvasElement} />
