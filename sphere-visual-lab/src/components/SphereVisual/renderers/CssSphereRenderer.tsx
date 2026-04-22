import type { CSSProperties } from 'react';
import styles from './CssSphereRenderer.module.css';
import { sphereModeConfigs } from '../presets/sphereModes';
import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../SphereVisual.types';

interface CssSphereRendererProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

type CssVariables = CSSProperties & Record<`--${string}`, string | number>;

const glowAlphaMap: Record<GlowIntensity, number> = {
  low: 0.56,
  medium: 0.76,
  high: 0.96,
};

const blurMap: Record<SphereQuality, string> = {
  low: '30px',
  medium: '44px',
  high: '58px',
};

export default function CssSphereRenderer({
  presetConfig,
  mode,
  quality,
  interactive,
  glowIntensity,
  speed,
  pointerX,
  pointerY,
  reducedMotion,
}: CssSphereRendererProps) {
  const modeConfig = sphereModeConfigs[mode];
  const safeSpeed = Math.max(speed, 0.15);

  const className = [
    styles.root,
    reducedMotion ? styles.reducedMotion : '',
    mode === 'idle' ? styles.modeIdle : '',
    mode === 'thinking' ? styles.modeThinking : '',
    mode === 'searching' ? styles.modeSearching : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cssVariables: CssVariables = {
    '--core-rgb': presetConfig.coreRgb,
    '--accent-rgb': presetConfig.accentRgb,
    '--halo-rgb': presetConfig.haloRgb,
    '--ring-rgb': presetConfig.ringRgb,
    '--noise-opacity': presetConfig.noiseOpacity,
    '--pointer-x': interactive ? pointerX.toString() : '0',
    '--pointer-y': interactive ? pointerY.toString() : '0',
    '--rotation-duration': `${modeConfig.rotationDuration / safeSpeed}s`,
    '--pulse-duration': `${modeConfig.pulseDuration / safeSpeed}s`,
    '--orbit-opacity': modeConfig.orbitOpacity.toString(),
    '--halo-opacity': Math.min(
      1,
      modeConfig.haloStrength * glowAlphaMap[glowIntensity],
    ).toString(),
    '--glow-blur': blurMap[quality],
  };

  return (
    <div className={className} style={cssVariables}>
      <div className={styles.glow} />
      <div className={styles.halo} />
      <div className={styles.orbit} />
      <div className={styles.core}>
        <div className={styles.innerLight} />
        <div className={styles.highlight} />
        <div className={styles.noise} />
      </div>
      <div className={styles.spark} />
    </div>
  );
}