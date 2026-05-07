import type { CSSProperties } from 'react';
import styles from './OrbitalVisual.module.css';
import type { OrbitalVisualProps } from './OrbitalVisual.types';
import { orbitalPresets } from './presets/orbitalPresets';
import ThreeOrbitalCanvas from './renderers/ThreeOrbitalCanvas';

export default function OrbitalVisual({
  size = 420,
  width,
  height,
  preset = 'atomic-orb',
  quality = 'medium',
  glowIntensity = 'medium',
  speed = 1,
  background = 'dark',
  className,
}: OrbitalVisualProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const presetConfig = orbitalPresets[preset];

  const rootClassName = [
    styles.root,
    background === 'dark' ? styles.darkBackground : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const rootStyle: CSSProperties = {
    width: resolvedWidth,
    height: resolvedHeight,
  };

  return (
    <div className={rootClassName} style={rootStyle}>
      <div className={styles.stage}>
        <ThreeOrbitalCanvas
          presetConfig={presetConfig}
          quality={quality}
          glowIntensity={glowIntensity}
          speed={speed}
        />
      </div>
    </div>
  );
}