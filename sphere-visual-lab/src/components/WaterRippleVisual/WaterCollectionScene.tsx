import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Color, DoubleSide, Object3D, Vector4,
  type InstancedMesh, type Mesh, type ShaderMaterial } from 'three';
import type { WaterRippleVisualProps } from './WaterRippleVisual.types';
import { advanceRippleTime } from './rippleTiming';
import { canTraceWave, createImpactSchedule, MAX_WATER_IMPACTS, RAIN_DROP_SCALE, rainHeight,
  retainImpacts, scheduleImpacts, type WaterImpact } from './waterCollectionMotion';
import { multiRippleFragment, rainFragment, rainVertex, surfaceVertex } from './waterCollectionShaders';

type Props = Required<Pick<WaterRippleVisualProps, 'size' | 'quality' | 'variant' | 'color' |
  'speed' | 'glowIntensity' | 'lineWidth' | 'damping' | 'tilt' | 'paused' | 'dropKey' | 'intensity'>>;

function writeImpactUniforms(materials: (ShaderMaterial | null)[], time: number, impacts: WaterImpact[]) {
  // Three.js owns these mutable GPU uniforms, outside React's render state.
  for (const material of materials) {
    if (!material) continue;
    material.uniforms.uTime.value = time;
    material.uniforms.uImpactCount.value = impacts.length;
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
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const object = useMemo(() => new Object3D(), []);
  const { viewport, size: dimensions, invalidate, frameloop } = useThree();
  const raining = props.variant === 'rain';
  const interactive = props.variant === 'interactive';
  const uniforms = useMemo(() => Array.from({ length: 2 }, () => ({
    uTime: { value: 0 }, uColor: { value: new Color('#168dff') },
    uGlow: { value: 1.3 }, uDamping: { value: 0.55 }, uLineWidth: { value: 0.02 },
    uImpactCount: { value: 0 },
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
    if (raining) impacts = scheduleImpacts(schedule.current, t, props.intensity);
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
  const top = Math.max(2.8 * Math.sin(angle), raining ? 1.85 * Math.cos(angle) + 1.7 * Math.sin(angle) : 0);
  const diameter = Math.min(props.size, dimensions.width * 0.94,
    dimensions.height * 0.82 * 5.6 / Math.max(top + bottom, 0.1));
  const scale = diameter / dimensions.width * viewport.width / 5.6;

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
  </group>;
}
