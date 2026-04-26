import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface PetalFieldColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface PetalFieldProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: PetalFieldColors;
}

interface PetalGeometrySet {
  wash: THREE.TubeGeometry;
  glow: THREE.TubeGeometry;
  mid: THREE.TubeGeometry;
  core: THREE.TubeGeometry;
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.22;
    default:
      return 1;
  }
}

function createPetalTubeGeometry(
  length: number,
  width: number,
  rotation: number,
  radius: number,
  zOffset = 0,
  bend = 0,
) {
  const start = new THREE.Vector3(0, 0, zOffset);
  const tip = new THREE.Vector3(0, length, zOffset + bend);

  const rightCurve = new THREE.CubicBezierCurve3(
    start,
    new THREE.Vector3(width * 1.02, length * 0.18, zOffset + bend * 0.15),
    new THREE.Vector3(width * 0.92, length * 0.78, zOffset + bend * 0.8),
    tip,
  );

  const leftCurve = new THREE.CubicBezierCurve3(
    tip,
    new THREE.Vector3(-width * 0.92, length * 0.78, zOffset + bend * 0.8),
    new THREE.Vector3(-width * 1.02, length * 0.18, zOffset + bend * 0.15),
    start,
  );

  const rawPoints = [
    ...rightCurve.getPoints(42),
    ...leftCurve.getPoints(42).slice(1),
  ];

  const rotatedPoints = rawPoints.map((point) =>
    point.clone().applyAxisAngle(Z_AXIS, rotation),
  );

  const path = new THREE.CatmullRomCurve3(
    rotatedPoints,
    false,
    'catmullrom',
    0.45,
  );

  return new THREE.TubeGeometry(path, 120, radius, 12, false);
}

function createPetalLayer(
  count: number,
  length: number,
  width: number,
  rotationOffset: number,
  coreRadius: number,
  midRadius: number,
  glowRadius: number,
  washRadius: number,
  zOffset = 0,
  bend = 0,
): PetalGeometrySet[] {
  return Array.from({ length: count }, (_, index) => {
    const rotation = (index / count) * Math.PI * 2 + rotationOffset;

    return {
      wash: createPetalTubeGeometry(
        length,
        width,
        rotation,
        washRadius,
        zOffset,
        bend,
      ),
      glow: createPetalTubeGeometry(
        length,
        width,
        rotation,
        glowRadius,
        zOffset,
        bend,
      ),
      mid: createPetalTubeGeometry(
        length,
        width,
        rotation,
        midRadius,
        zOffset,
        bend,
      ),
      core: createPetalTubeGeometry(
        length,
        width,
        rotation,
        coreRadius,
        zOffset,
        bend,
      ),
    };
  });
}

function mix3(
  a: THREE.Color,
  b: THREE.Color,
  c: THREE.Color,
  t1: number,
  t2: number,
) {
  return a.clone().lerp(b, t1).lerp(c, t2);
}

function getOuterPalette(index: number, count: number, colors: PetalFieldColors) {
  const t = index / count;
  const waveA = (Math.sin(t * Math.PI * 2) + 1) * 0.5;
  const waveB = (Math.sin(t * Math.PI * 2 + 2.1) + 1) * 0.5;

  return {
    wash: mix3(
      colors.halo,
      colors.mint,
      colors.violet,
      0.18 + waveA * 0.18,
      0.08 + waveB * 0.12,
    ),
    glow: mix3(
      colors.violet,
      colors.pink,
      colors.mint,
      0.18 + waveA * 0.28,
      0.08 + waveB * 0.16,
    ),
    mid: mix3(
      colors.mint,
      colors.halo,
      colors.violet,
      0.28 + waveA * 0.18,
      0.08 + waveB * 0.1,
    ),
    core: mix3(
      colors.white,
      colors.mint,
      colors.violet,
      0.2 + waveA * 0.16,
      0.04 + waveB * 0.06,
    ),
  };
}

function getInnerPalette(index: number, count: number, colors: PetalFieldColors) {
  const t = index / count;
  const waveA = (Math.sin(t * Math.PI * 2 + 0.7) + 1) * 0.5;
  const waveB = (Math.sin(t * Math.PI * 2 + 3.0) + 1) * 0.5;

  return {
    wash: mix3(
      colors.halo,
      colors.violet,
      colors.mint,
      0.12 + waveA * 0.16,
      0.06 + waveB * 0.08,
    ),
    glow: mix3(
      colors.violet,
      colors.pink,
      colors.halo,
      0.24 + waveA * 0.2,
      0.1 + waveB * 0.08,
    ),
    mid: mix3(
      colors.violet,
      colors.pink,
      colors.mint,
      0.22 + waveA * 0.16,
      0.06 + waveB * 0.12,
    ),
    core: mix3(
      colors.white,
      colors.violet,
      colors.mint,
      0.14 + waveA * 0.12,
      0.04 + waveB * 0.08,
    ),
  };
}

function getMicroPalette(index: number, count: number, colors: PetalFieldColors) {
  const t = index / count;
  const waveA = (Math.sin(t * Math.PI * 2 + 1.4) + 1) * 0.5;

  return {
    wash: colors.halo.clone().lerp(colors.violet, 0.12 + waveA * 0.08),
    glow: colors.pink.clone().lerp(colors.violet, 0.18 + waveA * 0.12),
    mid: colors.mint.clone().lerp(colors.violet, 0.16 + waveA * 0.12),
    core: colors.white.clone().lerp(colors.mint, 0.12 + waveA * 0.08),
  };
}

export default function PetalField({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: PetalFieldProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const microRef = useRef<THREE.Group>(null);
  const centerGlowRef = useRef<THREE.Mesh>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const outerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.68,
        0.162,
        0,
        0.0052,
        0.0128,
        0.024,
        0.041,
        0.008,
        0.018,
      ),
    [],
  );

  const innerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.52,
        0.115,
        Math.PI / 8,
        0.0042,
        0.0105,
        0.019,
        0.031,
        0.016,
        0.01,
      ),
    [],
  );

  const microLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.315,
        0.064,
        0,
        0.003,
        0.0068,
        0.011,
        0.017,
        0.022,
        0.006,
      ),
    [],
  );

  const discOuter = useMemo(
    () => colors.halo.clone().lerp(colors.mint, 0.08),
    [colors],
  );
  const discMid = useMemo(
    () => colors.violet.clone().lerp(colors.halo, 0.18),
    [colors],
  );
  const discInner = useMemo(
    () => colors.white.clone().lerp(colors.mint, 0.22),
    [colors],
  );
  const center = useMemo(
    () => colors.white.clone().lerp(colors.mint, 0.34),
    [colors],
  );
  const centerHot = useMemo(
    () => colors.white.clone().lerp(colors.pink, 0.16),
    [colors],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.35 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (rootRef.current) {
      rootRef.current.rotation.z = Math.sin(elapsed * 0.14 * safeSpeed) * 0.045;
      rootRef.current.rotation.x = Math.sin(elapsed * 0.08 * safeSpeed) * 0.04;
      rootRef.current.rotation.y = Math.cos(elapsed * 0.09 * safeSpeed) * 0.04;
    }

    if (outerRef.current) {
      outerRef.current.rotation.z =
        elapsed * 0.085 * safeSpeed * motionFactor;
    }

    if (innerRef.current) {
      innerRef.current.rotation.z =
        -elapsed * 0.11 * safeSpeed * motionFactor +
        Math.sin(elapsed * 0.42 * motionFactor) * 0.03;
    }

    if (microRef.current) {
      microRef.current.rotation.z =
        elapsed * 0.16 * safeSpeed * motionFactor;
    }

    if (centerGlowRef.current) {
      const scale =
        1 + Math.sin(elapsed * 1.25 * motionFactor) * 0.055;
      centerGlowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={rootRef} renderOrder={18}>
      <mesh position={[0, 0, -0.03]} renderOrder={9}>
        <circleGeometry args={[0.78, 80]} />
        <meshBasicMaterial
          color={discOuter}
          transparent
          opacity={0.024 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.02]} renderOrder={10}>
        <circleGeometry args={[0.57, 80]} />
        <meshBasicMaterial
          color={discMid}
          transparent
          opacity={0.018 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.01]} renderOrder={11}>
        <circleGeometry args={[0.4, 80]} />
        <meshBasicMaterial
          color={discInner}
          transparent
          opacity={0.042 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group ref={outerRef}>
        {outerLayer.map((petal, index) => {
          const palette = getOuterPalette(index, outerLayer.length, colors);

          return (
            <group key={`outer-${index}`}>
              <mesh geometry={petal.wash} renderOrder={12}>
                <meshBasicMaterial
                  color={palette.wash}
                  transparent
                  opacity={0.065 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.glow} renderOrder={13}>
                <meshBasicMaterial
                  color={palette.glow}
                  transparent
                  opacity={0.22 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.mid} renderOrder={14}>
                <meshBasicMaterial
                  color={palette.mid}
                  transparent
                  opacity={0.38 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.core} renderOrder={15}>
                <meshBasicMaterial
                  color={palette.core}
                  transparent
                  opacity={0.88}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={innerRef}>
        {innerLayer.map((petal, index) => {
          const palette = getInnerPalette(index, innerLayer.length, colors);

          return (
            <group key={`inner-${index}`}>
              <mesh geometry={petal.wash} renderOrder={16}>
                <meshBasicMaterial
                  color={palette.wash}
                  transparent
                  opacity={0.05 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.glow} renderOrder={17}>
                <meshBasicMaterial
                  color={palette.glow}
                  transparent
                  opacity={0.15 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.mid} renderOrder={18}>
                <meshBasicMaterial
                  color={palette.mid}
                  transparent
                  opacity={0.29 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.core} renderOrder={19}>
                <meshBasicMaterial
                  color={palette.core}
                  transparent
                  opacity={0.78}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={microRef}>
        {microLayer.map((petal, index) => {
          const palette = getMicroPalette(index, microLayer.length, colors);

          return (
            <group key={`micro-${index}`}>
              <mesh geometry={petal.wash} renderOrder={20}>
                <meshBasicMaterial
                  color={palette.wash}
                  transparent
                  opacity={0.034 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.glow} renderOrder={21}>
                <meshBasicMaterial
                  color={palette.glow}
                  transparent
                  opacity={0.095 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.mid} renderOrder={22}>
                <meshBasicMaterial
                  color={palette.mid}
                  transparent
                  opacity={0.16 * glowFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.core} renderOrder={23}>
                <meshBasicMaterial
                  color={palette.core}
                  transparent
                  opacity={0.62}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      <mesh ref={centerGlowRef} position={[0, 0, 0.024]} renderOrder={24}>
        <sphereGeometry args={[0.072, 24, 24]} />
        <meshBasicMaterial
          color={center}
          transparent
          opacity={0.14 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.03]} renderOrder={25}>
        <sphereGeometry args={[0.028, 20, 20]} />
        <meshBasicMaterial
          color={centerHot}
          transparent
          opacity={0.58}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}