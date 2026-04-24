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

  float sharpPulse(float x, float power) {
    return pow(clamp(x, 0.0, 1.0), power);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y *= 1.04;

    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float t = uTime;

    vec2 polar = vec2(cos(a), sin(a)) * r;
    float n = fbm(polar * 3.9 + vec2(t * 0.09, -t * 0.07));

    float spiralA = 0.5 + 0.5 * sin(
      a * (6.4 + uTwist * 0.45) -
      r * (18.0 + uTwist * 2.1) -
      t * (2.15 + uTwist * 0.14) +
      n * 2.2
    );

    float spiralB = 0.5 + 0.5 * sin(
      a * (9.1 + uTwist * 0.38) +
      r * (14.5 + uTwist * 1.2) +
      t * (1.75 + uTwist * 0.12) -
      n * 1.8
    );

    float spiralC = 0.5 + 0.5 * sin(
      a * (12.6 + uTwist * 0.26) -
      r * (23.5 + uTwist * 1.6) -
      t * (2.6 + uTwist * 0.16) +
      n * 2.4
    );

    float spiralD = 0.5 + 0.5 * sin(
      a * (7.4 + uTwist * 0.22) -
      r * 11.5 +
      t * 1.1 -
      n * 1.2
    );

    float bandOuter = ringBand(r, 0.86 + 0.024 * sin(t * 0.42 + n), 0.068);
    float bandMid   = ringBand(r, 0.66 + 0.028 * sin(t * 0.55 - n), 0.056);
    float bandInner = ringBand(r, 0.48 + 0.022 * sin(t * 0.72 + n * 1.2), 0.044);
    float bandCore  = ringBand(r, 0.30 + 0.016 * sin(t * 0.95 - n * 1.3), 0.032);
    float rimBand   = ringBand(r, 0.95 + 0.010 * sin(a * 5.5 + t * 0.68 + n), 0.018);

    float filamentA = sharpPulse(spiralA, 5.4);
    float filamentB = sharpPulse(spiralB, 5.8);
    float filamentC = sharpPulse(spiralC, 6.0);
    float filamentD = sharpPulse(spiralD, 4.4);

    float arcOuter = bandOuter * filamentA;
    float arcMid   = bandMid * filamentB;
    float arcInner = bandInner * filamentC;
    float arcCore  = bandCore * filamentD * 0.68;

    float rimArcs = rimBand * sharpPulse(
      0.5 + 0.5 * sin(a * 16.0 - t * 2.35 + n * 2.0),
      6.0
    );

    float bridgeField =
      smoothstep(
        0.72,
        0.98,
        filamentA * 0.34 + filamentB * 0.38 + filamentC * 0.28
      ) *
      smoothstep(0.20, 0.90, r) *
      (1.0 - smoothstep(0.96, 1.05, r));

    float outerSweep =
      smoothstep(0.60, 0.96, 0.5 + 0.5 * sin(a * 3.1 - t * 0.54 + n * 1.7)) *
      smoothstep(0.58, 0.92, r) *
      (1.0 - smoothstep(0.96, 1.05, r));

    float centerSpiral =
      smoothstep(0.05, 0.22, r) *
      (1.0 - smoothstep(0.22, 0.40, r)) *
      sharpPulse(
        0.5 + 0.5 * sin(a * (7.0 + uTwist * 0.12) - r * 11.5 - t * 1.7 + n * 1.3),
        4.0
      );

    float centerMist =
      (1.0 - smoothstep(0.0, 0.16, r)) *
      smoothstep(0.40, 0.82, 0.5 + 0.5 * sin(a * 4.2 + t * 0.95 - n * 1.0));

    float structure =
      arcOuter * 1.00 +
      arcMid * 0.96 +
      arcInner * 0.88 +
      arcCore * 0.62 +
      rimArcs * 0.34 +
      bridgeField * 0.18 +
      outerSweep * 0.10 +
      centerSpiral * 0.16 +
      centerMist * 0.05;

    float outerFade = 1.0 - smoothstep(0.995, 1.05, r);
    float innerFade = smoothstep(0.0, 0.018, r);

    float fresnel = pow(1.0 - abs(vNormalW.z), 1.9);

    float alpha = structure * outerFade * innerFade * uOpacity;
    alpha += rimArcs * 0.05 * uOpacity * uIntensity;
    alpha += centerSpiral * 0.03 * uOpacity * uIntensity;
    alpha += centerMist * 0.02 * uOpacity * uIntensity;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.20, 0.95, spiralA));
    color = mix(color, uColorC, smoothstep(0.24, 0.95, spiralB));

    color += uColorA * arcOuter * 0.30 * uIntensity;
    color += uColorB * arcMid   * 0.32 * uIntensity;
    color += uColorC * arcInner * 0.28 * uIntensity;
    color += uColorA * arcCore  * 0.14 * uIntensity;
    color += uColorA * rimArcs  * 0.14 * uIntensity;
    color += uColorC * bridgeField * 0.06 * uIntensity;
    color += uColorA * fresnel  * 0.06 * uIntensity;
    color += vec3(1.0) * centerMist * 0.015 * uIntensity;

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
        opacity: 0.085 * glowBoost,
        speed: 0.42,
        twist: 0.26,
        intensity: 0.66,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 1.12,
        opacity: 0.11 * glowBoost,
        speed: 0.58,
        twist: 0.50,
        intensity: 0.82,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.mint,
      },
      {
        scale: 1.03,
        opacity: 0.135 * glowBoost,
        speed: 0.82,
        twist: 0.84,
        intensity: 0.96,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.93,
        opacity: 0.155 * glowBoost,
        speed: 1.06,
        twist: 1.16,
        intensity: 1.08,
        colorA: colors.violet,
        colorB: colors.halo,
        colorC: colors.pink,
      },
      {
        scale: 0.83,
        opacity: 0.14 * glowBoost,
        speed: 1.32,
        twist: 1.48,
        intensity: 1.16,
        colorA: colors.pink,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.72,
        opacity: 0.10 * glowBoost,
        speed: 1.60,
        twist: 1.82,
        intensity: 1.20,
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