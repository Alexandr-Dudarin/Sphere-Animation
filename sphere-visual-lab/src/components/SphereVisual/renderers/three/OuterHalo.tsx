import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface OuterHaloColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface OuterHaloProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: OuterHaloColors;
}

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.14;
    default:
      return 1;
  }
}

function createTailTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += 1) {
    const u = x / (canvas.width - 1);

    // справа ярче (там голова), влево хвост плавно гаснет
    const horizontal = Math.pow(u, 2.4);

    for (let y = 0; y < canvas.height; y += 1) {
      const v = (y - canvas.height / 2) / (canvas.height / 2);

      // мягкая форма по вертикали
      const vertical = Math.exp(-v * v * 5.5);

      const alpha = horizontal * vertical;

      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
}

export default function OuterHalo({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: OuterHaloProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const cometAnchorRef = useRef<THREE.Group>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const tailTexture = useMemo(() => createTailTexture(), []);

  useEffect(() => {
    return () => {
      tailTexture?.dispose();
    };
  }, [tailTexture]);

  const haloColor = useMemo(
    () => colors.halo.clone().lerp(colors.mint, 0.16),
    [colors],
  );

  const headColor = useMemo(
    () => colors.white.clone().lerp(colors.mint, 0.24),
    [colors],
  );

  const tailColor = useMemo(
    () => colors.violet.clone().lerp(colors.mint, 0.3),
    [colors],
  );

  const softTailColor = useMemo(
    () => colors.pink.clone().lerp(colors.halo, 0.45),
    [colors],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.4 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    const angle = elapsed * safeSpeed * 0.42 * motionFactor;

    // Если захочешь ближе/дальше от края — это главное число
    const orbitRadius = 1.105;

    if (glowRef.current) {
      const pulse = 1 + Math.sin(elapsed * 0.55) * 0.006;
      glowRef.current.scale.setScalar(pulse);
    }

    if (cometAnchorRef.current) {
      cometAnchorRef.current.position.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * orbitRadius,
        0.028,
      );

      // хвост идёт по касательной к окружности
      cometAnchorRef.current.rotation.z = angle + Math.PI / 2;
    }
  });

  return (
    <group renderOrder={40}>
      {/* очень мягкое общее внешнее свечение */}
      <mesh ref={glowRef} renderOrder={40}>
        <sphereGeometry args={[1.19, 56, 56]} />
        <meshBasicMaterial
          color={haloColor}
          transparent
          opacity={0.02 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* комета */}
      <group ref={cometAnchorRef} renderOrder={41}>
        {/* мягкий широкий хвост */}
        <mesh position={[-0.12, 0, 0.002]} renderOrder={41}>
          <planeGeometry args={[0.28, 0.08]} />
          <meshBasicMaterial
            color={softTailColor}
            transparent
            opacity={0.22 * glowFactor}
            alphaMap={tailTexture ?? undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* основной хвост */}
        <mesh position={[-0.085, 0, 0.006]} renderOrder={42}>
          <planeGeometry args={[0.21, 0.048]} />
          <meshBasicMaterial
            color={tailColor}
            transparent
            opacity={0.52 * glowFactor}
            alphaMap={tailTexture ?? undefined}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* мягкий ореол головы */}
        <mesh position={[-0.01, 0, 0.01]} renderOrder={42}>
          <sphereGeometry args={[0.05, 18, 18]} />
          <meshBasicMaterial
            color={tailColor}
            transparent
            opacity={0.14 * glowFactor}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* голова кометы */}
        <mesh position={[0, 0, 0.012]} renderOrder={43}>
          <sphereGeometry args={[0.027, 18, 18]} />
          <meshBasicMaterial
            color={headColor}
            transparent
            opacity={0.96}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}