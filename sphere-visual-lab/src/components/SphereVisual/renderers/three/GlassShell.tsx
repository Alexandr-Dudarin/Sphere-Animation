import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface GlassShellColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface GlassShellProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: GlassShellColors;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.2;
    default:
      return 1;
  }
}

const VERTEX_SHADER = `
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vLocalPos;

  void main() {
    vLocalPos = normalize(position);

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uHalo;
  uniform vec3 uMint;
  uniform vec3 uViolet;
  uniform vec3 uPink;
  uniform vec3 uWhite;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vLocalPos;

  float angleDelta(float a, float b) {
    return abs(atan(sin(a - b), cos(a - b)));
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);

    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 3.05);

    float rim = smoothstep(0.04, 0.98, fresnel);
    float body = smoothstep(0.03, 0.26, fresnel) * 0.055;

    float angle = atan(vLocalPos.y, vLocalPos.x);
    float bandA = 0.5 + 0.5 * sin(angle * 2.4 + vLocalPos.z * 4.6 + uTime * 0.34);
    float bandB = 0.5 + 0.5 * sin(angle * 3.3 - uTime * 0.42 + vLocalPos.z * 5.2);

    vec3 spectralA = mix(uHalo, uMint, 0.52);
    vec3 spectralB = mix(uViolet, uPink, 0.42);
    vec3 spectral = mix(spectralA, spectralB, bandA * 0.58 + bandB * 0.18);

    float travelA = exp(-pow(angleDelta(angle, uTime * 0.36 + vLocalPos.z * 0.38) / 0.62, 2.0));
    float travelB = exp(-pow(angleDelta(angle, -uTime * 0.28 + 1.9 + vLocalPos.z * 0.22) / 0.44, 2.0));

    float movingHighlight = rim * (travelA * 0.34 + travelB * 0.18);
    float sparkle = 0.5 + 0.5 * sin(angle * 5.0 - uTime * 0.8 + vLocalPos.z * 6.0);

    vec3 color = spectral * (rim * 0.76 + body * 0.22);
    color += uWhite * movingHighlight * (0.62 + sparkle * 0.18);
    color += mix(uMint, uWhite, 0.28) * rim * 0.08;

    float alpha = uOpacity * clamp(
      rim * 0.84 +
      body * 0.2 +
      movingHighlight * 0.22,
      0.0,
      1.0
    );

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function GlassShell({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: GlassShellProps) {
  const shellMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const innerVeilMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerAuraMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const innerVeilColor = useMemo(() => {
    return colors.halo.clone().lerp(colors.mint, 0.14);
  }, [colors]);

  const outerAuraColor = useMemo(() => {
    return colors.halo.clone().lerp(colors.violet, 0.18);
  }, [colors]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.3 * glowFactor },
      uHalo: { value: colors.halo.clone().lerp(colors.white, 0.05) },
      uMint: { value: colors.mint.clone() },
      uViolet: { value: colors.violet.clone() },
      uPink: { value: colors.pink.clone() },
      uWhite: { value: colors.white.clone() },
    }),
    [colors, glowFactor],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.38 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (shellMaterialRef.current) {
      shellMaterialRef.current.uniforms.uTime.value =
        elapsed * safeSpeed * motionFactor;

      shellMaterialRef.current.uniforms.uOpacity.value =
        0.3 *
        glowFactor *
        (0.975 + Math.sin(elapsed * 0.72 * motionFactor) * 0.025);
    }

    if (innerVeilMaterialRef.current) {
      innerVeilMaterialRef.current.opacity =
        0.032 *
        glowFactor *
        (0.97 + Math.sin(elapsed * 0.46 * motionFactor + 0.7) * 0.03);
    }

    if (outerAuraMaterialRef.current) {
      outerAuraMaterialRef.current.opacity =
        0.012 *
        glowFactor *
        (0.98 + Math.sin(elapsed * 0.54 * motionFactor + 1.2) * 0.02);
    }
  });

  return (
    <group>
      {/* Внутренняя мягкая вуаль */}
      <mesh renderOrder={37}>
        <sphereGeometry args={[1.035, 52, 52]} />
        <meshBasicMaterial
          ref={innerVeilMaterialRef}
          color={innerVeilColor}
          transparent
          opacity={0.032 * glowFactor}
          depthWrite={false}
          toneMapped={false}
          side={THREE.FrontSide}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Основная стеклянная оболочка */}
      <mesh renderOrder={40}>
        <sphereGeometry args={[1.092, 72, 72]} />
        <shaderMaterial
          ref={shellMaterialRef}
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Очень мягкий внешний воздух, без явного кольца */}
      <mesh renderOrder={41}>
        <sphereGeometry args={[1.128, 52, 52]} />
        <meshBasicMaterial
          ref={outerAuraMaterialRef}
          color={outerAuraColor}
          transparent
          opacity={0.012 * glowFactor}
          depthWrite={false}
          toneMapped={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}