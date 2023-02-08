import {
  channelFragmentShader,
  channelVertexShader,
} from "./shader/channelShader";
import { headFragmentShader, headVertexShader } from "./shader/headShader";
import { createShaderProgram } from "./shader/shaderHelper";
import { get } from "svelte/store";
import {
  LINE_COLORS_WEBGL,
  LINE_THICKNESS_DELTA,
  LINE_THICKNESS_DUPLICATES,
} from "./const";
import {
  amplitudeAdjustment,
  offsetAdjustment,
  channelActivated,
  thicknessAdjustment,
} from "./stores";
export class OscilloscopeWebGl {
  private channelProgram: WebGLProgram;
  private headProgram: WebGLProgram;
  private channelVertexBuffer: WebGLBuffer;
  private headVertexBuffer: WebGLBuffer;
  private webgl: WebGL2RenderingContext;

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
    this.headProgram = createShaderProgram(
      this.webgl,
      headVertexShader,
      headFragmentShader
    );
    this.channelVertexBuffer = this.webgl.createBuffer() as WebGLBuffer;
    this.headVertexBuffer = this.webgl.createBuffer() as WebGLBuffer;
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

      // Colour
      let colors = new Float32Array(LINE_COLORS_WEBGL[i]);
      let colorUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_colour"
      );

      this.webgl.uniform4fv(colorUniform, colors);

      // Offset
      let offsetUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_offset"
      );
      let channelOffset = get(offsetAdjustment)[i];
      this.webgl.uniform1f(offsetUniform, channelOffset);

      // Amplitude
      let amplitudeUniform = this.webgl.getUniformLocation(
        this.channelProgram,
        "u_amplitude"
      );
      let channelAmplitude = get(amplitudeAdjustment)[i];
      this.webgl.uniform1f(amplitudeUniform, channelAmplitude);

      this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);

      // draw three lines to make thicker line -> Thickness
      if (get(thicknessAdjustment)[i]) {
        // First line
        let thicknessUniform = this.webgl.getUniformLocation(
          this.channelProgram,
          "u_thick_line_id"
        );
        this.webgl.uniform1i(thicknessUniform, 1);
        this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);

        // Second line
        thicknessUniform = this.webgl.getUniformLocation(
          this.channelProgram,
          "u_thick_line_id"
        );
        this.webgl.uniform1i(thicknessUniform, 2);
        this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);

        // Third line -> "original" line
        thicknessUniform = this.webgl.getUniformLocation(
          this.channelProgram,
          "u_thick_line_id"
        );
        this.webgl.uniform1i(thicknessUniform, 0);
        this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, samples.length);
      }
    }
  }

  drawHeads(xArr: number[], channelSamples: number[][]) {
    this.webgl.useProgram(this.headProgram);

    let headVertices = new Float32Array([
      1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0,
    ]);
    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.headVertexBuffer);
    this.webgl.bufferData(
      this.webgl.ARRAY_BUFFER,
      headVertices,
      this.webgl.STATIC_DRAW
    );
    let vertexAttribute = this.webgl.getAttribLocation(
      this.headProgram,
      "aVertex"
    );

    this.webgl.vertexAttribPointer(
      vertexAttribute,
      2,
      this.webgl.FLOAT,
      false,
      0,
      0
    );
    this.webgl.enableVertexAttribArray(vertexAttribute);

    for (let i = 0; i < channelSamples.length; i++) {
      let activated = get(channelActivated)[i];

      if (!activated) continue;

      let xCurr = xArr[i];
      let xCurrUniform = this.webgl.getUniformLocation(
        this.headProgram,
        "u_xCurr"
      );
      this.webgl.uniform1f(xCurrUniform, xCurr);

      let sampleCurr = channelSamples[i][xCurr];

      let sampleUniform = this.webgl.getUniformLocation(
        this.headProgram,
        "u_sample"
      );
      this.webgl.uniform1f(sampleUniform, sampleCurr);

      let color = new Float32Array(LINE_COLORS_WEBGL[i]);
      let colorUniform = this.webgl.getUniformLocation(
        this.headProgram,
        "u_colour"
      );

      this.webgl.uniform4fv(colorUniform, color);

      let offsetUniform = this.webgl.getUniformLocation(
        this.headProgram,
        "u_offset"
      );
      let channelOffset = get(offsetAdjustment)[i];
      this.webgl.uniform1f(offsetUniform, channelOffset);

      let amplitudeUniform = this.webgl.getUniformLocation(
        this.headProgram,
        "u_amplitude"
      );
      let channelAmplitude = get(amplitudeAdjustment)[i];
      this.webgl.uniform1f(amplitudeUniform, channelAmplitude);

      this.webgl.drawArrays(
        this.webgl.TRIANGLE_STRIP,
        0,
        headVertices.length / 2
      );
    }
  }
}
