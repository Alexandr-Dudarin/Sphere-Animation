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

interface CloudData {
  positions: Float32Array;
  colors: Float32Array;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.84;
    case 'high':
      return 1.18;
    default:
      return 1;
  }
}

function pickColorMix(
  radiusFactor: number,
  angle: number,
  colors: InnerVolumeColors,
) {
  const waveA = (Math.sin(angle * 2.2) + 1) * 0.5;
  const waveB = (Math.cos(angle * 1.7 + radiusFactor * 4.0) + 1) * 0.5;

  return colors.halo
    .clone()
    .lerp(colors.mint, 0.14 + waveA * 0.2)
    .lerp(colors.violet, 0.08 + waveB * 0.16)
    .lerp(colors.pink, Math.max(0, radiusFactor - 0.5) * 0.12);
}

function createCloudData(
  count: number,
  minRadius: number,
  maxRadius: number,
  flattenZ: number,
  colors: InnerVolumeColors,
): CloudData {
  const positions = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const radiusMix = Math.pow(Math.random(), 0.82);
    const distance = minRadius + (maxRadius - minRadius) * radiusMix;

    const x = Math.sin(phi) * Math.cos(theta) * distance;
    const y = Math.sin(phi) * Math.sin(theta) * distance;
    const z = Math.cos(phi) * distance * flattenZ;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const radiusFactor = distance / maxRadius;
    const mixed = pickColorMix(radiusFactor, theta, colors);

    colorArray[i * 3] = mixed.r;
    colorArray[i * 3 + 1] = mixed.g;
    colorArray[i * 3 + 2] = mixed.b;
  }

  return {
    positions,
    colors: colorArray,
  };
}

export default function InnerVolumeGlow({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: InnerVolumeGlowProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Points>(null);
  const midRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Points>(null);

  const outerMaterialRef = useRef<THREE.PointsMaterial>(null);
  const midMaterialRef = useRef<THREE.PointsMaterial>(null);
  const innerMaterialRef = useRef<THREE.PointsMaterial>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const outerCloud = useMemo(
    () => createCloudData(1600, 0.42, 0.9, 0.72, colors),
    [colors],
  );

  const midCloud = useMemo(
    () => createCloudData(1100, 0.18, 0.72, 0.84, colors),
    [colors],
  );

  const innerCloud = useMemo(
    () => createCloudData(700, 0.02, 0.46, 0.92, colors),
    [colors],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.42 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (rootRef.current) {
      rootRef.current.rotation.z =
        Math.sin(elapsed * 0.12 * safeSpeed) * 0.03;
      rootRef.current.rotation.x =
        Math.sin(elapsed * 0.08 * safeSpeed) * 0.024;
      rootRef.current.rotation.y =
        Math.cos(elapsed * 0.09 * safeSpeed) * 0.024;
    }

    if (outerRef.current) {
      outerRef.current.rotation.z =
        elapsed * 0.018 * safeSpeed * motionFactor;
      const scale =
        1 + Math.sin(elapsed * 0.52 * motionFactor) * 0.016 * motionFactor;
      outerRef.current.scale.setScalar(scale);
    }

    if (midRef.current) {
      midRef.current.rotation.z =
        -elapsed * 0.026 * safeSpeed * motionFactor;
      const scale =
        1 +
        Math.sin(elapsed * 0.76 * motionFactor + 0.8) *
          0.018 *
          motionFactor;
      midRef.current.scale.setScalar(scale);
    }

    if (innerRef.current) {
      innerRef.current.rotation.z =
        elapsed * 0.034 * safeSpeed * motionFactor;
      const scale =
        1 +
        Math.sin(elapsed * 1.02 * motionFactor + 1.6) *
          0.014 *
          motionFactor;
      innerRef.current.scale.setScalar(scale);
    }

    if (outerMaterialRef.current) {
      outerMaterialRef.current.opacity =
        (0.07 + Math.sin(elapsed * 0.55 * motionFactor) * 0.008) *
        glowFactor;
    }

    if (midMaterialRef.current) {
      midMaterialRef.current.opacity =
        (0.09 + Math.sin(elapsed * 0.72 * motionFactor + 0.8) * 0.01) *
        glowFactor;
    }

    if (innerMaterialRef.current) {
      innerMaterialRef.current.opacity =
        (0.11 + Math.sin(elapsed * 0.95 * motionFactor + 1.5) * 0.01) *
        glowFactor;
    }
  });

  return (
    <group ref={rootRef} renderOrder={8}>
      <points ref={outerRef} renderOrder={8}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[outerCloud.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[outerCloud.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={outerMaterialRef}
          size={0.058}
          vertexColors
          transparent
          opacity={0.07 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <points ref={midRef} renderOrder={9}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[midCloud.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[midCloud.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={midMaterialRef}
          size={0.048}
          vertexColors
          transparent
          opacity={0.09 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <points ref={innerRef} renderOrder={10}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[innerCloud.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[innerCloud.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={innerMaterialRef}
          size={0.04}
          vertexColors
          transparent
          opacity={0.11 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}