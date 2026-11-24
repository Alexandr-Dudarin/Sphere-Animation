import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../SphereVisual/hooks/useReducedMotion';
import type { BinaryPlanetVisualProps } from './BinaryPlanetVisual.types';
import { clampBinary } from './binaryMotion';
import { getBinaryPreset } from './binaryPresets';
import BinaryPlanetScene from './BinaryPlanetScene';
import styles from './BinaryPlanetVisual.module.css';

export default function BinaryPlanetVisual({ size = 620, width, height, preset = 'ice-twins',
  quality = 'medium', background = 'dark', speed = 0.65, separation, tilt = 68,
  glowIntensity = 1, showRing, showOrbits, paused = false, resetKey = 0,
  frameloop = 'always', className = '',
}: BinaryPlanetVisualProps) {
  const reducedMotion = useReducedMotion();
  const safeSpeed = clampBinary(speed, 0.65, 0, 2);
  const safeSize = clampBinary(size, 620, 1, 4096);
  const stopped = paused || reducedMotion || safeSpeed === 0;
  const loop = stopped && frameloop === 'always' ? 'demand' : frameloop;
  const selected = getBinaryPreset(preset);
  return <div className={`${styles.root} ${background === 'dark' ? styles.dark : ''} ${className}`}
    style={{ width: width ?? safeSize, height: height ?? safeSize }}
    role="img" aria-label={`Система двух планет: ${selected.title}`}
    data-binary-planet="" data-binary-preset={selected.id} data-frameloop={loop}>
    <Canvas orthographic frameloop={loop} dpr={[1, { low: 1, medium: 1.5, high: 2 }[quality]]}
      camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      fallback={<div className={styles.fallback}>Для планет требуется поддержка WebGL.</div>}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      <BinaryPlanetScene size={safeSize} preset={selected.id} quality={quality} speed={safeSpeed}
        separation={clampBinary(separation ?? selected.defaultSeparation, selected.defaultSeparation, 1.35, 1.9)} tilt={clampBinary(tilt, 68, 10, 80)}
        glowIntensity={clampBinary(glowIntensity, 1, 0, 2)} showRing={showRing ?? showOrbits ?? true}
        paused={stopped} resetKey={resetKey} />
    </Canvas>
  </div>;
}
