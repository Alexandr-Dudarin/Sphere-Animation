import type {
  GlowIntensity,
  SphereMode,
  SpherePresetConfig,
  SphereQuality,
} from '../SphereVisual.types';
import ThreeSphereCanvas from './ThreeSphereCanvas';

interface ThreeSphereRendererProps {
  presetConfig: SpherePresetConfig;
  mode: SphereMode;
  quality: SphereQuality;
  interactive: boolean;
  glowIntensity: GlowIntensity;
  speed: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
  visualScale: number;
}

export default function ThreeSphereRenderer(
  props: ThreeSphereRendererProps,
) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ThreeSphereCanvas {...props} />
    </div>
  );
}