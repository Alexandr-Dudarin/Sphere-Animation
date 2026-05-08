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
  mirrorX?: boolean;
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

function colorToRgba(color: THREE.Color, alpha: number) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
  const gradient = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );

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

function createCoreTemperatureTexture(
  coreColor: THREE.Color,
  glowColor: THREE.Color,
  accentColor: THREE.Color,
) {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const center = size / 2;
  const coolEdge = glowColor.clone().lerp(accentColor, 0.32);

  const gradient = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.08, 'rgba(255,255,255,0.998)');
  gradient.addColorStop(0.2, 'rgba(245,252,255,0.99)');
  gradient.addColorStop(0.38, colorToRgba(coreColor, 0.96));
  gradient.addColorStop(0.6, colorToRgba(glowColor, 0.74));
  gradient.addColorStop(0.82, colorToRgba(coolEdge, 0.24));
  gradient.addColorStop(1, colorToRgba(coolEdge, 0));

  context.clearRect(0, 0, size, size);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const imageData = context.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];

    if (alpha > 0) {
      const noise = (Math.random() - 0.5) * 8;

      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

function createHotCoreTexture(coreColor: THREE.Color) {
  if (typeof document === 'undefined') {
    return null;
  }

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const center = size / 2;
  const gradient = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.22, 'rgba(255,255,255,0.96)');
  gradient.addColorStop(0.5, colorToRgba(coreColor, 0.34));
  gradient.addColorStop(0.78, colorToRgba(coreColor, 0.08));
  gradient.addColorStop(1, colorToRgba(coreColor, 0));

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

  useFrame(() => {
    if (!ref.current) return;

    ref.current.rotation.set(0, 0, 0);
    ref.current.scale.setScalar(1);
  });

  return (
    <group ref={ref}>
      {family.orbits.map((orbit, index) => (
        <group
          key={`${family.key}-${index}`}
          scale={orbit.mirrorX ? [-1, 1, 1] : [1, 1, 1]}
        >
          <OrbitRibbon
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
        </group>
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
  const coreTemperatureTexture = useMemo(
    () => createCoreTemperatureTexture(colors.core, colors.glow, colors.accent),
    [colors.core, colors.glow, colors.accent],
  );
  const hotCoreTexture = useMemo(
    () => createHotCoreTexture(colors.core),
    [colors.core],
  );

  useEffect(() => {
    return () => {
      glowTexture?.dispose();
      coreTemperatureTexture?.dispose();
      hotCoreTexture?.dispose();
    };
  }, [glowTexture, coreTemperatureTexture, hotCoreTexture]);

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
          mirrorX: family.mirrorX ?? false,
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
      rootRef.current.rotation.set(0, 0, 0);
    }

    if (coreRef.current) {
      const breath = 1 + Math.sin(elapsed * 0.13 * safeSpeed) * 0.0016;
      coreRef.current.scale.setScalar(breath);
    }
  });

  return (
    <group ref={rootRef}>
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
        {glowTexture ? (
          <sprite
            renderOrder={8}
            scale={[
              presetConfig.coreSize * 7.2,
              presetConfig.coreSize * 7.2,
              1,
            ]}
          >
            <spriteMaterial
              map={glowTexture}
              color={colors.glow.clone().lerp(colors.accent, 0.08)}
              transparent
              opacity={presetConfig.coreGlowOpacity * 0.22 * glowFactor}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        ) : null}

        {coreTemperatureTexture ? (
          <sprite
            renderOrder={9}
            scale={[
              presetConfig.coreSize * 5.05,
              presetConfig.coreSize * 5.05,
              1,
            ]}
          >
            <spriteMaterial
              map={coreTemperatureTexture}
              color={colors.hot}
              transparent
              opacity={0.92}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        ) : null}

        {hotCoreTexture ? (
          <sprite
            renderOrder={10}
            scale={[
              presetConfig.coreSize * 1.12,
              presetConfig.coreSize * 1.12,
              1,
            ]}
          >
            <spriteMaterial
              map={hotCoreTexture}
              color={colors.hot.clone().lerp(colors.core, 0.04)}
              transparent
              opacity={0.58}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        ) : null}
      </group>
    </group>
  );
}