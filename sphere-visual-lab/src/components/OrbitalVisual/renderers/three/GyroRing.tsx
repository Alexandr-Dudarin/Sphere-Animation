import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
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

function getGeometrySegments(
  quality: OrbitalQuality,
) {
  switch (quality) {
    case 'low':
      return {
        radialSegments: 8,
        tubularSegments: 42,
      };

    case 'high':
      return {
        radialSegments: 16,
        tubularSegments: 96,
      };

    default:
      return {
        radialSegments: 12,
        tubularSegments: 72,
      };
  }
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

  const geometrySegments =
    getGeometrySegments(quality);

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
      0.56,
      0.985,
    );

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
              0.5,
        ),
      [
        markerCount,
        config.phase,
        segmentStep,
      ],
    );

  const metalColor =
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
            1.08,
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
              index * 0.055,
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
            0.34,
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

  const railRadius =
    Math.max(
      config.radius -
        config.railInset,
      config.thickness * 2,
    );

  const railThickness =
    Math.max(
      config.thickness *
        config.railThicknessScale,
      0.0045,
    );

  const edgeRadius =
    config.radius +
    config.thickness *
      0.2;

  const edgeThickness =
    Math.max(
      config.thickness *
        0.065,
      0.0035,
    );

  const continuousRailOpacity =
    THREE.MathUtils.clamp(
      config.opacity *
        0.48 *
        glowFactor,
      0,
      0.72,
    );

  const edgeOpacity =
    THREE.MathUtils.clamp(
      config.opacity *
        0.16 *
        glowFactor,
      0,
      0.32,
    );

  return (
    <group
      rotation={[
        config.tiltX,
        config.tiltY,
        config.tiltZ,
      ]}
    >
      <group ref={spinRef}>
        <mesh
          renderOrder={
            8 +
            index * 3
          }
        >
          <torusGeometry
            args={[
              railRadius,
              railThickness,
              geometrySegments.radialSegments,
              geometrySegments.tubularSegments,
              Math.PI * 2,
            ]}
          />

          <meshBasicMaterial
            color={railColor}
            transparent
            opacity={
              continuousRailOpacity
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
          renderOrder={
            9 +
            index * 3
          }
        >
          <torusGeometry
            args={[
              edgeRadius,
              edgeThickness,
              geometrySegments.radialSegments,
              geometrySegments.tubularSegments,
              Math.PI * 2,
            ]}
          />

          <meshBasicMaterial
            color={railColor}
            transparent
            opacity={edgeOpacity}
            blending={
              THREE.AdditiveBlending
            }
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>

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
                  renderOrder={
                    10 +
                    index * 3
                  }
                >
                  <torusGeometry
                    args={[
                      config.radius,
                      config.thickness,
                      geometrySegments.radialSegments,
                      geometrySegments.tubularSegments,
                      segmentArc,
                    ]}
                  />

                  <meshStandardMaterial
                    color={
                      metalColor
                    }
                    emissive={
                      colors.glow
                    }
                    emissiveIntensity={
                      (
                        0.04 +
                        index * 0.012
                      ) *
                      glowFactor
                    }
                    metalness={0.9}
                    roughness={0.29}
                    transparent
                    opacity={
                      config.opacity
                    }
                    depthWrite
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
                0.38;

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
                    config.thickness *
                      0.38,
                  ]}
                  renderOrder={
                    17 +
                    index
                  }
                >
                  <boxGeometry
                    args={[
                      config.thickness *
                        2.35,
                      config.thickness *
                        0.58,
                      config.thickness *
                        0.42,
                    ]}
                  />

                  <meshStandardMaterial
                    color={
                      metalColor
                    }
                    emissive={
                      colors.glow
                    }
                    emissiveIntensity={
                      0.08 *
                      glowFactor
                    }
                    metalness={0.84}
                    roughness={0.24}
                    toneMapped={false}
                  />
                </mesh>

                <mesh
                  position={[
                    0,
                    0,
                    config.thickness *
                      0.64,
                  ]}
                  renderOrder={
                    19 +
                    index
                  }
                >
                  <boxGeometry
                    args={[
                      config.thickness *
                        1.48,
                      config.thickness *
                        0.14,
                      config.thickness *
                        0.09,
                    ]}
                  />

                  <meshBasicMaterial
                    color={
                      markerColor
                    }
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        0.72 *
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
