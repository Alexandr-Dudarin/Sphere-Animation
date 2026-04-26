import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface CenterCoreColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface CenterCoreGlowProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: CenterCoreColors;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.14;
    default:
      return 1;
  }
}

export default function CenterCoreGlow({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: CenterCoreGlowProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const sparkRef = useRef<THREE.Mesh>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const palette = useMemo(() => {
    return {
      outer: colors.violet.clone().lerp(colors.pink, 0.38),
      mid: colors.mint.clone().lerp(colors.white, 0.25),
      core: colors.white.clone().lerp(colors.mint, 0.12),
      spark: colors.pink.clone().lerp(colors.white, 0.45),
    };
  }, [colors]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.35 : 1;
    const safeSpeed = Math.max(speed, 0.15) * motionFactor;

    const outerPulse = 1 + Math.sin(elapsed * 1.35 * safeSpeed + 0.2) * 0.035;
    const midPulse = 1 + Math.sin(elapsed * 2.1 * safeSpeed + 0.9) * 0.05;
    const corePulse = 1 + Math.sin(elapsed * 3.2 * safeSpeed + 1.7) * 0.035;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(outerPulse);
    }

    if (midRef.current) {
      midRef.current.scale.setScalar(midPulse);
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(corePulse);
    }

    if (sparkRef.current) {
      sparkRef.current.position.x =
        Math.cos(elapsed * 1.6 * safeSpeed) * 0.009;
      sparkRef.current.position.y =
        Math.sin(elapsed * 2.0 * safeSpeed + 0.7) * 0.007;
    }
  });

  return (
    <group renderOrder={40}>
      <mesh ref={outerRef} position={[0, 0, 0.028]} renderOrder={40}>
        <sphereGeometry args={[0.128, 32, 32]} />
        <meshBasicMaterial
          color={palette.outer}
          transparent
          opacity={0.12 * glowFactor}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={midRef} position={[0, 0, 0.036]} renderOrder={41}>
        <sphereGeometry args={[0.085, 32, 32]} />
        <meshBasicMaterial
          color={palette.mid}
          transparent
          opacity={0.23 * glowFactor}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={coreRef} position={[0, 0, 0.05]} renderOrder={42}>
        <sphereGeometry args={[0.043, 28, 28]} />
        <meshBasicMaterial
          color={palette.core}
          transparent
          opacity={0.9}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={sparkRef} position={[0.006, -0.004, 0.06]} renderOrder={43}>
        <sphereGeometry args={[0.015, 20, 20]} />
        <meshBasicMaterial
          color={palette.spark}
          transparent
          opacity={0.46 * glowFactor}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}