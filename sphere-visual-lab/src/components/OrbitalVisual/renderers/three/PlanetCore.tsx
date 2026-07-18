import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
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
    vec3 lightDirection = normalize(vec3(-0.58, 0.42, 0.72));

    float diffuse = dot(normal, lightDirection);
    float daylight = smoothstep(-0.18, 0.82, diffuse);
    float terminator = smoothstep(-0.14, 0.16, diffuse);

    vec3 spherePosition = normalize(vObjectPosition);

    float broadNoise = fbm(spherePosition * 3.35 + vec3(0.35, 1.2, -0.8));
    float detailNoise = fbm(spherePosition * 8.4 + vec3(-1.4, 0.6, 1.1));

    float latitudeBand =
      0.5 +
      0.5 *
        sin(
          spherePosition.y * 22.0 +
          broadNoise * 4.2 +
          spherePosition.x * 1.6
        );

    float cloudMask = smoothstep(
      0.54,
      0.82,
      broadNoise * 0.72 + detailNoise * 0.28 + latitudeBand * 0.12
    );

    float darkerPatch = smoothstep(
      0.34,
      0.7,
      detailNoise * 0.68 + (1.0 - broadNoise) * 0.32
    );

    vec3 nightColor = mix(
      uAccentColor * 0.1,
      uCoreColor * 0.2,
      broadNoise
    );

    vec3 oceanColor = mix(
      uAccentColor * 0.42,
      uCoreColor * 0.92,
      0.32 + broadNoise * 0.68
    );

    vec3 cloudColor = mix(
      uGlowColor,
      uHotColor,
      0.22
    );

    vec3 surfaceColor = mix(
      oceanColor,
      cloudColor,
      cloudMask * 0.28
    );

    surfaceColor *= 0.82 + latitudeBand * 0.16;
    surfaceColor = mix(
      surfaceColor,
      uAccentColor * 0.34,
      darkerPatch * 0.17
    );

    vec3 litSurface = mix(
      nightColor,
      surfaceColor,
      0.18 + daylight * 0.82
    );

    litSurface *= 0.34 + terminator * 0.66;

    vec3 halfVector = normalize(lightDirection + viewDirection);
    float specular = pow(max(dot(normal, halfVector), 0.0), 34.0);

    float rim = pow(
      1.0 - max(dot(normal, viewDirection), 0.0),
      3.15
    );

    vec3 rimColor = mix(uAccentColor, uGlowColor, 0.72);

    vec3 finalColor =
      litSurface +
      uHotColor * specular * 0.15 +
      rimColor * rim * 0.24 * uGlowFactor * (0.45 + daylight * 0.55);

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

    float rim = pow(
      1.0 - max(dot(normal, viewDirection), 0.0),
      3.4
    );

    vec3 atmosphereColor = mix(
      uAccentColor,
      uGlowColor,
      0.68
    );

    float alpha = rim * 0.12 * uGlowFactor;

    gl_FragColor = vec4(
      atmosphereColor * rim * 0.72,
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
        <shaderMaterial
          uniforms={surfaceUniforms}
          vertexShader={PLANET_VERTEX_SHADER}
          fragmentShader={PLANET_FRAGMENT_SHADER}
          depthWrite
          depthTest
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>

      <mesh renderOrder={13} scale={1.025}>
        <sphereGeometry args={[coreSize * 1.1, 96, 96]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          depthTest
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}