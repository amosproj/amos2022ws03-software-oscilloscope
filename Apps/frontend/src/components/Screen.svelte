<script>
  import { beforeUpdate, onMount } from "svelte";

  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
  } from "../const";
  import { createShaderProgram } from "../shader/shaderHelper";
  import { fragmentShader, vertexShader} from  "../shader/shader";
  import { Oscilloscope } from "../Oscilloscope";

  let canvasElement;
  let gl;
  let shaderProgram;
  let oscilloscope;

  
  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    oscilloscope.channels[channelIndex].offsetY = offsetY;
    //lines[channelIndex].offsetY = offsetY;
    //heads[channelIndex].offsetY = offsetY;
  };

  // Update the amplification of wave
  export const updateChannelScaling = (channelIndex, scaling) => {
    oscilloscope.channels[channelIndex].scaleY = scaling;
    //setScaling(channelIndex, scaling);
  };

  export const updateChannelThickness = (channelIndex, isThick) => {
    //const thickness = isThick ? LINE_THICKNESS_BIG : LINE_THICKNESS_SMALL;
    //lines[channelIndex].setThickness(thickness);
  };

  export const startStopChannelI = (channelIndex, hasStarted) => {
    oscilloscope.channels[channelIndex].active = hasStarted;
  };

    // ----- Svelte lifecycle hooks -----
    onMount(() => {
      resizeCanvas();
      initializGL();
      initShader();
      initData();
    });
  
    beforeUpdate(() => {
      window.requestAnimationFrame(newFrame);
    });
  
    export const updateChannels = (samples) => {
      oscilloscope.updateChannels(samples);
    };
  
    const resizeCanvas = () => {
      canvasElement.width = CANVAS_WIDTH;
      canvasElement.height = CANVAS_HEIGHT;
    };
  
    const initData = () => {
      oscilloscope = new Oscilloscope(gl, shaderProgram);
    }
  
    const initializGL = () => {
      // Initialize the GL context
      gl = canvasElement.getContext("webgl2");
  
      // Only continue if WebGL is available and working
      if (gl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
      }
  
      // Set clear color to black, fully opaque
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // Clear the color buffer with specified clear color
      gl.clear(gl.COLOR_BUFFER_BIT);
    };
  
    function initShader() {
      shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
  
      gl.useProgram(shaderProgram);
      let aVertexPosition  = gl.getAttribLocation(shaderProgram, "aVertexPosition");
      gl.vertexAttribPointer(
        aVertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(aVertexPosition);
    }
  
    const newFrame = () => {
      oscilloscope.draw();
      window.requestAnimationFrame(newFrame);
    };
  </script>
  
  <canvas bind:this={canvasElement} />
  