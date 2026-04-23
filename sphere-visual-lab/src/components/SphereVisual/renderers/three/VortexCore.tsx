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
    return 1.0 - smoothstep(width, width * 1.9, d);
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
    float n = fbm(polar * 4.0 + vec2(t * 0.09, -t * 0.07));

    float flowA = sin(a * (4.1 + uTwist * 0.34) - r * (10.4 + uTwist * 1.5) + t * (1.45 + uTwist * 0.15) + n * 1.25);
    float flowB = sin(a * (8.0 + uTwist * 0.46) + r * (9.0 + uTwist * 0.55) - t * (2.0 + uTwist * 0.16) + n * 1.0);
    float flowC = sin(a * 11.2 - r * 16.8 + t * 0.95 - n * 0.9);
    float flowD = sin(a * 6.2 - r * 11.0 - t * 1.25 + n * 1.15);

    float bandOuter = ringBand(r, 0.84 + 0.032 * flowA, 0.078);
    float bandMid   = ringBand(r, 0.63 + 0.030 * flowB, 0.058);
    float bandInner = ringBand(r, 0.43 + 0.022 * flowC, 0.042);
    float bandCore  = ringBand(r, 0.26 + 0.016 * flowD, 0.028);
    float rimBand   = ringBand(r, 0.95 + 0.010 * sin(a * 5.0 + t * 0.65 + n), 0.020);

    float lineA = 0.5 + 0.5 * sin(a * 12.0 - r * 24.0 - t * 2.35 + n * 2.3);
    float lineB = 0.5 + 0.5 * sin(a * 9.0 + r * 15.5 + t * 1.85 - n * 1.8);
    float lineC = 0.5 + 0.5 * sin(a * 6.5 - r * 10.2 + t * 1.05 + n * 1.3);
    float lineD = 0.5 + 0.5 * sin(a * 14.0 - r * 20.0 + t * 2.15 - n * 2.0);

    float filamentA = sharpPulse(lineA, 5.0);
    float filamentB = sharpPulse(lineB, 5.4);
    float filamentC = sharpPulse(lineC, 4.4);
    float filamentD = sharpPulse(lineD, 5.8);

    float arcField =
      bandOuter * filamentA +
      bandMid   * filamentB +
      bandInner * filamentC +
      bandCore  * filamentD * 0.62;

    float softFill =
      smoothstep(0.30, 0.96, filamentA * 0.42 + filamentB * 0.34 + filamentC * 0.24) *
      smoothstep(0.16, 0.96, r) *
      (1.0 - smoothstep(0.96, 1.05, r));

    float outerVeil =
      smoothstep(0.60, 0.96, 0.5 + 0.5 * sin(a * 2.4 - t * 0.48 + n * 1.8)) *
      smoothstep(0.54, 0.92, r) *
      (1.0 - smoothstep(0.96, 1.05, r));

    float centerMist =
      (1.0 - smoothstep(0.0, 0.18, r)) *
      smoothstep(0.42, 0.82, 0.5 + 0.5 * sin(a * 4.4 + t * 1.0 - n * 1.1));

    float structure =
      arcField * 0.96 +
      softFill * 0.14 +
      outerVeil * 0.10 +
      rimBand * 0.18 +
      centerMist * 0.08;

    float outerFade = 1.0 - smoothstep(0.995, 1.05, r);
    float innerFade = smoothstep(0.0, 0.02, r);

    float fresnel = pow(1.0 - abs(vNormalW.z), 1.85);

    float alpha = structure * outerFade * innerFade * uOpacity;
    alpha += rimBand * 0.055 * uOpacity * uIntensity;
    alpha += centerMist * 0.03 * uOpacity * uIntensity;

    vec3 color = mix(uColorA, uColorB, smoothstep(0.2, 0.95, filamentA));
    color = mix(color, uColorC, smoothstep(0.26, 0.95, filamentB));

    color += uColorA * bandOuter * filamentA * 0.30 * uIntensity;
    color += uColorB * bandMid   * filamentB * 0.32 * uIntensity;
    color += uColorC * bandInner * filamentC * 0.28 * uIntensity;
    color += uColorA * bandCore  * filamentD * 0.18 * uIntensity;
    color += uColorA * rimBand   * 0.14 * uIntensity;
    color += uColorC * outerVeil * 0.07 * uIntensity;
    color += uColorA * fresnel   * 0.06 * uIntensity;
    color += vec3(1.0) * centerMist * 0.02 * uIntensity;

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

  const motion = modeSettings[mode];
  const glowBoost = glowBoostMap[glowIntensity];
  const safeSpeed = Math.max(speed, 0.15);
  const segments = segmentMap[quality];

  const layerConfigs = useMemo<LayerConfig[]>(() => {
    return [
      {
        scale: 1.22,
        opacity: 0.075 * glowBoost,
        speed: 0.42,
        twist: 0.28,
        intensity: 0.58,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 1.12,
        opacity: 0.105 * glowBoost,
        speed: 0.60,
        twist: 0.54,
        intensity: 0.72,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.mint,
      },
      {
        scale: 1.02,
        opacity: 0.13 * glowBoost,
        speed: 0.84,
        twist: 0.86,
        intensity: 0.88,
        colorA: colors.halo,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.91,
        opacity: 0.15 * glowBoost,
        speed: 1.08,
        twist: 1.18,
        intensity: 1.0,
        colorA: colors.violet,
        colorB: colors.halo,
        colorC: colors.pink,
      },
      {
        scale: 0.80,
        opacity: 0.13 * glowBoost,
        speed: 1.34,
        twist: 1.52,
        intensity: 1.1,
        colorA: colors.pink,
        colorB: colors.accent,
        colorC: colors.violet,
      },
      {
        scale: 0.69,
        opacity: 0.09 * glowBoost,
        speed: 1.64,
        twist: 1.88,
        intensity: 1.16,
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
        Math.sin(elapsed * (0.90 + index * 0.14) * safeSpeed) *
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

    if (coreGlowRef.current) {
      const glowScale =
        1.01 + Math.sin(elapsed * 1.6 * safeSpeed) * 0.045 * motion.pulse;
      coreGlowRef.current.scale.setScalar(glowScale);
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

      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[0.10, 20, 20]} />
        <meshBasicMaterial
          color={colors.halo}
          transparent
          opacity={0.05 * glowBoost}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}