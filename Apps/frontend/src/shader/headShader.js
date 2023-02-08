import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HEAD_WIDTH_PIXEL,
  NUM_INTERVALS_HORIZONTAL,
} from "../const";

export const headFragmentShader = `#version 300 es
precision highp float;

in vec4 v_colour;
out vec4 o_colour;

void main() {
  o_colour = v_colour;
}
`;

export const headVertexShader = `#version 300 es
  precision highp float;
  #define VOLTS_TO_NDC ${2.0 / NUM_INTERVALS_HORIZONTAL}
  #define X_PIXEL_TO_NDC ${2.0 / CANVAS_WIDTH}
  #define Y_PIXEL_TO_NDC ${2.0 / CANVAS_HEIGHT}
  #define CANVAS_WIDTH ${CANVAS_WIDTH}
  #define SCALE_Y ${(NUM_INTERVALS_HORIZONTAL / 2).toFixed(1)}
  #define HEAD_WIDTH_PIXEL ${HEAD_WIDTH_PIXEL.toFixed(1)}

  uniform float u_xCurr;
  uniform float u_sample;
  uniform vec4 u_colour;
  uniform float u_offset;
  uniform float u_amplitude;
  in vec2 aVertex;
  out vec4 v_colour;

  float x_to_ndc(float x) {
    return x * X_PIXEL_TO_NDC - 1.0;
  }
  
  void main() {
    float x = u_xCurr;
    float y = (u_sample * u_amplitude + (SCALE_Y * u_offset));
    float xNDC = x_to_ndc(x);
    float yNDC = y * VOLTS_TO_NDC;
    vec2 scale = vec2(HEAD_WIDTH_PIXEL * X_PIXEL_TO_NDC, HEAD_WIDTH_PIXEL * Y_PIXEL_TO_NDC);
    gl_Position = vec4(aVertex.x * scale.x + xNDC, aVertex.y * scale.y + yNDC, 0, 1);
    v_colour = u_colour;
  }
`;
