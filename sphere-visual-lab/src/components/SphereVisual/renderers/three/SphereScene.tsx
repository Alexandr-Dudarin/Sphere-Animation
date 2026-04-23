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
  swirlSpeed: number;
  pulse: number;
  glow: number;
}

const modeSettings: Record<SphereMode, MotionSettings> = {
  idle: {
    swirlSpeed: 0.45,
    pulse: 0.35,
    glow: 0.7,
  },
  thinking: {
    swirlSpeed: 1,
    pulse: 0.75,
    glow: 1,
  },
  searching: {
    swirlSpeed: 1.18,
    pulse: 0.95,
    glow: 1.14,
  },
};

const glowStrengthMap: Record<GlowIntensity, number> = {
  low: 0.72,
  medium: 0.9,
  high: 1.08,
};

const shellOpacityMap: Record<SphereQuality, number> = {
  low: 0.08,
  medium: 0.11,
  high: 0.14,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 48,
  medium: 72,
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
  const shellRef = useRef<THREE.Mesh>(null);
  const shellRimRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  const vortexRootRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const ringCRef = useRef<THREE.Mesh>(null);
  const ringDRef = useRef<THREE.Mesh>(null);
  const haloBandRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

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
      mode === 'searching' ? 'rgb(155, 120, 255)' : 'rgb(128, 104, 255)';
    const pink =
      mode === 'searching' ? 'rgb(255, 98, 186)' : 'rgb(232, 118, 255)';
    const mint = 'rgb(110, 255, 225)';
    const amber = 'rgb(255, 196, 112)';

    return {
      core,
      accent,
      halo,
      violet,
      pink,
      mint,
      amber,
    };
  }, [mode, presetConfig]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const pointerFactor = reducedMotion ? 0.08 : interactive ? 1 : 0.18;

    const targetRotX = pointerY * 0.24 * pointerFactor;
    const targetRotY = pointerX * 0.32 * pointerFactor;

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
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        Math.sin(elapsed * 0.4 * safeSpeed) * 0.03,
        0.05,
      );
    }

    if (vortexRootRef.current) {
      vortexRootRef.current.rotation.z +=
        delta * 0.18 * safeSpeed * motion.swirlSpeed;
      vortexRootRef.current.rotation.y +=
        delta * 0.1 * safeSpeed * motion.swirlSpeed;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.04 * safeSpeed;
      shellRef.current.rotation.x += delta * 0.015 * safeSpeed;
    }

    if (shellRimRef.current) {
      shellRimRef.current.rotation.y -= delta * 0.025 * safeSpeed;
    }

    if (auraRef.current) {
      const auraScale =
        1.02 + Math.sin(elapsed * 1.4 * safeSpeed) * 0.06 * motion.glow;
      auraRef.current.scale.setScalar(auraScale);
    }

    if (ringARef.current) {
      ringARef.current.rotation.z +=
        delta * 0.95 * safeSpeed * motion.swirlSpeed;
      ringARef.current.rotation.x += delta * 0.22 * safeSpeed;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z -=
        delta * 0.72 * safeSpeed * motion.swirlSpeed;
      ringBRef.current.rotation.y += delta * 0.28 * safeSpeed;
    }

    if (ringCRef.current) {
      ringCRef.current.rotation.z +=
        delta * 1.25 * safeSpeed * motion.swirlSpeed;
      ringCRef.current.rotation.x -= delta * 0.32 * safeSpeed;
    }

    if (ringDRef.current) {
      ringDRef.current.rotation.z -=
        delta * 1.6 * safeSpeed * motion.swirlSpeed;
      ringDRef.current.rotation.y -= delta * 0.18 * safeSpeed;
    }

    if (haloBandRef.current) {
      haloBandRef.current.rotation.z -=
        delta * 0.35 * safeSpeed * motion.swirlSpeed;
    }

    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.5 * safeSpeed;
      knotRef.current.rotation.y -= delta * 0.82 * safeSpeed;
      knotRef.current.rotation.z += delta * 0.28 * safeSpeed;
    }

    if (coreGlowRef.current) {
      const glowScale =
        1.02 + Math.sin(elapsed * 2.2 * safeSpeed) * 0.1 * motion.pulse;
      coreGlowRef.current.scale.setScalar(glowScale);
    }

    if (coreRef.current) {
      const coreScale =
        1 + Math.sin(elapsed * 2.8 * safeSpeed) * 0.08 * motion.pulse;
      coreRef.current.scale.setScalar(coreScale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={[colors.halo, colors.core, 0.95]} />
      <pointLight
        position={[2.2, 2.1, 2.8]}
        color={colors.halo}
        intensity={2.1 * glowStrength}
      />
      <pointLight
        position={[-2, -1.5, 2.4]}
        color={colors.violet}
        intensity={1.45 * glowStrength}
      />
      <pointLight
        position={[0, 0, 1.8]}
        color={colors.accent}
        intensity={1.8 * glowStrength}
      />

      <group ref={rootRef}>
        <mesh ref={auraRef}>
          <sphereGeometry args={[1.5, 40, 40]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.05 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <group ref={vortexRootRef}>
          <mesh ref={ringARef} rotation={[Math.PI / 2.6, 0.25, 0]}>
            <torusGeometry args={[0.52, 0.16, 32, 200]} />
            <meshBasicMaterial
              color={colors.halo}
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh
            ref={ringBRef}
            rotation={[Math.PI / 2.15, -0.42, 0.2]}
            scale={[1, 1, 0.58]}
          >
            <torusGeometry args={[0.46, 0.12, 28, 180]} />
            <meshBasicMaterial
              color={colors.accent}
              transparent
              opacity={0.26}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh
            ref={ringCRef}
            rotation={[Math.PI / 1.85, 0.35, -0.18]}
            scale={[1, 1, 0.5]}
          >
            <torusGeometry args={[0.34, 0.095, 24, 180]} />
            <meshBasicMaterial
              color={colors.violet}
              transparent
              opacity={0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh
            ref={ringDRef}
            rotation={[Math.PI / 2.45, -0.12, 0.35]}
            scale={[1, 1, 0.42]}
          >
            <torusGeometry args={[0.24, 0.07, 20, 180]} />
            <meshBasicMaterial
              color={colors.pink}
              transparent
              opacity={0.24}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh ref={haloBandRef} rotation={[0.55, 0.25, 0]}>
            <torusGeometry args={[0.72, 0.035, 18, 220]} />
            <meshBasicMaterial
              color={colors.mint}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh ref={knotRef} scale={[1, 1, 0.62]}>
            <torusKnotGeometry args={[0.18, 0.045, 180, 24, 2, 3]} />
            <meshBasicMaterial
              color={colors.amber}
              transparent
              opacity={0.14}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh ref={coreGlowRef}>
            <sphereGeometry args={[0.34, 28, 28]} />
            <meshBasicMaterial
              color={colors.halo}
              transparent
              opacity={0.14 * glowStrength}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh ref={coreRef}>
            <sphereGeometry args={[0.11, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={new THREE.Color(colors.accent)}
              emissiveIntensity={2.2 * glowStrength}
              roughness={0.1}
              metalness={0.04}
            />
          </mesh>
        </group>

        <mesh ref={shellRef}>
          <sphereGeometry args={[1.18, segments, segments]} />
          <meshPhysicalMaterial
            color="#f7fbff"
            transparent
            opacity={shellOpacity}
            roughness={0.08}
            metalness={0}
            transmission={0.95}
            thickness={0.24}
            ior={1.08}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={0.35}
          />
        </mesh>

        <mesh ref={shellRimRef}>
          <sphereGeometry args={[1.205, segments, segments]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.05 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}