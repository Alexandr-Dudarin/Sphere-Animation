import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type GlowIntensity = 'low' | 'medium' | 'high' | number;

type SphereColors = {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
};

type InnerScatterFieldProps = {
  speed?: number;
  reducedMotion?: boolean;
  interactive?: boolean;
  glowIntensity?: GlowIntensity;
  colors: SphereColors;
};

type ParticleSeed = {
  radius: number;
  angle: number;
  phase: number;
  speed: number;
  drift: number;
  depth: number;
  twist: number;
};

const PARTICLE_COUNT = 440;

function resolveGlowFactor(glowIntensity: GlowIntensity = 'medium') {
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

function createSoftSpriteTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.Texture();
  }

  const gradient = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  );

  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.22, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.52, 'rgba(255,255,255,0.28)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function writeParticlePosition(
  positions: Float32Array,
  index: number,
  seed: ParticleSeed,
  time: number,
) {
  const i3 = index * 3;

  const spiralTime = time * seed.speed;
  const inwardWeight = Math.pow(1 - seed.radius, 1.25);

  const swirl =
    seed.angle +
    spiralTime +
    seed.radius * 5.6 +
    inwardWeight * seed.twist * 1.9 +
    Math.sin(spiralTime * 0.8 + seed.phase) * 0.12;

  const radiusPulse =
    0.92 +
    0.05 * Math.sin(time * 0.75 + seed.phase) +
    0.025 * Math.cos(time * 1.1 + seed.phase * 0.85);

  const orbitRadius = seed.radius * radiusPulse;
  const inwardPull = inwardWeight * 0.12;

  const localWave =
    0.012 * seed.drift * Math.sin(swirl * 1.7 + seed.phase) +
    0.008 * seed.drift * Math.cos(swirl * 2.1 - seed.phase);

  const x =
    Math.cos(swirl) * orbitRadius * 0.84 +
    Math.cos(swirl * 2.0 + seed.phase) * localWave -
    Math.cos(swirl) * inwardPull * 0.32;

  const y =
    Math.sin(swirl) * orbitRadius * 0.8 +
    Math.sin(swirl * 1.6 + seed.phase) * localWave -
    Math.sin(swirl) * inwardPull * 0.26;

  const z =
    seed.depth * 0.06 +
    Math.sin(swirl * 1.18 + seed.phase) * 0.013 +
    Math.cos(time * 0.62 + seed.phase) * 0.006;

  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;
}

export default function InnerScatterField({
  speed = 1,
  reducedMotion = false,
  glowIntensity = 'medium',
  colors,
}: InnerScatterFieldProps) {
  const groupRef = useRef<THREE.Group>(null);

  const glowFactor = resolveGlowFactor(glowIntensity);

  const { geometry, material, spriteTexture, positions, seeds } = useMemo(() => {
    const sprite = createSoftSpriteTexture();
    const positionsArray = new Float32Array(PARTICLE_COUNT * 3);
    const colorsArray = new Float32Array(PARTICLE_COUNT * 3);
    const particleSeeds: ParticleSeed[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const radius = 0.045 + Math.pow(Math.random(), 1.65) * 0.76;
      const angle = Math.random() * Math.PI * 2;
      const phase = Math.random() * Math.PI * 2;
      const speedMul = THREE.MathUtils.randFloat(0.18, 0.34);
      const drift = THREE.MathUtils.randFloat(0.55, 1.1);
      const depth = THREE.MathUtils.randFloatSpread(1);
      const twist = THREE.MathUtils.randFloat(0.85, 1.35);

      const seed: ParticleSeed = {
        radius,
        angle,
        phase,
        speed: speedMul,
        drift,
        depth,
        twist,
      };

      particleSeeds.push(seed);
      writeParticlePosition(positionsArray, i, seed, 0);

      const outerColor = colors.halo.clone().lerp(colors.mint, 0.35 + radius * 0.2);
      const innerColor = colors.violet.clone().lerp(colors.pink, 0.35 + (1 - radius) * 0.4);
      const mixed = outerColor
        .lerp(innerColor, 0.22 + (1 - radius) * 0.42)
        .lerp(colors.white, (1 - radius) * 0.08);

      const i3 = i * 3;
      colorsArray[i3] = mixed.r;
      colorsArray[i3 + 1] = mixed.g;
      colorsArray[i3 + 2] = mixed.b;
    }

    const scatterGeometry = new THREE.BufferGeometry();
    scatterGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionsArray, 3),
    );
    scatterGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colorsArray, 3),
    );

    const scatterMaterial = new THREE.PointsMaterial({
      size: 0.026 * glowFactor,
      map: sprite,
      transparent: true,
      opacity: 0.34 * glowFactor,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      alphaTest: 0.01,
    });

    return {
      geometry: scatterGeometry,
      material: scatterMaterial,
      spriteTexture: sprite,
      positions: positionsArray,
      seeds: particleSeeds,
    };
  }, [colors, glowFactor]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
    };
  }, [geometry, material, spriteTexture]);

  useFrame((state) => {
    const motionFactor = reducedMotion ? 0.22 : 1;
    const t = state.clock.getElapsedTime() * speed * motionFactor;

    for (let i = 0; i < seeds.length; i += 1) {
      writeParticlePosition(positions, i, seeds[i]!, t);
    }

    geometry.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.26) * 0.045;
      groupRef.current.rotation.x = Math.cos(t * 0.22) * 0.018;
      groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.026;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.03]}>
      <points geometry={geometry} frustumCulled={false}>
        <primitive object={material} attach="material" />
      </points>
    </group>
  );
}