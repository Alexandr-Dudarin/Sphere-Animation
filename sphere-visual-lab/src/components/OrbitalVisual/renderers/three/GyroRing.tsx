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
      return 28;

    case 'high':
      return 80;

    default:
      return 54;
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
      width * 0.085,
      depth * 0.28,
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
  const precessionRef =
    useRef<THREE.Group>(null);

  const axisRef =
    useRef<THREE.Group>(null);

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
      0.72,
      0.996,
    );

  const gapAngle =
    Math.max(
      segmentStep -
        segmentArc,
      0.001,
    );

  const curveSegments =
    getCurveSegments(
      quality,
    );

  const bandWidth =
    Math.max(
      config.thickness *
        2.42,
      0.058,
    );

  const bandDepth =
    Math.max(
      config.thickness *
        0.78,
      0.019,
    );

  const railWidth =
    Math.max(
      bandWidth *
        config.railThicknessScale,
      0.013,
    );

  const railDepth =
    Math.max(
      bandDepth * 0.095,
      0.0028,
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
            segmentArc * 0.955,
          curveSegments,
          bevelScale: 0.28,
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

  const edgeRailGeometry =
    useMemo(
      () =>
        createBandSegmentGeometry({
          radius:
            config.radius +
            bandWidth * 0.32,
          width:
            Math.max(
              railWidth * 0.32,
              0.004,
            ),
          depth:
            railDepth,
          arc:
            segmentArc * 0.92,
          curveSegments,
          bevelScale: 0.2,
        }),
      [
        config.radius,
        bandWidth,
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
      edgeRailGeometry.dispose();
    };
  }, [
    segmentGeometry,
    railGeometry,
    edgeRailGeometry,
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

  const jointAngles =
    useMemo(
      () =>
        segmentIndexes.map(
          (segmentIndex) =>
            segmentIndex *
              segmentStep +
            segmentArc +
            gapAngle / 2,
        ),
      [
        segmentIndexes,
        segmentStep,
        segmentArc,
        gapAngle,
      ],
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
            segmentStep *
              0.34,
        ),
      [
        markerCount,
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
            0.08 +
              index * 0.018,
          )
          .multiplyScalar(
            1.14,
          ),
      [
        colors.metal,
        colors.glow,
        index,
      ],
    );

  const connectorColor =
    useMemo(
      () =>
        colors.metal
          .clone()
          .lerp(
            colors.glow,
            0.035,
          )
          .multiplyScalar(
            0.82,
          ),
      [
        colors.metal,
        colors.glow,
      ],
    );

  const railColor =
    useMemo(
      () =>
        colors.glow
          .clone()
          .lerp(
            colors.hot,
            0.1 +
              index * 0.04,
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
            0.42,
          ),
      [
        colors.hot,
        colors.glow,
      ],
    );

  useFrame((state) => {
    if (
      !precessionRef.current ||
      !axisRef.current ||
      !spinRef.current
    ) {
      return;
    }

    const elapsed =
      state.clock.getElapsedTime();

    const safeSpeed =
      Math.max(
        speed,
        0.2,
      );

    const spatialAngle =
      config.spatialPhase +
      elapsed *
        config.spatialSpeed *
        config.spatialDirection *
        safeSpeed;

    /*
     * Пространственное движение теперь
     * задаётся явно в пресете.
     *
     * Большое и среднее кольца сохраняют
     * почти реберный наклон и вращаются
     * только в одной экранной плоскости.
     */
    if (
      config.spatialMotion ===
      'planar-orbit'
    ) {
      precessionRef.current.rotation.set(
        0,
        0,
        spatialAngle,
      );

      axisRef.current.rotation.set(
        config.tiltX,
        config.tiltY,
        config.tiltZ,
      );
    } else {
      /*
       * Маленькое кольцо остаётся
       * вертикальным и непрерывно
       * поворачивается вокруг своей
       * вертикальной оси. Поэтому оно
       * циклически видно то ребром,
       * то широкой овальной частью.
       */
      precessionRef.current.rotation.set(
        0,
        0,
        0,
      );

      axisRef.current.rotation.set(
        config.tiltX,
        config.tiltY +
          spatialAngle,
        config.tiltZ,
      );
    }

    /*
     * Отдельный внутренний уровень:
     * сегменты, соединители и маркеры
     * продолжают двигаться вдоль
     * собственной окружности кольца.
     */
    spinRef.current.rotation.z =
      config.phase +
      elapsed *
        config.spinSpeed *
        config.direction *
        safeSpeed;
  });

  const frontRailZ =
    bandDepth / 2 +
    railDepth * 0.72;

  const backRailZ =
    -frontRailZ;

  const jointTangentialLength =
    THREE.MathUtils.clamp(
      config.radius *
        gapAngle *
        1.05,
      bandWidth * 0.16,
      bandWidth * 0.5,
    );

  return (
    <group ref={precessionRef}>
      <group
        ref={axisRef}
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
              segmentStep;

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
                    index * 5
                  }
                >
                  <meshPhysicalMaterial
                    color={bodyColor}
                    emissive={
                      colors.glow
                    }
                    emissiveIntensity={
                      (
                        0.035 +
                        index * 0.009
                      ) *
                      glowFactor
                    }
                    metalness={0.58}
                    roughness={0.22}
                    clearcoat={1}
                    clearcoatRoughness={0.16}
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
                    index * 5
                  }
                >
                  <meshBasicMaterial
                    color={railColor}
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        config.opacity *
                          0.64 *
                          glowFactor,
                        0,
                        0.82,
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
                    index * 5
                  }
                >
                  <meshBasicMaterial
                    color={railColor}
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        config.opacity *
                          0.34 *
                          glowFactor,
                        0,
                        0.56,
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
                    edgeRailGeometry
                  }
                  position={[
                    0,
                    0,
                    frontRailZ *
                      0.98,
                  ]}
                  renderOrder={
                    15 +
                    index * 5
                  }
                >
                  <meshBasicMaterial
                    color={railColor}
                    transparent
                    opacity={
                      THREE.MathUtils.clamp(
                        config.opacity *
                          0.2 *
                          glowFactor,
                        0,
                        0.32,
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

        {jointAngles.map(
          (
            angle,
            jointIndex,
          ) => (
            <group
              key={`joint-${jointIndex}`}
              position={[
                Math.cos(
                  angle,
                ) *
                  config.radius,
                Math.sin(
                  angle,
                ) *
                  config.radius,
                0,
              ]}
              rotation={[
                0,
                0,
                angle,
              ]}
            >
              <mesh
                renderOrder={
                  18 +
                  index * 5
                }
              >
                <boxGeometry
                  args={[
                    bandWidth *
                      1.08,
                    jointTangentialLength,
                    bandDepth *
                      1.22,
                  ]}
                />

                <meshPhysicalMaterial
                  color={
                    connectorColor
                  }
                  emissive={
                    colors.glow
                  }
                  emissiveIntensity={
                    0.018 *
                    glowFactor
                  }
                  metalness={0.76}
                  roughness={0.25}
                  clearcoat={0.88}
                  clearcoatRoughness={0.2}
                  depthWrite
                  depthTest
                  toneMapped={false}
                />
              </mesh>

              <mesh
                position={[
                  0,
                  0,
                  bandDepth *
                    0.69,
                ]}
                renderOrder={
                  20 +
                  index * 5
                }
              >
                <boxGeometry
                  args={[
                    bandWidth *
                      0.55,
                    Math.max(
                      jointTangentialLength *
                        0.38,
                      bandWidth *
                        0.035,
                    ),
                    bandDepth *
                      0.08,
                  ]}
                />

                <meshBasicMaterial
                  color={railColor}
                  transparent
                  opacity={
                    THREE.MathUtils.clamp(
                      0.42 *
                        glowFactor,
                      0,
                      0.66,
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
          ),
        )}

        {markerAngles.map(
          (
            angle,
            markerIndex,
          ) => {
            const markerRadius =
              config.radius -
              bandWidth *
                0.12;

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
                      0.67,
                  ]}
                  renderOrder={
                    24 +
                    index
                  }
                >
                  <boxGeometry
                    args={[
                      bandWidth *
                        0.48,
                      bandWidth *
                        0.075,
                      bandDepth *
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
                        0.58 *
                          glowFactor,
                        0,
                        0.78,
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
    </group>
  );
}
