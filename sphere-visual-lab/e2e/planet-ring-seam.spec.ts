import { expect, test } from '@playwright/test';
import { planetRingFragment } from '../src/components/shared/planetRing/planetRingShaders';

// Exercise the actual GLSL in WebGL: a discontinuity in any animated angular
// layer must be caught even when a whole-scene screenshot makes it hard to see.
test('planetary ring colour and opacity join continuously at a full turn', async ({ page }) => {
  const result = await page.evaluate((fragment) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL is required for the ring seam regression');
    const compile = (kind: number, source: string) => {
      const shader = gl.createShader(kind)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'GLSL error');
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      uniform float uTestU, uTestRadial;
      varying vec2 vUv;
      varying float vViewZ, vCenterViewZ;
      void main() {
        vUv = vec2(uTestU, uTestRadial);
        vViewZ = vCenterViewZ = 0.0;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);
    const pixel = compile(gl.FRAGMENT_SHADER, 'precision highp float;\n' + fragment);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, pixel);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'Link error');
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DITHER);
    const set = (name: string, value: number) => gl.uniform1f(gl.getUniformLocation(program, name), value);
    set('uOpacity', 0.95);
    set('uFlowSpeed', 0.7);
    set('uShimmerSpeed', 0.6);
    set('uDepthSide', 0);
    set('uDepthFeather', 0.04);
    gl.uniform3f(gl.getUniformLocation(program, 'uBaseColor'), 0.2, 0.5, 0.9);
    const sample = (u: number) => {
      set('uTestU', u);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const rgba = new Uint8Array(4);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
      return rgba;
    };
    let maxJump = 0, maxNearJump = 0, peakAlpha = 0;
    for (const time of [0, 3.7, 1000]) for (const offset of [0, 0.37]) {
      set('uTime', time);
      set('uOffset', offset);
      for (const radial of [0.13, 0.245, 0.35, 0.505, 0.63, 0.87]) {
        set('uTestRadial', radial);
        const start = sample(0), end = sample(1);
        const before = sample(0.9999), after = sample(0.0001);
        for (let channel = 0; channel < 4; channel++) {
          maxJump = Math.max(maxJump, Math.abs(start[channel] - end[channel]));
          maxNearJump = Math.max(maxNearJump, Math.abs(before[channel] - after[channel]));
        }
        peakAlpha = Math.max(peakAlpha, start[3]);
      }
    }
    const error = gl.getError();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(pixel);
    return { maxJump, maxNearJump, peakAlpha, error };
  }, planetRingFragment);
  expect(result.error).toBe(0);
  expect(result.peakAlpha).toBeGreaterThan(64);
  expect(result.maxJump).toBeLessThanOrEqual(1);
  expect(result.maxNearJump).toBeLessThanOrEqual(2);
});
