import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../../SphereVisual.types';
import InnerScatterField from './InnerScatterField';
import PetalField from './PetalField';
import PetalPulseField from './PetalPulseField';
import PetalEchoField from './PetalEchoField';
import InnerVolumeGlow from './InnerVolumeGlow';
import GlassShell from './GlassShell';
import Lights from './Lights';
import CenterCoreGlow from './CenterCoreGlow';

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
    mode: _mode,
    quality: _quality,
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
      violet: rgbStringToColor(presetConfig.violetRgb),
      pink: rgbStringToColor(presetConfig.pinkRgb),
      mint: rgbStringToColor(presetConfig.mintRgb),
      white: rgbStringToColor(presetConfig.whiteRgb ?? '255 255 255'),
    };
  }, [presetConfig]);

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
            opacity={0.012}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        <InnerVolumeGlow
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
          volumeStrength={presetConfig.innerVolumeStrength}
        />

        <PetalEchoField
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
          echoStrength={presetConfig.echoStrength}
        />

        <PetalField
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
        />

        <PetalPulseField
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
          pulseStrength={presetConfig.pulseStrength}
        />

        <CenterCoreGlow
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
          centerStrength={presetConfig.centerStrength}
        />

        <InnerScatterField
          speed={speed}
          reducedMotion={reducedMotion}
          interactive={interactive}
          glowIntensity={glowIntensity}
          colors={colors}
          scatterStrength={presetConfig.scatterStrength}
        />

        <GlassShell
          speed={speed}
          reducedMotion={reducedMotion}
          glowIntensity={glowIntensity}
          colors={colors}
          shellStrength={presetConfig.shellOpacity}
        />
      </group>
    </>
  );
}