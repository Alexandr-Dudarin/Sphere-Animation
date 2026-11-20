import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BackSide, CatmullRomCurve3, Color, Vector3,
  type Group, type ShaderMaterial } from 'three';
import type { BinaryPlanetVisualProps } from './BinaryPlanetVisual.types';
import { getBinaryPreset, type PlanetAppearance } from './binaryPresets';
import { advanceBinaryTime, BINARY_ROLL, binaryBounds, binaryPositions,
  fitBinaryWidth, INITIAL_ANOMALY, ORBIT_RATE } from './binaryMotion';
import { atmosphereFragment, orbitFragment, orbitVertex, planetFragment, planetVertex } from './binaryShaders';

type SceneProps = Required<Pick<BinaryPlanetVisualProps, 'size' | 'preset' | 'quality' |
  'speed' | 'separation' | 'tilt' | 'glowIntensity' | 'showOrbits' | 'paused' | 'resetKey'>>;

function Planet({ appearance, time, glow, segments, index }: {
  appearance: PlanetAppearance; time: RefObject<number>; glow: number; segments: number; index: number;
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
  return <group ref={spin}>
    <mesh>
      <sphereGeometry args={[appearance.radius, segments, segments / 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={planetVertex} fragmentShader={planetFragment}
        toneMapped={false} />
    </mesh>
    <mesh scale={1.09}>
      <sphereGeometry args={[appearance.radius, segments, segments / 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={planetVertex} fragmentShader={atmosphereFragment}
        side={BackSide} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </mesh>
  </group>;
}

function Orbit({ curve, color, time, glow, segments, index }: {
  curve: CatmullRomCurve3; color: string; time: RefObject<number>; glow: number; segments: number; index: number;
}) {
  const material = useRef<ShaderMaterial>(null);
  const halo = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uColor: { value: new Color(color) }, uTime: { value: 0 },
    uGlow: { value: glow }, uOpacity: { value: 0.72 }, uOffset: { value: index * Math.PI },
  }), [color, glow, index]);
  const haloUniforms = useMemo(() => ({ ...uniforms, uOpacity: { value: 0.08 } }), [uniforms]);
  useFrame(() => {
    for (const ref of [material, halo]) if (ref.current) ref.current.uniforms.uTime.value = time.current;
  });
  return <>
    <mesh>
      <tubeGeometry args={[curve, segments * 2, 0.007, 6, true]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={orbitVertex} fragmentShader={orbitFragment}
        transparent depthWrite={false} toneMapped={false} />
    </mesh>
    <mesh>
      <tubeGeometry args={[curve, segments * 2, 0.025, 6, true]} />
      <shaderMaterial ref={halo} uniforms={haloUniforms} vertexShader={orbitVertex} fragmentShader={orbitFragment}
        transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </mesh>
  </>;
}

export default function BinaryPlanetScene(props: SceneProps) {
  const config = getBinaryPreset(props.preset);
  const time = useRef(0);
  const first = useRef<Group>(null), second = useRef<Group>(null);
  const skipDelta = useRef(true);
  const { viewport, size: dimensions, invalidate, frameloop } = useThree();
  const segments = { low: 32, medium: 64, high: 96 }[props.quality];
  const curves = useMemo(() => [0, 1].map((planet) => new CatmullRomCurve3(
    Array.from({ length: 128 }, (_, i) => {
      const point = binaryPositions(i / 128 * Math.PI * 2, props.separation,
        config.massRatio, config.eccentricity)[planet];
      return new Vector3(...point);
    }), true, 'centripetal',
  )), [props.separation, config]);

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
    <group rotation={[props.tilt * Math.PI / 180, 0, 0]}>
      {props.showOrbits && curves.map((curve, i) => <Orbit key={i} curve={curve}
        color={config.planets[i].atmosphere} time={time} glow={props.glowIntensity} segments={segments} index={i} />)}
      <group ref={first}>
        <Planet appearance={config.planets[0]} time={time} glow={props.glowIntensity} segments={segments} index={0} />
      </group>
      <group ref={second}>
        <Planet appearance={config.planets[1]} time={time} glow={props.glowIntensity} segments={segments} index={1} />
      </group>
    </group>
  </group>;
}
