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
      return 1.28;
    case 'medium':
    default:
      return 1;
  }
}

function resolvePalette(colors?: Partial<VortexColors>) {
  return {
    a:
      colors?.halo?.clone() ??
      colors?.accent?.clone() ??
      new THREE.Color('#8EEBFF'),
    b: colors?.violet?.clone() ?? new THREE.Color('#8C88FF'),
    c: colors?.mint?.clone() ?? new THREE.Color('#8FFFE1'),
    d: colors?.pink?.clone() ?? new THREE.Color('#F08BFF'),
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
    float r = clamp(length(p), 0.0, 1.0);

    float dome = pow(max(1.0 - r, 0.0), 1.45);

    float wobble =
      sin((p.x * 1.9 + p.y * 1.3) * 3.5 + uTime * 0.45) * 0.012 +
      cos((p.x * -1.4 + p.y * 1.8) * 4.2 - uTime * 0.32) * 0.009;

    pos.z += dome * 0.34 + wobble * dome * uMotion;
    pos.xy *= 1.0 - dome * 0.05;

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

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);

    if (r > 1.0) {
      discard;
    }

    vec2 dir = normalize(p + vec2(0.00001, 0.0));
    float t = uTime;

    float nBase = fbm(p * 2.2 + vec2(t * 0.08, -t * 0.05));
    float nFine = fbm(p * 4.8 + vec2(-t * 0.14, t * 0.10));
    float n = mix(nBase, nFine, 0.42);

    vec2 rot1 = vec2(cos(r * 7.4 - t * 0.85), sin(r * 7.4 - t * 0.85));
    vec2 rot2 = vec2(cos(r * 11.2 + t * 0.56 + 1.2), sin(r * 11.2 + t * 0.56 + 1.2));
    vec2 rot3 = vec2(cos(r * 4.8 - t * 0.28 - 0.8), sin(r * 4.8 - t * 0.28 - 0.8));

    float swirl1 = 0.5 + 0.5 * dot(dir, rot1);
    float swirl2 = 0.5 + 0.5 * dot(dir, rot2);
    float swirl3 = 0.5 + 0.5 * dot(dir, rot3);

    float broad =
      smoothstep(0.18, 0.95, swirl1 * 0.72 + swirl3 * 0.28 + n * 0.22);

    float tight =
      smoothstep(0.24, 0.98, swirl2 * 0.76 + n * 0.18);

    float center =
      (1.0 - smoothstep(0.0, 0.38, r)) *
      smoothstep(0.12, 0.92, swirl2 * 0.6 + swirl1 * 0.4);

    float mass =
      (1.0 - smoothstep(0.68, 1.0, r)) *
      (0.18 + 0.28 * nBase + 0.16 * swirl1);

    float shell =
      smoothstep(0.52, 0.92, r) *
      (1.0 - smoothstep(0.90, 1.0, r)) *
      (0.4 + 0.6 * swirl3);

    float density =
      broad * 0.42 +
      tight * 0.28 +
      mass * 0.34 +
      center * 0.42 +
      shell * 0.12;

    float colorMix1 =
      0.5 + 0.5 * sin(r * 5.4 - t * 0.26 + nBase * 2.1 + dir.x * 1.9);

    float colorMix2 =
      0.5 + 0.5 * sin(r * 6.8 + t * 0.18 + nFine * 1.7 + dir.y * 2.3 + 0.9);

    float colorMix3 =
      0.5 + 0.5 * sin(r * 3.2 - t * 0.14 + (dir.x + dir.y) * 1.4 + 1.7);

    vec3 color = mix(uColorA, uColorB, colorMix1);
    color = mix(color, uColorC, colorMix2 * 0.45 + shell * 0.10);
    color = mix(color, uColorD, colorMix3 * 0.22 + center * 0.25);

    vec3 finalColor = color;
    finalColor *= 0.88 + 0.32 * density;
    finalColor += uColorA * center * 0.18 * uGlow;
    finalColor += vec3(1.0) * center * 0.06 * uGlow;

    float edgeFade = 1.0 - smoothstep(0.84, 1.0, r);

    float alpha =
      density *
      edgeFade *
      uOpacity;

    gl_FragColor = vec4(finalColor, alpha);
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
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.78 * glow },
        uGlow: { value: glow },
        uMotion: { value: reducedMotion ? 0.2 : 1.0 },
        uColorA: { value: palette.a },
        uColorB: { value: palette.b },
        uColorC: { value: palette.c },
        uColorD: { value: palette.d },
      },
      vertexShader,
      fragmentShader,
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
      pointerX * 0.10,
      0.06,
    );

    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      Math.sin(t * 0.18) * 0.03,
      0.05,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh frustumCulled={false} renderOrder={1}>
        <circleGeometry args={[1.02, 192]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}