import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, type Mesh, type ShaderMaterial } from 'three';
import { dropFragmentShader, dropVertexShader, spoutFragmentShader, spoutVertexShader } from './dropShaders';
import { getDropletSequence } from './dropletSequence';
import { createSpoutCurves } from './spoutGeometry';
import type { WaterRippleQuality } from './WaterRippleVisual.types';

interface Props {
  time: RefObject<number>;
  interval: number;
  color: string;
  glow: number;
  quality: WaterRippleQuality;
}

export default function DropletSource({ time, interval, color, glow, quality }: Props) {
  const liquidMeshes = useRef<(Mesh | null)[]>([]);
  const liquidMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const spoutMaterials = useRef<(ShaderMaterial | null)[]>([]);
  const invalidate = useThree((state) => state.invalidate);
  const curves = useMemo(() => createSpoutCurves(), []);
  const liquidUniforms = useMemo(() => Array.from({ length: 5 }, () => ({
    uColor: { value: new Color('#168dff') }, uOpacity: { value: 0 },
    uGlow: { value: 1.3 }, uTaper: { value: 0 }, uTip: { value: 0 },
  })), []);
  const spoutUniforms = useMemo(() => Array.from({ length: 6 }, (_, index) => ({
    uColor: { value: new Color('#168dff') }, uOpacity: { value: index % 2 === 0 ? 0.72 : 0.08 },
    uGlow: { value: 1.3 },
  })), []);

  useEffect(() => {
    for (const material of [...liquidMaterials.current, ...spoutMaterials.current]) {
      if (!material) continue;
      material.uniforms.uColor.value.set(color);
      material.uniforms.uGlow.value = glow;
    }
    invalidate();
  }, [color, glow, invalidate]);

  useFrame(() => {
    const sequence = getDropletSequence(time.current, interval);
    const poses = [sequence.main, ...sequence.satellites, sequence.source, sequence.neck];
    poses.forEach((pose, index) => {
      const mesh = liquidMeshes.current[index];
      const material = liquidMaterials.current[index];
      if (!mesh || !material) return;
      mesh.visible = pose.visible;
      mesh.position.set(...pose.position);
      mesh.scale.set(...pose.scale);
      mesh.rotation.set(Math.PI / 2, 0, pose.tilt);
      material.uniforms.uOpacity.value = pose.opacity;
      material.uniforms.uTaper.value = pose.taper;
      material.uniforms.uTip.value = pose.tip;
    });
  });

  return (
    <group>
      {curves.flatMap((curve, index) => [0.007, 0.022].map((radius, layer) => {
        const key = index * 2 + layer;
        return <mesh key={`lip-${key}`} renderOrder={1}>
          <tubeGeometry args={[curve, 64, radius, 8, false]} />
          <shaderMaterial ref={(material) => { spoutMaterials.current[key] = material; }}
            uniforms={spoutUniforms[key]} vertexShader={spoutVertexShader}
            fragmentShader={spoutFragmentShader} transparent depthWrite={false} toneMapped={false} />
        </mesh>;
      }))}
      {liquidUniforms.map((uniforms, index) => <mesh key={`liquid-${index}`} visible={false} renderOrder={2}
        ref={(mesh) => { liquidMeshes.current[index] = mesh; }}>
        <sphereGeometry args={[1, quality === 'low' ? 32 : 64, quality === 'low' ? 24 : 40]} />
        <shaderMaterial ref={(material) => { liquidMaterials.current[index] = material; }}
          uniforms={uniforms} vertexShader={dropVertexShader} fragmentShader={dropFragmentShader}
          transparent depthWrite={false} toneMapped={false} />
      </mesh>)}
    </group>
  );
}
