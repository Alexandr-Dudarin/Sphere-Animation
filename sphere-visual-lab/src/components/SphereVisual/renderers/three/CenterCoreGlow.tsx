import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface CenterCoreColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface CenterCoreGlowProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: CenterCoreColors;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.8;
    case 'high':
      return 1.16;
    default:
      return 1;
  }
}

const VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURA_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float a = atan(p.y, p.x);

    float baseMask = smoothstep(1.0, 0.08, r);
    float petalHint = 0.5 + 0.5 * cos(a * 8.0);
    float swirl = 0.5 + 0.5 * sin(a * 3.0 - r * 7.5 + uTime * 0.22);
    float inner = exp(-pow(r / 0.7, 2.4));

    vec3 color = mix(uColorA, uColorB, petalHint * 0.72);
    color = mix(color, uColorC, swirl * 0.38);

    float alpha =
      uOpacity *
      baseMask *
      inner *
      (0.7 + 0.3 * petalHint);

    gl_FragColor = vec4(color, alpha);
  }
`;

const CORE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);

    float softCore = exp(-pow(r / 0.48, 2.6));
    float softBloom = exp(-pow(r / 0.78, 2.2)) * 0.55;
    float drift = 0.96 + 0.04 * sin(uTime * 0.45 - r * 4.0);

    vec3 color = mix(uColorA, uColorB, 0.38 + 0.18 * sin(uTime * 0.18));
    float alpha = uOpacity * (softCore * 0.7 + softBloom * 0.3) * drift;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function CenterCoreGlow({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: CenterCoreGlowProps) {
  const rootRef = useRef<THREE.Group>(null);
  const auraMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const coreMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const auraUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.22 * glowFactor },
      uColorA: {
        value: colors.mint.clone().lerp(colors.halo, 0.35),
      },
      uColorB: {
        value: colors.violet.clone().lerp(colors.pink, 0.26),
      },
      uColorC: {
        value: colors.accent.clone().lerp(colors.mint, 0.22),
      },
    }),
    [colors, glowFactor],
  );

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0.16 * glowFactor },
      uColorA: {
        value: colors.white.clone().lerp(colors.mint, 0.26),
      },
      uColorB: {
        value: colors.violet.clone().lerp(colors.white, 0.52),
      },
    }),
    [colors, glowFactor],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.45 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (rootRef.current) {
      const breath =
        1 + Math.sin(elapsed * 0.82 * motionFactor) * 0.012 * motionFactor;
      rootRef.current.scale.setScalar(breath);
      rootRef.current.rotation.z =
        Math.sin(elapsed * 0.18 * safeSpeed * motionFactor) * 0.025;
    }

    if (auraMaterialRef.current) {
      auraMaterialRef.current.uniforms.uTime.value =
        elapsed * safeSpeed * motionFactor;

      auraMaterialRef.current.uniforms.uOpacity.value =
        0.22 *
        glowFactor *
        (0.95 + Math.sin(elapsed * 0.52 * motionFactor) * 0.05);
    }

    if (coreMaterialRef.current) {
      coreMaterialRef.current.uniforms.uTime.value =
        elapsed * safeSpeed * motionFactor;

      coreMaterialRef.current.uniforms.uOpacity.value =
        0.16 *
        glowFactor *
        (0.97 + Math.sin(elapsed * 0.44 * motionFactor + 0.6) * 0.03);
    }
  });

  return (
    <group ref={rootRef} renderOrder={16}>
      <mesh position={[0, 0, -0.05]} renderOrder={16}>
        <planeGeometry args={[1.9, 1.9]} />
        <shaderMaterial
          ref={auraMaterialRef}
          uniforms={auraUniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={AURA_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, 0, -0.01]} renderOrder={17}>
        <planeGeometry args={[1.04, 1.04]} />
        <shaderMaterial
          ref={coreMaterialRef}
          uniforms={coreUniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={CORE_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}