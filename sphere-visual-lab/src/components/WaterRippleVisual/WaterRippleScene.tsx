import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, DoubleSide, type ShaderMaterial } from 'three';
import type { WaterRippleVisualProps } from './WaterRippleVisual.types';
import { advanceRippleTime } from './rippleTiming';
import { rippleFragmentShader, rippleVertexShader } from './rippleShaders';
import { getRippleDiameter, rippleDefaults } from './rippleConfig';
import { fitDropletDiameter, getDropletStartTime } from './dropletSequence';
import DropletSource from './DropletSource';

type SceneProps = Required<Pick<WaterRippleVisualProps,
  'size' | 'quality' | 'color' | 'speed' | 'glowIntensity' | 'amplitude' |
  'damping' | 'rippleInterval' | 'tilt' | 'paused' | 'dropKey' | 'lineWidth' | 'variant'>>;

const segments = { low: 64, medium: 112, high: 176 } as const;

export default function WaterRippleScene(props: SceneProps) {
  const hasDrop = props.variant === 'droplet';
  const material = useRef<ShaderMaterial>(null);
  const time = useRef(hasDrop ? getDropletStartTime(props.rippleInterval) : 3.5);
  const previousDrop = useRef(props.dropKey);
  const previousVariant = useRef(props.variant);
  const skipDelta = useRef(true);
  const invalidate = useThree((state) => state.invalidate);
  const frameloop = useThree((state) => state.frameloop);
  const viewport = useThree((state) => state.viewport);
  const dimensions = useThree((state) => state.size);
  const uniforms = useMemo(() => ({
    uTime: { value: 3.5 },
    uInterval: { value: 4.8 },
    uDamping: { value: 0.55 },
    uAmplitude: { value: rippleDefaults.amplitude },
    uLineWidth: { value: rippleDefaults.lineWidth },
    uGlow: { value: 1.3 },
    uColor: { value: new Color('#168dff') },
  }), []);

  useEffect(() => {
    // Read the attached material: R3F may reconcile the supplied uniform objects.
    if (!material.current) return;
    const current = material.current.uniforms;
    if (previousDrop.current !== props.dropKey || previousVariant.current !== props.variant) {
      time.current = hasDrop ? getDropletStartTime(props.rippleInterval) : 0;
      previousDrop.current = props.dropKey;
      previousVariant.current = props.variant;
    }
    current.uTime.value = time.current;
    current.uInterval.value = props.rippleInterval;
    current.uDamping.value = props.damping;
    current.uAmplitude.value = props.amplitude;
    current.uLineWidth.value = props.lineWidth;
    current.uGlow.value = props.glowIntensity;
    current.uColor.value.set(props.color);
    invalidate();
  }, [props.dropKey, props.rippleInterval, props.damping, props.amplitude,
    props.lineWidth, props.variant, props.glowIntensity, props.color, hasDrop, invalidate]);

  useEffect(() => {
    skipDelta.current = true;
  }, [frameloop, props.paused, props.speed]);

  useFrame((_, delta) => {
    if (!material.current) return;
    if (!props.paused && frameloop === 'always' && !skipDelta.current) {
      time.current = advanceRippleTime(time.current, delta, props.speed);
      material.current.uniforms.uTime.value = time.current;
    }
    if (frameloop === 'always') {
      skipDelta.current = false;
    }
  }, -1);

  // Pixel-based size is independent of the rectangular container's aspect ratio.
  const baseDiameter = getRippleDiameter(props.size, dimensions.width, dimensions.height, props.tilt, hasDrop);
  const diameter = hasDrop
    ? fitDropletDiameter(baseDiameter, dimensions.height, props.tilt)
    : baseDiameter;
  const scale = (diameter / dimensions.width) * viewport.width / 5.6;
  return (
    <group rotation={[-Math.PI / 2 + props.tilt * Math.PI / 180, 0, 0]} scale={scale}>
      <mesh>
        <planeGeometry args={[5.6, 5.6, segments[props.quality], segments[props.quality]]} />
        <shaderMaterial ref={material} uniforms={uniforms}
          vertexShader={rippleVertexShader} fragmentShader={rippleFragmentShader}
          transparent depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>
      {hasDrop && <DropletSource time={time} interval={props.rippleInterval}
        color={props.color} glow={props.glowIntensity} quality={props.quality} />}
    </group>
  );
}
