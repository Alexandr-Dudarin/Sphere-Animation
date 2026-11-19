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

export const waterfallVertex = /* glsl */ `
uniform float uTime, uIntensity;
varying vec2 vUv;
void main() {
  vUv = uv;
  float descent = 1.0 - uv.y;
  float travel = sqrt(descent + 0.035) * 8.0 - uTime * 3.4;
  float spread = descent * descent;
  float x = (uv.x - 0.5) * (1.8 + spread * 0.12);
  x += sin(travel + uv.x * 9.0) * descent * 0.035;
  x += sin(travel * 1.7 + uv.x * 21.0) * spread * 0.018 * uIntensity;
  float y = -sin(descent * 3.14159) * 0.17;
  y += sin(uv.x * 19.0 + travel) * descent * 0.035;
  float z = uv.y * 2.05 + sin(uv.x * 11.0) * 0.012 * uv.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
}`;
export const waterfallFragment = /* glsl */ `
uniform float uTime, uGlow, uLineWidth, uIntensity;
uniform vec3 uColor;
varying vec2 vUv;
float waterNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec4 n = sin(vec4(dot(i, vec2(127.1, 311.7)), dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7)),
    dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7)), dot(i + 1.0, vec2(127.1, 311.7)))) * 43758.5453;
  n = fract(n);
  return mix(mix(n.x, n.y, f.x), mix(n.z, n.w, f.x), f.y);
}
void main() {
  float descent = 1.0 - vUv.y;
  // Features follow a downward, accelerating coordinate instead of fixed parallel threads.
  float travel = sqrt(descent + 0.035) * 8.0 - uTime * 3.4;
  float coarse = waterNoise(vec2(vUv.x * 6.0, travel * 0.7));
  float fine = waterNoise(vec2(vUv.x * 17.0, travel * 1.8));
  float stream = vUv.x * 11.0 + (coarse - 0.5) * (0.5 + descent * 1.3);
  stream += (fine - 0.5) * descent * 0.38;
  float d = abs(fract(stream) - 0.5);
  float width = uLineWidth * (1.2 + coarse * 2.4);
  float aa = max(fwidth(stream), 0.009);
  float core = 1.0 - smoothstep(width, width + aa, d);
  float halo = exp(-pow(d / (0.13 + width), 2.0));
  float body = smoothstep(0.24, 0.78, coarse) * (0.3 + fine * 0.7);
  float flow = 0.26 + 0.74 * smoothstep(0.18, 0.85, fine);
  float edge = smoothstep(0.0, 0.06, vUv.x) * (1.0 - smoothstep(0.94, 1.0, vUv.x));
  float foot = smoothstep(0.0, 0.035 + fine * 0.025, vUv.y);
  float alpha = (core * flow * 0.63 + halo * 0.18 + body * 0.17) * edge * foot;
  alpha *= 0.6 + uIntensity * 0.4;
  vec3 color = mix(uColor, vec3(0.63, 0.94, 1.0), clamp(core * flow * 0.56 + body * 0.18, 0.0, 0.7));
  gl_FragColor = vec4(color * uGlow, min(alpha * uGlow, 0.9));
  #include <colorspace_fragment>
}`;

export const crownVertex = /* glsl */ `
uniform float uAge;
#ifdef USE_INSTANCING
attribute float aAge;
#endif
varying float vAge;
varying vec2 vUv;
void main() {
  vUv = uv;
  vAge = uAge;
  #ifdef USE_INSTANCING
    vAge = aAge;
  #endif
  float p = clamp(vAge / 0.88, 0.0, 1.0);
  float angle = uv.x * 6.2831853;
  float height = sin(p * 3.1415926) * (1.0 - p * 0.65) * 0.65;
  float lobes = 0.78 + 0.22 * cos(angle * 9.0);
  float radius = 0.10 + p * 0.55 + uv.y * uv.y * height * 0.25;
  vec3 point = vec3(cos(angle) * radius, sin(angle) * radius, uv.y * height * lobes + 0.008);
  vec4 transformed = vec4(point, 1.0);
  #ifdef USE_INSTANCING
    transformed = instanceMatrix * transformed;
  #endif
  gl_Position = projectionMatrix * modelViewMatrix * transformed;
}`;
export const crownFragment = /* glsl */ `
uniform float uGlow, uLineWidth;
varying float vAge;
uniform vec3 uColor;
varying vec2 vUv;
void main() {
  float aa = max(fwidth(vUv.y), 0.005);
  float rim = smoothstep(1.0 - uLineWidth * 2.0 - aa, 1.0 - uLineWidth, vUv.y);
  float base = 1.0 - smoothstep(0.01, 0.04 + aa, vUv.y);
  float ribs = pow(0.5 + 0.5 * cos(vUv.x * 6.2831853 * 9.0), 22.0) * 0.13;
  float fade = smoothstep(0.0, 0.045, vAge) * (1.0 - smoothstep(0.5, 0.88, vAge));
  float alpha = (rim * 0.9 + base * 0.25 + ribs + 0.022) * fade;
  gl_FragColor = vec4(mix(uColor, vec3(0.65, 0.94, 1.0), rim * 0.5) * uGlow, alpha);
  #include <colorspace_fragment>
}`;
