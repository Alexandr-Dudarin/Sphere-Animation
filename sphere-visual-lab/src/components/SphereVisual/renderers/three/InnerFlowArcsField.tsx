import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereQuality,
} from '../../SphereVisual.types';

interface InnerFlowArcsFieldProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  quality: SphereQuality;
  colors: {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
  };
}

interface ArcItem {
  geometry: THREE.TubeGeometry;
  color: THREE.Color;
  opacity: number;
  phase: number;
  speedFactor: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

export default function InnerFlowArcsField({
  speed,
  reducedMotion,
  glowIntensity,
  quality,
  colors,
}: InnerFlowArcsFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const arcCount =
    quality === 'high' ? 10 : quality === 'medium' ? 7 : 5;

  const glowFactor =
    glowIntensity === 'high'
      ? 1
      : glowIntensity === 'medium'
        ? 0.82
        : 0.66;

  const arcs = useMemo<ArcItem[]>(() => {
    const items: ArcItem[] = [];
    const palette = [colors.mint, colors.violet, colors.pink, colors.white];

    for (let i = 0; i < arcCount; i += 1) {
      const rand = (offset: number) => seededRandom(i * 17.23 + offset);

      const startAngle = rand(1) * Math.PI * 2;
      const sweep = THREE.MathUtils.lerp(0.9, 1.75, rand(2));
      const innerRadius = THREE.MathUtils.lerp(0.12, 0.2, rand(3));
      const outerRadius = THREE.MathUtils.lerp(0.34, 0.56, rand(4));
      const bulge = THREE.MathUtils.lerp(0.015, 0.05, rand(5));
      const zAmplitude = THREE.MathUtils.lerp(0.015, 0.04, rand(6));
      const tubeRadius = THREE.MathUtils.lerp(0.0028, 0.0054, rand(7));
      const opacity = THREE.MathUtils.lerp(0.09, 0.22, rand(8));
      const phase = rand(9) * Math.PI * 2;
      const speedFactor = THREE.MathUtils.lerp(0.7, 1.2, rand(10));

      const colorBase = palette[i % palette.length].clone();
      const mixedColor = colorBase.lerp(colors.accent.clone(), rand(11) * 0.18);

      const points: THREE.Vector3[] = [];
      const pointCount = 24;

      for (let j = 0; j <= pointCount; j += 1) {
        const t = j / pointCount;
        const eased = THREE.MathUtils.smoothstep(t, 0, 1);

        const angle = startAngle + eased * sweep * Math.PI * 2;
        const radius =
          THREE.MathUtils.lerp(innerRadius, outerRadius, eased) +
          Math.sin(eased * Math.PI) * bulge;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z =
          Math.sin(angle * 1.35 + phase) *
          zAmplitude *
          (1 - eased * 0.75);

        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(
        curve,
        48,
        tubeRadius,
        10,
        false,
      );

      items.push({
        geometry,
        color: mixedColor,
        opacity,
        phase,
        speedFactor,
      });
    }

    return items;
  }, [
    arcCount,
    colors.accent,
    colors.mint,
    colors.pink,
    colors.violet,
    colors.white,
  ]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.15);

    if (groupRef.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        Math.sin(elapsed * 0.22 * safeSpeed) * 0.08,
        0.04,
      );

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        Math.cos(elapsed * 0.16 * safeSpeed) * 0.05,
        0.03,
      );

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(elapsed * 0.14 * safeSpeed) * 0.05,
        0.03,
      );
    }

    materialRefs.current.forEach((material, index) => {
      if (!material) return;

      const arc = arcs[index];
      const pulse = reducedMotion
        ? 0.92
        : 0.84 +
          Math.sin(
            elapsed * 0.9 * safeSpeed * arc.speedFactor + arc.phase,
          ) *
            0.16;

      material.opacity = arc.opacity * glowFactor * pulse;
    });
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, index) => (
        <mesh
          key={index}
          geometry={arc.geometry}
          renderOrder={3}
        >
          <meshBasicMaterial
            ref={(node) => {
              materialRefs.current[index] = node;
            }}
            color={arc.color}
            transparent
            opacity={arc.opacity * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}