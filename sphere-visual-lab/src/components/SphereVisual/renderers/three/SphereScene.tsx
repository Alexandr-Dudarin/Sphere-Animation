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
  visualScale: number;
}

function rgbStringToColor(value: string) {
  return new THREE.Color(`rgb(${value.split(' ').join(', ')})`);
}

export default function SphereScene(props: SphereSceneProps) {
  const {
    presetConfig,
    mode,
    quality: _quality,
    interactive,
    glowIntensity,
    speed,
    pointerX,
    pointerY,
    reducedMotion,
    visualScale,
  } = props;

  const scaleRef = useRef<THREE.Group>(null);
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

    if (scaleRef.current) {
      scaleRef.current.scale.setScalar(visualScale);
    }

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

      <group ref={scaleRef}>
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
          />

          <PetalEchoField
            speed={speed}
            reducedMotion={reducedMotion}
            glowIntensity={glowIntensity}
            colors={colors}
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
          />

          <CenterCoreGlow
            speed={speed}
            reducedMotion={reducedMotion}
            glowIntensity={glowIntensity}
            colors={colors}
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
      </group>
    </>
  );
}