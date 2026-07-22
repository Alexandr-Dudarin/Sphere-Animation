import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  OrbitalPortalRingPresetConfig,
  OrbitalQuality,
} from '../../OrbitalVisual.types';

interface PortalRingColors {
  glow: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
}

interface PortalRingProps {
  config: OrbitalPortalRingPresetConfig;
  colors: PortalRingColors;
  quality: OrbitalQuality;
  speed: number;
  glowFactor: number;
  index: number;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vWorldPosition;

  void main() {
    vUv = uv;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;

    vViewPosition = mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);

    /*
     * Передаём непрерывные координаты, а не уже вычисленный угол.
     * Угол, интерполированный между вершинами около -PI / PI, создавал
     * заметную радиальную линию-склейку на вращающихся кольцах.
     */
    vWorldPosition = worldPosition.xy;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  uniform float uAccentMix;
  uniform float uHotMix;
  uniform float uRingRole;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uHotColor;

  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vWorldPosition;

  float loopDistance(float a, float b) {
    float distanceValue = abs(a - b);
    return min(distanceValue, 1.0 - distanceValue);
  }

  void main() {
    vec3 viewDirection = normalize(-vViewPosition);
    vec3 normalValue = normalize(vViewNormal);

    float fresnel = pow(
      1.0 -
      abs(dot(normalValue, viewDirection)),
      1.62
    );

    float faceLight = pow(
      clamp(
        dot(
          normalValue,
          normalize(vec3(-0.36, 0.58, 0.74))
        ) * 0.5 + 0.5,
        0.0,
        1.0
      ),
      1.28
    );

    float worldAngle =
      atan(vWorldPosition.y, vWorldPosition.x) /
      6.28318530718 +
      0.5;

    float along = fract(
      worldAngle +
      uPhase -
      uTime * (0.052 + uRingRole * 0.019)
    );

    float hotHead = exp(
      -pow(
        loopDistance(along, 0.19) / 0.032,
        2.0
      )
    );

    float warmTail = exp(
      -pow(
        loopDistance(along, 0.285) / 0.13,
        2.0
      )
    ) * 0.3;

    float secondaryHead = exp(
      -pow(
        loopDistance(along, 0.67) / 0.055,
        2.0
      )
    ) *
      (0.24 + uRingRole * 0.08);

    float crossSection =
      abs(vUv.y - 0.5) * 2.0;

    float tubeBand = pow(
      max(1.0 - crossSection, 0.0),
      0.4
    );

    float edgeBand =
      1.0 -
      smoothstep(0.78, 1.0, crossSection);

    float technicalScan =
      0.5 +
      0.5 * sin(
        vUv.x * 17.0 -
        uTime * 0.68 +
        vUv.y * 5.0 +
        uPhase * 6.2831
      );

    float machinedBand =
      0.5 +
      0.5 * sin(
        vUv.x * 46.0 +
        vUv.y * 8.0 +
        uPhase * 11.0
      );

    float microBand =
      0.5 +
      0.5 * sin(
        vUv.y * 36.0 +
        vUv.x * 5.0 +
        uPhase * 9.0
      );

    vec3 metalShadow = mix(
      uAccentColor * 0.075,
      uBaseColor * 0.065,
      0.45
    );

    vec3 metalBody = mix(
      uAccentColor *
        (0.32 + uAccentMix * 0.13),
      uBaseColor *
        (0.38 + uRingRole * 0.08),
      0.36
    );

    float metalLight = clamp(
      0.14 +
      faceLight * 0.5 +
      fresnel * 0.52 +
      technicalScan * 0.07 +
      machinedBand * 0.028,
      0.0,
      1.0
    );

    vec3 color = mix(
      metalShadow,
      metalBody,
      metalLight
    );

    color +=
      uBaseColor *
      (
        fresnel *
          (0.12 + uRingRole * 0.035) +
        microBand * 0.022
      );

    float hotAmount = clamp(
      (
        hotHead * 0.9 +
        warmTail * 0.34 +
        secondaryHead * 0.5
      ) *
      uHotMix +
      fresnel *
        (0.045 + uRingRole * 0.022),
      0.0,
      0.88
    );

    color = mix(
      color,
      uHotColor,
      hotAmount
    );

    float alpha =
      uOpacity *
      tubeBand *
      edgeBand *
      (
        0.76 +
        fresnel * 0.2 +
        faceLight * 0.09 +
        hotHead * 0.12 +
        secondaryHead * 0.05
      );

    gl_FragColor = vec4(color, alpha);
  }
`;

function getTorusDetail(quality: OrbitalQuality) {
  switch (quality) {
    case 'low':
      return {
        radialSegments: 6,
        tubularSegments: 26,
      };
    case 'high':
      return {
        radialSegments: 14,
        tubularSegments: 88,
      };
    default:
      return {
        radialSegments: 9,
        tubularSegments: 54,
      };
  }
}

export default function PortalRing({
  config,
  colors,
  quality,
  speed,
  glowFactor,
  index,
}: PortalRingProps) {
  const ringRef = useRef<THREE.Group>(null);

  const segmentCount = Math.max(
    3,
    Math.round(config.segments),
  );

  const segmentStep =
    (Math.PI * 2) / segmentCount;

  const segmentArc =
    segmentStep *
    THREE.MathUtils.clamp(
      1 - config.gapRatio,
      0.5,
      0.997,
    );

  const detail = getTorusDetail(quality);

  const geometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        config.radius,
        config.thickness,
        detail.radialSegments,
        detail.tubularSegments,
        segmentArc,
      ),
    [
      config.radius,
      config.thickness,
      detail.radialSegments,
      detail.tubularSegments,
      segmentArc,
    ],
  );

  const railGeometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        config.radius,
        Math.max(
          config.thickness * 0.145,
          0.0042,
        ),
        Math.max(detail.radialSegments - 2, 4),
        detail.tubularSegments,
        segmentArc * 0.7,
      ),
    [
      config.radius,
      config.thickness,
      detail.radialSegments,
      detail.tubularSegments,
      segmentArc,
    ],
  );

  const pulseGeometry = useMemo(
    () =>
      new THREE.TorusGeometry(
        config.radius,
        Math.max(
          config.thickness * 0.2,
          0.005,
        ),
        Math.max(detail.radialSegments - 2, 4),
        Math.max(
          Math.round(detail.tubularSegments * 0.48),
          18,
        ),
        segmentArc * 0.2,
      ),
    [
      config.radius,
      config.thickness,
      detail.radialSegments,
      detail.tubularSegments,
      segmentArc,
    ],
  );

  const ringRole = THREE.MathUtils.clamp(
    index / 2,
    0,
    1,
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: {
        value:
          config.opacity *
          glowFactor,
      },
      uPhase: { value: config.phase },
      uAccentMix: {
        value: config.accentMix,
      },
      uHotMix: { value: config.hotMix },
      uRingRole: { value: ringRole },
      uBaseColor: {
        value: colors.glow.clone(),
      },
      uAccentColor: {
        value: colors.accent.clone(),
      },
      uHotColor: {
        value: colors.hot.clone(),
      },
    }),
    [
      colors,
      config.accentMix,
      config.hotMix,
      config.opacity,
      config.phase,
      glowFactor,
      ringRole,
    ],
  );

  const material = useMemo(() => {
    const nextMaterial =
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      });

    nextMaterial.name =
      `PortalRingMaterial-${index}`;
    nextMaterial.toneMapped = false;

    return nextMaterial;
  }, [index, uniforms]);

  const railColor = useMemo(
    () =>
      colors.glow
        .clone()
        .lerp(colors.hot, 0.36),
    [colors.glow, colors.hot],
  );

  const pulseColor = useMemo(
    () =>
      colors.hot
        .clone()
        .lerp(colors.glow, 0.18),
    [colors.glow, colors.hot],
  );

  const markerColor = useMemo(
    () =>
      colors.hot
        .clone()
        .lerp(
          colors.glow,
          0.2 + ringRole * 0.14,
        ),
    [colors.hot, colors.glow, ringRole],
  );

  const markerBaseColor = useMemo(
    () =>
      colors.accent
        .clone()
        .multiplyScalar(0.16),
    [colors.accent],
  );

  const railMaterial = useMemo(() => {
    const nextMaterial =
      new THREE.MeshBasicMaterial({
        color: railColor,
        transparent: true,
        opacity:
          config.opacity *
          glowFactor *
          (0.27 + ringRole * 0.04),
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      });

    nextMaterial.name =
      `PortalRingRailMaterial-${index}`;

    return nextMaterial;
  }, [
    config.opacity,
    glowFactor,
    index,
    railColor,
    ringRole,
  ]);

  const pulseMaterial = useMemo(() => {
    const nextMaterial =
      new THREE.MeshBasicMaterial({
        color: pulseColor,
        transparent: true,
        opacity:
          config.opacity *
          glowFactor *
          0.5,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      });

    nextMaterial.name =
      `PortalRingPulseMaterial-${index}`;

    return nextMaterial;
  }, [
    config.opacity,
    glowFactor,
    index,
    pulseColor,
  ]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      railGeometry.dispose();
      pulseGeometry.dispose();
      material.dispose();
      railMaterial.dispose();
      pulseMaterial.dispose();
    };
  }, [
    geometry,
    material,
    pulseGeometry,
    pulseMaterial,
    railGeometry,
    railMaterial,
  ]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);

    if (ringRef.current) {
      ringRef.current.position.z =
        config.depthOffset;

      ringRef.current.rotation.set(
        config.tiltX,
        config.tiltY,
        config.tiltZ +
          elapsed *
            config.spinSpeed *
            config.direction *
            safeSpeed +
          config.phase,
      );
    }

    material.uniforms.uTime.value =
      elapsed * safeSpeed;

    material.uniforms.uOpacity.value =
      config.opacity *
      glowFactor *
      (
        0.99 +
        Math.sin(
          elapsed * 0.44 +
          index * 1.37,
        ) *
          0.016
      );

    railMaterial.opacity =
      config.opacity *
      glowFactor *
      (
        0.21 +
        ringRole * 0.04 +
        (
          0.5 +
          0.5 *
            Math.sin(
              elapsed *
                (1.1 + ringRole * 0.22) *
                safeSpeed +
              config.phase * 8.0,
            )
        ) *
          0.18
      );

    pulseMaterial.opacity =
      config.opacity *
      glowFactor *
      (
        0.3 +
        (
          0.5 +
          0.5 *
            Math.sin(
              elapsed *
                (1.54 + ringRole * 0.28) *
                safeSpeed +
              config.phase * 11.0,
            )
        ) *
          0.4
      );
  });

  const markerEvery = Math.max(
    1,
    Math.round(config.markerEvery),
  );

  const markerOpacity =
    (0.5 - ringRole * 0.12) *
    config.opacity *
    glowFactor;

  return (
    <group ref={ringRef}>
      {Array.from(
        { length: segmentCount },
        (_, segmentIndex) => {
          const segmentAngle =
            segmentIndex * segmentStep;

          const showMarker =
            segmentIndex % markerEvery === 0;

          const markerAngle =
            segmentAngle +
            segmentArc * 0.93;

          const railAngle =
            segmentAngle +
            segmentArc * 0.15;

          const pulseAngle =
            segmentAngle +
            segmentArc *
              (
                0.18 +
                ((segmentIndex + index) % 3) *
                  0.17
              );

          return (
            <group
              key={`${index}-portal-segment-${segmentIndex}`}
            >
              <mesh
                geometry={geometry}
                rotation={[0, 0, segmentAngle]}
              >
                <primitive
                  object={material}
                  attach="material"
                />
              </mesh>

              <mesh
                geometry={railGeometry}
                rotation={[0, 0, railAngle]}
                position={[
                  0,
                  0,
                  config.thickness * 0.52,
                ]}
                renderOrder={18}
              >
                <primitive
                  object={railMaterial}
                  attach="material"
                />
              </mesh>

              {showMarker ? (
                <>
                  <mesh
                    geometry={pulseGeometry}
                    rotation={[0, 0, pulseAngle]}
                    position={[
                      0,
                      0,
                      config.thickness * 0.72,
                    ]}
                    renderOrder={20}
                  >
                    <primitive
                      object={pulseMaterial}
                      attach="material"
                    />
                  </mesh>

                  <mesh
                    position={[
                      Math.cos(markerAngle) *
                        config.radius,
                      Math.sin(markerAngle) *
                        config.radius,
                      config.thickness * 0.62,
                    ]}
                    rotation={[0, 0, markerAngle]}
                    renderOrder={19}
                  >
                    <boxGeometry
                      args={[
                        config.thickness * 0.64,
                        config.thickness *
                          (1.52 - ringRole * 0.18),
                        config.thickness * 0.32,
                      ]}
                    />

                    <meshBasicMaterial
                      color={markerBaseColor}
                      transparent
                      opacity={
                        0.82 *
                        config.opacity
                      }
                      toneMapped={false}
                      depthWrite
                    />
                  </mesh>

                  <mesh
                    position={[
                      Math.cos(markerAngle) *
                        config.radius,
                      Math.sin(markerAngle) *
                        config.radius,
                      config.thickness * 0.88,
                    ]}
                    rotation={[0, 0, markerAngle]}
                    renderOrder={21}
                  >
                    <boxGeometry
                      args={[
                        config.thickness * 0.26,
                        config.thickness *
                          (0.9 - ringRole * 0.1),
                        config.thickness * 0.11,
                      ]}
                    />

                    <meshBasicMaterial
                      color={markerColor}
                      transparent
                      opacity={markerOpacity}
                      toneMapped={false}
                      depthWrite={false}
                      blending={
                        THREE.AdditiveBlending
                      }
                    />
                  </mesh>
                </>
              ) : null}
            </group>
          );
        },
      )}
    </group>
  );
}
