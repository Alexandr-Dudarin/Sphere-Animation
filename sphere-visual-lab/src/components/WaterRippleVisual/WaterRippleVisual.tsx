import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../SphereVisual/hooks/useReducedMotion';
import type { WaterRippleVisualProps } from './WaterRippleVisual.types';
import WaterRippleScene from './WaterRippleScene';
import WaterCollectionScene from './WaterCollectionScene';
import { bounded } from './rippleTiming';
import { rippleDefaults } from './rippleConfig';
import styles from './WaterRippleVisual.module.css';

const dpr = { low: 1, medium: 1.5, high: 2 };

export default function WaterRippleVisual({
  size = 520, width, height, quality = 'medium', background = 'dark',
  color = '#168dff', speed = rippleDefaults.speed, glowIntensity = 1.3, amplitude = rippleDefaults.amplitude,
  lineWidth = rippleDefaults.lineWidth, variant = 'droplet', intensity = 1,
  damping = 0.55, rippleInterval, tilt = 22, paused = false,
  dropKey = 0, frameloop = 'always', className = '',
}: WaterRippleVisualProps) {
  const reducedMotion = useReducedMotion();
  const [keyboardImpulse, setKeyboardImpulse] = useState(0);
  const safeSize = bounded(size, 520, 1, 4096);
  const safeSpeed = bounded(speed, rippleDefaults.speed, 0, 3);
  const stopped = paused || reducedMotion || safeSpeed === 0;
  const loop = stopped && frameloop === 'always' ? 'demand' : frameloop;
  const interactive = variant === 'interactive';
  const isClassic = variant === 'ripples' || variant === 'droplet' || variant === 'crown';
  const defaultInterval = variant === 'ripples' ? rippleDefaults.rippleInterval : 4;
  const sceneProps = {
    size: safeSize, quality, color, variant, speed: safeSpeed,
    glowIntensity: bounded(glowIntensity, 1.3, 0, 2),
    lineWidth: bounded(lineWidth, rippleDefaults.lineWidth, 0.004, 0.05),
    damping: bounded(damping, 0.55, 0.2, 2), tilt: bounded(tilt, 22, 10, 75),
    paused: stopped, dropKey: dropKey + (interactive ? keyboardImpulse : 0),
  };
  return (
    <div className={`${styles.root} ${background === 'dark' ? styles.dark : ''} ${className}`}
      style={{ width: width ?? safeSize, height: height ?? safeSize }}
      role={interactive ? 'button' : 'img'} tabIndex={interactive ? 0 : undefined}
      aria-disabled={interactive ? stopped : undefined}
      aria-label={interactive ? 'Коснитесь воды или нажмите Enter для новой волны' : 'Анимированная водная сцена'}
      onKeyDown={interactive ? (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !stopped) {
          event.preventDefault();
          setKeyboardImpulse((value) => value + 1);
        }
      } : undefined}
      data-water-ripple="" data-frameloop={loop} data-water-variant={variant}>
      <Canvas orthographic frameloop={loop} dpr={[1, dpr[quality]]}
        camera={{ position: [0, 0, 8], zoom: 100, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        fallback={<div className={styles.fallback}>Для ряби требуется поддержка WebGL.</div>}
        style={{ width: '100%', height: '100%', pointerEvents: interactive ? 'auto' : 'none', touchAction: 'pan-y' }}>
        {isClassic ? <WaterRippleScene {...sceneProps}
          amplitude={bounded(amplitude, rippleDefaults.amplitude, 0, 0.15)}
          rippleInterval={bounded(rippleInterval ?? defaultInterval, defaultInterval, 3, 10)} /> :
          <WaterCollectionScene key={variant} {...sceneProps} intensity={bounded(intensity, 1, 0.3, 2)} />}
      </Canvas>
    </div>
  );
}
