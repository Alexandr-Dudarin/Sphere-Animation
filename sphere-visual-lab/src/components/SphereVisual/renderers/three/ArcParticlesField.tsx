import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SphereQuality,
} from '../../SphereVisual.types';

interface ArcParticlesFieldProps {
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

type ArcLayerName = 'outer' | 'mid' | 'inner';

interface ArcDescriptor {
  id: string;
  layer: ArcLayerName;
  familyIndex: number;
  points: [number, number, number][];
  color: string;
  coreWidth: number;
  glowWidth: number;
  opacity: number;
  glowOpacity: number;
  scale: number;
  phase: number;
  velocity: number;
  localTiltX: number;
  localTiltY: number;
  localTiltZ: number;
  pulseOffset: number;
  echoSpread: number;
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
    pulse: 0.3,
  },
  thinking: {
    rotationSpeed: 0.88,
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
  high: 1.2,
};

function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function makeBasisFromPole(pole: THREE.Vector3) {
  const helper =
    Math.abs(pole.y) < 0.92
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0);

  const u = new THREE.Vector3().crossVectors(pole, helper).normalize();
  const v = new THREE.Vector3().crossVectors(pole, u).normalize();

  return { u, v };
}

function createSphericalArcPoints(params: {
  radius: number;
  startAngle: number;
  sweep: number;
  pole: THREE.Vector3;
  segments: number;
  wobble: number;
  phase: number;
}) {
  const { radius, startAngle, sweep, pole, segments, wobble, phase } = params;
  const { u, v } = makeBasisFromPole(pole);
  const points: [number, number, number][] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const eased = t * t * (3 - 2 * t);

    const angle =
      startAngle +
      sweep * (eased - 0.5) +
      Math.sin(eased * Math.PI * 2 + phase) * wobble;

    const curve = new THREE.Vector3()
      .addScaledVector(u, Math.cos(angle))
      .addScaledVector(v, Math.sin(angle));

    curve
      .addScaledVector(
        pole,
        Math.sin(eased * Math.PI) * wobble * 0.5 +
          Math.cos(angle * 0.75 + phase) * wobble * 0.12,
      )
      .normalize()
      .multiplyScalar(radius);

    points.push([curve.x, curve.y, curve.z]);
  }

  return points;
}

function getQualityConfig(quality: SphereQuality) {
  if (quality === 'low') {
    return {
      segments: 12,
      outerFamilies: 4,
      outerCopies: 5,
      midFamilies: 5,
      midCopies: 6,
      innerFamilies: 3,
      innerCopies: 4,
    };
  }

  if (quality === 'medium') {
    return {
      segments: 16,
      outerFamilies: 5,
      outerCopies: 6,
      midFamilies: 6,
      midCopies: 7,
      innerFamilies: 4,
      innerCopies: 5,
    };
  }

  return {
    segments: 20,
    outerFamilies: 6,
    outerCopies: 7,
    midFamilies: 7,
    midCopies: 8,
    innerFamilies: 5,
    innerCopies: 6,
  };
}

function getEchoConfig(layer: ArcLayerName) {
  if (layer === 'outer') {
    return [
      { rotation: 0.028, scale: 1.01, opacity: 0.24 },
      { rotation: 0.058, scale: 1.02, opacity: 0.16 },
      { rotation: -0.035, scale: 0.996, opacity: 0.1 },
    ];
  }

  if (layer === 'mid') {
    return [
      { rotation: 0.032, scale: 1.012, opacity: 0.28 },
      { rotation: 0.066, scale: 1.022, opacity: 0.18 },
      { rotation: -0.04, scale: 0.996, opacity: 0.12 },
    ];
  }

  return [
    { rotation: 0.024, scale: 1.008, opacity: 0.18 },
    { rotation: 0.05, scale: 1.016, opacity: 0.1 },
  ];
}

export default function ArcParticlesField({
  colors,
  mode,
  quality,
  glowIntensity,
  speed,
  reducedMotion,
}: ArcParticlesFieldProps) {
  const rootRef = useRef<THREE.Group>(null);
  const arcRefs = useRef<Array<THREE.Group | null>>([]);

  const motion = modeSettings[mode];
  const glowBoost = glowBoostMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);
  const config = getQualityConfig(quality);

  const arcs = useMemo<ArcDescriptor[]>(() => {
    const random = createSeededRandom(51823);

    const outerColors = [
      colors.halo.getStyle(),
      colors.accent.getStyle(),
      colors.violet.getStyle(),
      colors.pink.getStyle(),
    ];

    const midColors = [
      colors.halo.getStyle(),
      colors.accent.getStyle(),
      colors.violet.getStyle(),
      colors.pink.getStyle(),
      colors.mint.getStyle(),
    ];

    const innerColors = [
      colors.halo.getStyle(),
      colors.accent.getStyle(),
      colors.mint.getStyle(),
      colors.violet.getStyle(),
    ];

    const result: ArcDescriptor[] = [];

    function pushLayer(params: {
      layer: ArcLayerName;
      familyCount: number;
      copiesPerFamily: number;
      palette: string[];
      radiusMin: number;
      radiusMax: number;
      sweepMin: number;
      sweepMax: number;
      wobbleMin: number;
      wobbleMax: number;
      coreWidthMin: number;
      coreWidthMax: number;
      glowWidthMin: number;
      glowWidthMax: number;
      opacityMin: number;
      opacityMax: number;
      glowOpacityMin: number;
      glowOpacityMax: number;
      scaleMin: number;
      scaleMax: number;
      localPhaseStep: number;
      polarSpread: number;
      tiltMax: number;
    }) {
      const {
        layer,
        familyCount,
        copiesPerFamily,
        palette,
        radiusMin,
        radiusMax,
        sweepMin,
        sweepMax,
        wobbleMin,
        wobbleMax,
        coreWidthMin,
        coreWidthMax,
        glowWidthMin,
        glowWidthMax,
        opacityMin,
        opacityMax,
        glowOpacityMin,
        glowOpacityMax,
        scaleMin,
        scaleMax,
        localPhaseStep,
        polarSpread,
        tiltMax,
      } = params;

      for (let familyIndex = 0; familyIndex < familyCount; familyIndex += 1) {
        const azimuth =
          (familyIndex / familyCount) * Math.PI * 2 + (random() - 0.5) * 0.2;

        const polar =
          Math.PI / 2 +
          (random() - 0.5) * polarSpread +
          Math.sin((familyIndex / familyCount) * Math.PI * 2) * polarSpread * 0.12;

        const pole = new THREE.Vector3(
          Math.sin(polar) * Math.cos(azimuth),
          Math.cos(polar),
          Math.sin(polar) * Math.sin(azimuth),
        ).normalize();

        const familyColor = palette[familyIndex % palette.length];
        const familyVelocity = 0.72 + random() * 0.34;
        const familySweep = sweepMin + random() * (sweepMax - sweepMin);
        const familyRadius = radiusMin + random() * (radiusMax - radiusMin);
        const familyWobble = wobbleMin + random() * (wobbleMax - wobbleMin);
        const familyPhase = random() * Math.PI * 2;

        for (
          let copyIndex = 0;
          copyIndex < copiesPerFamily;
          copyIndex += 1
        ) {
          const centered = copyIndex - (copiesPerFamily - 1) / 2;
          const localPhase = centered * localPhaseStep;

          const startAngle =
            familyPhase + localPhase * 0.62 + (random() - 0.5) * 0.18;

          const sweep =
            familySweep + localPhase * 0.12 + (random() - 0.5) * 0.08;

          const radius =
            familyRadius + centered * 0.008 + (random() - 0.5) * 0.01;

          const coreWidth =
            coreWidthMin + random() * (coreWidthMax - coreWidthMin);

          const glowWidth =
            glowWidthMin + random() * (glowWidthMax - glowWidthMin);

          const opacity =
            opacityMin + random() * (opacityMax - opacityMin);

          const glowOpacity =
            glowOpacityMin +
            random() * (glowOpacityMax - glowOpacityMin);

          const scale = scaleMin + random() * (scaleMax - scaleMin);

          result.push({
            id: `${layer}-${familyIndex}-${copyIndex}`,
            layer,
            familyIndex,
            points: createSphericalArcPoints({
              radius,
              startAngle,
              sweep,
              pole,
              segments: config.segments,
              wobble: familyWobble,
              phase: familyPhase + localPhase,
            }),
            color: familyColor,
            coreWidth,
            glowWidth,
            opacity,
            glowOpacity,
            scale,
            phase: familyPhase + localPhase,
            velocity: familyVelocity,
            localTiltX: (random() - 0.5) * tiltMax,
            localTiltY: (random() - 0.5) * tiltMax,
            localTiltZ: (random() - 0.5) * tiltMax * 0.8,
            pulseOffset: random() * Math.PI * 2,
            echoSpread: 0.85 + random() * 0.28,
          });
        }
      }
    }

    pushLayer({
      layer: 'outer',
      familyCount: config.outerFamilies,
      copiesPerFamily: config.outerCopies,
      palette: outerColors,
      radiusMin: 0.82,
      radiusMax: 0.98,
      sweepMin: 1.25,
      sweepMax: 2.0,
      wobbleMin: 0.05,
      wobbleMax: 0.11,
      coreWidthMin: 0.32,
      coreWidthMax: 0.52,
      glowWidthMin: 1.25,
      glowWidthMax: 2.0,
      opacityMin: 0.42,
      opacityMax: 0.72,
      glowOpacityMin: 0.1,
      glowOpacityMax: 0.18,
      scaleMin: 0.98,
      scaleMax: 1.03,
      localPhaseStep: 0.14,
      polarSpread: 1.1,
      tiltMax: 0.045,
    });

    pushLayer({
      layer: 'mid',
      familyCount: config.midFamilies,
      copiesPerFamily: config.midCopies,
      palette: midColors,
      radiusMin: 0.54,
      radiusMax: 0.82,
      sweepMin: 1.2,
      sweepMax: 1.9,
      wobbleMin: 0.06,
      wobbleMax: 0.12,
      coreWidthMin: 0.34,
      coreWidthMax: 0.56,
      glowWidthMin: 1.3,
      glowWidthMax: 2.15,
      opacityMin: 0.46,
      opacityMax: 0.8,
      glowOpacityMin: 0.12,
      glowOpacityMax: 0.2,
      scaleMin: 0.97,
      scaleMax: 1.02,
      localPhaseStep: 0.12,
      polarSpread: 0.95,
      tiltMax: 0.04,
    });

    pushLayer({
      layer: 'inner',
      familyCount: config.innerFamilies,
      copiesPerFamily: config.innerCopies,
      palette: innerColors,
      radiusMin: 0.34,
      radiusMax: 0.56,
      sweepMin: 1.0,
      sweepMax: 1.6,
      wobbleMin: 0.04,
      wobbleMax: 0.1,
      coreWidthMin: 0.28,
      coreWidthMax: 0.46,
      glowWidthMin: 1.05,
      glowWidthMax: 1.7,
      opacityMin: 0.24,
      opacityMax: 0.48,
      glowOpacityMin: 0.06,
      glowOpacityMax: 0.12,
      scaleMin: 0.96,
      scaleMax: 1.01,
      localPhaseStep: 0.1,
      polarSpread: 0.78,
      tiltMax: 0.03,
    });

    return result;
  }, [
    colors,
    config.innerCopies,
    config.innerFamilies,
    config.midCopies,
    config.midFamilies,
    config.outerCopies,
    config.outerFamilies,
    config.segments,
  ]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const timeFactor = reducedMotion ? 0.2 : 1;
    const globalTime = elapsed * safeSpeed * motion.rotationSpeed * timeFactor;

    if (rootRef.current) {
      rootRef.current.rotation.z += delta * 0.03 * safeSpeed * timeFactor;
      rootRef.current.rotation.x = Math.sin(globalTime * 0.24) * 0.01;
      rootRef.current.rotation.y = Math.cos(globalTime * 0.2) * 0.01;
    }

    arcRefs.current.forEach((group, index) => {
      if (!group) return;

      const arc = arcs[index];
      const localTime = globalTime * arc.velocity + arc.phase;

      const pulse =
        1 +
        Math.sin(localTime * 1.5 + arc.pulseOffset) *
          0.012 *
          motion.pulse;

      group.rotation.z = arc.localTiltZ + Math.sin(localTime * 0.65) * 0.03;
      group.rotation.x = arc.localTiltX + Math.sin(localTime * 0.46) * 0.012;
      group.rotation.y = arc.localTiltY + Math.cos(localTime * 0.5) * 0.012;

      group.scale.setScalar(arc.scale * pulse);
    });
  });

  const renderArcVisual = (arc: ArcDescriptor, index: number) => {
    const echoConfig = getEchoConfig(arc.layer);

    return (
      <group
        key={arc.id}
        ref={(group) => {
          arcRefs.current[index] = group;
        }}
      >
        <Line
          points={arc.points}
          color={arc.color}
          lineWidth={arc.glowWidth * 2.0}
          transparent
          opacity={arc.glowOpacity * 0.34 * glowBoost}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />

        <Line
          points={arc.points}
          color={arc.color}
          lineWidth={arc.glowWidth}
          transparent
          opacity={arc.glowOpacity * glowBoost}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />

        {echoConfig.map((echo, echoIndex) => (
          <group
            key={`${arc.id}-echo-${echoIndex}`}
            rotation={[0, 0, echo.rotation * arc.echoSpread]}
            scale={[echo.scale, echo.scale, echo.scale]}
          >
            <Line
              points={arc.points}
              color={arc.color}
              lineWidth={arc.glowWidth * 0.9}
              transparent
              opacity={arc.opacity * echo.opacity * glowBoost}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </group>
        ))}

        <Line
          points={arc.points}
          color={arc.color}
          lineWidth={arc.coreWidth}
          transparent
          opacity={arc.opacity * glowBoost}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </group>
    );
  };

  return (
    <group ref={rootRef}>
      {arcs.map((arc, index) => renderArcVisual(arc, index))}
    </group>
  );
}