import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../SphereVisual/hooks/useReducedMotion';
import type { WaterRippleVisualProps } from './WaterRippleVisual.types';
import WaterRippleScene from './WaterRippleScene';
import { bounded } from './rippleTiming';
import { rippleDefaults } from './rippleConfig';
import styles from './WaterRippleVisual.module.css';

const dpr = { low: 1, medium: 1.5, high: 2 };

export default function WaterRippleVisual({
  size = 520, width, height, quality = 'medium', background = 'dark',
  color = '#168dff', speed = rippleDefaults.speed, glowIntensity = 1.3, amplitude = rippleDefaults.amplitude,
  lineWidth = rippleDefaults.lineWidth, variant = 'ripples',
  damping = 0.55, rippleInterval = 4.8, tilt = 22, paused = false,
  dropKey = 0, frameloop = 'always', className = '',
}: WaterRippleVisualProps) {
  const reducedMotion = useReducedMotion();
  const safeSize = bounded(size, 520, 1, 4096);
  const safeSpeed = bounded(speed, rippleDefaults.speed, 0, 3);
  const stopped = paused || reducedMotion || safeSpeed === 0;
  const loop = stopped && frameloop === 'always' ? 'demand' : frameloop;
  return (
    <div className={`${styles.root} ${background === 'dark' ? styles.dark : ''} ${className}`}
      style={{ width: width ?? safeSize, height: height ?? safeSize }}
      role="img" aria-label="Расходящаяся рябь на поверхности воды"
      data-water-ripple="" data-frameloop={loop} data-water-variant={variant}>
      <Canvas orthographic frameloop={loop} dpr={[1, dpr[quality]]}
        camera={{ position: [0, 0, 8], zoom: 100, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        fallback={<div className={styles.fallback}>Для ряби требуется поддержка WebGL.</div>}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <WaterRippleScene size={safeSize} quality={quality} color={color} variant={variant}
          speed={safeSpeed} glowIntensity={bounded(glowIntensity, 1.3, 0, 2)}
          amplitude={bounded(amplitude, rippleDefaults.amplitude, 0, 0.15)}
          lineWidth={bounded(lineWidth, rippleDefaults.lineWidth, 0.004, 0.05)} damping={bounded(damping, 0.55, 0.2, 2)}
          rippleInterval={bounded(rippleInterval, 4.8, 3, 10)} tilt={bounded(tilt, 22, 10, 75)}
          paused={stopped} dropKey={dropKey} />
      </Canvas>
    </div>
  );
}
