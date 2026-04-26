import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface PetalColors {
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
  colors: PetalColors;
}

interface PetalGeometrySet {
  core: THREE.TubeGeometry;
  glow: THREE.TubeGeometry;
  echo: THREE.TubeGeometry;
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.18;
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
    new THREE.Vector3(width * 1.14, length * 0.17, zOffset + bend * 0.12),
    new THREE.Vector3(width * 0.96, length * 0.8, zOffset + bend * 0.78),
    tip,
  );

  const leftCurve = new THREE.CubicBezierCurve3(
    tip,
    new THREE.Vector3(-width * 0.96, length * 0.8, zOffset + bend * 0.78),
    new THREE.Vector3(-width * 1.14, length * 0.17, zOffset + bend * 0.12),
    start,
  );

  const rawPoints = [
    ...rightCurve.getPoints(52),
    ...leftCurve.getPoints(52).slice(1),
  ];

  const rotatedPoints = rawPoints.map((point) =>
    point.clone().applyAxisAngle(Z_AXIS, rotation),
  );

  const path = new THREE.CatmullRomCurve3(
    rotatedPoints,
    false,
    'catmullrom',
    0.42,
  );

  return new THREE.TubeGeometry(path, 180, radius, 12, false);
}

function createPetalLayer(
  count: number,
  length: number,
  width: number,
  rotationOffset: number,
  coreRadius: number,
  glowRadius: number,
  echoRadius: number,
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
      glow: createPetalTubeGeometry(
        length,
        width,
        rotation,
        glowRadius,
        zOffset,
        bend,
      ),
      echo: createPetalTubeGeometry(
        length,
        width,
        rotation,
        echoRadius,
        zOffset,
        bend,
      ),
    };
  });
}

interface PetalLayerProps {
  items: PetalGeometrySet[];
  coreColor: THREE.Color;
  glowColor: THREE.Color;
  echoColor: THREE.Color;
  coreOpacity: number;
  glowOpacity: number;
  echoOpacity: number;
  renderOrderBase: number;
}

function PetalLayer({
  items,
  coreColor,
  glowColor,
  echoColor,
  coreOpacity,
  glowOpacity,
  echoOpacity,
  renderOrderBase,
}: PetalLayerProps) {
  return (
    <>
      {items.map((item, index) => (
        <group key={`petal-layer-${renderOrderBase}-${index}`}>
          <mesh geometry={item.echo} renderOrder={renderOrderBase}>
            <meshBasicMaterial
              color={echoColor}
              transparent
              opacity={echoOpacity}
              depthWrite={false}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <mesh geometry={item.glow} renderOrder={renderOrderBase + 1}>
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={glowOpacity}
              depthWrite={false}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <mesh geometry={item.core} renderOrder={renderOrderBase + 2}>
            <meshBasicMaterial
              color={coreColor}
              transparent
              opacity={coreOpacity}
              depthWrite={false}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function PetalField({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
}: PetalFieldProps) {
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const echoRef = useRef<THREE.Group>(null);

  const glowFactor = getGlowFactor(glowIntensity);

  const outerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.9,
        0.24,
        0,
        0.0048,
        0.0108,
        0.018,
        0.01,
        0.018,
      ),
    [],
  );

  const innerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.72,
        0.18,
        Math.PI / 8,
        0.0039,
        0.0088,
        0.0148,
        0.02,
        0.012,
      ),
    [],
  );

  const farEchoLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.98,
        0.29,
        Math.PI / 16,
        0.0032,
        0.012,
        0.024,
        -0.03,
        0.02,
      ),
    [],
  );

  const outerCoreColor = useMemo(
    () => colors.white.clone().lerp(colors.mint, 0.32),
    [colors],
  );

  const outerGlowColor = useMemo(
    () => colors.mint.clone().lerp(colors.halo, 0.22),
    [colors],
  );

  const outerEchoColor = useMemo(
    () => colors.mint.clone().lerp(colors.halo, 0.56),
    [colors],
  );

  const innerCoreColor = useMemo(
    () => colors.white.clone().lerp(colors.violet, 0.2),
    [colors],
  );

  const innerGlowColor = useMemo(
    () => colors.violet.clone().lerp(colors.pink, 0.28),
    [colors],
  );

  const innerEchoColor = useMemo(
    () => colors.violet.clone().lerp(colors.pink, 0.48),
    [colors],
  );

  const farEchoColor = useMemo(
    () => colors.pink.clone().lerp(colors.mint, 0.38),
    [colors],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.45 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    const outerBreath =
      1 + Math.sin(elapsed * 0.9 * motionFactor) * 0.018 * motionFactor;

    const innerBreath =
      1 +
      Math.sin(elapsed * 1.02 * motionFactor + 0.9) * 0.014 * motionFactor;

    const farBreath =
      1 +
      Math.sin(elapsed * 0.78 * motionFactor + 1.4) * 0.024 * motionFactor;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(outerBreath);
      outerRef.current.rotation.z = elapsed * 0.024 * safeSpeed * motionFactor;
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(innerBreath);
      innerRef.current.rotation.z =
        -elapsed * 0.032 * safeSpeed * motionFactor;
    }

    if (echoRef.current) {
      echoRef.current.scale.setScalar(farBreath);
      echoRef.current.rotation.z =
        elapsed * 0.012 * safeSpeed * motionFactor +
        Math.sin(elapsed * 0.34 * motionFactor) * 0.02;
    }
  });

  return (
    <group renderOrder={20}>
      <group ref={echoRef}>
        <PetalLayer
          items={farEchoLayer}
          coreColor={farEchoColor}
          glowColor={farEchoColor}
          echoColor={farEchoColor}
          coreOpacity={0.03 * glowFactor}
          glowOpacity={0.05 * glowFactor}
          echoOpacity={0.07 * glowFactor}
          renderOrderBase={20}
        />
      </group>

      <group ref={outerRef}>
        <PetalLayer
          items={outerLayer}
          coreColor={outerCoreColor}
          glowColor={outerGlowColor}
          echoColor={outerEchoColor}
          coreOpacity={0.82 * glowFactor}
          glowOpacity={0.18 * glowFactor}
          echoOpacity={0.07 * glowFactor}
          renderOrderBase={23}
        />
      </group>

      <group ref={innerRef}>
        <PetalLayer
          items={innerLayer}
          coreColor={innerCoreColor}
          glowColor={innerGlowColor}
          echoColor={innerEchoColor}
          coreOpacity={0.5 * glowFactor}
          glowOpacity={0.14 * glowFactor}
          echoOpacity={0.06 * glowFactor}
          renderOrderBase={26}
        />
      </group>
    </group>
  );
}