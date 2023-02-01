import {
  channelFragmentShader,
  channelVertexShader,
} from "./shader/channelShader";
import { createShaderProgram } from "./shader/shaderHelper";
import { get } from "svelte/store";
import { LINE_COLORS_WEBGL } from "./const";
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
  }

  clear() {
    this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
  }

  drawChannels(channelSamples: number[][]) {
    this.webgl.useProgram(this.channelProgram);
    for (let i = 0; i < channelSamples.length; i++) {
      let samples = new Float32Array(channelSamples[i]);
      this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.channelVertexBuffer);
      this.webgl.bufferData(
        this.webgl.ARRAY_BUFFER,
        samples,
        this.webgl.DYNAMIC_DRAW
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

      let colors = new Float32Array(LINE_COLORS_WEBGL[i]);
      let colorUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_colour"
      );

      this.webgl.uniform4fv(colorUniform, colors);

      let offsetUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_offset"
      );
      let channelOffset = get(offsetAdjustment)[i];
      this.webgl.uniform1f(offsetUniform, channelOffset);

      let amplitudeUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_amplitude"
      );
      let channelAmplitude = get(amplitudeAdjustment)[i];
      this.webgl.uniform1f(amplitudeUniform, channelAmplitude);

      this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);
    }
  }
}
