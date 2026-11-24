import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, DoubleSide,
  type Group, type ShaderMaterial } from 'three';
import type { BinaryPlanetVisualProps } from './BinaryPlanetVisual.types';
import { getBinaryPreset, type PlanetAppearance } from './binaryPresets';
import { advanceBinaryTime, BINARY_ROLL, binaryBounds, binaryPositions, binaryRingDimensions,
  fitBinaryWidth, INITIAL_ANOMALY, ORBIT_RATE } from './binaryMotion';
import { planetFragment, planetVertex } from './binaryShaders';
import { createPlanetRingGeometry } from '../shared/planetRing/planetRingGeometry';
import { planetRingVertex, planetRingFragment } from '../shared/planetRing/planetRingShaders';

type SceneProps = Required<Pick<BinaryPlanetVisualProps, 'size' | 'preset' | 'quality' |
  'speed' | 'separation' | 'tilt' | 'glowIntensity' | 'showRing' | 'paused' | 'resetKey'>>;

function Planet({ appearance, time, glow, segments, index, planeTilt }: {
  appearance: PlanetAppearance; time: RefObject<number>; glow: number; segments: number; index: number; planeTilt: number;
}) {
  const spin = useRef<Group>(null);
  const uniforms = useMemo(() => ({
    uColor: { value: new Color(appearance.color) }, uAccent: { value: new Color(appearance.accent) },
    uAtmosphere: { value: new Color(appearance.atmosphere) }, uSeed: { value: appearance.seed },
    uBands: { value: appearance.bands }, uGlow: { value: glow },
  }), [appearance, glow]);
  useFrame(() => {
    if (spin.current) spin.current.rotation.set(0.22 + index * 0.18,
      time.current * (index === 0 ? 0.12 : -0.15) + index * 1.7, -0.15);
  });
  // Orbital inclination should not tip the planets' spin axes toward the camera.
  return <group rotation={[-planeTilt, 0, 0]}><group ref={spin}>
    <mesh>
      <sphereGeometry args={[appearance.radius, segments, segments / 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={planetVertex} fragmentShader={planetFragment}
        toneMapped={false} />
    </mesh>
  </group></group>;
}

/** One broad annulus, using the same striped material as the original Ring Planet.
 * Real depth testing works for both moving opaque planets; no fixed front/back overlay.
 */
function SharedRing({ inner, outer, color, time, glow }: {
  inner: number; outer: number; color: string; time: RefObject<number>; glow: number;
}) {
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => createPlanetRingGeometry(
    (inner + outer) / 2, (outer - inner) / 8.4, 1, 1, 0, 0,
  ), [inner, outer]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uOpacity: { value: 0.95 * glow },
    uFlowSpeed: { value: 0.7 }, uShimmerSpeed: { value: 0.6 }, uOffset: { value: 0 },
    uDepthSide: { value: 0 }, uDepthFeather: { value: 0.04 }, uBaseColor: { value: new Color(color) },
  }), [color, glow]);
  useFrame(() => { if (material.current) material.current.uniforms.uTime.value = time.current; });
  return <mesh geometry={geometry}>
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={planetRingVertex}
      fragmentShader={planetRingFragment} side={DoubleSide} transparent depthWrite={false}
      depthTest toneMapped={false} />
  </mesh>;
}

export default function BinaryPlanetScene(props: SceneProps) {
  const config = getBinaryPreset(props.preset);
  const time = useRef(0);
  const first = useRef<Group>(null), second = useRef<Group>(null);
  const skipDelta = useRef(true);
  const { viewport, size: dimensions, invalidate, frameloop } = useThree();
  const segments = { low: 32, medium: 64, high: 96 }[props.quality];
  const ring = binaryRingDimensions(config, props.separation);

  useEffect(() => { time.current = 0; skipDelta.current = true; invalidate(); },
    [props.resetKey, config, invalidate]);
  useEffect(() => { skipDelta.current = true; invalidate(); },
    [props.paused, props.speed, frameloop, invalidate]);
  useFrame((_, delta) => {
    if (!props.paused && frameloop === 'always' && !skipDelta.current) {
      time.current = advanceBinaryTime(time.current, delta, props.speed);
    }
    if (frameloop === 'always') skipDelta.current = false;
    const positions = binaryPositions(INITIAL_ANOMALY + time.current * ORBIT_RATE,
      props.separation, config.massRatio, config.eccentricity);
    first.current?.position.set(...positions[0]);
    second.current?.position.set(...positions[1]);
  }, -1);

  const bounds = binaryBounds(config, props.separation, props.tilt);
  const width = fitBinaryWidth(props.size, dimensions.width, dimensions.height, bounds);
  const scale = width / dimensions.width * viewport.width / (bounds.x * 2);
  return <group scale={scale} rotation={[0, 0, BINARY_ROLL]}>
    <group rotation={[-props.tilt * Math.PI / 180, 0, 0]}>
      {props.showRing && <SharedRing inner={ring.inner} outer={ring.outer} color={config.ringColor}
        time={time} glow={props.glowIntensity} />}
      <group ref={first}>
        <Planet appearance={config.planets[0]} time={time} glow={props.glowIntensity} segments={segments} index={0}
          planeTilt={-props.tilt * Math.PI / 180} />
      </group>
      <group ref={second}>
        <Planet appearance={config.planets[1]} time={time} glow={props.glowIntensity} segments={segments} index={1}
          planeTilt={-props.tilt * Math.PI / 180} />
      </group>
    </group>
  </group>;
}
