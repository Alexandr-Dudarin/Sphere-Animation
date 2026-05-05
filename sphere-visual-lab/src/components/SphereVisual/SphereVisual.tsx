import type { CSSProperties } from 'react';
import styles from './SphereVisual.module.css';
import type { SphereVisualProps } from './SphereVisual.types';
import { SPHERE_DEFAULTS } from '../../shared/constants/defaults';
import { spherePresets } from './presets/spherePresets';
import { useReducedMotion } from './hooks/useReducedMotion';
import { usePointerTracking } from './hooks/usePointerTracking';
import CssSphereRenderer from './renderers/CssSphereRenderer';
import ThreeSphereRenderer from './renderers/ThreeSphereRenderer';

const BASE_VISUAL_SIZE = 440;

export default function SphereVisual({
  size = SPHERE_DEFAULTS.size,
  width,
  height,
  mode = SPHERE_DEFAULTS.mode,
  preset = SPHERE_DEFAULTS.preset,
  quality = SPHERE_DEFAULTS.quality,
  interactive = SPHERE_DEFAULTS.interactive,
  glowIntensity = SPHERE_DEFAULTS.glowIntensity,
  speed = SPHERE_DEFAULTS.speed,
  background = SPHERE_DEFAULTS.background,
  renderer = 'three',
  className,
}: SphereVisualProps) {
  const reducedMotion = useReducedMotion();
  const effectiveInteractive = interactive && !reducedMotion;

  const { containerRef, pointerX, pointerY } =
    usePointerTracking<HTMLDivElement>(effectiveInteractive);

  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const presetConfig = spherePresets[preset];

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

  const visualScale = size / BASE_VISUAL_SIZE;

  const sharedRendererProps = {
    presetConfig,
    mode,
    quality,
    interactive: effectiveInteractive,
    glowIntensity,
    speed,
    pointerX,
    pointerY,
    reducedMotion,
    visualScale,
  };

  return (
    <div className={rootClassName} style={rootStyle}>
      <div ref={containerRef} className={styles.stage}>
        {renderer === 'css' ? (
          <CssSphereRenderer
            presetConfig={presetConfig}
            mode={mode}
            quality={quality}
            interactive={effectiveInteractive}
            glowIntensity={glowIntensity}
            speed={speed}
            pointerX={pointerX}
            pointerY={pointerY}
            reducedMotion={reducedMotion}
          />
        ) : (
          <ThreeSphereRenderer {...sharedRendererProps} />
        )}
      </div>
    </div>
  );
}