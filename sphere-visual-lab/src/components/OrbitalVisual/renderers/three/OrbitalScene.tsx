import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  OrbitalGlowIntensity,
  OrbitalPresetConfig,
  OrbitalQuality,
} from '../../OrbitalVisual.types';
import OrbitRibbon from './OrbitRibbon';

interface OrbitalSceneProps {
  presetConfig: OrbitalPresetConfig;
  quality: OrbitalQuality;
  glowIntensity: OrbitalGlowIntensity;
  speed: number;
}

interface OrbitConfig {
  radius: number;
  thickness: number;
  ellipseX: number;
  ellipseY: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  wobble: number;
  opacity: number;
  flowSpeed: number;
  shimmerSpeed: number;
  rotationSpeed: number;
  seed: number;
  offset: number;
  baseColor: THREE.Color;
  hotColor: THREE.Color;
  nodes?: {
    size: number;
    glowSize: number;
    speed: number;
    offset: number;
    pulseOffset: number;
    opacity: number;
  }[];
}

interface OrbitFamilyGroupConfig {
  key: string;
  phase: number;
  driftX: number;
  driftY: number;
  driftZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  breath: number;
  orbits: OrbitConfig[];
}

function rgbStringToColor(value: string) {
  return new THREE.Color(`rgb(${value.split(' ').join(', ')})`);
}

function getGlowFactor(glowIntensity: OrbitalGlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.16;
    default:
      return 1;
  }
}

function createSoftGlowTexture() {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.12, 'rgba(255,255,255,0.96)');
  gradient.addColorStop(0.26, 'rgba(255,255,255,0.76)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.22)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  context.clearRect(0, 0, size, size);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

function OrbitFamilyGroup({
  family,
  speed,
  glowFactor,
}: {
  family: OrbitFamilyGroupConfig;
  speed: number;
  glowFactor: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);

    if (ref.current) {
      ref.current.rotation.x =
        elapsed * family.spinX * safeSpeed +
        Math.sin(elapsed * 0.018 * safeSpeed + family.phase) * family.driftX;

      ref.current.rotation.y =
        elapsed * family.spinY * safeSpeed +
        Math.cos(elapsed * 0.017 * safeSpeed + family.phase * 1.12) *
          family.driftY;

      ref.current.rotation.z =
        elapsed * family.spinZ * safeSpeed +
        Math.sin(elapsed * 0.016 * safeSpeed + family.phase * 0.9) *
          family.driftZ;

      const scale =
        1 +
        Math.sin(elapsed * 0.055 * safeSpeed + family.phase) * family.breath;

      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={ref}>
      {family.orbits.map((orbit, index) => (
        <OrbitRibbon
          key={`${family.key}-${index}`}
          radius={orbit.radius}
          thickness={orbit.thickness}
          ellipseX={orbit.ellipseX}
          ellipseY={orbit.ellipseY}
          tiltX={orbit.tiltX}
          tiltY={orbit.tiltY}
          tiltZ={orbit.tiltZ}
          wobble={orbit.wobble}
          seed={orbit.seed}
          baseColor={orbit.baseColor}
          hotColor={orbit.hotColor}
          opacity={orbit.opacity}
          flowSpeed={orbit.flowSpeed}
          shimmerSpeed={orbit.shimmerSpeed}
          rotationSpeed={orbit.rotationSpeed}
          offset={orbit.offset}
          speed={speed}
          glowFactor={glowFactor}
          nodes={orbit.nodes}
        />
      ))}
    </group>
  );
}

export default function OrbitalScene({
  presetConfig,
  quality,
  glowIntensity,
  speed,
}: OrbitalSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const colors = useMemo(() => {
    return {
      core: rgbStringToColor(presetConfig.coreRgb),
      glow: rgbStringToColor(presetConfig.glowRgb),
      accent: rgbStringToColor(presetConfig.accentRgb),
      hot: rgbStringToColor(presetConfig.hotRgb),
    };
  }, [presetConfig]);

  const glowTexture = useMemo(() => createSoftGlowTexture(), []);

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
    };
  }, [glowTexture]);

  const familyGroups = useMemo<OrbitFamilyGroupConfig[]>(() => {
    const baseRadius = presetConfig.baseRadius;

    return presetConfig.families.map((family, familyIndex) => {
      const offsetBase = familyIndex * 0.18;

      const baseColor = colors.glow
        .clone()
        .lerp(colors.accent, family.heroAccentMix);

      const hotColor = colors.hot.clone().lerp(baseColor, family.hotColorMix);

      const heroSeed = familyIndex * 10 + 1;

      const nodeCount =
        quality === 'low'
          ? 0
          : quality === 'medium'
            ? Math.min(family.nodes.count, 2)
            : family.nodes.count;

      const heroNodes = Array.from({ length: nodeCount }, (_, nodeIndex) => ({
        size: family.nodes.size,
        glowSize: family.nodes.glowSize,
        speed: family.nodes.speed,
        offset:
          (family.nodes.offset + nodeIndex * (1 / Math.max(nodeCount, 1))) % 1,
        pulseOffset: familyIndex * 1.3 + nodeIndex * 0.68,
        opacity: 0.2,
      }));

      const orbits: OrbitConfig[] = [
        {
          radius: baseRadius * family.radiusScale,
          thickness: presetConfig.ringThickness * family.heroThicknessScale,
          ellipseX: family.ellipseX,
          ellipseY: family.ellipseY,
          tiltX: family.tiltX,
          tiltY: family.tiltY,
          tiltZ: family.tiltZ,
          wobble: family.wobble,
          opacity: family.heroOpacity,
          flowSpeed: family.flowSpeed,
          shimmerSpeed: family.shimmerSpeed,
          rotationSpeed: family.rotationSpeed,
          seed: heroSeed,
          offset: offsetBase + 0.04,
          baseColor,
          hotColor,
          nodes: heroNodes,
        },
      ];

      return {
        key: `family-${familyIndex}`,
        phase: familyIndex * 1.12,
        driftX: family.driftX,
        driftY: family.driftY,
        driftZ: family.driftZ,
        spinX: family.spinX,
        spinY: family.spinY,
        spinZ: family.spinZ,
        breath: family.breath,
        orbits,
      };
    });
  }, [colors, presetConfig, quality]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);

    if (rootRef.current) {
      // Почти убираем ощущение общего вращения сцены
      rootRef.current.rotation.x =
        Math.sin(elapsed * 0.008 * safeSpeed) * 0.001;
      rootRef.current.rotation.y =
        Math.cos(elapsed * 0.007 * safeSpeed) * 0.0014;
      rootRef.current.rotation.z =
        Math.sin(elapsed * 0.006 * safeSpeed) * 0.0005;
    }

    if (coreRef.current) {
      const breath = 1 + Math.sin(elapsed * 0.16 * safeSpeed) * 0.0028;
      coreRef.current.scale.setScalar(breath);
    }
  });

  return (
    <group ref={rootRef}>
      {/* Один мягкий общий ореол за всей формой */}
      {glowTexture ? (
        <sprite
          renderOrder={1}
          scale={[
            presetConfig.haloSize * 4.8,
            presetConfig.haloSize * 4.8,
            1,
          ]}
        >
          <spriteMaterial
            map={glowTexture}
            color={colors.glow.clone().lerp(colors.accent, 0.08)}
            transparent
            opacity={presetConfig.haloOpacity * 1.9 * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ) : null}

      {familyGroups.map((family) => (
        <OrbitFamilyGroup
          key={family.key}
          family={family}
          speed={speed}
          glowFactor={glowFactor}
        />
      ))}

      <group ref={coreRef}>
        {/* Мягкий glow ядра — уже не сферами, чтобы не видеть концентрические круги */}
        {glowTexture ? (
          <sprite
            renderOrder={10}
            scale={[
              presetConfig.coreSize * 3.1,
              presetConfig.coreSize * 3.1,
              1,
            ]}
          >
            <spriteMaterial
              map={glowTexture}
              color={colors.glow.clone().lerp(colors.core, 0.2)}
              transparent
              opacity={presetConfig.coreGlowOpacity * 0.72 * glowFactor}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        ) : null}

        {/* Цельное яркое ядро */}
        <mesh renderOrder={12}>
          <sphereGeometry args={[presetConfig.coreSize * 0.57, 28, 28]} />
          <meshBasicMaterial
            color={colors.hot.clone().lerp(colors.core, 0.08)}
            transparent
            opacity={presetConfig.coreInnerOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}