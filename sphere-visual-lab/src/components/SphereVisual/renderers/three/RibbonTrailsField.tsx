import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SphereQuality,
} from '../../SphereVisual.types';

interface RibbonTrailsFieldProps {
  colors: {
    accent: THREE.Color;
    halo: THREE.Color;
    violet: THREE.Color;
    pink: THREE.Color;
    mint: THREE.Color;
    white: THREE.Color;
  };
  mode: SphereMode;
  quality: SphereQuality;
  glowIntensity: GlowIntensity;
  speed: number;
  reducedMotion: boolean;
}

interface RibbonDescriptor {
  id: string;
  points: [number, number, number][];
  color: string;
  coreWidth: number;
  glowWidth: number;
  opacity: number;
  glowOpacity: number;
  rotationSpeed: number;
  baseRotation: number;
  tiltX: number;
  tiltY: number;
  pulseOffset: number;
  echoCount: number;
  echoRotationStep: number;
  echoScaleStep: number;
  echoOpacityStep: number;
}

const modeSettings: Record<
  SphereMode,
  {
    rotationSpeed: number;
    pulse: number;
  }
> = {
  idle: {
    rotationSpeed: 0.42,
    pulse: 0.28,
  },
  thinking: {
    rotationSpeed: 0.9,
    pulse: 0.8,
  },
  searching: {
    rotationSpeed: 1.12,
    pulse: 1,
  },
};

const glowBoostMap: Record<GlowIntensity, number> = {
  low: 0.82,
  medium: 1,
  high: 1.24,
};

function getQualityConfig(quality: SphereQuality) {
  if (quality === 'low') {
    return {
      segments: 18,
      echoCountOuter: 4,
      echoCountMid: 5,
      echoCountInner: 4,
    };
  }

  if (quality === 'medium') {
    return {
      segments: 24,
      echoCountOuter: 6,
      echoCountMid: 7,
      echoCountInner: 5,
    };
  }

  return {
    segments: 30,
    echoCountOuter: 8,
    echoCountMid: 9,
    echoCountInner: 7,
  };
}

function createRibbonPoints(params: {
  radiusStart: number;
  radiusEnd: number;
  startAngle: number;
  sweep: number;
  twist: number;
  depth: number;
  segments: number;
  yScale?: number;
}) {
  const {
    radiusStart,
    radiusEnd,
    startAngle,
    sweep,
    twist,
    depth,
    segments,
    yScale = 0.96,
  } = params;

  const points: [number, number, number][] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const eased = t * t * (3 - 2 * t);

    const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, eased);

    const angle =
      startAngle +
      sweep * eased +
      Math.sin(eased * Math.PI * 2) * twist;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * yScale;

    const arch = Math.sin(eased * Math.PI);
    const z =
      arch * depth +
      Math.cos(angle * 0.7 + eased * Math.PI) * depth * 0.1;

    points.push([x, y, z]);
  }

  return points;
}

export default function RibbonTrailsField({
  colors,
  mode,
  quality,
  glowIntensity,
  speed,
  reducedMotion,
}: RibbonTrailsFieldProps) {
  const rootRef = useRef<THREE.Group>(null);
  const ribbonRefs = useRef<Array<THREE.Group | null>>([]);

  const motion = modeSettings[mode];
  const glowBoost = glowBoostMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);
  const config = getQualityConfig(quality);

  const ribbons = useMemo<RibbonDescriptor[]>(() => {
    return [
      {
        id: 'outer-cyan',
        points: createRibbonPoints({
          radiusStart: 1.0,
          radiusEnd: 0.44,
          startAngle: -0.9,
          sweep: 2.25,
          twist: 0.18,
          depth: 0.035,
          segments: config.segments,
          yScale: 0.98,
        }),
        color: colors.halo.getStyle(),
        coreWidth: 0.34,
        glowWidth: 1.4,
        opacity: 0.76,
        glowOpacity: 0.16,
        rotationSpeed: 0.42,
        baseRotation: -0.25,
        tiltX: 0.02,
        tiltY: -0.015,
        pulseOffset: 0.3,
        echoCount: config.echoCountOuter,
        echoRotationStep: 0.035,
        echoScaleStep: 0.008,
        echoOpacityStep: 0.08,
      },
      {
        id: 'outer-pink',
        points: createRibbonPoints({
          radiusStart: 0.98,
          radiusEnd: 0.42,
          startAngle: 1.85,
          sweep: -2.12,
          twist: -0.16,
          depth: 0.03,
          segments: config.segments,
          yScale: 0.97,
        }),
        color: colors.pink.getStyle(),
        coreWidth: 0.34,
        glowWidth: 1.38,
        opacity: 0.72,
        glowOpacity: 0.15,
        rotationSpeed: -0.38,
        baseRotation: 0.65,
        tiltX: -0.018,
        tiltY: 0.014,
        pulseOffset: 1.5,
        echoCount: config.echoCountOuter,
        echoRotationStep: -0.033,
        echoScaleStep: 0.008,
        echoOpacityStep: 0.08,
      },
      {
        id: 'mid-violet',
        points: createRibbonPoints({
          radiusStart: 0.82,
          radiusEnd: 0.28,
          startAngle: 0.2,
          sweep: 1.92,
          twist: 0.14,
          depth: 0.026,
          segments: config.segments,
          yScale: 0.96,
        }),
        color: colors.violet.getStyle(),
        coreWidth: 0.32,
        glowWidth: 1.25,
        opacity: 0.68,
        glowOpacity: 0.14,
        rotationSpeed: 0.62,
        baseRotation: 0.18,
        tiltX: 0.012,
        tiltY: 0.012,
        pulseOffset: 2.2,
        echoCount: config.echoCountMid,
        echoRotationStep: 0.028,
        echoScaleStep: 0.007,
        echoOpacityStep: 0.075,
      },
      {
        id: 'mid-mint',
        points: createRibbonPoints({
          radiusStart: 0.76,
          radiusEnd: 0.24,
          startAngle: -2.2,
          sweep: 1.78,
          twist: -0.12,
          depth: 0.022,
          segments: config.segments,
          yScale: 0.95,
        }),
        color: colors.mint.getStyle(),
        coreWidth: 0.28,
        glowWidth: 1.15,
        opacity: 0.58,
        glowOpacity: 0.12,
        rotationSpeed: -0.54,
        baseRotation: -0.42,
        tiltX: -0.01,
        tiltY: 0.008,
        pulseOffset: 0.9,
        echoCount: config.echoCountMid,
        echoRotationStep: -0.024,
        echoScaleStep: 0.006,
        echoOpacityStep: 0.07,
      },
      {
        id: 'inner-cyan',
        points: createRibbonPoints({
          radiusStart: 0.58,
          radiusEnd: 0.18,
          startAngle: 0.9,
          sweep: -1.48,
          twist: 0.1,
          depth: 0.016,
          segments: config.segments,
          yScale: 0.94,
        }),
        color: colors.accent.getStyle(),
        coreWidth: 0.24,
        glowWidth: 0.95,
        opacity: 0.42,
        glowOpacity: 0.08,
        rotationSpeed: 0.78,
        baseRotation: 0.12,
        tiltX: 0.008,
        tiltY: -0.008,
        pulseOffset: 2.8,
        echoCount: config.echoCountInner,
        echoRotationStep: 0.02,
        echoScaleStep: 0.005,
        echoOpacityStep: 0.065,
      },
    ];
  }, [colors, config]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const globalTime = elapsed * safeSpeed * motion.rotationSpeed;

    if (rootRef.current) {
      rootRef.current.rotation.z += delta * 0.02 * safeSpeed;
      rootRef.current.rotation.x = Math.sin(globalTime * 0.22) * 0.01;
      rootRef.current.rotation.y = Math.cos(globalTime * 0.18) * 0.01;
    }

    ribbonRefs.current.forEach((group, index) => {
      if (!group) return;

      const ribbon = ribbons[index];
      const localTime = globalTime * ribbon.rotationSpeed;

      const pulse =
        1 +
        Math.sin(localTime * 1.6 + ribbon.pulseOffset) *
          0.012 *
          motion.pulse *
          (reducedMotion ? 0.2 : 1);

      group.rotation.z =
        ribbon.baseRotation + localTime + Math.sin(localTime * 0.7) * 0.04;

      group.rotation.x = ribbon.tiltX + Math.sin(localTime * 0.45) * 0.008;
      group.rotation.y = ribbon.tiltY + Math.cos(localTime * 0.48) * 0.008;

      group.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={rootRef}>
      {ribbons.map((ribbon, index) => (
        <group
          key={ribbon.id}
          ref={(group) => {
            ribbonRefs.current[index] = group;
          }}
        >
          <Line
            points={ribbon.points}
            color={ribbon.color}
            lineWidth={ribbon.glowWidth * 2.2}
            transparent
            opacity={ribbon.glowOpacity * 0.34 * glowBoost}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />

          <Line
            points={ribbon.points}
            color={ribbon.color}
            lineWidth={ribbon.glowWidth}
            transparent
            opacity={ribbon.glowOpacity * glowBoost}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />

          {Array.from({ length: ribbon.echoCount }).map((_, echoIndex) => {
            const centered =
              echoIndex - (ribbon.echoCount - 1) / 2;

            const rotation =
              centered * ribbon.echoRotationStep;

            const scale =
              1 + Math.abs(centered) * ribbon.echoScaleStep;

            const opacity =
              Math.max(
                0.04,
                ribbon.opacity *
                  (1 - Math.abs(centered) * ribbon.echoOpacityStep),
              ) * glowBoost;

            return (
              <group
                key={`${ribbon.id}-echo-${echoIndex}`}
                rotation={[0, 0, rotation]}
                scale={[scale, scale, scale]}
              >
                <Line
                  points={ribbon.points}
                  color={ribbon.color}
                  lineWidth={ribbon.glowWidth * 0.9}
                  transparent
                  opacity={opacity}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </group>
            );
          })}

          <Line
            points={ribbon.points}
            color={ribbon.color}
            lineWidth={ribbon.coreWidth}
            transparent
            opacity={ribbon.opacity * glowBoost}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </group>
      ))}
    </group>
  );
}