import type { CSSProperties } from 'react';
import styles from './OrbitalVisual.module.css';
import type { OrbitalVisualProps } from './OrbitalVisual.types';
import { orbitalPresets } from './presets/orbitalPresets';
import ThreeOrbitalCanvas from './renderers/ThreeOrbitalCanvas';

const BASE_VISUAL_SIZE = 440;

export default function OrbitalVisual({
  size = 420,
  width,
  height,
  preset = 'atomic-orb',
  quality = 'medium',
  glowIntensity = 'medium',
  speed = 1,
  background = 'dark',
  frameloop = 'always',
  className,
}: OrbitalVisualProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const presetConfig = orbitalPresets[preset];
  const visualScale = size / BASE_VISUAL_SIZE;

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
          visualScale={visualScale}
          frameloop={frameloop}
        />
      </div>
    </div>
  );
}