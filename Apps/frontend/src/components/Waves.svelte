<script>
  import { beforeUpdate, onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    WAVE_CURSOR_SIZE,
  } from "../const";
  import { channelActivated, timeSweep } from "../stores";
  import { OscilloscopeWebGl } from "../OscilloscopeWebGl";
  import { computeDisplayDeltaFromTimeSweep } from "../helper";
  let canvasElement;
  let oscilloscopeWebGl;
  /**
   * @type {Number[][]}
   */
  let channelSamples = Array.from(Array(NUM_CHANNELS), () =>
    new Array(CANVAS_WIDTH).fill(undefined)
  );
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

  const update = () => {
    oscilloscopeWebGl.drawChannels(channelSamples);
    oscilloscopeWebGl.drawHeads(xLast, channelSamples);
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
