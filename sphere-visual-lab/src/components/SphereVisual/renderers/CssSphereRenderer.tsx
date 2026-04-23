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

const blurMap: Record<SphereQuality, string> = {
  low: '16px',
  medium: '12px',
  high: '8px',
};

const shellOpacityMap: Record<SphereQuality, number> = {
  low: 0.76,
  medium: 0.88,
  high: 1,
};

const glowAlphaMap: Record<GlowIntensity, number> = {
  low: 0.72,
  medium: 0.88,
  high: 1,
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
    '--swirl-duration': `${modeConfig.rotationDuration / safeSpeed}s`,
    '--counter-duration': `${(modeConfig.rotationDuration * 1.45) / safeSpeed}s`,
    '--micro-duration': `${(modeConfig.rotationDuration * 0.72) / safeSpeed}s`,
    '--breath-duration': `${modeConfig.pulseDuration / safeSpeed}s`,
    '--detail-blur': blurMap[quality],
    '--shell-opacity': shellOpacityMap[quality].toString(),
    '--glow-alpha': Math.min(
      1,
      modeConfig.haloStrength * glowAlphaMap[glowIntensity],
    ).toString(),
    '--flare-x': `${50 + pointerX * 16}%`,
    '--flare-y': `${22 + pointerY * 13}%`,
    '--violet-rgb': mode === 'searching' ? '156 122 255' : '132 111 255',
    '--pink-rgb': mode === 'searching' ? '255 97 186' : '233 116 255',
    '--mint-rgb': '108 255 223',
    '--amber-rgb': '255 196 112',
  };

  return (
    <div className={className} style={cssVariables}>
      <div className={styles.backMist} />
      <div className={styles.outerGlow} />

      <div className={styles.vortexZone}>
        <div className={styles.swirlA} />
        <div className={styles.swirlB} />
        <div className={styles.swirlC} />
        <div className={styles.swirlD} />
        <div className={styles.chromaBand} />
        <div className={styles.tunnelGlow} />
        <div className={styles.texture} />
        <div className={styles.centerEye} />
        <div className={styles.centerCore} />
      </div>

      <div className={styles.glassShell} />
      <div className={styles.shellInner} />
      <div className={styles.glassHalo} />
      <div className={styles.refraction} />
      <div className={styles.frontCaustic} />
      <div className={styles.specular} />
      <div className={styles.frontRim} />
    </div>
  );
}