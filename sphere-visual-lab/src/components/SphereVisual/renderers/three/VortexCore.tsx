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
  scale: number;
  opacity: number;
  speed: number;
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
    pulse: 0.9,
  },
  searching: {
    swirlSpeed: 1.24,
    pulse: 1,
  },
};

const glowBoostMap: Record<GlowIntensity, number> = {
  low: 0.82,
  medium: 1,
  high: 1.22,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 72,
  medium: 112,
  high: 160,
};

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vUv = uv;
    vNormalW = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormalW;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uTwist;
  uniform float uIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  float ringBand(float r, float center, float width) {
    float d = abs(r - center);
    return 1.0 - smoothstep(width, width * 1.9, d);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y *= 1.04;

    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float t = uTime;

    float flowA = sin(a * (4.0 + uTwist * 0.45) - r * (10.0 + uTwist * 1.8) + t * (1.5 + uTwist * 0.18));
    float flowB = sin(a * (8.5 + uTwist * 0.6) + r * (8.0 + uTwist * 0.8) - t * (2.2 + uTwist * 0.22));
    float flowC = sin(a * 13.0 - r * 18.0 + t * 1.15);

    float bandOuter = ringBand(r, 0.72 + 0.035 * flowA, 0.07);
    float bandMid   = ringBand(r, 0.50 + 0.035 * flowB, 0.055);
    float bandInner = ringBand(r, 0.30 + 0.025 * flowC, 0.04);
    float bandCore  = ringBand(r, 0.16 + 0.018 * flowA, 0.028);

    float edgeBand  = ringBand(r, 0.88 + 0.018 * sin(a * 7.0 + t * 0.9), 0.035);

    float ribbon1 = 0.5 + 0.5 * sin(a * 7.0 - r * 15.0 - t * (1.9 + uTwist * 0.14));
    float ribbon2 = 0.5 + 0.5 * sin(a * 10.0 + r * 12.0 + t * (1.45 + uTwist * 0.12));
    float ribbon3 = 0.5 + 0.5 * sin(a * 5.0 - r * 8.0 + t * 0.9);

    float fill = smoothstep(0.18, 0.96, ribbon1 * 0.42 + ribbon2 * 0.38 + ribbon3 * 0.2);

    float structure =
      bandOuter * mix(0.4, 1.0, ribbon1) +
      bandMid   * mix(0.36, 0.92, ribbon2) +
      bandInner * mix(0.3, 0.88, ribbon3) +
      bandCore  * 0.6 +
      edgeBand  * 0.28 +
      fill      * 0.12;

    float outerFade = 1.0 - smoothstep(0.98, 1.03, r);
    float innerHole = smoothstep(0.01, 0.05, r);
    float centerGlow = 1.0 - smoothstep(0.0, 0.14, r);

    float fresnel = pow(1.0 - abs(vNormalW.z), 1.9);

    float alpha = structure * outerFade * innerHole * uOpacity;
    alpha += edgeBand * 0.08 * uOpacity * uIntensity;
    alpha += centerGlow * 0.12 * uOpacity * uIntensity;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.2, 0.95, ribbon1));
    color = mix(color, uColorC, smoothstep(0.24, 0.95, ribbon2));

    color += uColorA * bandOuter * 0.22 * uIntensity;
    color += uColorB * bandMid   * 0.28 * uIntensity;
    color += uColorC * bandInner * 0.24 * uIntensity;
    color += uColorA * edgeBand  * 0.16 * uIntensity;
    color += uColorB * bandCore  * 0.34 * uIntensity;
    color += uColorA * fresnel   * 0.06 * uIntensity;
    color += vec3(1.0) * centerGlow * 0.05 * uIntensity;

    gl_FragColor = vec4(color, alpha);
  }
`;

function createSphereMaterial(config: {
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
    side: THREE.FrontSide,
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
  const shellRefs = useRef<Array<THREE.Mesh | null>>([]);
  const coreGlowRef = useRef<THREE.Mesh>(null);
  const eyeRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const motion = modeSettings[mode];
  const glowBoost = glowBoostMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);
  const segments = segmentMap[quality];

  const layerConfigs = useMemo<LayerConfig[]>(() => {
    return [
      {
        scale: 1.08,
        opacity: 0.16 * glowBoost,
        speed: 0.7,
        twist: 0.62,
        intensity: 0.86,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.98,
        opacity: 0.2 * glowBoost,
        speed: 0.96,
        twist: 0.95,
        intensity: 1.0,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.mint,
      },
      {
        scale: 0.84,
        opacity: 0.18 * glowBoost,
        speed: 1.22,
        twist: 1.34,
        intensity: 1.12,
        colorA: colors.violet,
        colorB: colors.halo,
        colorC: colors.pink,
      },
      {
        scale: 0.7,
        opacity: 0.16 * glowBoost,
        speed: 1.52,
        twist: 1.76,
        intensity: 1.2,
        colorA: colors.pink,
        colorB: colors.accent,
        colorC: colors.violet,
      },
    ];
  }, [colors, glowBoost]);

  const materials = useMemo(() => {
    return layerConfigs.map((layer) =>
      createSphereMaterial({
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
      groupRef.current.rotation.y += delta * 0.06 * safeSpeed * motion.swirlSpeed;
      groupRef.current.rotation.z += delta * 0.04 * safeSpeed * motion.swirlSpeed;
    }

    materials.forEach((material, index) => {
      const layer = layerConfigs[index];
      material.uniforms.uTime.value =
        elapsed * safeSpeed * layer.speed * timeFactor;
    });

    shellRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const layer = layerConfigs[index];
      const breath =
        1 +
        Math.sin(elapsed * (1.0 + index * 0.18) * safeSpeed) *
          0.018 *
          motion.pulse;

      if (!reducedMotion) {
        mesh.rotation.y += delta * 0.03 * safeSpeed * layer.speed;
        mesh.rotation.z += delta * 0.05 * safeSpeed * layer.speed * (index % 2 === 0 ? 1 : -1);
      }

      mesh.scale.setScalar(layer.scale * breath);
    });

    if (coreGlowRef.current) {
      const glowScale =
        1.06 + Math.sin(elapsed * 2.15 * safeSpeed) * 0.12 * motion.pulse;
      coreGlowRef.current.scale.setScalar(glowScale);
    }

    if (eyeRef.current) {
      const eyeScale =
        1 + Math.sin(elapsed * 1.55 * safeSpeed) * 0.028 * motion.pulse;
      eyeRef.current.scale.setScalar(eyeScale);
    }

    if (coreRef.current) {
      const coreScale =
        1 + Math.sin(elapsed * 2.95 * safeSpeed) * 0.08 * motion.pulse;
      coreRef.current.scale.setScalar(coreScale);
    }
  });

  return (
    <group ref={groupRef}>
      {layerConfigs.map((layer, index) => (
        <mesh
          key={`sphere-layer-${index}`}
          ref={(mesh) => {
            shellRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.98, segments, segments]} />
          <primitive object={materials[index]} attach="material" />
        </mesh>
      ))}

      <mesh ref={eyeRef}>
        <sphereGeometry args={[0.17, 28, 28]} />
        <meshBasicMaterial
          color="#07101d"
          transparent
          opacity={0.86}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[0.26, 28, 28]} />
        <meshBasicMaterial
          color={colors.halo}
          transparent
          opacity={0.28 * glowBoost}
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