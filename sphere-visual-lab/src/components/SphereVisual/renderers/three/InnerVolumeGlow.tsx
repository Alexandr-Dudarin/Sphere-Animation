import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface InnerVolumeColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface InnerVolumeGlowProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: InnerVolumeColors;
  volumeStrength: number;
}

interface VeilLayerProps {
  speed: number;
  reducedMotion: boolean;
  glowFactor: number;
  radius: number;
  opacity: number;
  z: number;
  phase: number;
  rotationSpeed: number;
  pulse: number;
  colors: [THREE.Color, THREE.Color, THREE.Color];
  renderOrder: number;
  centerCut: number;
  edgeStrength: number;
  bandA: number;
  bandB: number;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.24;
    default:
      return 1;
  }
}

const VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  uniform float uCenterCut;
  uniform float uEdgeStrength;
  uniform float uBandA;
  uniform float uBandB;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x);

    if (r > 1.0) discard;

    float bandOuter = exp(-pow((r - uBandA) / 0.12, 2.0));
    float bandMid = exp(-pow((r - uBandB) / 0.18, 2.0));

    float inwardA = 0.5 + 0.5 * sin(a * 4.0 + r * 7.8 - uTime * 0.2 + uPhase);
    float inwardB = 0.5 + 0.5 * sin(a * 7.0 - r * 9.4 + uTime * 0.16 + uPhase * 1.31);
    float inwardC = 0.5 + 0.5 * sin((p.x * 1.8 - p.y * 2.0) * 2.7 - uTime * 0.12 + uPhase * 2.0);

    float edgeWarp =
      0.026 * sin(a * 5.0 + uTime * 0.14 + uPhase) +
      0.018 * sin(a * 9.0 - uTime * 0.09 + uPhase * 0.82) +
      0.012 * sin(a * 13.0 + uTime * 0.06 + uPhase * 1.7);

    float edgeFade = 1.0 - smoothstep(0.91 + edgeWarp, 1.0, r);

    float centerSuppression = smoothstep(uCenterCut, 1.0, r);

    float structure =
      bandOuter * (uEdgeStrength + inwardA * 0.2 + inwardB * 0.14) +
      bandMid * (0.34 + inwardB * 0.16 + inwardC * 0.12);

    structure *= edgeFade;
    structure *= centerSuppression;

    vec3 color = mix(
      uColorA,
      uColorB,
      clamp(bandOuter * 0.62 + inwardA * 0.24, 0.0, 1.0)
    );

    color = mix(
      color,
      uColorC,
      clamp(bandMid * 0.22 + inwardB * 0.16, 0.0, 1.0)
    );

    float alpha = uOpacity * structure;

    gl_FragColor = vec4(color, alpha);
  }
`;

function VeilLayer({
  speed,
  reducedMotion,
  glowFactor,
  radius,
  opacity,
  z,
  phase,
  rotationSpeed,
  pulse,
  colors,
  renderOrder,
  centerCut,
  edgeStrength,
  bandA,
  bandB,
}: VeilLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity * glowFactor },
      uPhase: { value: phase },
      uCenterCut: { value: centerCut },
      uEdgeStrength: { value: edgeStrength },
      uBandA: { value: bandA },
      uBandB: { value: bandB },
      uColorA: { value: colors[0].clone() },
      uColorB: { value: colors[1].clone() },
      uColorC: { value: colors[2].clone() },
    }),
    [colors, glowFactor, opacity, phase, centerCut, edgeStrength, bandA, bandB],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.4 : 1;
    const safeSpeed = Math.max(speed, 0.15);
    const t = elapsed * safeSpeed * motionFactor;

    if (meshRef.current) {
      meshRef.current.rotation.z = phase + t * rotationSpeed;
      const scale = radius * (1 + Math.sin(t * 0.42 + phase) * pulse);
      meshRef.current.scale.set(scale, scale, scale);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uOpacity.value =
        opacity * glowFactor * (0.97 + Math.sin(t * 0.34 + phase) * 0.035);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, z]} renderOrder={renderOrder}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function InnerVolumeGlow({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
  volumeStrength,
}: InnerVolumeGlowProps) {
  const rootRef = useRef<THREE.Group>(null);
  const glowFactor = getGlowFactor(glowIntensity);
  const volumeFactor = THREE.MathUtils.clamp(volumeStrength, 0.45, 1.7);

  const shellPalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.halo.clone().lerp(colors.white, 0.08),
      colors.mint.clone().lerp(colors.accent, 0.28),
      colors.pink.clone().lerp(colors.violet, 0.22),
    ],
    [colors],
  );

  const edgePalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.halo.clone().lerp(colors.accent, 0.22),
      colors.mint.clone().lerp(colors.violet, 0.18),
      colors.accent.clone().lerp(colors.white, 0.16),
    ],
    [colors],
  );

  const supportPalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.accent.clone().lerp(colors.halo, 0.28),
      colors.violet.clone().lerp(colors.pink, 0.24),
      colors.mint.clone().lerp(colors.accent, 0.18),
    ],
    [colors],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.15);

    if (rootRef.current) {
      rootRef.current.rotation.x = Math.sin(elapsed * 0.06 * safeSpeed) * 0.012;
      rootRef.current.rotation.y = Math.cos(elapsed * 0.07 * safeSpeed) * 0.012;
      rootRef.current.rotation.z = Math.sin(elapsed * 0.05 * safeSpeed) * 0.01;
    }
  });

  return (
    <group ref={rootRef} renderOrder={6}>
      <VeilLayer
        speed={speed}
        reducedMotion={reducedMotion}
        glowFactor={glowFactor}
        radius={1.08}
        opacity={0.28 * volumeFactor}
        z={-0.095}
        phase={0.18}
        rotationSpeed={0.02}
        pulse={0.018}
        colors={shellPalette}
        renderOrder={6}
        centerCut={0.52}
        edgeStrength={0.94}
        bandA={0.9}
        bandB={0.76}
      />

      <VeilLayer
        speed={speed}
        reducedMotion={reducedMotion}
        glowFactor={glowFactor}
        radius={0.98}
        opacity={0.19 * volumeFactor}
        z={-0.04}
        phase={1.24}
        rotationSpeed={-0.028}
        pulse={0.014}
        colors={edgePalette}
        renderOrder={7}
        centerCut={0.46}
        edgeStrength={0.82}
        bandA={0.86}
        bandB={0.7}
      />

      <VeilLayer
        speed={speed}
        reducedMotion={reducedMotion}
        glowFactor={glowFactor}
        radius={0.82}
        opacity={0.07 * volumeFactor}
        z={0.01}
        phase={2.4}
        rotationSpeed={0.038}
        pulse={0.01}
        colors={supportPalette}
        renderOrder={8}
        centerCut={0.38}
        edgeStrength={0.42}
        bandA={0.76}
        bandB={0.58}
      />
    </group>
  );
}