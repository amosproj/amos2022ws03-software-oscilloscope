export const fragmentShader = `#version 300 es
precision mediump float;

in vec4 v_colour;
out vec4 o_colour;

void main() {
  o_colour = v_colour;
}
`;
export const vertexShader = `#version 300 es
precision mediump float;

uniform vec4 u_colour;
uniform float u_sample;
uniform int u_channel;
uniform float u_offset;
uniform float u_scale;

in vec2 inputVertex;
out vec4 v_colour;

void main() {
  float index = float(u_channel);
  float y = (u_sample * u_scale / 5.0) + u_offset;
  float x = (inputVertex.x / 5.0);
  x = x - 1.0 + index / 5.0;
  gl_Position = vec4(x, y, 1, 1);
  v_colour = u_colour;
}
`;
