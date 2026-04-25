import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type ShellColors = {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
};

type GlassShellProps = {
  colors?: Partial<ShellColors>;
  glowIntensity?: 'low' | 'medium' | 'high' | number;
  reducedMotion?: boolean;
  speed?: number;
};

function resolveGlowFactor(glowIntensity: GlassShellProps['glowIntensity']) {
  if (typeof glowIntensity === 'number') {
    return THREE.MathUtils.clamp(glowIntensity, 0.5, 2);
  }

  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.28;
    case 'medium':
    default:
      return 1;
  }
}

const vertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);

    vWorldNormal = worldNormal;
    vViewDir = normalize(cameraPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  uniform float uGlow;
  uniform float uTime;

  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0), 2.7);
    float softPulse = 0.94 + 0.06 * sin(uTime * 0.8);

    vec3 color = mix(uColor, uAccent, 0.28 + fresnel * 0.32);
    float alpha = fresnel * uOpacity * softPulse * (0.85 + 0.15 * uGlow);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function GlassShell({
  colors,
  glowIntensity = 'medium',
  reducedMotion = false,
  speed = 1,
}: GlassShellProps) {
  const groupRef = useRef<THREE.Group>(null);

  const glow = resolveGlowFactor(glowIntensity);

  const glassColor = useMemo(() => {
    const base = (colors?.white ?? new THREE.Color('#ffffff')).clone();
    const halo = (colors?.halo ?? new THREE.Color('#8EEBFF')).clone();

    return base.lerp(halo, 0.18);
  }, [colors]);

  const rimColor = useMemo(() => {
    const halo = (colors?.halo ?? new THREE.Color('#8EEBFF')).clone();
    const pink = (colors?.pink ?? new THREE.Color('#FF8BEF')).clone();

    return halo.lerp(pink, 0.18);
  }, [colors]);

  const accentColor = useMemo(() => {
    const violet = (colors?.violet ?? new THREE.Color('#A88BFF')).clone();
    const mint = (colors?.mint ?? new THREE.Color('#8FFFE1')).clone();

    return violet.lerp(mint, 0.32);
  }, [colors]);

  const rimMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: rimColor },
        uAccent: { value: accentColor },
        uOpacity: { value: 0.18 * glow },
        uGlow: { value: glow },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide,
    });
  }, [accentColor, glow, rimColor]);

  useEffect(() => {
    return () => {
      rimMaterial.dispose();
    };
  }, [rimMaterial]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime() * speed * (reducedMotion ? 0.18 : 1);

    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.04;
    groupRef.current.rotation.x = Math.cos(t * 0.09) * 0.025;

    rimMaterial.uniforms.uTime.value = t;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.03, 72, 72]} />
        <meshPhysicalMaterial
          color={glassColor}
          transparent
          opacity={0.2}
          transmission={1}
          thickness={0.75}
          ior={1.12}
          roughness={0.18}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={0.45}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.012}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial
          color={colors?.halo ?? new THREE.Color('#8EEBFF')}
          transparent
          opacity={0.02 * glow}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={1.028}>
        <sphereGeometry args={[1.03, 72, 72]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>
    </group>
  );
}