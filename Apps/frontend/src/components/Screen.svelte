<script>
  import { beforeUpdate, onMount } from "svelte";

  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
  } from "../const";
  import { Oscilloscope } from "../Oscilloscope";

  let canvasElement;
  let webgl;
  let oscilloscope;

  export const updateChannelSweep = (channelIndex, sweep) => {
    console.log(sweep);
    oscilloscope.channels[channelIndex].sweep = sweep;
  };

  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    oscilloscope.channels[channelIndex].offsetY = offsetY;
  };

  // Update the amplification of wave
  export const updateChannelScaling = (channelIndex, scaling) => {
    oscilloscope.channels[channelIndex].scaleY = scaling;
  };

  export const updateChannelThickness = (channelIndex, isThick) => {
    // TODO
    // currently not supported
  };

  export const startStopChannelI = (channelIndex, hasStarted) => {
    oscilloscope.channels[channelIndex].active = hasStarted;
  };

    // ----- Svelte lifecycle hooks -----
    onMount(() => {
      resizeCanvas();
      initialize();
    });
  
    beforeUpdate(() => {
      window.requestAnimationFrame(newFrame);
    });
  
    export const updateChannels = (samplesInVolts) => {
      oscilloscope.updateChannels(samplesInVolts);
    };
  
    const resizeCanvas = () => {
      canvasElement.width = CANVAS_WIDTH;
      canvasElement.height = CANVAS_HEIGHT;
    };
  
    const initialize = () => {
      webgl = canvasElement.getContext("webgl2");
      if (webgl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
      }
      webgl.clearColor(0.0, 0.0, 0.0, 1.0);
      webgl.clear(webgl.COLOR_BUFFER_BIT);

      oscilloscope = new Oscilloscope(webgl)
    }
  
    const newFrame = () => {
      oscilloscope.draw();
      window.requestAnimationFrame(newFrame);
    };
  </script>
  
  <canvas bind:this={canvasElement} />
  