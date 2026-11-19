import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Color, DoubleSide, Object3D, Vector4, CatmullRomCurve3, Vector3,
  type InstancedMesh, type Mesh, type ShaderMaterial } from 'three';
import type { WaterRippleVisualProps } from './WaterRippleVisual.types';
import { advanceRippleTime } from './rippleTiming';
import { canTraceWave, createImpactSchedule, CROWN_LIFETIME, MAX_WATER_IMPACTS, RAIN_DROP_SCALE, rainHeight,
  retainImpacts, scheduleImpacts, type WaterImpact } from './waterCollectionMotion';
import { crownFragment, crownVertex, multiRippleFragment, rainFragment, rainVertex, surfaceVertex,
  waterfallFragment, waterfallVertex } from './waterCollectionShaders';

type Props = Required<Pick<WaterRippleVisualProps, 'size' | 'quality' | 'variant' | 'color' |
  'speed' | 'glowIntensity' | 'lineWidth' | 'damping' | 'tilt' | 'paused' | 'dropKey' | 'intensity'>>;

function writeImpactUniforms(materials: (ShaderMaterial | null)[], time: number, impacts: WaterImpact[]) {
  // Three.js owns these mutable GPU uniforms, outside React's render state.
  for (const material of materials) {
    if (!material) continue;
    material.uniforms.uTime.value = time;
    const vectors = material.uniforms.uImpacts.value as Vector4[];
    for (let i = 0; i < MAX_WATER_IMPACTS; i++) {
      const impact = impacts[i];
      vectors[i].set(impact?.x ?? 0, impact?.y ?? 0, impact?.time ?? 0, impact?.strength ?? 0);
    }
  }
}

export default function WaterCollectionScene(props: Props) {
  const time = useRef(props.variant === 'interactive' ? 0 : 1.6);
  const schedule = useRef(createImpactSchedule());
  const manual = useRef<WaterImpact[]>([]);
  const previousDrop = useRef(props.dropKey);
  const skipDelta = useRef(true);
  const surface = useRef<Mesh>(null);
  const rain = useRef<InstancedMesh>(null);
  const splashes = useRef<InstancedMesh>(null);
  const splashAges = useMemo(() => new Float32Array(MAX_WATER_IMPACTS), []);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const object = useMemo(() => new Object3D(), []);
  const { viewport, size: dimensions, invalidate, frameloop } = useThree();
  const waterfall = props.variant === 'waterfall';
  const raining = props.variant === 'rain';
  const interactive = props.variant === 'interactive';
  const lip = useMemo(() => new CatmullRomCurve3([
    new Vector3(-0.91, 0.01, 2.04), new Vector3(-0.48, 0, 2.06),
    new Vector3(0, 0, 2.05), new Vector3(0.48, 0, 2.04), new Vector3(0.91, 0.01, 2.06),
  ]), []);
  const uniforms = useMemo(() => Array.from({ length: 4 }, () => ({
    uTime: { value: 0 }, uAge: { value: 0 }, uColor: { value: new Color('#168dff') },
    uGlow: { value: 1.3 }, uDamping: { value: 0.55 }, uLineWidth: { value: 0.02 },
    uIntensity: { value: 1 },
    uImpacts: { value: Array.from({ length: MAX_WATER_IMPACTS }, () => new Vector4(0, 0, 0, 0)) },
  })), []);

  useEffect(() => {
    if (previousDrop.current !== props.dropKey) {
      previousDrop.current = props.dropKey;
      if (interactive) {
        manual.current = retainImpacts([...manual.current,
          { x: 0, y: 0, time: time.current, strength: 1 }], time.current);
      } else {
        time.current = 0;
        schedule.current = createImpactSchedule();
      }
    }
    for (const material of materials.current) {
      if (!material) continue;
      const u = material.uniforms;
      u.uColor.value.set(props.color);
      u.uGlow.value = props.glowIntensity;
      u.uLineWidth.value = props.lineWidth;
      u.uDamping.value = props.damping;
      u.uIntensity.value = props.intensity;
    }
    invalidate();
  }, [props.dropKey, props.color, props.glowIntensity, props.lineWidth, props.damping,
    props.intensity, interactive, invalidate]);

  useEffect(() => { skipDelta.current = true; }, [frameloop, props.paused, props.speed]);

  useFrame((_, delta) => {
    if (!props.paused && frameloop === 'always' && !skipDelta.current) {
      time.current = advanceRippleTime(time.current, delta, props.speed);
    }
    if (frameloop === 'always') skipDelta.current = false;
    const t = time.current;
    let impacts: WaterImpact[] = [];
    if (raining || waterfall) impacts = scheduleImpacts(schedule.current, t, props.intensity, waterfall);
    if (interactive) {
      manual.current = retainImpacts(manual.current, t);
      impacts = manual.current;
    }
    writeImpactUniforms(materials.current, t, impacts);
    if (rain.current) {
      let count = 0;
      for (const impact of impacts) {
        const z = rainHeight(t, impact.time);
        if (z === null) continue;
        const length = (0.12 + 0.12 * (1 - z / 1.65)) * RAIN_DROP_SCALE;
        object.position.set(impact.x, impact.y, z + length / 2);
        object.rotation.set(Math.PI / 2, 0, 0);
        object.scale.set(0.038 * props.lineWidth / 0.02 * RAIN_DROP_SCALE, length, 1);
        object.updateMatrix();
        rain.current.setMatrixAt(count++, object.matrix);
      }
      rain.current.count = count;
      rain.current.instanceMatrix.needsUpdate = true;
    }
    if (splashes.current) {
      let count = 0;
      for (const impact of impacts) {
        const age = t - impact.time;
        // The same impact starts the surface rings and its crown; no premature splashes.
        if (age < 0 || age >= CROWN_LIFETIME) continue;
        const width = 0.58 + impact.strength * 0.6;
        object.position.set(impact.x, impact.y, 0);
        object.rotation.set(0, 0, impact.x * 7);
        object.scale.set(width, width, 0.85 + impact.strength);
        object.updateMatrix();
        splashes.current.geometry.getAttribute('aAge').setX(count, age);
        splashes.current.setMatrixAt(count++, object.matrix);
      }
      splashes.current.count = count;
      splashes.current.instanceMatrix.needsUpdate = true;
      splashes.current.geometry.getAttribute('aAge').needsUpdate = true;
    }
  }, -1);

  function touchWater(event: ThreeEvent<PointerEvent>, force: boolean) {
    if (!interactive || props.paused || !surface.current) return;
    const local = surface.current.worldToLocal(event.point.clone());
    if (Math.hypot(local.x, local.y) > 2.3) return;
    const impact = { x: local.x, y: local.y, time: time.current, strength: force ? 1 : 0.7 };
    const previous = manual.current.at(-1);
    if (force || canTraceWave(previous, impact)) {
      manual.current = retainImpacts([...manual.current, impact], time.current);
      invalidate();
    }
  }

  const angle = props.tilt * Math.PI / 180;
  const bottom = 2.8 * Math.sin(angle);
  const top = Math.max(2.8 * Math.sin(angle), waterfall ? 2.12 * Math.cos(angle) :
    raining ? 1.85 * Math.cos(angle) + 1.7 * Math.sin(angle) : 0);
  const diameter = Math.min(props.size, dimensions.width * 0.94,
    dimensions.height * 0.82 * 5.6 / Math.max(top + bottom, 0.1));
  const scale = diameter / dimensions.width * viewport.width / 5.6;
  const segments = props.quality === 'low' ? 48 : props.quality === 'high' ? 144 : 96;

  return <group rotation={[-Math.PI / 2 + angle, 0, 0]} scale={scale}
    position={[0, -(top - bottom) * scale * 0.5, 0]}>
    <mesh ref={surface} frustumCulled={false}
      onPointerMove={interactive ? (event) => touchWater(event, false) : undefined}
      onPointerDown={interactive ? (event) => touchWater(event, true) : undefined}>
      <planeGeometry args={[5.6, 5.6]} />
      <shaderMaterial ref={(value) => { materials.current[0] = value; }} uniforms={uniforms[0]}
        vertexShader={surfaceVertex}
        fragmentShader={multiRippleFragment}
        transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
    </mesh>
    {raining && <instancedMesh ref={rain} args={[undefined, undefined, MAX_WATER_IMPACTS]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={(value) => { materials.current[1] = value; }} uniforms={uniforms[1]}
        vertexShader={rainVertex} fragmentShader={rainFragment}
        transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
    </instancedMesh>}
    {waterfall && <>
      <mesh frustumCulled={false}>
        <planeGeometry args={[1, 1, segments, segments]} />
        <shaderMaterial ref={(value) => { materials.current[2] = value; }} uniforms={uniforms[2]}
          vertexShader={waterfallVertex} fragmentShader={waterfallFragment}
          transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[lip, 48, props.lineWidth * 0.28, 6, false]} />
        <meshBasicMaterial color={props.color} transparent opacity={Math.min(props.glowIntensity * 0.6, 1)}
          depthWrite={false} toneMapped={false} />
      </mesh>
      <instancedMesh ref={splashes} args={[undefined, undefined, MAX_WATER_IMPACTS]}
        count={0} frustumCulled={false} renderOrder={3}>
        <planeGeometry args={[1, 1, segments, 12]}>
          <instancedBufferAttribute attach="attributes-aAge" args={[splashAges, 1]} />
        </planeGeometry>
        <shaderMaterial ref={(value) => { materials.current[3] = value; }} uniforms={uniforms[3]}
          vertexShader={crownVertex} fragmentShader={crownFragment}
          transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </instancedMesh>
    </>}
  </group>;
}
