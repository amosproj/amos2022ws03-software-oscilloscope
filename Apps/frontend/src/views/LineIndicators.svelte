<script>
  import {
    CANVAS_HEIGHT,
    LINE_INDICATORS_CANVAS_WIDTH,
    LINE_COLORS_WEBGL,
    NUM_CHANNELS,
  } from "../const";
  import { onMount } from "svelte";
  import { createShaderProgram } from "../shader/shaderHelper.js";
  import { fragmentShader, vertexShader } from "../shader/indicatorShaders.js";
  import {
    amplitudeAdjustment,
    channelActivated,
    offsetAdjustment,
  } from "../stores";

  let canvasElement;
  let gl;
  let program;
  let sampleUniform;
  let colorUniform;
  let channelUniform;
  let offsetUniform;
  let scaleUniform;

  let min = Array(NUM_CHANNELS).fill(0.0);
  let max = Array(NUM_CHANNELS).fill(0.0);
  let offsets = Array(NUM_CHANNELS).fill(0.0);
  let amplitudes = Array(NUM_CHANNELS).fill(1.0);
  let isActive = Array(NUM_CHANNELS).fill(true);

  offsetAdjustment.subscribe((newOffsets) => {
    offsets = newOffsets;
  });

  channelActivated.subscribe((newIsActive) => {
    isActive = newIsActive;
  });

  amplitudeAdjustment.subscribe((newAmplitudes) => {
    amplitudes = newAmplitudes;
  });

  const initWebGL = () => {
    prepareCanvasAndWebGL();
    prepareProgram();
    prepareArrayBuffer();
    prepareUniforms();
    prepareInputVertex();
    drawAllIndicators();
  };

  const prepareCanvasAndWebGL = () => {
    canvasElement.width = LINE_INDICATORS_CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;

    gl = canvasElement.getContext("webgl2");
    if (!gl) return;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const prepareArrayBuffer = () => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const lineVertices = new Float32Array([0, 0, 1, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, lineVertices, gl.STATIC_DRAW);
  };

  const prepareProgram = () => {
    program = createShaderProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  };

  const prepareUniforms = () => {
    const initialSample = 0;
    const initialColor = new Float32Array([1, 1, 1, 1]);
    const initialChannel = 0;
    const initialOffset = 0;
    const initialScale = 0;

    sampleUniform = gl.getUniformLocation(program, "u_sample");
    gl.uniform1f(sampleUniform, initialSample);
    colorUniform = gl.getUniformLocation(program, "u_colour");
    gl.uniform4fv(colorUniform, initialColor);
    channelUniform = gl.getUniformLocation(program, "u_channel");
    gl.uniform1i(channelUniform, initialChannel);
    offsetUniform = gl.getUniformLocation(program, "u_offset");
    gl.uniform1f(offsetUniform, initialOffset);
    scaleUniform = gl.getUniformLocation(program, "u_scale");
    gl.uniform1f(scaleUniform, initialScale);
  };

  const prepareInputVertex = () => {
    const inputVertex = gl.getAttribLocation(program, "inputVertex");
    gl.enableVertexAttribArray(inputVertex);
    gl.vertexAttribPointer(inputVertex, 2, gl.FLOAT, false, 0, 0);
  };

  const drawAllIndicators = () => {
    for (let channel = 0; channel < NUM_CHANNELS; channel++)
      drawIndicator(channel);
  };

  /**
   * Draw a channel's min and max indicator.
   * @param {number} channel
   */
  const drawIndicator = (channel) => {
    gl.uniform1i(channelUniform, channel);
    gl.uniform4fv(colorUniform, new Float32Array(LINE_COLORS_WEBGL[channel]));
    gl.uniform1f(sampleUniform, min[channel]);
    gl.uniform1f(offsetUniform, offsets[channel]);
    gl.uniform1f(scaleUniform, amplitudes[channel]);
    gl.drawArrays(gl.LINES, 0, 2);
    gl.uniform1f(sampleUniform, max[channel]);
    gl.drawArrays(gl.LINES, 0, 2);
  };

  /**
   * Trigger a rerender of the indicators with given sample array.
   *
   * @param {number[]} samples
   */
  export const update = (samples) => {
    for (let channel = 0; channel < NUM_CHANNELS; channel++) {
      if (!isActive[channel]) continue;
      if (samples[channel] > max[channel]) {
        max[channel] = samples[channel];
      }
      if (samples[channel] < min[channel]) {
        min[channel] = samples[channel];
      }
      drawIndicator(channel);
    }
  };

  /**
   * Reset all values and indicators.
   */
  export const reset = () => {
    min = Array(NUM_CHANNELS).fill(0.0);
    max = Array(NUM_CHANNELS).fill(0.0);
    drawAllIndicators();
  };

  onMount(() => {
    initWebGL();
  });
</script>

<link rel="stylesheet" href="../app.scss" />

<canvas data-cy="line-indicators" bind:this={canvasElement} />
