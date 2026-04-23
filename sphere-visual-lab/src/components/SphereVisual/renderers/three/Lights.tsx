import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface LightsProps {
  colors: {
    halo: THREE.Color;
    accent: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
  };
  glowIntensity: GlowIntensity;
}

const glowStrengthMap: Record<GlowIntensity, number> = {
  low: 0.72,
  medium: 0.9,
  high: 1.08,
};

export default function Lights({ colors, glowIntensity }: LightsProps) {
  const glowStrength = glowStrengthMap[glowIntensity];

  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={[colors.halo, colors.accent, 0.72]} />

      <pointLight
        position={[2.25, 2.05, 2.8]}
        color={colors.halo}
        intensity={2.25 * glowStrength}
      />

      <pointLight
        position={[-1.9, -1.45, 2.3]}
        color={colors.violet}
        intensity={1.65 * glowStrength}
      />

      <pointLight
        position={[0.1, 0, 1.7]}
        color={colors.accent}
        intensity={2.1 * glowStrength}
      />

      <pointLight
        position={[0.25, 0.35, 1.2]}
        color={colors.pink}
        intensity={1.18 * glowStrength}
      />
    </>
  );
}