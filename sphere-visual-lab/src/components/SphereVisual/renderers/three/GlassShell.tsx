import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereQuality,
} from '../../SphereVisual.types';

interface GlassShellProps {
  colors: {
    halo: THREE.Color;
  };
  quality: SphereQuality;
  glowIntensity: GlowIntensity;
  speed: number;
  reducedMotion: boolean;
}

const shellOpacityMap: Record<SphereQuality, number> = {
  low: 0.035,
  medium: 0.05,
  high: 0.065,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 48,
  medium: 72,
  high: 96,
};

const rimOpacityMap: Record<GlowIntensity, number> = {
  low: 0.032,
  medium: 0.042,
  high: 0.054,
};

export default function GlassShell({
  colors,
  quality,
  glowIntensity,
  speed,
  reducedMotion,
}: GlassShellProps) {
  const shellRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);

  const shellOpacity = shellOpacityMap[quality];
  const segments = segmentMap[quality];
  const rimOpacity = rimOpacityMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);

  useFrame((_, delta) => {
    if (reducedMotion) {
      return;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.012 * safeSpeed;
      shellRef.current.rotation.x += delta * 0.004 * safeSpeed;
    }

    if (rimRef.current) {
      rimRef.current.rotation.y -= delta * 0.008 * safeSpeed;
    }
  });

  return (
    <>
      <mesh ref={shellRef}>
        <sphereGeometry args={[1.15, segments, segments]} />
        <meshPhysicalMaterial
          color="#f8fbff"
          transparent
          opacity={shellOpacity}
          roughness={0.12}
          metalness={0}
          transmission={0.45}
          thickness={0.08}
          ior={1.03}
          clearcoat={1}
          clearcoatRoughness={0.18}
          envMapIntensity={0.1}
        />
      </mesh>

      <mesh ref={rimRef}>
        <sphereGeometry args={[1.18, segments, segments]} />
        <meshBasicMaterial
          color={colors.halo}
          transparent
          opacity={rimOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}