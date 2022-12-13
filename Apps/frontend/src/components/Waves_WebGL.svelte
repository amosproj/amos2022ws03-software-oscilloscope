<script>
  import { beforeUpdate, onMount } from "svelte";
  import { Grid } from "../Grid";
  import { Channel } from "../Channel";

  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
    MIN_SWEEP,
    MAX_SWEEP,
    LINE_COLORS,
    WAVE_CURSOR_SIZE,
    LINE_THICKNESS_SMALL,
    LINE_THICKNESS_BIG,
  } from "../const";

  let canvasElement;
  let gl;
  let grid;
  let channels = [];
  let shaderProgram;
  let x = 0;
  const fsSource = `#version 300 es
    precision mediump float;

    in vec4 v_colour;
    out vec4 o_colour;

    void main() {
      o_colour = v_colour;
    }
  `;

  const vsSource = `#version 300 es
      precision mediump float;

      uniform vec4 u_colour;
      in vec2 aVertexPosition;
      out vec4 v_colour;

      void main() {
        gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1);
        v_colour = u_colour;
      }
    `;

  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      return null;
    }
    return shaderProgram;
  }

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    initializGL();
    initData();
    initShader();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  export const updateBuffer = (samples) => {
    for (let i = 0; i < 10; i++)
    {
      channels[i].update(samples[i] / 3.0)
    }
  };

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  };

  const initData = () => {
    grid = new Grid(gl);
    for (let i = 0; i < 10; i++)
    {
      channels.push(new Channel(gl, CANVAS_WIDTH, LINE_COLORS[i]));
    }
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
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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

  const draw = () => {
    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gl.clear(gl.COLOR_BUFFER_BIT);
    grid.draw(shaderProgram);
    for (const channel of channels)
    {
      channel.draw(shaderProgram);
    }
  };

  const newFrame = () => {
    draw();
    window.requestAnimationFrame(newFrame);
  };
</script>

<canvas bind:this={canvasElement} />
