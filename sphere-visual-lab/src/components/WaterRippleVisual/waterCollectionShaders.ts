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
uniform vec4 uImpacts[24];
varying vec2 vPoint;
void main() {
  float core = 0.0;
  float halo = 0.0;
  float field = 0.0;
  for (int i = 0; i < 24; i++) {
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

export const vortexVertex = /* glsl */ `
uniform float uIntensity;
varying vec2 vPoint;
void main() {
  vPoint = position.xy;
  vec3 p = position;
  p.z = -0.65 * uIntensity * exp(-dot(p.xy, p.xy) * 1.9);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
export const vortexFragment = /* glsl */ `
uniform float uTime, uGlow, uLineWidth, uIntensity;
uniform vec3 uColor;
varying vec2 vPoint;
void main() {
  float r = length(vPoint);
  float angle = atan(vPoint.y, vPoint.x);
  // Integer angular winding keeps the atan seam continuous.
  float phase = r * 16.0 - angle * 3.0 + uTime * 2.1;
  float d = abs(sin(phase * 0.5));
  float aa = max(fwidth(d), 0.007);
  float width = uLineWidth * 2.0;
  float core = 1.0 - smoothstep(width, width + aa, d);
  float halo = exp(-pow(d / (width * 3.0 + aa), 2.0));
  float edge = smoothstep(0.09, 0.26, r) * (1.0 - smoothstep(1.7, 2.65, r));
  float flow = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(r * 7.0 + uTime * 3.2), 3.0);
  float alpha = (core * 0.83 + halo * 0.19) * edge * flow;
  gl_FragColor = vec4(mix(uColor, vec3(0.58, 0.9, 1.0), core * 0.45) * uGlow, alpha * min(uGlow, 1.6));
  #include <colorspace_fragment>
}`;

export const waterfallVertex = /* glsl */ `
uniform float uTime, uIntensity;
varying vec2 vUv;
void main() {
  vUv = uv;
  float descent = 1.0 - uv.y;
  float x = (uv.x - 0.5) * 1.8;
  x += sin(descent * 8.0 - uTime * 1.5 + uv.x * 4.0) * descent * 0.025;
  float y = sin(uv.x * 15.0 + descent * 11.0 - uTime * 2.0) * 0.025 * descent;
  y -= sin(descent * 3.14159) * 0.13;
  vec3 p = vec3(x, y, uv.y * 2.05);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
export const waterfallFragment = /* glsl */ `
uniform float uTime, uGlow, uLineWidth, uIntensity;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float descent = 1.0 - vUv.y;
  float strand = vUv.x * 26.0 + sin(descent * 5.0 - uTime + vUv.x * 17.0) * descent * 0.12;
  float d = abs(fract(strand) - 0.5);
  float aa = max(fwidth(strand), 0.012);
  float core = 1.0 - smoothstep(uLineWidth * 1.1, uLineWidth * 1.1 + aa, d);
  float halo = exp(-pow(d / (0.09 + uLineWidth), 2.0));
  float seed = sin(floor(strand) * 53.7) * 7.0;
  // Equal time intervals travel farther near the foot of the waterfall.
  float phase = sqrt(descent + 0.03) * 18.0 - uTime * 5.5;
  float flow = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(phase + seed), 3.0);
  float edge = smoothstep(0.0, 0.065, vUv.x) * (1.0 - smoothstep(0.935, 1.0, vUv.x));
  float foot = smoothstep(0.0, 0.045, vUv.y);
  float alpha = (core * 0.72 + halo * 0.14 + 0.018) * flow * edge * foot * (0.5 + uIntensity * 0.5);
  gl_FragColor = vec4(mix(uColor, vec3(0.63, 0.94, 1.0), core * flow * 0.48) * uGlow, min(alpha * uGlow, 0.9));
  #include <colorspace_fragment>
}`;

export const crownVertex = /* glsl */ `
uniform float uAge;
varying vec2 vUv;
void main() {
  vUv = uv;
  float p = clamp(uAge / 0.88, 0.0, 1.0);
  float angle = uv.x * 6.2831853;
  float height = sin(p * 3.1415926) * (1.0 - p * 0.65) * 0.65;
  float lobes = 0.78 + 0.22 * cos(angle * 9.0);
  float radius = 0.10 + p * 0.55 + uv.y * uv.y * height * 0.25;
  vec3 point = vec3(cos(angle) * radius, sin(angle) * radius, uv.y * height * lobes + 0.008);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(point, 1.0);
}`;
export const crownFragment = /* glsl */ `
uniform float uAge, uGlow, uLineWidth;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float aa = max(fwidth(vUv.y), 0.005);
  float rim = smoothstep(1.0 - uLineWidth * 2.0 - aa, 1.0 - uLineWidth, vUv.y);
  float base = 1.0 - smoothstep(0.01, 0.04 + aa, vUv.y);
  float ribs = pow(0.5 + 0.5 * cos(vUv.x * 6.2831853 * 9.0), 22.0) * 0.13;
  float fade = smoothstep(0.0, 0.045, uAge) * (1.0 - smoothstep(0.5, 0.88, uAge));
  float alpha = (rim * 0.9 + base * 0.25 + ribs + 0.022) * fade;
  gl_FragColor = vec4(mix(uColor, vec3(0.65, 0.94, 1.0), rim * 0.5) * uGlow, alpha);
  #include <colorspace_fragment>
}`;
