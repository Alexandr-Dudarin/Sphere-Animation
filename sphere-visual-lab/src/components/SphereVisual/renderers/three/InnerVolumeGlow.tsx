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
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.22;
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
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = atan(p.y, p.x);

    if (r > 1.0) discard;

    // Главный молочный слой ближе к краям
    float edgeBandA = exp(-pow((r - 0.88) / 0.14, 2.0));
    float edgeBandB = exp(-pow((r - 0.74) / 0.22, 2.0));

    // Слабая поддержка середины, но без сильного центра
    float midBand = exp(-pow((r - 0.56) / 0.24, 2.0)) * 0.42;

    // Небольшое приглушение самого центра
    float centerSuppression = 1.0 - smoothstep(0.0, 0.34, r) * 0.5;

    // Мягкие "затягивания" с краёв к центру
    float flowA = 0.5 + 0.5 * sin(a * 4.0 + r * 7.5 - uTime * 0.22 + uPhase);
    float flowB = 0.5 + 0.5 * sin(a * 7.0 - r * 10.0 + uTime * 0.16 + uPhase * 1.37);
    float flowC = 0.5 + 0.5 * sin((p.x * 1.7 - p.y * 2.0) * 2.8 - uTime * 0.12 + uPhase * 2.1);

    // Мягкая неоднородность края, чтобы туман не читался как круг
    float warp =
      0.028 * sin(a * 5.0 + uTime * 0.14 + uPhase) +
      0.018 * sin(a * 9.0 - uTime * 0.09 + uPhase * 0.8) +
      0.012 * sin(a * 13.0 + uTime * 0.06 + uPhase * 1.7);

    float edgeFade = 1.0 - smoothstep(0.90 + warp, 1.0, r);

    float outerStructure =
      edgeBandA * (0.82 + flowA * 0.18 + flowB * 0.14) +
      edgeBandB * (0.46 + flowB * 0.16);

    float innerStructure =
      midBand * (0.42 + flowC * 0.18);

    float structure = (outerStructure + innerStructure) * edgeFade * centerSuppression;

    vec3 color = mix(
      uColorA,
      uColorB,
      clamp(edgeBandA * 0.55 + flowA * 0.28, 0.0, 1.0)
    );

    color = mix(
      color,
      uColorC,
      clamp(midBand * 0.22 + flowB * 0.16, 0.0, 1.0)
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
}: VeilLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity * glowFactor },
      uPhase: { value: phase },
      uColorA: { value: colors[0].clone() },
      uColorB: { value: colors[1].clone() },
      uColorC: { value: colors[2].clone() },
    }),
    [colors, glowFactor, opacity, phase],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.4 : 1;
    const safeSpeed = Math.max(speed, 0.15);
    const t = elapsed * safeSpeed * motionFactor;

    if (meshRef.current) {
      meshRef.current.rotation.z = phase + t * rotationSpeed;

      const scale = radius * (1 + Math.sin(t * 0.45 + phase) * pulse);
      meshRef.current.scale.set(scale, scale, scale);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uOpacity.value =
        opacity * glowFactor * (0.97 + Math.sin(t * 0.34 + phase) * 0.04);
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
}: InnerVolumeGlowProps) {
  const rootRef = useRef<THREE.Group>(null);
  const glowFactor = getGlowFactor(glowIntensity);

  const edgePalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.halo.clone().lerp(colors.white, 0.08),
      colors.mint.clone().lerp(colors.halo, 0.22),
      colors.violet.clone().lerp(colors.pink, 0.12),
    ],
    [colors],
  );

  const outerPalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.halo.clone().lerp(colors.mint, 0.18),
      colors.mint.clone().lerp(colors.violet, 0.2),
      colors.violet.clone().lerp(colors.white, 0.08),
    ],
    [colors],
  );

  const supportPalette = useMemo<[THREE.Color, THREE.Color, THREE.Color]>(
    () => [
      colors.halo.clone().lerp(colors.violet, 0.08),
      colors.violet.clone().lerp(colors.mint, 0.14),
      colors.white.clone().lerp(colors.pink, 0.06),
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
        radius={1.06}
        opacity={0.24}
        z={-0.09}
        phase={0.18}
        rotationSpeed={0.022}
        pulse={0.018}
        colors={edgePalette}
        renderOrder={6}
      />

      <VeilLayer
        speed={speed}
        reducedMotion={reducedMotion}
        glowFactor={glowFactor}
        radius={0.96}
        opacity={0.17}
        z={-0.035}
        phase={1.22}
        rotationSpeed={-0.032}
        pulse={0.014}
        colors={outerPalette}
        renderOrder={7}
      />

      <VeilLayer
        speed={speed}
        reducedMotion={reducedMotion}
        glowFactor={glowFactor}
        radius={0.8}
        opacity={0.085}
        z={0.01}
        phase={2.38}
        rotationSpeed={0.042}
        pulse={0.01}
        colors={supportPalette}
        renderOrder={8}
      />
    </group>
  );
}