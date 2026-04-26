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
  core: THREE.TubeGeometry;
  mid: THREE.TubeGeometry;
  glow: THREE.TubeGeometry;
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
  zOffset = 0,
  bend = 0,
): PetalGeometrySet[] {
  return Array.from({ length: count }, (_, index) => {
    const rotation = (index / count) * Math.PI * 2 + rotationOffset;

    return {
      core: createPetalTubeGeometry(
        length,
        width,
        rotation,
        coreRadius,
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
      glow: createPetalTubeGeometry(
        length,
        width,
        rotation,
        glowRadius,
        zOffset,
        bend,
      ),
    };
  });
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
        0.66,
        0.155,
        0,
        0.0052,
        0.0125,
        0.026,
        0.008,
        0.018,
      ),
    [],
  );

  const innerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.5,
        0.11,
        Math.PI / 8,
        0.0042,
        0.0102,
        0.02,
        0.016,
        0.01,
      ),
    [],
  );

  const microLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.31,
        0.062,
        0,
        0.003,
        0.0068,
        0.012,
        0.022,
        0.006,
      ),
    [],
  );

  const palette = useMemo(() => {
    return {
      outerCore: colors.white.clone().lerp(colors.mint, 0.28),
      outerMid: colors.mint.clone().lerp(colors.halo, 0.18),
      outerGlow: colors.violet.clone().lerp(colors.pink, 0.36),

      innerCore: colors.white.clone().lerp(colors.violet, 0.2),
      innerMid: colors.violet.clone().lerp(colors.pink, 0.26),
      innerGlow: colors.halo.clone().lerp(colors.mint, 0.2),

      microCore: colors.white.clone().lerp(colors.mint, 0.16),
      microMid: colors.mint.clone().lerp(colors.violet, 0.18),
      microGlow: colors.pink.clone().lerp(colors.violet, 0.18),

      discOuter: colors.halo.clone().lerp(colors.mint, 0.1),
      discMid: colors.violet.clone().lerp(colors.halo, 0.22),
      discInner: colors.white.clone().lerp(colors.mint, 0.26),

      center: colors.white.clone().lerp(colors.mint, 0.34),
      centerHot: colors.white.clone().lerp(colors.pink, 0.18),
    };
  }, [colors]);

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
      {/* мягкая внутренняя подложка */}
      <mesh position={[0, 0, -0.03]} renderOrder={9}>
        <circleGeometry args={[0.82, 80]} />
        <meshBasicMaterial
          color={palette.discOuter}
          transparent
          opacity={0.045 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.02]} renderOrder={10}>
        <circleGeometry args={[0.6, 80]} />
        <meshBasicMaterial
          color={palette.discMid}
          transparent
          opacity={0.04 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.01]} renderOrder={11}>
        <circleGeometry args={[0.42, 80]} />
        <meshBasicMaterial
          color={palette.discInner}
          transparent
          opacity={0.075 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* внешний luminous-слой */}
      <group ref={outerRef}>
        {outerLayer.map((petal, index) => (
          <group key={`outer-${index}`}>
            <mesh geometry={petal.glow} renderOrder={12}>
              <meshBasicMaterial
                color={palette.outerGlow}
                transparent
                opacity={0.17 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.mid} renderOrder={13}>
              <meshBasicMaterial
                color={palette.outerMid}
                transparent
                opacity={0.34 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.core} renderOrder={14}>
              <meshBasicMaterial
                color={palette.outerCore}
                transparent
                opacity={0.98}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* внутренний luminous-слой */}
      <group ref={innerRef}>
        {innerLayer.map((petal, index) => (
          <group key={`inner-${index}`}>
            <mesh geometry={petal.glow} renderOrder={15}>
              <meshBasicMaterial
                color={palette.innerGlow}
                transparent
                opacity={0.12 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.mid} renderOrder={16}>
              <meshBasicMaterial
                color={palette.innerMid}
                transparent
                opacity={0.28 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.core} renderOrder={17}>
              <meshBasicMaterial
                color={palette.innerCore}
                transparent
                opacity={0.84}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* маленький центральный слой, чтобы не было пусто */}
      <group ref={microRef}>
        {microLayer.map((petal, index) => (
          <group key={`micro-${index}`}>
            <mesh geometry={petal.glow} renderOrder={18}>
              <meshBasicMaterial
                color={palette.microGlow}
                transparent
                opacity={0.08 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.mid} renderOrder={19}>
              <meshBasicMaterial
                color={palette.microMid}
                transparent
                opacity={0.18 * glowFactor}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            <mesh geometry={petal.core} renderOrder={20}>
              <meshBasicMaterial
                color={palette.microCore}
                transparent
                opacity={0.72}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* живой центр */}
      <mesh ref={centerGlowRef} position={[0, 0, 0.024]} renderOrder={21}>
        <sphereGeometry args={[0.082, 24, 24]} />
        <meshBasicMaterial
          color={palette.center}
          transparent
          opacity={0.24 * glowFactor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.03]} renderOrder={22}>
        <sphereGeometry args={[0.036, 20, 20]} />
        <meshBasicMaterial
          color={palette.centerHot}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}