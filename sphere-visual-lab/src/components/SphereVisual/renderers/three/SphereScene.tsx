import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../../SphereVisual.types';
import VortexFieldPlane from './VortexFieldPlane';
import InnerScatterField from './InnerScatterField';
import { DarkVortexMask } from './DarkVortexMask';
import GlassShell from './GlassShell';
import Lights from './Lights';

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

function rgbStringToColor(value: string) {
  return new THREE.Color(`rgb(${value.split(' ').join(', ')})`);
}

export default function SphereScene(props: SphereSceneProps) {
  const {
    presetConfig,
    mode,
    interactive,
    glowIntensity,
    speed,
    pointerX,
    pointerY,
    reducedMotion,
  } = props;

  const rootRef = useRef<THREE.Group>(null);

  const colors = useMemo(() => {
    return {
      accent: rgbStringToColor(presetConfig.accentRgb),
      halo: rgbStringToColor(presetConfig.haloRgb),
      violet:
        mode === 'searching'
          ? new THREE.Color('rgb(158, 122, 255)')
          : new THREE.Color('rgb(128, 104, 255)'),
      pink:
        mode === 'searching'
          ? new THREE.Color('rgb(255, 96, 184)')
          : new THREE.Color('rgb(232, 118, 255)'),
      mint: new THREE.Color('rgb(108, 255, 223)'),
      white: new THREE.Color('#ffffff'),
    };
  }, [mode, presetConfig]);

  const safeSpeed = Math.max(speed, 0.15);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const pointerFactor = reducedMotion ? 0.06 : interactive ? 1 : 0.14;

    const targetRotX = pointerY * 0.08 * pointerFactor;
    const targetRotY = pointerX * 0.1 * pointerFactor;

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
        Math.sin(elapsed * 0.24 * safeSpeed) * 0.008,
        0.05,
      );
    }
  });

  return (
    <>
      <Lights colors={colors} glowIntensity={glowIntensity} />

      <group ref={rootRef}>
        <mesh>
          <sphereGeometry args={[1.12, 40, 40]} />
          <meshBasicMaterial
            color={colors.halo}
            transparent
            opacity={0.009}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <VortexFieldPlane
          speed={speed}
          reducedMotion={reducedMotion}
          interactive={interactive}
          glowIntensity={glowIntensity}
          colors={colors}
        />

        <DarkVortexMask
          radius={1.02}
          opacity={0.20}
          color="#050814"
          innerClearRadius={0.19}
          outerRadius={0.87}
          softness={0.28}
          swirlStrength={0.16}
          speed={speed}
          reducedMotion={reducedMotion}
          zOffset={0.014}
        />

        <InnerScatterField
          speed={speed}
          reducedMotion={reducedMotion}
          interactive={interactive}
          glowIntensity={glowIntensity}
          colors={colors}
        />

        <GlassShell
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
        />
      </group>
    </>
  );
}