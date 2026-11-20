import { MAX_WATER_IMPACTS } from './waterCollectionMotion';

export const surfaceVertex = /* glsl */ `
varying vec2 vPoint;
varying vec2 vUv;
void main() {
  vPoint = position.xy;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const multiRippleFragment = /* glsl */ `
uniform float uTime, uDamping, uLineWidth, uGlow;
uniform vec3 uColor;
uniform int uImpactCount;
uniform vec4 uImpacts[${MAX_WATER_IMPACTS}];
varying vec2 vPoint;
void main() {
  float core = 0.0;
  float halo = 0.0;
  float field = 0.0;
  for (int i = 0; i < ${MAX_WATER_IMPACTS}; i++) {
    if (i >= uImpactCount) break;
    float age = uTime - uImpacts[i].z;
    float r = length(vPoint - uImpacts[i].xy);
    float trail = age * 0.84 - r;
    float envelope = smoothstep(0.0, 0.14, trail) * (1.0 - smoothstep(0.65, 1.35, trail));
    envelope *= step(0.0, age) * exp(-r * uDamping * 0.65 - max(age, 0.0) * 0.12) * uImpacts[i].w;
    float wave = sin(trail * 15.0);
    float distanceToCrest = acos(clamp(wave, -1.0, 1.0)) / 15.0;
    float aa = max(fwidth(r), 0.001);
    float line = 1.0 - smoothstep(uLineWidth * 0.28, uLineWidth * 0.28 + aa, distanceToCrest);
    core += line * envelope;
    halo += exp(-pow(distanceToCrest / (uLineWidth * 1.7 + aa), 2.0)) * envelope;
    field += wave * envelope;
  }
  float edge = 1.0 - smoothstep(2.2, 2.78, length(vPoint));
  float light = (core * 0.95 + halo * 0.23) * edge;
  // Intersections brighten or soften with the signed wave field.
  light *= 0.86 + 0.14 * clamp(field + 0.5, 0.0, 1.5);
  gl_FragColor = vec4(mix(uColor, vec3(0.68, 0.94, 1.0), min(core * 0.38, 0.6)) * uGlow,
    clamp(light * uGlow, 0.0, 0.95));
  #include <colorspace_fragment>
}`;

export const rainVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}`;
export const rainFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uGlow;
varying vec2 vUv;
void main() {
  float x = abs(vUv.x - 0.5);
  float tail = pow(1.0 - vUv.y, 1.2) * smoothstep(0.0, 0.12, vUv.y);
  float core = exp(-x * x * 100.0);
  gl_FragColor = vec4(mix(uColor, vec3(0.6, 0.94, 1.0), core * 0.6) * uGlow,
    (core + exp(-x * x * 18.0) * 0.22) * tail * 0.8);
  #include <colorspace_fragment>
}`;
