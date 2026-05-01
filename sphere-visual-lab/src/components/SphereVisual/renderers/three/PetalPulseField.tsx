import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface PetalPulseColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface PetalPulseFieldProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: PetalPulseColors;
}

interface PetalPulseGeometrySet {
  pulse: THREE.TubeGeometry;
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.18;
    default:
      return 1;
  }
}

function createPetalTubeGeometry(
  length: number,
  width: number,
  rotation: number,
  radius: number,
  zOffset = 0,
  bend = 0,
) {
  const start = new THREE.Vector3(0, 0, zOffset);
  const tip = new THREE.Vector3(0, length, zOffset + bend);

  const rightCurve = new THREE.CubicBezierCurve3(
    start,
    new THREE.Vector3(width * 1.02, length * 0.18, zOffset + bend * 0.15),
    new THREE.Vector3(width * 0.92, length * 0.78, zOffset + bend * 0.8),
    tip,
  );

  const leftCurve = new THREE.CubicBezierCurve3(
    tip,
    new THREE.Vector3(-width * 0.92, length * 0.78, zOffset + bend * 0.8),
    new THREE.Vector3(-width * 1.02, length * 0.18, zOffset + bend * 0.15),
    start,
  );

  const rawPoints = [
    ...rightCurve.getPoints(42),
    ...leftCurve.getPoints(42).slice(1),
  ];

  const rotatedPoints = rawPoints.map((point) =>
    point.clone().applyAxisAngle(Z_AXIS, rotation),
  );

  const path = new THREE.CatmullRomCurve3(
    rotatedPoints,
    false,
    'catmullrom',
    0.45,
  );

  return new THREE.TubeGeometry(path, 160, radius, 12, false);
}

function createPetalLayer(
  count: number,
  length: number,
  width: number,
  rotationOffset: number,
  pulseRadius: number,
  zOffset = 0,
  bend = 0,
): PetalPulseGeometrySet[] {
  return Array.from({ length: count }, (_, index) => {
    const rotation = (index / count) * Math.PI * 2 + rotationOffset;

    return {
      pulse: createPetalTubeGeometry(
        length,
        width,
        rotation,
        pulseRadius,
        zOffset,
        bend,
      ),
    };
  });
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
  uniform float uSpeed;
  uniform float uOffset;
  uniform vec3 uBaseColor;
  uniform vec3 uHotColor;

  varying vec2 vUv;

  float loopDistance(float a, float b) {
    float d = abs(a - b);
    return min(d, 1.0 - d);
  }

  void main() {
    float along = fract(vUv.x - uTime * uSpeed + uOffset);

    float head = exp(-pow(loopDistance(along, 0.18) / 0.042, 2.0));
    float tail = exp(-pow(loopDistance(along, 0.26) / 0.12, 2.0)) * 0.56;
    float pulse = clamp(head + tail, 0.0, 1.0);

    float body = 0.12 + 0.06 * sin((vUv.x + uOffset) * 24.0 - uTime * 1.15);
    float shimmer = 0.92 + 0.08 * sin((vUv.x + uOffset) * 34.0 - uTime * 1.35);

    vec3 color = mix(uBaseColor, uHotColor, pulse);
    float alpha = uOpacity * (body + pulse * 1.22) * shimmer;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface PulsePetalProps {
  geometry: THREE.TubeGeometry;
  baseColor: THREE.Color;
  hotColor: THREE.Color;
  opacity: number;
  speed: number;
  reducedMotion: boolean;
  glowFactor: number;
  offset: number;
  speedFactor: number;
}

function PulsePetal({
  geometry,
  baseColor,
  hotColor,
  opacity,
  speed,
  reducedMotion,
  glowFactor,
  offset,
  speedFactor,
}: PulsePetalProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity * glowFactor },
      uSpeed: { value: speedFactor },
      uOffset: { value: offset },
      uBaseColor: { value: baseColor.clone() },
      uHotColor: { value: hotColor.clone() },
    }),
    [opacity, glowFactor, speedFactor, offset, baseColor, hotColor],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.42 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        elapsed * safeSpeed * motionFactor;
    }
  });

  return (
    <mesh geometry={geometry} renderOrder={24}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function PetalPulseField({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: PetalPulseFieldProps) {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const outerLayer = useMemo(
    () =>
      createPetalLayer(
        10,
        0.76,
        0.17,
        0,
        0.0038,
        0.012,
        0.022,
      ),
    [],
  );

  const innerLayer = useMemo(
    () =>
      createPetalLayer(
        10,
        0.58,
        0.12,
        Math.PI / 10,
        0.0032,
        0.018,
        0.012,
      ),
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.42 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (outerRef.current) {
      outerRef.current.rotation.z =
        elapsed * 0.08 * safeSpeed * motionFactor;
    }

    if (innerRef.current) {
      innerRef.current.rotation.z =
        -elapsed * 0.1 * safeSpeed * motionFactor +
        Math.sin(elapsed * 0.42 * motionFactor) * 0.024;
    }
  });

  return (
    <group renderOrder={24}>
      <group ref={outerRef}>
        {outerLayer.map((petal, index) => {
          if (index % 2 !== 0) return null;

          return (
            <PulsePetal
              key={`outer-pulse-${index}`}
              geometry={petal.pulse}
              baseColor={colors.mint.clone().lerp(colors.halo, 0.3)}
              hotColor={colors.white.clone().lerp(colors.mint, 0.14)}
              opacity={0.115}
              speed={speed}
              reducedMotion={reducedMotion}
              glowFactor={glowFactor}
              offset={index / outerLayer.length}
              speedFactor={0.38 + index * 0.01}
            />
          );
        })}
      </group>

      <group ref={innerRef}>
        {innerLayer.map((petal, index) => {
          if (index % 3 !== 0) return null;

          return (
            <PulsePetal
              key={`inner-pulse-${index}`}
              geometry={petal.pulse}
              baseColor={colors.violet.clone().lerp(colors.pink, 0.24)}
              hotColor={colors.white.clone().lerp(colors.violet, 0.12)}
              opacity={0.1}
              speed={speed}
              reducedMotion={reducedMotion}
              glowFactor={glowFactor}
              offset={index / innerLayer.length + 0.1}
              speedFactor={0.45 + index * 0.008}
            />
          );
        })}
      </group>
    </group>
  );
}