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
  uniform float u_offsetY;
  uniform float u_scaleY;
  in vec2 aVertexPosition;
  out vec4 v_colour;

  void main() {
    float y = aVertexPosition.y * u_scaleY + u_offsetY;
    gl_Position = vec4(aVertexPosition.x, y, 0, 1);
    v_colour = u_colour;
  }
`;