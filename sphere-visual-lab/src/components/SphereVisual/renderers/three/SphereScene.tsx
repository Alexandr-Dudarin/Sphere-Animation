import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../../SphereVisual.types';

interface SphereSceneProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

interface MotionSettings {
  spin: number;
  pulse: number;
  glow: number;
}

const modeSettings: Record<SphereMode, MotionSettings> = {
  idle: {
    spin: 0.55,
    pulse: 0.35,
    glow: 0.72,
  },
  thinking: {
    spin: 1,
    pulse: 0.75,
    glow: 1,
  },
  searching: {
    spin: 1.22,
    pulse: 1,
    glow: 1.16,
  },
};

const glowStrengthMap: Record<GlowIntensity, number> = {
  low: 0.72,
  medium: 0.9,
  high: 1.08,
};

const shellOpacityMap: Record<SphereQuality, number> = {
  low: 0.16,
  medium: 0.2,
  high: 0.24,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 48,
  medium: 64,
  high: 96,
};

function rgbStringToColor(value: string) {
  return `rgb(${value.split(' ').join(', ')})`;
}

export default function SphereScene({
  presetConfig,
  mode,
  quality,
  interactive,
  glowIntensity,
  speed,
  pointerX,
  pointerY,
  reducedMotion,
}: SphereSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const bandRef = useRef<THREE.Mesh>(null);

  const motion = modeSettings[mode];
  const glowStrength = glowStrengthMap[glowIntensity];
  const shellOpacity = shellOpacityMap[quality];
  const segments = segmentMap[quality];
  const safeSpeed = Math.max(speed, 0.15);

  const colors = useMemo(() => {
    const core = rgbStringToColor(presetConfig.coreRgb);
    const accent = rgbStringToColor(presetConfig.accentRgb);
    const halo = rgbStringToColor(presetConfig.haloRgb);
    const violet =
      mode === 'searching' ? 'rgb(153, 118, 255)' : 'rgb(128, 104, 255)';
    const pink =
      mode === 'searching' ? 'rgb(255, 96, 182)' : 'rgb(232, 118, 255)';
    const mint = 'rgb(112, 255, 227)';

    return {
      core,
      accent,
      halo,
      violet,
      pink,
      mint,
    };
  }, [mode, presetConfig]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const pointerFactor = reducedMotion
      ? 0.08
      : interactive
        ? 1
        : 0.2;

    const targetRotX = pointerY * 0.22 * pointerFactor;
    const targetRotY = pointerX * 0.3 * pointerFactor;

    if (rootRef.current) {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        targetRotX,
        0.08,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        targetRotY,
        0.08,
      );
      rootRef.current.rotation.z = Math.sin(elapsed * 0.3 * safeSpeed) * 0.03;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.12 * safeSpeed;
      shellRef.current.rotation.x += delta * 0.04 * safeSpeed;
    }

    if (rimRef.current) {
      rimRef.current.rotation.y -= delta * 0.08 * safeSpeed;
    }

    if (auraRef.current) {
      const auraScale =
        1.02 + Math.sin(elapsed * 1.5 * safeSpeed) * 0.05 * motion.glow;
      auraRef.current.scale.setScalar(auraScale);
    }

    if (ringARef.current) {
      ringARef.current.rotation.z += delta * 0.7 * safeSpeed * motion.spin;
      ringARef.current.rotation.x += delta * 0.18 * safeSpeed;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z -= delta * 0.52 * safeSpeed * motion.spin;
      ringBRef.current.rotation.y += delta * 0.2 * safeSpeed;
    }

    if (ringCRef.current) {
      ringCRef.current.rotation.x += delta * 0.92 * safeSpeed * motion.spin;
      ringCRef.current.rotation.y -= delta * 0.38 * safeSpeed;
    }

    if (bandRef.current) {
      bandRef.current.rotation.z -= delta * 0.34 * safeSpeed * motion.spin;
    }

    if (coreRef.current) {
      const coreScale =
        1 + Math.sin(elapsed * 2.4 * safeSpeed) * 0.08 * motion.pulse;
      coreRef.current.scale.setScalar(coreScale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={[colors.halo, colors.core, 1.1]} />
      <pointLight
        position={[2.4, 2.1, 2.6]}
        color={colors.halo}
        intensity={2.4 * glowStrength}
      />
      <pointLight
        position={[-2.2, -1.8, 2.1]}
        color={colors.violet}
        intensity={1.45 * glowStrength}
      />
      <pointLight
        position={[0, 0, 1.4]}
        color={colors.accent}
        intensity={1.8 * glowStrength}
      />

      <group ref={rootRef}>
        <mesh ref={auraRef}>
          <sphereGeometry args={[1.45, 48, 48]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.06 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={shellRef}>
          <sphereGeometry args={[1.2, segments, segments]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={shellOpacity}
            roughness={0.06}
            metalness={0}
            transmission={1}
            thickness={0.65}
            ior={1.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            attenuationColor={colors.halo}
            attenuationDistance={1.2}
            envMapIntensity={1.1}
          />
        </mesh>

        <mesh ref={rimRef}>
          <sphereGeometry args={[1.22, segments, segments]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.045 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={ringARef} rotation={[Math.PI / 2.8, 0.3, 0]}>
          <torusGeometry args={[0.48, 0.2, 32, 180]} />
          <meshBasicMaterial
            color={colors.accent}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh
          ref={ringBRef}
          rotation={[Math.PI / 2.2, -0.5, 0.2]}
          scale={[1, 1, 0.58]}
        >
          <torusGeometry args={[0.42, 0.14, 28, 180]} />
          <meshBasicMaterial
            color={colors.violet}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={ringCRef} scale={[1, 1, 0.62]}>
          <torusKnotGeometry args={[0.27, 0.08, 220, 24, 2, 3]} />
          <meshBasicMaterial
            color={colors.pink}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={bandRef} rotation={[0.6, 0.3, 0]}>
          <torusGeometry args={[0.7, 0.045, 18, 220]} />
          <meshBasicMaterial
            color={colors.mint}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.42, 40, 40]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.06 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={new THREE.Color(colors.accent)}
            emissiveIntensity={1.9 * glowStrength}
            roughness={0.12}
            metalness={0.05}
          />
        </mesh>
      </group>
    </>
  );
}