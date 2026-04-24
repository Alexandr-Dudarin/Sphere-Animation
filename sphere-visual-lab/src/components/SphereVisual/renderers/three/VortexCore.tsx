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
    pulse: 0.94,
  },
  searching: {
    swirlSpeed: 1.26,
    pulse: 1,
  },
};

const glowBoostMap: Record<GlowIntensity, number> = {
  low: 0.82,
  medium: 1,
  high: 1.24,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 80,
  medium: 128,
  high: 192,
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

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  float ringBand(float r, float center, float width) {
    float d = abs(r - center);
    return 1.0 - smoothstep(width, width * 1.75, d);
  }

  float thread(float signal, float width) {
    return 1.0 - smoothstep(width, width * 2.0, abs(signal));
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y *= 1.04;

    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float t = uTime;

    vec2 polar = vec2(cos(a), sin(a)) * r;
    float n = fbm(polar * 3.8 + vec2(t * 0.08, -t * 0.06));

    float bandOuter = ringBand(r, 0.86 + 0.018 * sin(t * 0.50 + n), 0.066);
    float bandMid   = ringBand(r, 0.66 + 0.020 * sin(t * 0.70 - n), 0.054);
    float bandInner = ringBand(r, 0.48 + 0.016 * sin(t * 0.92 + n * 1.1), 0.042);
    float bandCore  = ringBand(r, 0.31 + 0.012 * sin(t * 1.16 - n * 1.2), 0.030);
    float rimBand   = ringBand(r, 0.95 + 0.008 * sin(a * 6.0 + t * 0.70 + n), 0.016);

    float s1 = sin(
      a * (6.8 + uTwist * 0.42) -
      r * (18.0 + uTwist * 2.0) -
      t * (2.15 + uTwist * 0.12) +
      n * 2.0
    );

    float s2 = sin(
      a * (9.6 + uTwist * 0.34) +
      r * (15.0 + uTwist * 1.2) +
      t * (1.80 + uTwist * 0.10) -
      n * 1.6
    );

    float s3 = sin(
      a * (13.0 + uTwist * 0.24) -
      r * (24.5 + uTwist * 1.6) -
      t * (2.70 + uTwist * 0.14) +
      n * 2.2
    );

    float s4 = sin(
      a * (7.6 + uTwist * 0.18) -
      r * 12.0 +
      t * 1.10 -
      n * 1.1
    );

    float outerThreadA = thread(s1, 0.090);
    float outerThreadB = thread(s3, 0.082);

    float midThreadA = thread(s2, 0.090);
    float midThreadB = thread(s1 * 0.82 + s4 * 0.18, 0.078);

    float innerThreadA = thread(s3, 0.074);
    float innerThreadB = thread(s2 * 0.70 + s4 * 0.30, 0.070);

    float coreThread = thread(s4, 0.080);

    float outerArcs = bandOuter * max(outerThreadA, outerThreadB * 0.92);
    float midArcs   = bandMid * max(midThreadA, midThreadB * 0.90);
    float innerArcs = bandInner * max(innerThreadA, innerThreadB * 0.88);
    float coreArcs  = bandCore * coreThread * 0.56;

    float rimThreads =
      rimBand *
      thread(
        sin(a * 15.0 - t * 2.30 + n * 1.8),
        0.070
      );

    float bridgeArcs =
      smoothstep(
        0.78,
        0.98,
        outerThreadA * 0.32 + midThreadA * 0.38 + innerThreadA * 0.30
      ) *
      smoothstep(0.24, 0.90, r) *
      (1.0 - smoothstep(0.95, 1.04, r));

    float centerMist =
      (1.0 - smoothstep(0.0, 0.14, r)) *
      smoothstep(0.46, 0.82, 0.5 + 0.5 * sin(a * 4.0 + t * 0.92 - n));

    float structure =
      outerArcs * 1.04 +
      midArcs * 1.00 +
      innerArcs * 0.92 +
      coreArcs * 0.48 +
      rimThreads * 0.30 +
      bridgeArcs * 0.10 +
      centerMist * 0.03;

    float outerFade = 1.0 - smoothstep(0.995, 1.05, r);
    float innerFade = smoothstep(0.0, 0.018, r);

    float fresnel = pow(1.0 - abs(vNormalW.z), 1.9);

    float alpha = structure * outerFade * innerFade * uOpacity;
    alpha += rimThreads * 0.05 * uOpacity * uIntensity;
    alpha += centerMist * 0.015 * uOpacity * uIntensity;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.20, 0.95, outerThreadA));
    color = mix(color, uColorC, smoothstep(0.20, 0.95, midThreadA));

    color += uColorA * outerArcs * 0.36 * uIntensity;
    color += uColorB * midArcs   * 0.36 * uIntensity;
    color += uColorC * innerArcs * 0.32 * uIntensity;
    color += uColorA * coreArcs  * 0.14 * uIntensity;
    color += uColorA * rimThreads * 0.18 * uIntensity;
    color += uColorC * bridgeArcs * 0.05 * uIntensity;
    color += uColorA * fresnel * 0.07 * uIntensity;
    color += vec3(1.0) * centerMist * 0.01 * uIntensity;

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

  const motion = modeSettings[mode];
  const glowBoost = glowBoostMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);
  const segments = segmentMap[quality];

  const layerConfigs = useMemo<LayerConfig[]>(() => {
    return [
      {
        scale: 1.22,
        opacity: 0.095 * glowBoost,
        speed: 0.42,
        twist: 0.26,
        intensity: 0.72,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 1.12,
        opacity: 0.125 * glowBoost,
        speed: 0.58,
        twist: 0.50,
        intensity: 0.88,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.mint,
      },
      {
        scale: 1.03,
        opacity: 0.15 * glowBoost,
        speed: 0.82,
        twist: 0.84,
        intensity: 1.02,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.93,
        opacity: 0.17 * glowBoost,
        speed: 1.06,
        twist: 1.16,
        intensity: 1.14,
        colorA: colors.violet,
        colorB: colors.halo,
        colorC: colors.pink,
      },
      {
        scale: 0.83,
        opacity: 0.155 * glowBoost,
        speed: 1.32,
        twist: 1.48,
        intensity: 1.22,
        colorA: colors.pink,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.72,
        opacity: 0.115 * glowBoost,
        speed: 1.60,
        twist: 1.82,
        intensity: 1.24,
        colorA: colors.mint,
        colorB: colors.halo,
        colorC: colors.accent,
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
      groupRef.current.rotation.y += delta * 0.044 * safeSpeed * motion.swirlSpeed;
      groupRef.current.rotation.z += delta * 0.030 * safeSpeed * motion.swirlSpeed;
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
        Math.sin(elapsed * (0.90 + index * 0.15) * safeSpeed) *
          0.012 *
          motion.pulse;

      if (!reducedMotion) {
        mesh.rotation.y += delta * 0.020 * safeSpeed * layer.speed;
        mesh.rotation.z +=
          delta *
          0.032 *
          safeSpeed *
          layer.speed *
          (index % 2 === 0 ? 1 : -1);
      }

      mesh.scale.setScalar(layer.scale * breath);
    });
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
    </group>
  );
}