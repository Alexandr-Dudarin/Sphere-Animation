import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../../SphereVisual.types';

interface SphereSceneProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

interface MotionSettings {
  swirlSpeed: number;
  pulse: number;
  glow: number;
}

interface LayerConfig {
  z: number;
  scale: number;
  opacity: number;
  speed: number;
  direction: 1 | -1;
  texture: 'cyan' | 'violet' | 'pink' | 'mint' | 'halo';
}

const modeSettings: Record<SphereMode, MotionSettings> = {
  idle: {
    swirlSpeed: 0.42,
    pulse: 0.3,
    glow: 0.7,
  },
  thinking: {
    swirlSpeed: 1,
    pulse: 0.82,
    glow: 1,
  },
  searching: {
    swirlSpeed: 1.2,
    pulse: 1,
    glow: 1.14,
  },
};

const glowStrengthMap: Record<GlowIntensity, number> = {
  low: 0.72,
  medium: 0.9,
  high: 1.08,
};

const shellOpacityMap: Record<SphereQuality, number> = {
  low: 0.03,
  medium: 0.045,
  high: 0.06,
};

const segmentMap: Record<SphereQuality, number> = {
  low: 48,
  medium: 72,
  high: 96,
};

function rgbStringToCss(value: string) {
  return `rgb(${value.split(' ').join(', ')})`;
}

function createVortexTexture(options: {
  size?: number;
  primary: string;
  secondary: string;
  tertiary: string;
  rotation?: number;
  arms?: number;
  turns?: number;
  innerCut?: number;
  outerFade?: number;
  intensity?: number;
}) {
  const {
    size = 1024,
    primary,
    secondary,
    tertiary,
    rotation = 0,
    arms = 3,
    turns = 3.2,
    innerCut = 0.12,
    outerFade = 0.9,
    intensity = 1,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const half = size / 2;
  const radius = size * 0.48;

  ctx.clearRect(0, 0, size, size);
  ctx.translate(half, half);
  ctx.rotate(rotation);

  const conic = ctx.createConicGradient(0, 0, 0);
  conic.addColorStop(0, 'rgba(0,0,0,0)');
  conic.addColorStop(0.08, primary);
  conic.addColorStop(0.18, 'rgba(0,0,0,0)');
  conic.addColorStop(0.34, secondary);
  conic.addColorStop(0.5, 'rgba(0,0,0,0)');
  conic.addColorStop(0.66, tertiary);
  conic.addColorStop(0.82, 'rgba(0,0,0,0)');
  conic.addColorStop(0.94, primary);
  conic.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = conic;
  ctx.fill();

  ctx.globalCompositeOperation = 'screen';

  const spiralColors = [primary, secondary, tertiary];

  for (let arm = 0; arm < arms; arm += 1) {
    const baseOffset = (Math.PI * 2 * arm) / arms;

    spiralColors.forEach((color, colorIndex) => {
      ctx.beginPath();

      for (let step = 0; step <= 260; step += 1) {
        const progress = step / 260;
        const angle =
          progress * turns * Math.PI * 2 +
          baseOffset +
          colorIndex * 0.28;

        const localRadius =
          size * 0.06 + progress * radius * 0.86;

        const wobble =
          Math.sin(progress * 10 + arm * 1.2 + colorIndex) *
          size *
          0.008;

        const ellipseY = 0.82 + colorIndex * 0.03;

        const x = Math.cos(angle) * (localRadius + wobble);
        const y =
          Math.sin(angle) * (localRadius * ellipseY + wobble * 0.35);

        if (step === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = (10 - colorIndex * 2) * intensity;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 28 * intensity;
      ctx.globalAlpha = 0.42 - colorIndex * 0.08;
      ctx.stroke();
    });
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'lighter';

  const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.18);
  centerGlow.addColorStop(0, 'rgba(255,255,255,0.95)');
  centerGlow.addColorStop(0.12, primary);
  centerGlow.addColorStop(0.3, secondary);
  centerGlow.addColorStop(0.62, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = centerGlow;
  ctx.fill();

  ctx.globalCompositeOperation = 'destination-in';
  const mask = ctx.createRadialGradient(0, 0, size * innerCut, 0, 0, radius);
  mask.addColorStop(0, 'rgba(0,0,0,0)');
  mask.addColorStop(innerCut + 0.02, 'rgba(0,0,0,0.92)');
  mask.addColorStop(0.62, 'rgba(0,0,0,0.72)');
  mask.addColorStop(outerFade, 'rgba(0,0,0,0.08)');
  mask.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = mask;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createHaloTexture(color: string) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const half = size / 2;
  const radius = size * 0.47;

  const gradient = ctx.createRadialGradient(half, half, size * 0.12, half, half, radius);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.32, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.52, color);
  gradient.addColorStop(0.72, 'rgba(0,0,0,0.08)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.beginPath();
  ctx.arc(half, half, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export default function SphereScene({
  presetConfig,
  mode,
  quality,
  interactive,
  glowIntensity,
  speed,
  pointerX,
  pointerY,
  reducedMotion,
}: SphereSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const shellRimRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  const layerRefs = useRef<Array<THREE.Mesh | null>>([]);

  const motion = modeSettings[mode];
  const glowStrength = glowStrengthMap[glowIntensity];
  const shellOpacity = shellOpacityMap[quality];
  const segments = segmentMap[quality];
  const safeSpeed = Math.max(speed, 0.15);

  const cssColors = useMemo(() => {
    const accent = rgbStringToCss(presetConfig.accentRgb);
    const halo = rgbStringToCss(presetConfig.haloRgb);
    const violet =
      mode === 'searching' ? 'rgba(158, 122, 255, 0.95)' : 'rgba(128, 104, 255, 0.94)';
    const pink =
      mode === 'searching' ? 'rgba(255, 96, 184, 0.95)' : 'rgba(232, 118, 255, 0.94)';
    const mint = 'rgba(108, 255, 223, 0.9)';

    return {
      accent,
      halo,
      violet,
      pink,
      mint,
    };
  }, [mode, presetConfig]);

  const threeColors = useMemo(() => {
    return {
      halo: new THREE.Color(cssColors.halo),
      accent: new THREE.Color(cssColors.accent),
      violet: new THREE.Color(cssColors.violet),
      pink: new THREE.Color(cssColors.pink),
      mint: new THREE.Color(cssColors.mint),
      white: new THREE.Color('#ffffff'),
    };
  }, [cssColors]);

  const textures = useMemo(() => {
    return {
      cyan: createVortexTexture({
        primary: cssColors.halo,
        secondary: cssColors.accent,
        tertiary: cssColors.mint,
        rotation: 0,
        arms: 3,
        turns: 3.1,
        innerCut: 0.1,
        outerFade: 0.88,
        intensity: 1,
      }),
      violet: createVortexTexture({
        primary: cssColors.violet,
        secondary: cssColors.halo,
        tertiary: cssColors.pink,
        rotation: 0.6,
        arms: 3,
        turns: 3.5,
        innerCut: 0.14,
        outerFade: 0.9,
        intensity: 0.9,
      }),
      pink: createVortexTexture({
        primary: cssColors.pink,
        secondary: cssColors.accent,
        tertiary: cssColors.violet,
        rotation: -0.4,
        arms: 2,
        turns: 3,
        innerCut: 0.18,
        outerFade: 0.86,
        intensity: 0.8,
      }),
      mint: createVortexTexture({
        primary: cssColors.mint,
        secondary: cssColors.halo,
        tertiary: cssColors.accent,
        rotation: 1,
        arms: 2,
        turns: 2.8,
        innerCut: 0.2,
        outerFade: 0.82,
        intensity: 0.65,
      }),
      halo: createHaloTexture(cssColors.halo),
    };
  }, [cssColors]);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    };
  }, [textures]);

  const layerConfigs = useMemo<LayerConfig[]>(() => {
    return [
      {
        z: -0.34,
        scale: 1.18,
        opacity: 0.18,
        speed: 0.9,
        direction: 1,
        texture: 'cyan',
      },
      {
        z: -0.18,
        scale: 0.94,
        opacity: 0.24,
        speed: 1.15,
        direction: -1,
        texture: 'violet',
      },
      {
        z: 0,
        scale: 0.72,
        opacity: 0.28,
        speed: 1.45,
        direction: 1,
        texture: 'pink',
      },
      {
        z: 0.14,
        scale: 0.52,
        opacity: 0.26,
        speed: 1.8,
        direction: -1,
        texture: 'mint',
      },
      {
        z: 0.24,
        scale: 1.1,
        opacity: 0.1,
        speed: 0.42,
        direction: 1,
        texture: 'halo',
      },
    ];
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const pointerFactor = reducedMotion ? 0.08 : interactive ? 1 : 0.18;

    const targetRotX = pointerY * 0.18 * pointerFactor;
    const targetRotY = pointerX * 0.24 * pointerFactor;

    if (rootRef.current) {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        targetRotX,
        0.08,
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        targetRotY,
        0.08,
      );
      rootRef.current.rotation.z = THREE.MathUtils.lerp(
        rootRef.current.rotation.z,
        Math.sin(elapsed * 0.36 * safeSpeed) * 0.02,
        0.05,
      );
    }

    layerRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const config = layerConfigs[index];
      const breath =
        1 + Math.sin(elapsed * (1.4 + index * 0.16) * safeSpeed) * 0.018 * motion.pulse;

      mesh.rotation.z +=
        delta * config.speed * safeSpeed * motion.swirlSpeed * config.direction;

      mesh.rotation.x = Math.sin(elapsed * 0.4 + index * 0.7) * 0.04;
      mesh.rotation.y = Math.cos(elapsed * 0.35 + index * 0.6) * 0.04;

      mesh.position.z =
        config.z + Math.sin(elapsed * (0.8 + index * 0.12)) * 0.008;

      mesh.scale.setScalar(config.scale * breath);
    });

    if (coreGlowRef.current) {
      const glowScale =
        1.04 + Math.sin(elapsed * 2.3 * safeSpeed) * 0.12 * motion.pulse;
      coreGlowRef.current.scale.setScalar(glowScale);
    }

    if (coreRef.current) {
      const coreScale =
        1 + Math.sin(elapsed * 3 * safeSpeed) * 0.08 * motion.pulse;
      coreRef.current.scale.setScalar(coreScale);
    }

    if (auraRef.current) {
      const auraScale =
        1.02 + Math.sin(elapsed * 1.7 * safeSpeed) * 0.05 * motion.glow;
      auraRef.current.scale.setScalar(auraScale);
    }

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.012 * safeSpeed;
      shellRef.current.rotation.x += delta * 0.004 * safeSpeed;
    }

    if (shellRimRef.current) {
      shellRimRef.current.rotation.y -= delta * 0.008 * safeSpeed;
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={[threeColors.halo, threeColors.accent, 0.7]} />
      <pointLight
        position={[2.2, 2, 2.8]}
        color={threeColors.halo}
        intensity={2.2 * glowStrength}
      />
      <pointLight
        position={[-1.8, -1.4, 2.4]}
        color={threeColors.violet}
        intensity={1.6 * glowStrength}
      />
      <pointLight
        position={[0, 0, 1.6]}
        color={threeColors.accent}
        intensity={2.1 * glowStrength}
      />

      <group ref={rootRef}>
        <mesh ref={auraRef}>
          <sphereGeometry args={[1.42, 40, 40]} />
          <meshBasicMaterial
            color={threeColors.halo}
            transparent
            opacity={0.04 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>

        {layerConfigs.map((layer, index) => (
          <mesh
            key={`${layer.texture}-${index}`}
            ref={(mesh) => {
              layerRefs.current[index] = mesh;
            }}
            position={[0, 0, layer.z]}
            scale={layer.scale}
          >
            <circleGeometry args={[1, 80]} />
            <meshBasicMaterial
              map={textures[layer.texture]}
              transparent
              opacity={layer.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        <mesh ref={coreGlowRef}>
          <sphereGeometry args={[0.36, 28, 28]} />
          <meshBasicMaterial
            color={threeColors.halo}
            transparent
            opacity={0.18 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={coreRef}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color={threeColors.white}
            emissive={threeColors.accent}
            emissiveIntensity={2.8 * glowStrength}
            roughness={0.08}
            metalness={0.02}
          />
        </mesh>

        <mesh ref={shellRef}>
          <sphereGeometry args={[1.15, segments, segments]} />
          <meshPhysicalMaterial
            color="#f8fbff"
            transparent
            opacity={shellOpacity}
            roughness={0.12}
            metalness={0}
            transmission={0.45}
            thickness={0.08}
            ior={1.03}
            clearcoat={1}
            clearcoatRoughness={0.18}
            envMapIntensity={0.1}
          />
        </mesh>

        <mesh ref={shellRimRef}>
          <sphereGeometry args={[1.18, segments, segments]} />
          <meshBasicMaterial
            color={threeColors.halo}
            transparent
            opacity={0.04 * glowStrength}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}