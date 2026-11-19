// A finite wave train emitted at the origin, evaluated at retarded time.
// The envelope is zero at both ends, so looping never resets a visible ring.
const waveField = `
  uniform float uTime;
  uniform float uInterval;
  uniform float uDamping;
  uniform float uAmplitude;

  vec3 rippleAt(vec2 p) {
    float r = length(p);
    float travelTime = r / 0.84;
    float retarded = uTime - travelTime;
    float age = mod(max(retarded, 0.0), uInterval);
    float envelope = smoothstep(0.0, 0.24, age)
      * (1.0 - smoothstep(1.4, 2.8, age))
      * step(0.0, retarded);
    float edge = 1.0 - smoothstep(2.1, 2.8, r);
    float attenuation = exp(-r * uDamping) * edge;
    float phase = age * 12.8;
    float wave = sin(phase);
    float height = wave * envelope * attenuation * uAmplitude;
    return vec3(height, wave, envelope * attenuation);
  }
`;

export const rippleVertexShader = `
  ${waveField}
  varying vec2 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPoint = position.xy;
    float dx = (rippleAt(vPoint + vec2(0.012, 0.0)).x
      - rippleAt(vPoint - vec2(0.012, 0.0)).x) / 0.024;
    float dy = (rippleAt(vPoint + vec2(0.0, 0.012)).x
      - rippleAt(vPoint - vec2(0.0, 0.012)).x) / 0.024;
    vNormal = normalize(normalMatrix * vec3(-dx, -dy, 1.0));
    // Keep the luminous rings in one plane. Relief only changes the normals,
    // so a shrinking wave amplitude cannot lift an entire ring on screen.
    vec4 mv = modelViewMatrix * vec4(position.xy, 0.0, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const rippleFragmentShader = `
  ${waveField}
  uniform vec3 uColor;
  uniform float uGlow;
  uniform float uLineWidth;
  varying vec2 vPoint;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float r = length(vPoint);
    if (r > 2.8) discard;
    vec3 field = rippleAt(vPoint);
    // Convert phase to distance, with a pixel-sized antialiasing footprint.
    // Unlike a threshold on sin(phase), this keeps the line width explicit.
    float distanceToCrest = acos(clamp(field.y, -1.0, 1.0)) * (0.84 / 12.8);
    float aa = max(fwidth(r) * 0.65, 0.0008);
    float crest = 1.0 - smoothstep(uLineWidth * 0.5 - aa,
      uLineWidth * 0.5 + aa, distanceToCrest);
    float halo = exp(-pow(distanceToCrest / (uLineWidth * 2.2 + aa), 2.0));
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    vec3 light = normalize(vec3(-0.35, 0.65, 1.0));
    float specular = pow(max(dot(n, normalize(light + view)), 0.0), 42.0);
    float fresnel = pow(1.0 - abs(dot(n, view)), 3.0);
    float edge = 1.0 - smoothstep(2.0, 2.8, r);
    float impactAge = mod(uTime, uInterval);
    float impact = exp(-r * r * 42.0) * exp(-impactAge * 5.5) * step(0.0, uTime);
    float energy = (crest * 1.6 + halo * 0.18) * field.z * uGlow;
    vec3 color = uColor * (0.035 * edge + energy);
    color += mix(uColor, vec3(0.72, 0.94, 1.0), 0.65)
      * (specular * field.z * 0.36 + crest * field.z * uGlow * 0.22);
    color += uColor * impact * uGlow * 1.6;
    float alpha = clamp(edge * 0.055 + field.z * (crest * 0.9 + halo * 0.2)
      * uGlow + fresnel * edge * 0.05 + impact * uGlow, 0.0, 0.98);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;
