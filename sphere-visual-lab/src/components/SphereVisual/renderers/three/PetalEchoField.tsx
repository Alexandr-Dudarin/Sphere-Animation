import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GlowIntensity } from '../../SphereVisual.types';

interface PetalEchoColors {
  accent: THREE.Color;
  halo: THREE.Color;
  violet: THREE.Color;
  pink: THREE.Color;
  mint: THREE.Color;
  white: THREE.Color;
}

interface PetalEchoFieldProps {
  speed: number;
  reducedMotion: boolean;
  glowIntensity: GlowIntensity;
  colors: PetalEchoColors;
  echoStrength: number;
}

interface EchoPetalGeometrySet {
  haze: THREE.TubeGeometry;
  bloom: THREE.TubeGeometry;
  ghost: THREE.TubeGeometry;
}

const Z_AXIS = new THREE.Vector3(0, 0, 1);

function getGlowFactor(glowIntensity: GlowIntensity) {
  switch (glowIntensity) {
    case 'low':
      return 0.82;
    case 'high':
      return 1.2;
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
    new THREE.Vector3(width * 1.03, length * 0.18, zOffset + bend * 0.15),
    new THREE.Vector3(width * 0.94, length * 0.78, zOffset + bend * 0.82),
    tip,
  );

  const leftCurve = new THREE.CubicBezierCurve3(
    tip,
    new THREE.Vector3(-width * 0.94, length * 0.78, zOffset + bend * 0.82),
    new THREE.Vector3(-width * 1.03, length * 0.18, zOffset + bend * 0.15),
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
  ghostRadius: number,
  bloomRadius: number,
  hazeRadius: number,
  zOffset = 0,
  bend = 0,
): EchoPetalGeometrySet[] {
  return Array.from({ length: count }, (_, index) => {
    const rotation = (index / count) * Math.PI * 2 + rotationOffset;

    return {
      haze: createPetalTubeGeometry(
        length,
        width,
        rotation,
        hazeRadius,
        zOffset,
        bend,
      ),
      bloom: createPetalTubeGeometry(
        length,
        width,
        rotation,
        bloomRadius,
        zOffset,
        bend,
      ),
      ghost: createPetalTubeGeometry(
        length,
        width,
        rotation,
        ghostRadius,
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

function getOuterPalette(index: number, count: number, colors: PetalEchoColors) {
  const t = index / count;
  const waveA = (Math.sin(t * Math.PI * 2 + 0.3) + 1) * 0.5;
  const waveB = (Math.sin(t * Math.PI * 2 + 2.4) + 1) * 0.5;

  return {
    haze: mix3(
      colors.halo,
      colors.violet,
      colors.mint,
      0.1 + waveA * 0.1,
      0.04 + waveB * 0.06,
    ),
    bloom: mix3(
      colors.violet,
      colors.pink,
      colors.mint,
      0.18 + waveA * 0.16,
      0.06 + waveB * 0.08,
    ),
    ghost: mix3(
      colors.halo,
      colors.white,
      colors.violet,
      0.14 + waveA * 0.1,
      0.05 + waveB * 0.06,
    ),
  };
}

function getInnerPalette(index: number, count: number, colors: PetalEchoColors) {
  const t = index / count;
  const waveA = (Math.sin(t * Math.PI * 2 + 1.2) + 1) * 0.5;
  const waveB = (Math.sin(t * Math.PI * 2 + 3.1) + 1) * 0.5;

  return {
    haze: mix3(
      colors.halo,
      colors.violet,
      colors.mint,
      0.08 + waveA * 0.08,
      0.04 + waveB * 0.05,
    ),
    bloom: mix3(
      colors.violet,
      colors.pink,
      colors.halo,
      0.15 + waveA * 0.13,
      0.05 + waveB * 0.06,
    ),
    ghost: mix3(
      colors.halo,
      colors.white,
      colors.mint,
      0.1 + waveA * 0.08,
      0.04 + waveB * 0.05,
    ),
  };
}

export default function PetalEchoField({
  speed,
  reducedMotion,
  glowIntensity,
  colors,
  echoStrength,
}: PetalEchoFieldProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  const glowFactor = getGlowFactor(glowIntensity);
  const echoFactor = THREE.MathUtils.clamp(echoStrength, 0.45, 1.7);

  const outerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.95,
        0.205,
        0,
        0.0115,
        0.024,
        0.043,
        -0.012,
        0.02,
      ),
    [],
  );

  const innerLayer = useMemo(
    () =>
      createPetalLayer(
        8,
        0.82,
        0.17,
        Math.PI / 8,
        0.0095,
        0.019,
        0.034,
        -0.008,
        0.014,
      ),
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const motionFactor = reducedMotion ? 0.35 : 1;
    const safeSpeed = Math.max(speed, 0.15);

    if (rootRef.current) {
      const breath = 1 + Math.sin(elapsed * 0.78 * motionFactor) * 0.014;
      rootRef.current.scale.setScalar(breath);
      rootRef.current.rotation.z =
        Math.sin(elapsed * 0.1 * safeSpeed * motionFactor) * 0.03;
    }

    if (outerRef.current) {
      outerRef.current.rotation.z =
        elapsed * 0.028 * safeSpeed * motionFactor;
    }

    if (innerRef.current) {
      innerRef.current.rotation.z =
        -elapsed * 0.038 * safeSpeed * motionFactor +
        Math.sin(elapsed * 0.42 * motionFactor) * 0.02;
    }
  });

  return (
    <group ref={rootRef} renderOrder={7}>
      <group ref={outerRef}>
        {outerLayer.map((petal, index) => {
          const palette = getOuterPalette(index, outerLayer.length, colors);

          return (
            <group key={`outer-echo-${index}`}>
              <mesh geometry={petal.haze} renderOrder={8}>
                <meshBasicMaterial
                  color={palette.haze}
                  transparent
                  opacity={0.034 * glowFactor * echoFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.bloom} renderOrder={9}>
                <meshBasicMaterial
                  color={palette.bloom}
                  transparent
                  opacity={0.068 * glowFactor * echoFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.ghost} renderOrder={10}>
                <meshBasicMaterial
                  color={palette.ghost}
                  transparent
                  opacity={0.094 * glowFactor * echoFactor}
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
            <group key={`inner-echo-${index}`}>
              <mesh geometry={petal.haze} renderOrder={11}>
                <meshBasicMaterial
                  color={palette.haze}
                  transparent
                  opacity={0.026 * glowFactor * echoFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.bloom} renderOrder={12}>
                <meshBasicMaterial
                  color={palette.bloom}
                  transparent
                  opacity={0.056 * glowFactor * echoFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>

              <mesh geometry={petal.ghost} renderOrder={13}>
                <meshBasicMaterial
                  color={palette.ghost}
                  transparent
                  opacity={0.08 * glowFactor * echoFactor}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}