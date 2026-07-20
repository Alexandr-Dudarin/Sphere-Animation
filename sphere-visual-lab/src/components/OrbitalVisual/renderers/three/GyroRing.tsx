import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  OrbitalGyroRingPresetConfig,
  OrbitalQuality,
} from '../../OrbitalVisual.types';

interface GyroRingColors {
  metal: THREE.Color;
  glow: THREE.Color;
  hot: THREE.Color;
}

interface GyroRingProps {
  config: OrbitalGyroRingPresetConfig;
  colors: GyroRingColors;
  quality: OrbitalQuality;
  speed: number;
  glowFactor: number;
  index: number;
}

function getCurveSegments(
  quality: OrbitalQuality,
) {
  switch (quality) {
    case 'low':
      return 24;

    case 'high':
      return 72;

    default:
      return 48;
  }
}

function createBandSegmentGeometry({
  radius,
  width,
  depth,
  arc,
  curveSegments,
  bevelScale = 1,
}: {
  radius: number;
  width: number;
  depth: number;
  arc: number;
  curveSegments: number;
  bevelScale?: number;
}) {
  const outerRadius =
    radius + width / 2;

  const innerRadius =
    Math.max(
      radius - width / 2,
      0.02,
    );

  const shape =
    new THREE.Shape();

  shape.moveTo(
    outerRadius,
    0,
  );

  shape.absarc(
    0,
    0,
    outerRadius,
    0,
    arc,
    false,
  );

  shape.lineTo(
    Math.cos(arc) *
      innerRadius,
    Math.sin(arc) *
      innerRadius,
  );

  shape.absarc(
    0,
    0,
    innerRadius,
    arc,
    0,
    true,
  );

  shape.closePath();

  const bevelSize =
    Math.min(
      width * 0.09,
      depth * 0.3,
    ) *
    bevelScale;

  const geometry =
    new THREE.ExtrudeGeometry(
      shape,
      {
        depth,
        steps: 1,
        curveSegments,
        bevelEnabled:
          bevelSize > 0.0001,
        bevelSegments:
          bevelSize > 0.0001
            ? 2
            : 0,
        bevelSize,
        bevelThickness:
          bevelSize * 0.72,
      },
    );

  geometry.translate(
    0,
    0,
    -depth / 2,
  );

  geometry.computeVertexNormals();

  return geometry;
}

export default function GyroRing({
  config,
  colors,
  quality,
  speed,
  glowFactor,
  index,
}: GyroRingProps) {
  const spinRef =
    useRef<THREE.Group>(null);

  const segments =
    Math.max(
      3,
      Math.round(
        config.segments,
      ),
    );

  const segmentStep =
    (Math.PI * 2) /
    segments;

  const segmentArc =
    segmentStep *
    THREE.MathUtils.clamp(
      1 -
        config.gapRatio,
      0.68,
      0.993,
    );

  const curveSegments =
    getCurveSegments(
      quality,
    );

  const bandWidth =
    Math.max(
      config.thickness *
        2.35,
      0.056,
    );

  const bandDepth =
    Math.max(
      config.thickness *
        0.72,
      0.018,
    );

  const railWidth =
    Math.max(
      bandWidth *
        config.railThicknessScale,
      0.014,
    );

  const railDepth =
    Math.max(
      bandDepth * 0.11,
      0.003,
    );

  const segmentGeometry =
    useMemo(
      () =>
        createBandSegmentGeometry({
          radius:
            config.radius,
          width:
            bandWidth,
          depth:
            bandDepth,
          arc:
            segmentArc,
          curveSegments,
        }),
      [
        config.radius,
        bandWidth,
        bandDepth,
        segmentArc,
        curveSegments,
      ],
    );

  const railGeometry =
    useMemo(
      () =>
        createBandSegmentGeometry({
          radius:
            Math.max(
              config.radius -
                config.railInset,
              0.05,
            ),
          width:
            railWidth,
          depth:
            railDepth,
          arc:
            segmentArc * 0.94,
          curveSegments,
          bevelScale: 0.35,
        }),
      [
        config.radius,
        config.railInset,
        railWidth,
        railDepth,
        segmentArc,
        curveSegments,
      ],
    );

  useEffect(() => {
    return () => {
      segmentGeometry.dispose();
      railGeometry.dispose();
    };
  }, [
    segmentGeometry,
    railGeometry,
  ]);

  const segmentIndexes =
    useMemo(
      () =>
        Array.from(
          {
            length: segments,
          },
          (_, segmentIndex) =>
            segmentIndex,
        ),
      [segments],
    );

  const markerCount =
    Math.max(
      0,
      Math.round(
        config.markerCount,
      ),
    );

  const markerAngles =
    useMemo(
      () =>
        Array.from(
          {
            length:
              markerCount,
          },
          (_, markerIndex) =>
            (
              markerIndex /
              Math.max(
                markerCount,
                1,
              )
            ) *
              Math.PI *
              2 +
            config.phase +
            segmentStep *
              0.51,
        ),
      [
        markerCount,
        config.phase,
        segmentStep,
      ],
    );

  const bodyColor =
    useMemo(
      () =>
        colors.metal
          .clone()
          .lerp(
            colors.glow,
            0.055 +
              index * 0.018,
          )
          .multiplyScalar(
            1.06,
          ),
      [
        colors.metal,
        colors.glow,
        index,
      ],
    );

  const railColor =
    useMemo(
      () =>
        colors.glow
          .clone()
          .lerp(
            colors.hot,
            0.12 +
              index * 0.045,
          ),
      [
        colors.glow,
        colors.hot,
        index,
      ],
    );

  const markerColor =
    useMemo(
      () =>
        colors.hot
          .clone()
          .lerp(
            colors.glow,
            0.38,
          ),
      [
        colors.hot,
        colors.glow,
      ],
    );

  useFrame((state) => {
    if (!spinRef.current) {
      return;
    }

    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(
        speed,
        0.2,
      );

    spinRef.current.rotation.z =
      config.phase +
      elapsed *
        config.spinSpeed *
        config.direction *
        safeSpeed;
  });

  const frontRailZ =
    bandDepth / 2 +
    railDepth * 0.6;

  const backRailZ =
    -frontRailZ;

  return (
    <group
      position={[
        config.offsetX ?? 0,
        config.offsetY ?? 0,
        config.offsetZ ?? 0,
      ]}
      rotation={[
        config.tiltX,
        config.tiltY,
        config.tiltZ,
      ]}
    >
      <group ref={spinRef}>
        {segmentIndexes.map(
          (segmentIndex) => {
            const startAngle =
              segmentIndex *
                segmentStep +
              config.phase;

            return (
              <group
                key={
                  segmentIndex
                }
                rotation={[
                  0,
                  0,
                  startAngle,
                ]}
              >
                <mesh
                  geometry={
                    segmentGeometry
                  }
                  renderOrder={
                    10 +
                    index * 4
                  }
                >
                  <meshPhysicalMaterial
                    color={bodyColor}
                    emissive={
                      colors.glow
                    }
                    emissiveIntensity={
                      (
                        0.025 +
                        index * 0.008
                      ) *
                      glowFactor
                    }
                    metalness={0.74}
                    roughness={0.26}
                    clearcoat={0.86}
                    clearcoatRoughness={0.2}
                    transparent
                    opacity={
                      config.opacity
                    }
                    depthWrite
                    depthTest
                    toneMapped={false}
                  />
                </mesh>

                <mesh
                  geometry={
                    railGeometry
                  }
                  position={[
                    0,
                    0,
                    frontRailZ,
                  ]}
                  renderOrder={
                    14 +
                    index * 4
                  }
                >
                  <meshBasicMaterial
                    color={railColor}
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        config.opacity *
                          0.78 *
                          glowFactor,
                        0,
                        0.94,
                      )
                    }
                    blending={
                      THREE.AdditiveBlending
                    }
                    depthWrite={false}
                    depthTest
                    toneMapped={false}
                  />
                </mesh>

                <mesh
                  geometry={
                    railGeometry
                  }
                  position={[
                    0,
                    0,
                    backRailZ,
                  ]}
                  rotation={[
                    0,
                    Math.PI,
                    0,
                  ]}
                  renderOrder={
                    13 +
                    index * 4
                  }
                >
                  <meshBasicMaterial
                    color={railColor}
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        config.opacity *
                          0.48 *
                          glowFactor,
                        0,
                        0.72,
                      )
                    }
                    blending={
                      THREE.AdditiveBlending
                    }
                    depthWrite={false}
                    depthTest
                    toneMapped={false}
                  />
                </mesh>
              </group>
            );
          },
        )}

        {markerAngles.map(
          (
            angle,
            markerIndex,
          ) => {
            const markerRadius =
              config.radius -
              config.railInset *
                0.25;

            return (
              <group
                key={`marker-${markerIndex}`}
                position={[
                  Math.cos(
                    angle,
                  ) *
                    markerRadius,
                  Math.sin(
                    angle,
                  ) *
                    markerRadius,
                  0,
                ]}
                rotation={[
                  0,
                  0,
                  angle +
                    Math.PI /
                      2,
                ]}
              >
                <mesh
                  position={[
                    0,
                    0,
                    bandDepth *
                      0.58,
                  ]}
                  renderOrder={
                    22 +
                    index
                  }
                >
                  <boxGeometry
                    args={[
                      bandWidth *
                        0.62,
                      bandWidth *
                        0.16,
                      bandDepth *
                        0.19,
                    ]}
                  />

                  <meshBasicMaterial
                    color={
                      markerColor
                    }
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        0.82 *
                          glowFactor,
                        0,
                        1,
                      )
                    }
                    blending={
                      THREE.AdditiveBlending
                    }
                    depthWrite={false}
                    depthTest
                    toneMapped={false}
                  />
                </mesh>
              </group>
            );
          },
        )}
      </group>
    </group>
  );
}
