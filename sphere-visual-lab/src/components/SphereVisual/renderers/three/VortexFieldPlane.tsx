import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type VortexColors = {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
};

type VortexFieldPlaneProps = {
  speed?: number;
  reducedMotion?: boolean;
  interactive?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high' | number;
  colors?: Partial<VortexColors>;
};

function resolveGlowFactor(
  glowIntensity: VortexFieldPlaneProps['glowIntensity'],
) {
  if (typeof glowIntensity === 'number') {
    return THREE.MathUtils.clamp(glowIntensity, 0.5, 2);
  }

  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.32;
    case 'medium':
    default:
      return 1;
  }
}

function resolvePalette(colors?: Partial<VortexColors>) {
  return {
    a: colors?.halo?.clone() ?? colors?.accent?.clone() ?? new THREE.Color('#8EEBFF'),
    b: colors?.violet?.clone() ?? new THREE.Color('#A88BFF'),
    c: colors?.mint?.clone() ?? new THREE.Color('#8FFFE1'),
    d: colors?.pink?.clone() ?? new THREE.Color('#FF8BEF'),
  };
}

const vertexShader = `
  uniform float uTime;
  uniform float uMotion;

  varying vec2 vUv;
  varying float vRadius;
  varying float vDome;

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec2 p = uv * 2.0 - 1.0;
    float r = length(p);

    float dome = pow(max(1.0 - r, 0.0), 1.45);
    float angle = atan(p.y, p.x);

    float innerWave =
      sin(angle * 4.0 - r * 8.0 + uTime * 0.55) * 0.02 +
      cos(angle * 7.0 + r * 12.0 - uTime * 0.42) * 0.012;

    pos.z += dome * (0.42 + innerWave * uMotion);
    pos.xy *= 1.0 - dome * 0.06;

    pos.z += sin((p.x + p.y) * 5.0 + uTime * 0.36) * 0.018 * dome * uMotion;

    vRadius = r;
    vDome = dome;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uGlow;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uColorD;

  varying vec2 vUv;
  varying float vRadius;
  varying float vDome;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  float filament(float x, float width) {
    return 1.0 - smoothstep(width, width * 2.0, abs(x));
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);

    if (r > 1.04) {
      discard;
    }

    float a = atan(p.y, p.x);
    float t = uTime;

    float n = fbm(vec2(a * 1.4, r * 4.6 + t * 0.08));

    float swirl1 = filament(
      sin(a * 4.8 - r * 10.8 - t * 1.18 + n * 2.1),
      0.08
    );

    float swirl2 = filament(
      sin(a * 7.6 + r * 8.2 + t * 0.92 - n * 1.7),
      0.07
    );

    float swirl3 = filament(
      sin(a * 11.4 - r * 15.6 - t * 1.36 + n * 2.8),
      0.06
    );

    float shellBand =
      smoothstep(0.48, 0.94, r) *
      (1.0 - smoothstep(0.92, 1.03, r));

    float centerBand =
      (1.0 - smoothstep(0.0, 0.34, r)) *
      smoothstep(0.16, 0.86, 0.5 + 0.5 * sin(a * 5.2 - t * 0.9 + n * 2.0));

    float veil =
      smoothstep(0.2, 0.94, 0.5 + 0.5 * sin(a * 2.1 - t * 0.35 + n * 1.5)) *
      (1.0 - smoothstep(0.88, 1.03, r));

    float structure =
      swirl1 * 0.9 +
      swirl2 * 0.78 +
      swirl3 * 0.72 +
      shellBand * swirl3 * 0.42 +
      centerBand * 0.26 +
      veil * 0.18;

    float circularMask = 1.0 - smoothstep(0.94, 1.03, r);
    float rim = smoothstep(0.72, 0.98, r) * (1.0 - smoothstep(0.98, 1.03, r));

    float colorShift = fract((a / 6.2831853) + t * 0.035 + n * 0.12 + r * 0.22);

    vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.34, colorShift));
    color = mix(color, uColorC, smoothstep(0.28, 0.68, colorShift));
    color = mix(color, uColorD, smoothstep(0.62, 1.0, colorShift));

    color += uColorA * swirl1 * 0.15 * uGlow;
    color += uColorB * swirl2 * 0.14 * uGlow;
    color += uColorD * swirl3 * 0.14 * uGlow;
    color += uColorC * rim * 0.18 * uGlow;
    color += vec3(1.0) * centerBand * 0.035 * uGlow;

    float alpha =
      circularMask *
      (structure * 0.34 + veil * 0.08 + centerBand * 0.08) *
      uOpacity;

    alpha += rim * 0.06 * uGlow;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function VortexFieldPlane({
  speed = 1,
  reducedMotion = false,
  interactive = true,
  glowIntensity = 'medium',
  colors,
}: VortexFieldPlaneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const glow = resolveGlowFactor(glowIntensity);
  const palette = useMemo(() => resolvePalette(colors), [colors]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.94 * glow },
        uGlow: { value: glow },
        uMotion: { value: reducedMotion ? 0.2 : 1.0 },
        uColorA: { value: palette.a },
        uColorB: { value: palette.b },
        uColorC: { value: palette.c },
        uColorD: { value: palette.d },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
  }, [glow, palette, reducedMotion]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    const pointerX = interactive ? state.pointer.x : 0;
    const pointerY = interactive ? state.pointer.y : 0;

    material.uniforms.uTime.value = t;
    material.uniforms.uMotion.value = reducedMotion ? 0.2 : 1.0;

    if (!groupRef.current) return;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointerY * 0.08,
      0.06,
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointerX * 0.1,
      0.06,
    );

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      Math.sin(t * 0.18) * 0.04,
      0.05,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh frustumCulled={false}>
        <planeGeometry args={[2.05, 2.05, 180, 180]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}