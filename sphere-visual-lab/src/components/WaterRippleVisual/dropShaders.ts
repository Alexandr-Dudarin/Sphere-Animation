export const dropVertexShader = `
  uniform float uTaper;
  uniform float uTip;
  varying vec3 vNormal;
  void main() {
    vec3 p = position;
    float taper = 1.0 - uTaper * (p.y * 0.5 + 0.5);
    vec3 n = vec3(normal.x / taper, normal.y, normal.z / taper);
    n.y += uTaper * 0.5 * (p.x * n.x + p.z * n.z);
    // Stretch only the upper hemisphere; keep the water contact point fixed.
    float upper = max(p.y, 0.0);
    n.y /= 1.0 + 3.0 * uTip * upper * upper;
    p.y += uTip * upper * upper * upper;
    p.xz *= taper;
    vNormal = normalize(normalMatrix * n);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dropFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlow;
  varying vec3 vNormal;
  void main() {
    vec3 n = normalize(vNormal);
    // The scene has an orthographic camera: all view rays are parallel.
    float facing = abs(n.z);
    float aa = max(fwidth(facing) * 0.55, 0.012);
    float core = 1.0 - smoothstep(0.25 - aa, 0.52 + aa, facing);
    float halo = pow(1.0 - facing, 4.0);
    vec3 color = uColor * (core * 1.6 + halo * 0.22) * uGlow;
    color += vec3(0.28, 0.68, 1.0) * core * 0.16 * uGlow;
    gl_FragColor = vec4(color, (core * 0.98 + halo * 0.16 + 0.002) * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const spoutVertexShader = `
  varying float vAlong;
  void main() {
    vAlong = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const spoutFragmentShader = `
  uniform vec3 uColor;
  uniform float uGlow;
  uniform float uOpacity;
  varying float vAlong;
  void main() {
    float fade = smoothstep(0.0, 0.28, vAlong);
    gl_FragColor = vec4(uColor * uGlow * 1.2, uOpacity * fade);
    #include <colorspace_fragment>
  }
`;
