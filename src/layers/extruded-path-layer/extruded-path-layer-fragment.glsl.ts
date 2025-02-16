// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const fs = `\
#version 300 es
#define SHADER_NAME path-layer-fragment-shader

precision highp float;

uniform float miterLimit;

in vec4 vColor;
in vec2 vCornerOffset;
in float vMiterLength;
in vec3 vNormal;
in vec3 cameraPosition;

/*
 * vPathPosition represents the relative coordinates of the current fragment on the path segment.
 * vPathPosition.x - position along the width of the path, between [-1, 1]. 0 is the center line.
 * vPathPosition.y - position along the length of the path, between [0, L / width].
 */
in vec2 vPathPosition;
in float vPathLength;
in float vJointType;
in vec3 vCommonPosition;

out vec4 fragColor;

void main(void) {
  geometry.uv = vPathPosition;

  if (vPathPosition.y < 0.0 || vPathPosition.y > vPathLength) {
    // if joint is rounded, test distance from the corner
    if (vJointType > 0.5 && length(vCornerOffset) > 1.0) {
      discard;
    }
    // trim miter
    if (vJointType < 0.5 && vMiterLength > miterLimit + 1.0) {
      discard;
    }
  }

  vec3 N = normalize(vNormal);

  vec3 lightColor = lighting_getLightColor(vColor.rgb, cameraPosition, vCommonPosition, N);

  fragColor = vec4(lightColor, vColor.a);

  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;
