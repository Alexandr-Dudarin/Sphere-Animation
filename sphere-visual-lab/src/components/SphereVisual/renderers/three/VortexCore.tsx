import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SphereQuality,
} from '../../SphereVisual.types';

interface VortexCoreProps {
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

interface MotionSettings {
  swirlSpeed: number;
  pulse: number;
}

interface LayerConfig {
  z: number;
  scale: number;
  opacity: number;
  speed: number;
  direction: 1 | -1;
  twist: number;
  intensity: number;
  colorA: THREE.Color;
  colorB: THREE.Color;
  colorC: THREE.Color;
}

const modeSettings: Record<SphereMode, MotionSettings> = {
  idle: {
    swirlSpeed: 0.42,
    pulse: 0.34,
  },
  thinking: {
    swirlSpeed: 1,
    pulse: 0.88,
  },
  searching: {
    swirlSpeed: 1.24,
    pulse: 1,
  },
};

const glowBoostMap: Record<GlowIntensity, number> = {
  low: 0.82,
  medium: 1,
  high: 1.2,
};

const circleSegmentsMap: Record<SphereQuality, number> = {
  low: 96,
  medium: 128,
  high: 192,
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uTwist;
  uniform float uIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float ringBand(float r, float center, float width) {
    float d = abs(r - center);
    return 1.0 - smoothstep(width, width * 1.8, d);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y *= 1.04;

    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float t = uTime;

    float phaseA = a * (4.0 + uTwist * 0.6) - t * (1.4 + uTwist * 0.2);
    float phaseB = a * (7.0 + uTwist * 0.8) + t * (1.1 + uTwist * 0.22);

    float ring1Center = 0.56 + 0.05 * sin(phaseA + r * 8.0);
    float ring2Center = 0.36 + 0.045 * sin(phaseB - r * 10.0);
    float ring3Center = 0.2 + 0.03 * sin(phaseA * 1.4 + phaseB * 0.5);

    float ring1 = ringBand(r, ring1Center, 0.055);
    float ring2 = ringBand(r, ring2Center, 0.045);
    float ring3 = ringBand(r, ring3Center, 0.038);

    float ribbon1 = 0.5 + 0.5 * sin(a * 8.0 - r * 18.0 - t * (2.2 + uTwist * 0.18));
    float ribbon2 = 0.5 + 0.5 * sin(a * 11.0 + r * 14.0 + t * (1.7 + uTwist * 0.15));

    float structure =
      ring1 * mix(0.45, 1.0, ribbon1) +
      ring2 * mix(0.38, 0.95, ribbon2) +
      ring3 * mix(0.32, 0.88, ribbon1);

    float outerFade = 1.0 - smoothstep(0.86, 1.0, r);
    float innerHole = smoothstep(0.02, 0.09, r);
    float centerGlow = 1.0 - smoothstep(0.0, 0.16, r);

    float alpha = structure * outerFade * innerHole * uOpacity;
    alpha += centerGlow * 0.16 * uOpacity * uIntensity;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.2, 0.95, ribbon1));
    color = mix(color, uColorC, smoothstep(0.3, 0.95, ribbon2));
    color += uColorA * ring1 * 0.25 * uIntensity;
    color += uColorB * ring2 * 0.28 * uIntensity;
    color += uColorC * ring3 * 0.22 * uIntensity;
    color += vec3(1.0) * centerGlow * 0.06 * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

function createVortexMaterial(config: {
  opacity: number;
  twist: number;
  intensity: number;
  colorA: THREE.Color;
  colorB: THREE.Color;
  colorC: THREE.Color;
}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: config.opacity },
      uTwist: { value: config.twist },
      uIntensity: { value: config.intensity },
      uColorA: { value: config.colorA.clone() },
      uColorB: { value: config.colorB.clone() },
      uColorC: { value: config.colorC.clone() },
    },
    vertexShader,
    fragmentShader,
  });
}

export default function VortexCore({
  colors,
  mode,
  quality,
  glowIntensity,
  speed,
  reducedMotion,
}: VortexCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layerRefs = useRef<Array<THREE.Mesh | null>>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);

  const motion = modeSettings[mode];
  const safeSpeed = Math.max(speed, 0.15);
  const glowBoost = glowBoostMap[glowIntensity];
  const circleSegments = circleSegmentsMap[quality];

  const layerConfigs = useMemo<LayerConfig[]>(() => {
    return [
      {
        z: -0.14,
        scale: 1.18,
        opacity: 0.28 * glowBoost,
        speed: 0.92,
        direction: 1,
        twist: 0.9,
        intensity: 1.02,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.mint,
      },
      {
        z: 0,
        scale: 0.92,
        opacity: 0.26 * glowBoost,
        speed: 1.18,
        direction: -1,
        twist: 1.32,
        intensity: 1.16,
        colorA: colors.violet,
        colorB: colors.halo,
        colorC: colors.pink,
      },
      {
        z: 0.12,
        scale: 0.68,
        opacity: 0.24 * glowBoost,
        speed: 1.46,
        direction: 1,
        twist: 1.76,
        intensity: 1.26,
        colorA: colors.pink,
        colorB: colors.accent,
        colorC: colors.violet,
      },
    ];
  }, [colors, glowBoost]);

  const materials = useMemo(() => {
    return layerConfigs.map((layer) =>
      createVortexMaterial({
        opacity: layer.opacity,
        twist: layer.twist,
        intensity: layer.intensity,
        colorA: layer.colorA,
        colorB: layer.colorB,
        colorC: layer.colorC,
      }),
    );
  }, [layerConfigs]);

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const timeFactor = reducedMotion ? 0.2 : 1;

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z += delta * 0.12 * safeSpeed * motion.swirlSpeed;
      groupRef.current.rotation.y += delta * 0.08 * safeSpeed * motion.swirlSpeed;
    }

    materials.forEach((material, index) => {
      const layer = layerConfigs[index];
      material.uniforms.uTime.value =
        elapsed * safeSpeed * layer.speed * timeFactor;
    });

    layerRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const layer = layerConfigs[index];
      const breath =
        1 +
        Math.sin(elapsed * (1.1 + index * 0.16) * safeSpeed) *
          0.024 *
          motion.pulse;

      if (!reducedMotion) {
        mesh.rotation.z +=
          delta *
          layer.speed *
          safeSpeed *
          motion.swirlSpeed *
          layer.direction;

        mesh.rotation.x = Math.sin(elapsed * 0.34 + index * 0.6) * 0.04;
        mesh.rotation.y = Math.cos(elapsed * 0.3 + index * 0.52) * 0.04;

        mesh.position.z =
          layer.z + Math.sin(elapsed * (0.64 + index * 0.12)) * 0.008;
      }

      mesh.scale.setScalar(layer.scale * breath);
    });

    if (coreGlowRef.current) {
      const glowScale =
        1.08 + Math.sin(elapsed * 2.3 * safeSpeed) * 0.14 * motion.pulse;
      coreGlowRef.current.scale.setScalar(glowScale);
    }

    if (coreRef.current) {
      const coreScale =
        1 + Math.sin(elapsed * 3.1 * safeSpeed) * 0.09 * motion.pulse;
      coreRef.current.scale.setScalar(coreScale);
    }

    if (eyeRef.current) {
      const eyeScale =
        1 + Math.sin(elapsed * 1.6 * safeSpeed) * 0.035 * motion.pulse;
      eyeRef.current.scale.setScalar(eyeScale);
    }
  });

  return (
    <group ref={groupRef}>
      {layerConfigs.map((layer, index) => (
        <mesh
          key={`shader-layer-${index}`}
          ref={(mesh) => {
            layerRefs.current[index] = mesh;
          }}
          position={[0, 0, layer.z]}
          scale={layer.scale}
        >
          <circleGeometry args={[1, circleSegments]} />
          <primitive object={materials[index]} attach="material" />
        </mesh>
      ))}

      <mesh ref={eyeRef}>
        <sphereGeometry args={[0.18, 28, 28]} />
        <meshBasicMaterial
          color="#07101d"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[0.28, 28, 28]} />
        <meshBasicMaterial
          color={colors.halo}
          transparent
          opacity={0.3 * glowBoost}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial
          color={colors.white}
          emissive={colors.accent}
          emissiveIntensity={3.5 * glowBoost}
          roughness={0.08}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}