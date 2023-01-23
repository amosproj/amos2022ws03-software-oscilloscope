import { channelFragmentShader, channelVertexShader } from "./shader/shader";
import { createShaderProgram } from "./shader/shaderHelper";
import { writable, get } from "svelte/store";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  LINE_COLORS,
  LINE_COLORS_RGBA,
  LINE_COLORS_WEBGL,
  NUM_CHANNELS,
  NUM_INTERVALS_HORIZONTAL,
  NUM_INTERVALS_VERTICAL,
} from "./const";
import { amplitudeAdjustment, offsetAdjustment } from "./stores";
export class OscilloscopeWebGl {
  private channelProgram: WebGLProgram;
  private webgl: WebGL2RenderingContext;
  private channelVertexBuffer: WebGLBuffer;

  constructor(webgl: WebGL2RenderingContext) {
    this.webgl = webgl;
    this.init();
  }

  init() {
    this.webgl.viewport(
      0,
      0,
      this.webgl.canvas.width,
      this.webgl.canvas.height
    );

    this.clear();

    this.channelProgram = createShaderProgram(
      this.webgl,
      channelVertexShader,
      channelFragmentShader
    );
    this.channelVertexBuffer = this.webgl.createBuffer() as WebGLBuffer;

    this.webgl.useProgram(this.channelProgram);
  }

  clear() {
    this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
  }

  drawChannels(channelSamples: number[][]) {
    let samples = new Float32Array(channelSamples.flat());
    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.channelVertexBuffer);
    this.webgl.bufferData(
      this.webgl.ARRAY_BUFFER,
      samples,
      this.webgl.STATIC_DRAW
    );

    let sampleAttribute = this.webgl.getAttribLocation(
      this.channelProgram,
      "aSample"
    );
    this.webgl.vertexAttribPointer(
      sampleAttribute,
      1,
      this.webgl.FLOAT,
      false,
      0,
      0
    );
    this.webgl.enableVertexAttribArray(sampleAttribute);

    let colors = new Float32Array(LINE_COLORS_WEBGL.flat());
    let colorUniform = this.webgl.getUniformLocation(
      this.channelProgram,
      "u_colour"
    );

    this.webgl.uniform4fv(colorUniform, colors);

    let offsetUniform = this.webgl.getUniformLocation(
      this.channelProgram,
      "u_offset"
    );
    let channelOffset = new Float32Array(get(offsetAdjustment));
    this.webgl.uniform1fv(offsetUniform, channelOffset);

    let amplitudeUniform = this.webgl.getUniformLocation(
      this.channelProgram,
      "u_amplitude"
    );
    let channelAmplitudes = new Float32Array(get(amplitudeAdjustment));
    this.webgl.uniform1fv(amplitudeUniform, channelAmplitudes);

    this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);
  }

  drawHeads() {}

  drawGrid() {}
}
