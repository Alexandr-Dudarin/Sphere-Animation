import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface PlanetCoreColors {
  core: THREE.Color;
  glow: THREE.Color;
  accent: THREE.Color;
  hot: THREE.Color;
}

interface PlanetCoreProps {
  coreSize: number;
  colors: PlanetCoreColors;
  speed: number;
  glowFactor: number;
}

const PLANET_VERTEX_SHADER = `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec3 vObjectPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vViewNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    vObjectPosition = position;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PLANET_FRAGMENT_SHADER = `
  uniform vec3 uCoreColor;
  uniform vec3 uGlowColor;
  uniform vec3 uAccentColor;
  uniform vec3 uHotColor;
  uniform float uGlowFactor;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec3 vObjectPosition;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);

    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);

    return mix(nxy0, nxy1, f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += noise3(p) * amplitude;
      p = p * 2.03 + vec3(1.7, 2.9, 4.1);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec3 normal = normalize(vViewNormal);
    vec3 viewDirection = normalize(vViewPosition);

    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));
    vec3 fillDirection = normalize(vec3(0.52, -0.2, 0.74));

    float diffuse = dot(normal, lightDirection);
    float softLight = smoothstep(-0.52, 0.88, diffuse);
    float daylight = smoothstep(-0.24, 0.72, diffuse);
    float terminator = smoothstep(-0.42, 0.26, diffuse);
    float fillLight = max(dot(normal, fillDirection), 0.0);

    vec3 spherePosition = normalize(vObjectPosition);

    vec3 warp = vec3(
      fbm(spherePosition * 1.8 + vec3(0.2, 1.1, -0.7)),
      fbm(spherePosition * 2.05 + vec3(-1.3, 0.35, 0.9)),
      fbm(spherePosition * 1.72 + vec3(0.75, -0.8, 1.45))
    ) - 0.5;

    vec3 warpedPosition = normalize(spherePosition + warp * 0.28);

    float broadNoise = fbm(
      warpedPosition * 2.25 + vec3(0.35, 1.2, -0.8)
    );
    float mediumNoise = fbm(
      warpedPosition * 5.2 + vec3(-1.4, 0.6, 1.1)
    );
    float detailNoise = fbm(
      warpedPosition * 12.2 + vec3(2.2, -1.1, 0.45)
    );

    float latitudeBand =
      0.5 +
      0.5 *
        sin(
          warpedPosition.y * 16.5 +
          broadNoise * 5.6 +
          warpedPosition.x * 1.2
        );

    float secondaryBand =
      0.5 +
      0.5 *
        sin(
          warpedPosition.y * 34.0 -
          mediumNoise * 4.4 +
          warpedPosition.z * 1.7
        );

    float cloudField =
      broadNoise * 0.58 +
      mediumNoise * 0.28 +
      detailNoise * 0.14 +
      latitudeBand * 0.1;

    float cloudMask = smoothstep(0.46, 0.73, cloudField);
    float cloudVeil = smoothstep(0.34, 0.78, cloudField);

    float darkerPatch = smoothstep(
      0.5,
      0.8,
      (1.0 - broadNoise) * 0.5 +
        mediumNoise * 0.34 +
        detailNoise * 0.16
    );

    float stormDistance = distance(
      spherePosition,
      normalize(vec3(-0.42, 0.18, 0.88))
    );

    float storm =
      exp(-stormDistance * stormDistance * 28.0) *
      (0.72 + detailNoise * 0.28);

    vec3 deepSurface = mix(
      uAccentColor * 0.3,
      uCoreColor * 0.68,
      0.24 + broadNoise * 0.64
    );

    vec3 middleSurface = mix(
      deepSurface,
      uGlowColor * 0.62 + uCoreColor * 0.24,
      mediumNoise * 0.42
    );

    vec3 bandColor = mix(
      uAccentColor * 0.52,
      uGlowColor * 0.68,
      latitudeBand
    );

    vec3 cloudColor = mix(
      uGlowColor,
      uHotColor,
      0.24 + detailNoise * 0.1
    );

    vec3 surfaceColor = middleSurface;

    surfaceColor = mix(
      surfaceColor,
      bandColor,
      latitudeBand * 0.085 + secondaryBand * 0.04
    );

    surfaceColor = mix(
      surfaceColor,
      cloudColor,
      cloudMask * 0.38 + cloudVeil * 0.075
    );

    surfaceColor += cloudColor * storm * 0.18;

    surfaceColor = mix(
      surfaceColor,
      uAccentColor * 0.34,
      darkerPatch * 0.13
    );

    vec3 shadowColor = mix(
      uAccentColor * 0.3,
      uCoreColor * 0.5,
      0.28 + broadNoise * 0.46
    );

    shadowColor = mix(
      shadowColor,
      surfaceColor * 0.64,
      0.4 + mediumNoise * 0.12
    );

    vec3 illuminatedSurface =
      surfaceColor * (0.82 + softLight * 0.34);

    vec3 litSurface = mix(
      shadowColor,
      illuminatedSurface,
      terminator
    );

    litSurface +=
      uCoreColor *
      fillLight *
      (1.0 - daylight) *
      0.11;

    vec3 halfVector = normalize(lightDirection + viewDirection);

    float specular =
      pow(max(dot(normal, halfVector), 0.0), 52.0) *
      smoothstep(-0.04, 0.7, diffuse);

    float rim = pow(
      1.0 - max(dot(normal, viewDirection), 0.0),
      3.1
    );

    float litRimMask =
      0.1 + 0.9 * smoothstep(-0.34, 0.64, diffuse);

    vec3 rimColor = mix(
      uAccentColor,
      uGlowColor,
      0.78
    );

    vec3 finalColor =
      litSurface +
      uHotColor * specular * 0.16 +
      rimColor *
        rim *
        0.22 *
        uGlowFactor *
        litRimMask;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vViewNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 uGlowColor;
  uniform vec3 uAccentColor;
  uniform float uGlowFactor;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vViewNormal);
    vec3 viewDirection = normalize(vViewPosition);
    vec3 lightDirection = normalize(vec3(-0.64, 0.5, 0.62));

    float diffuse = dot(normal, lightDirection);
    float litSide = smoothstep(-0.32, 0.66, diffuse);

    float rim = pow(
      1.0 - max(dot(normal, viewDirection), 0.0),
      3.05
    );

    vec3 atmosphereColor = mix(
      uAccentColor,
      uGlowColor,
      0.5 + litSide * 0.38
    );

    float alpha =
      rim *
      (0.016 + litSide * 0.105) *
      uGlowFactor;

    gl_FragColor = vec4(
      atmosphereColor * rim * (0.42 + litSide * 0.62),
      alpha
    );
  }
`;

export default function PlanetCore({
  coreSize,
  colors,
  speed,
  glowFactor,
}: PlanetCoreProps) {
  const planetRef = useRef<THREE.Group>(null);

  const surfaceUniforms = useMemo(
    () => ({
      uCoreColor: { value: colors.core.clone() },
      uGlowColor: { value: colors.glow.clone() },
      uAccentColor: { value: colors.accent.clone() },
      uHotColor: { value: colors.hot.clone() },
      uGlowFactor: { value: glowFactor },
    }),
    [colors, glowFactor],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uGlowColor: { value: colors.glow.clone() },
      uAccentColor: { value: colors.accent.clone() },
      uGlowFactor: { value: glowFactor },
    }),
    [colors, glowFactor],
  );

  /*
   * Материалы создаются как самостоятельные THREE-объекты.
   *
   * При изменении исходного GLSL React Fast Refresh повторно выполняет
   * компонент. Изменившаяся строка шейдера заставляет useMemo создать
   * новый ShaderMaterial, а primitive заменяет старый материал на новый.
   */
  const surfaceMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: surfaceUniforms,
      vertexShader: PLANET_VERTEX_SHADER,
      fragmentShader: PLANET_FRAGMENT_SHADER,
      depthWrite: true,
      depthTest: true,
      side: THREE.FrontSide,
    });

    material.name = 'RingPlanetSurfaceMaterial';
    material.toneMapped = false;

    return material;
  }, [
    surfaceUniforms,
    PLANET_VERTEX_SHADER,
    PLANET_FRAGMENT_SHADER,
  ]);

  const atmosphereMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: atmosphereUniforms,
      vertexShader: ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
    });

    material.name = 'RingPlanetAtmosphereMaterial';
    material.toneMapped = false;

    return material;
  }, [
    atmosphereUniforms,
    ATMOSPHERE_VERTEX_SHADER,
    ATMOSPHERE_FRAGMENT_SHADER,
  ]);

  /*
   * primitive не освобождает переданный THREE-объект автоматически,
   * поэтому старые материалы очищаем после замены или размонтирования.
   */
  useEffect(() => {
    return () => {
      surfaceMaterial.dispose();
    };
  }, [surfaceMaterial]);

  useEffect(() => {
    return () => {
      atmosphereMaterial.dispose();
    };
  }, [atmosphereMaterial]);

  useFrame((state) => {
    if (!planetRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const safeSpeed = Math.max(speed, 0.2);

    planetRef.current.rotation.x = 0.08;
    planetRef.current.rotation.y = elapsed * 0.16 * safeSpeed;
    planetRef.current.rotation.z = -0.12;
  });

  return (
    <group ref={planetRef}>
      <mesh renderOrder={12}>
        <sphereGeometry args={[coreSize * 1.1, 96, 96]} />

        <primitive
          key={surfaceMaterial.uuid}
          object={surfaceMaterial}
          attach="material"
        />
      </mesh>

      <mesh renderOrder={13} scale={1.023}>
        <sphereGeometry args={[coreSize * 1.1, 96, 96]} />

        <primitive
          key={atmosphereMaterial.uuid}
          object={atmosphereMaterial}
          attach="material"
        />
      </mesh>
    </group>
  );
}