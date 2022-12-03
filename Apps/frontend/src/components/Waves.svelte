<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
    MIN_SWEEP,
    MAX_SWEEP,
    LINE_COLORS,
    WAVE_CURSOR_SIZE,
  } from "../const";
  import { timeSweep } from "../stores";

  export let scalesY;

  let canvasElement;
  let webGLPlot;
  /**
   * @type {Number[][]}
   */
  let channelSamples;
  /**
   * @type {Number[][]}
   */
  let channelSamplesInjectCursor;
  let lines = [];
  let startStopLine = [];
  let xArr;
  let xLast;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    initializePlot();
    resetPlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  // ----- business logic -----

  const initChannelSamples = () => {
    channelSamples = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(0.0)
    );
    channelSamplesInjectCursor = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(0.0)
    );
  };

  export const resetPlot = () => {
    xArr = new Array(NUM_CHANNELS).fill(0.0);
    xLast = new Array(NUM_CHANNELS).fill(0);
    initChannelSamples();
    webGLPlot.clear();
    console.log("clear");
  };

  export const updateBuffer = (samples) => {
    for (
      let channelIndex = 0;
      channelIndex < channelSamples.length;
      channelIndex++
    ) {
      if (!startStopLine[channelIndex]) {
        continue;
      }
      let xCurr = xArr[channelIndex];
      let xNew = Math.round(xCurr);
      for (let x = xLast[channelIndex] + 1; x < xNew + 1; x++) {
        channelSamples[channelIndex][x] = samples[channelIndex];
      }
      channelSamplesInjectCursor[channelIndex] = channelSamples[channelIndex];
      // inject cursor (undefined values are not rendered) before the newest data sample
      for (let x = xNew + 1; x < xNew + WAVE_CURSOR_SIZE; x++) {
        channelSamplesInjectCursor[channelIndex][x] = undefined;
      }

      xLast[channelIndex] = xNew;

      let sweep = $timeSweep[channelIndex] / 5.0 - 1.0;
      let fac = sweep < 0 ? MIN_SWEEP : MAX_SWEEP;
      let delta = fac * sweep + 1.0;

      xArr[channelIndex] = xCurr + delta;
      while (xArr[channelIndex] >= CANVAS_WIDTH) {
        xArr[channelIndex] -= CANVAS_WIDTH;
      }
    }
  };

  // Sets the scaling of a individual wave according to the voltage intervals
  const setScaling = (index, scale) => {
    lines[index].scaleY = computeScaling(scale);
  };

  // computes the Scaling of a wave according to the voltage intervals
  const computeScaling = (scale) => {
    return (1 / (NUM_INTERVALS_HORIZONTAL / 2)) * scale;
  };

  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    lines[channelIndex].offsetY = offsetY;
  };

  // Update the amplification of wave
  export const updateChannelScaling = (channelIndex, scaling) => {
    setScaling(channelIndex, scaling);
  };

  export const startStopChannelI = (channelIndex, hasStarted) => {
    startStopLine[channelIndex] = hasStarted;
    /*if(hasStarted) console.log("start Channel " + channelIndex + ", hasStarted:" + startStopLine[channelIndex]);
    else console.log("stop Channel " + channelIndex + ", hasStarted:" + startStopLine[channelIndex]);
    */
  };

  const update = () => {
    for (let i = 0; i < channelSamplesInjectCursor.length; i++) {
      for (let x = 0; x < CANVAS_WIDTH; ++x) {
        lines[i].setY(x, channelSamplesInjectCursor[i][x]);
      }
    }
  };

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  };

  const initializePlot = () => {
    webGLPlot = new WebglPlot(canvasElement);
    initializeLines();
  };

  const initializeLines = () => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const color = new ColorRGBA(
        LINE_COLORS[i][0] / 255,
        LINE_COLORS[i][1] / 255,
        LINE_COLORS[i][2] / 255,
        1
      );
      let line = new WebglLine(color, CANVAS_WIDTH);
      line.arrangeX();
      line.scaleY = computeScaling(scalesY[i]);
      webGLPlot.addLine(line);
      lines.push(line);
      startStopLine[i] = true;
    }
  };

  const newFrame = () => {
    update();
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  };
</script>

<canvas bind:this={canvasElement} />
