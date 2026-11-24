export const planetVertex = /* glsl */ `
varying vec3 vNormal, vView, vLocal;
void main() {
  vec4 view = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = -view.xyz;
  vLocal = normalize(position);
  gl_Position = projectionMatrix * view;
}`;

export const planetFragment = /* glsl */ `
uniform vec3 uColor, uAccent, uAtmosphere;
uniform float uSeed, uBands, uGlow;
varying vec3 vNormal, vView, vLocal;
float hash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  return noise3(p) * 0.56 + noise3(p * 2.03 + 4.1) * 0.28 + noise3(p * 4.07 + 7.8) * 0.16;
}
void main() {
  vec3 p = normalize(vLocal);
  float broad = fbm(p * 3.8 + uSeed);
  float detail = fbm(p * 12.0 + uSeed * 2.0);
  float land = smoothstep(0.43, 0.66, broad + (detail - 0.5) * 0.18);
  float belts = 0.5 + 0.5 * sin(p.y * 38.0 + broad * 9.0 + detail * 3.0);
  float pattern = mix(land, smoothstep(0.12, 0.92, belts), uBands);
  vec3 albedo = mix(uColor * 0.38, uAccent, pattern * 0.79);
  float clouds = smoothstep(0.64, 0.80, fbm(p * 6.2 + vec3(uSeed, 4.0, 1.0)));
  albedo = mix(albedo, uAccent, clouds * 0.52 * (1.0 - uBands));
  vec3 n = normalize(vNormal), view = normalize(vView);
  vec3 light = normalize(vec3(-0.65, 0.8, 1.15));
  float daylight = max(dot(n, light), 0.0);
  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.6);
  float sheen = pow(max(dot(n, normalize(light + view)), 0.0), 42.0) * (1.0 - pattern);
  vec3 color = albedo * (0.12 + daylight * 1.12);
  color += uAtmosphere * rim * (0.26 + daylight * 0.45) * uGlow;
  color += uAccent * sheen * 0.24;
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`;
