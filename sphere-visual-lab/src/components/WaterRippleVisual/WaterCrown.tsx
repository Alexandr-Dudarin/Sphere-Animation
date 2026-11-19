import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, DoubleSide, type Mesh, type ShaderMaterial } from 'three';
import { crownFragment, crownVertex } from './waterCollectionShaders';

interface Props { time: RefObject<number>; interval: number; color: string; glow: number; lineWidth: number }

export default function WaterCrown({ time, interval, color, glow, lineWidth }: Props) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(() => ({ uAge: { value: 0 }, uColor: { value: new Color('#168dff') },
    uGlow: { value: 1.3 }, uLineWidth: { value: 0.02 } }), []);
  useEffect(() => {
    if (material.current) {
      material.current.uniforms.uColor.value.set(color);
      material.current.uniforms.uGlow.value = glow;
      material.current.uniforms.uLineWidth.value = lineWidth;
    }
    invalidate();
  }, [color, glow, lineWidth, invalidate]);
  useFrame(() => {
    const age = time.current < 0 ? -1 : time.current % interval;
    if (mesh.current) mesh.current.visible = age >= 0 && age < 0.88;
    if (material.current) material.current.uniforms.uAge.value = age;
  });
  return <mesh ref={mesh} visible={false} frustumCulled={false} renderOrder={3}>
    <planeGeometry args={[1, 1, 144, 12]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={crownVertex}
      fragmentShader={crownFragment} transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
  </mesh>;
}
