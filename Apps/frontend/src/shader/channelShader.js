import { CANVAS_WIDTH, NUM_INTERVALS_HORIZONTAL } from "../const";

export const channelFragmentShader = `#version 300 es
precision highp float;

in vec4 v_colour;
out vec4 o_colour;

void main() {
  o_colour = v_colour;
}
`;

export const channelVertexShader = `#version 300 es
  precision highp float;
  #define VOLTS_TO_NDC ${2.0 / NUM_INTERVALS_HORIZONTAL}
  #define X_TO_NDC ${2.0 / CANVAS_WIDTH}
  #define CANVAS_WIDTH ${CANVAS_WIDTH}
  #define SCALE_Y ${(NUM_INTERVALS_HORIZONTAL / 2).toFixed(1)}
  uniform vec4 u_colour;
  uniform float u_offset;
  uniform float u_amplitude;
  in float aSample;
  out vec4 v_colour;

  float x_to_ndc(float x) {
    return x * X_TO_NDC - 1.0;
  }
  
  void main() {
    float x = mod(float(gl_VertexID), float(CANVAS_WIDTH));
    float y = (aSample * u_amplitude + (SCALE_Y * u_offset));
    float xNDC = x_to_ndc(x);
    float yNDC = y * VOLTS_TO_NDC;
    gl_Position = vec4(xNDC, yNDC, 0, 1);
    v_colour = u_colour;
  }
`;
